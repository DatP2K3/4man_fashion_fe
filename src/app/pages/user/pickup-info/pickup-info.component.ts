import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile, ShippingAddress } from '@app/core/models/Profile.model';
import { ProfileService } from '@app/core/services/Profile.service';
import { AppStateService } from '@app/shared/state/AppState.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Cart, CartItem } from '@app/core/models/Cart.model';
import { CartService } from '@app/core/services/Cart.service';
import { OrderService } from '@app/core/services/Order.service';
import {
  OrderFeeDTO,
  CreateOrderRequest,
  OrderDTO,
  PaymentMethod,
} from '@app/core/models/Order.model';

interface AddressOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-pickup-info',
  standalone: false,
  templateUrl: './pickup-info.component.html',
  styleUrl: './pickup-info.component.scss',
})
export class PickupInfoComponent implements OnInit {
  profile: Profile | null = null;
  selectedAddress: ShippingAddress | null = null;
  selectedAddressId: string | null = null;
  selectedPaymentMethod: PaymentMethod = PaymentMethod.COD; // Default payment method
  loading: boolean = true;
  shippingForm: FormGroup;
  addressOptions: AddressOption[] = [];

  // Cart data
  cart: Cart | null = null;
  cartItems: CartItem[] = [];

  // Order fee data
  orderFee: OrderFeeDTO | null = null;
  subtotal: number = 0;
  shippingFee: number = 30000; // Default value until we get data from API

  constructor(
    private appState: AppStateService,
    private profileService: ProfileService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      ward: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      note: [''], // Add note field
    });
  }

  ngOnInit(): void {
    // Try to get profile from AppState first
    this.appState.profile$.subscribe((profile) => {
      if (profile) {
        this.profile = profile;
        this.loadAddressOptions();
        this.loading = false;
      } else {
        // If no profile in state, fetch from API
        this.fetchProfileFromApi();
      }
    });

    // Get cart data from state or service
    this.appState.cart$.subscribe((cart) => {
      if (cart) {
        this.cart = cart;
        this.cartItems = cart.cartItems?.filter((item) => !item.deleted) || [];
      } else {
        // If not in state, load from backend
        this.loadCart();
      }
    });
  }

  fetchProfileFromApi(): void {
    this.loading = true;
    this.profileService.getOrInit().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.profile = response.data;
          this.appState.updateProfile(this.profile!);
          this.loadAddressOptions();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load profile information',
        });
        this.loading = false;
      },
    });
  }

  loadAddressOptions(): void {
    this.addressOptions = [{ label: 'Thêm địa chỉ mới', value: 'new' }];
    console.log('Profile in pickup:', this.profile);
    if (
      this.profile?.listShippingAddress &&
      this.profile.listShippingAddress.length > 0
    ) {
      // Add existing addresses to dropdown options
      this.profile.listShippingAddress.forEach((address) => {
        if (address) {
          const label = `${address.recipientName} | ${address.phoneNumber} | ${address.addressLine1}`;

          this.addressOptions.push({
            label: label,
            value: address.id || '',
          });

          // Select default address
          if (address.defaultAddress) {
            this.selectedAddressId = address.id || null;
            this.populateFormWithAddress(address);
            this.fetchOrderFees(address.id || '');
          }
        }
      });

      // If no default address was found, select the first one
      if (!this.selectedAddressId && this.profile.listShippingAddress[0]) {
        this.selectedAddressId = this.profile.listShippingAddress[0].id || null;
        this.populateFormWithAddress(this.profile.listShippingAddress[0]);
        this.fetchOrderFees(this.profile.listShippingAddress[0].id || '');
      }
    }
  }

  onAddressChange(event: any): void {
    const selectedId = event.value;

    if (selectedId === 'new') {
      // Clear form for new address
      this.shippingForm.reset();

      // Reset fee information
      this.orderFee = null;
      this.subtotal = 0;
      this.shippingFee = 30000;
    } else {
      // Find and populate form with selected address
      const selectedAddress = this.profile?.listShippingAddress?.find(
        (item) => item && item.id === selectedId
      );

      if (selectedAddress) {
        this.populateFormWithAddress(selectedAddress);
        this.fetchOrderFees(selectedId);
      }
    }
  }

  fetchOrderFees(addressId: string): void {
    if (!addressId || addressId === 'new') {
      return;
    }

    this.orderService.calculateFee(addressId).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.orderFee = response.data;
          this.subtotal = this.orderFee.totalPrice;
          this.shippingFee = this.orderFee.shippingFee;
          console.log('Order fees loaded:', this.orderFee);
        }
      },
      error: (error) => {
        console.error('Error fetching order fees:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to calculate order fees',
        });
      },
    });
  }

  populateFormWithAddress(address: ShippingAddress): void {
    this.shippingForm.patchValue({
      recipientName: address.recipientName || '',
      phoneNumber: address.phoneNumber || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      ward: address.ward || '',
      district: address.district || '',
      city: address.city || '',
    });
  }

  loadCart(): void {
    this.cartService.getorInitCart().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.cart = response.data;
          // Update AppState only if cart is not null
          if (this.cart) {
            this.appState.updateCart(this.cart);
            // Make sure we filter out deleted items
            this.cartItems =
              this.cart.cartItems?.filter((item) => !item.deleted) || [];
            console.log('Loaded cart items:', this.cartItems);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.',
        });
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }

  onSubmit(): void {
    if (this.shippingForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form Invalid',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    const formData = this.shippingForm.value;

    // Handle saving address if it's new
    if (this.selectedAddressId === 'new') {
      // Create new address
      this.profileService
        .createShippingAddress({
          ...formData,
          profileId: this.profile?.id,
          defaultAddress: false,
        })
        .subscribe({
          next: (response) => {
            if (response && response.data) {
              this.messageService.add({
                severity: 'success',
                summary: 'Address Saved',
                detail: 'New shipping address saved successfully',
              });

              // Create order with the newly created address
              this.createOrder(response.data.id || '');
            }
          },
          error: (error) => {
            console.error('Error saving address:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save shipping address',
            });
          },
        });
    } else {
      // Proceed with existing address
      this.createOrder(this.selectedAddressId || '');
    }
  }

  private createOrder(addressId: string): void {
    // Prepare the order request
    const orderRequest: CreateOrderRequest = {
      toAddressId: addressId,
      paymentMethod: this.selectedPaymentMethod,
      note: this.shippingForm.get('note')?.value || '',
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.messageService.add({
            severity: 'success',
            summary: 'Đặt hàng thành công',
            detail: 'Đơn hàng của bạn đã được tạo thành công',
          });

          // Different handling based on payment method
          if (response.data.paymentMethod === PaymentMethod.COD) {
            // For COD, go directly to success page with order data
            this.router.navigate(['/order-successed'], {
              state: { order: response.data },
            });
          } else if (
            response.data.paymentMethod === PaymentMethod.ONLINE &&
            response.data.paymentUrl
          ) {
            // For online payment, redirect to VNPay
            window.location.href = response.data.paymentUrl;
          } else {
            // Fallback in case no payment URL is provided
            this.router.navigate(['/order-successed'], {
              queryParams: { orderCode: response.data.orderCode },
            });
          }
        }
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tạo đơn hàng. Vui lòng thử lại.',
        });
      },
    });
  }
}
