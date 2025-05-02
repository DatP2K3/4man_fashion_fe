import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile, ShippingAddress } from '@app/core/models/Profile.model';
import { ProfileService } from '@app/core/services/Profile.service';
import { AppStateService } from '@app/shared/state/AppState.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Cart, CartItem } from '@app/core/models/Cart.model';

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
  cartItems: CartItem[] = [];
  subtotal: number = 600000; // Default or from cart
  shippingFee: number = 30000; // Default shipping fee

  constructor(
    private appState: AppStateService,
    private profileService: ProfileService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
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

    // Get cart data if exists
    this.appState.cart$.subscribe((cart) => {
      if (cart) {
        this.cartItems = cart.cartItems || []; // Fixed: using cartItems instead of items
        this.calculateSubtotal();
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

  calculateSubtotal(): void {
    this.subtotal = 0;
    this.cartItems.forEach((item) => {
      this.subtotal += (item.discountPrice || 0) * (item.quantity || 1);
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
