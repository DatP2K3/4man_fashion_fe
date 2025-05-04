import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile, ShippingAddress } from '@app/core/models/Profile.model';
import { ProfileService } from '@app/core/services/Profile.service';
import { AppStateService } from '@app/shared/state/AppState.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Cart, CartItem } from '@app/core/models/Cart.model';
import { CartService } from '@app/core/services/Cart.service';

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
  loading: boolean = true;
  shippingForm: FormGroup;
  addressOptions: AddressOption[] = [];

  // Cart data
  cart: Cart | null = null;
  cartItems: CartItem[] = [];
  subtotal: number = 0; // Initialize to 0
  shippingFee: number = 30000; // Default shipping fee

  constructor(
    private appState: AppStateService,
    private profileService: ProfileService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService // Add CartService
  ) {
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      ward: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
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
        this.calculateSubtotal();
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
          }
        }
      });

      // If no default address was found, select the first one
      if (!this.selectedAddressId && this.profile.listShippingAddress[0]) {
        this.selectedAddressId = this.profile.listShippingAddress[0].id || null;
        this.populateFormWithAddress(this.profile.listShippingAddress[0]);
      }
    }
  }

  onAddressChange(event: any): void {
    const selectedId = event.value;

    if (selectedId === 'new') {
      // Clear form for new address
      this.shippingForm.reset();
    } else {
      // Find and populate form with selected address
      const selectedAddress = this.profile?.listShippingAddress?.find(
        (item) => item && item.id === selectedId
      );

      if (selectedAddress) {
        this.populateFormWithAddress(selectedAddress);
      }
    }
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

            this.calculateSubtotal();
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

  calculateSubtotal(): void {
    this.subtotal = 0;
    console.log('Calculating subtotal for items:', this.cartItems);

    if (!this.cartItems || this.cartItems.length === 0) {
      console.log('No cart items to calculate total');
      return;
    }

    this.cartItems.forEach((item) => {
      // Make sure we have valid values for price and quantity
      const price =
        item.discountPrice > 0
          ? item.discountPrice
          : item.originPrice > 0
          ? item.originPrice
          : 0;
      const quantity = item.quantity || 1;

      console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}`);

      if (price > 0) {
        this.subtotal += price * quantity;
      }
    });

    console.log('Final subtotal calculated:', this.subtotal);
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
            this.messageService.add({
              severity: 'success',
              summary: 'Address Saved',
              detail: 'New shipping address saved successfully',
            });
            // Navigate to payment or confirmation page
            // this.router.navigate(['/checkout/payment']);
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
      // this.router.navigate(['/checkout/payment']);
      this.messageService.add({
        severity: 'success',
        summary: 'Address Selected',
        detail: 'Proceeding to payment',
      });
    }
  }
}
