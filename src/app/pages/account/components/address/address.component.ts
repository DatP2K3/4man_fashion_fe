import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import {
  Profile,
  ShippingAddress,
} from '../../../../core/models/Profile.model';
import { AppStateService } from '../../../../shared/state/AppState.service';
import { ProfileService } from '../../../../core/services/Profile.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown'; // Thêm import này

@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit {
  // Các thuộc tính như cũ
  addressForm!: FormGroup;
  public profile: Profile | null = null;
  public addresses: ShippingAddress[] = [];
  public selectedAddress: ShippingAddress | null = null;
  public editingAddressIndex: number = -1;
  public isNewAddress: boolean = true;

  // Thêm lựa chọn "Thêm địa chỉ mới"
  public addressOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private appState: AppStateService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // Khởi tạo form như cũ
    this.addressForm = this.fb.group({
      recipientName: [''],
      phoneNumber: [''],
      addressLine1: [''],
      addressLine2: [''],
      ward: [''],
      district: [''],
      city: [''],
      defaultAddress: [false],
    });

    // Đăng ký theo dõi profile
    this.appState.profile$.subscribe((profile) => {
      if (profile) {
        this.profile = profile;

        // Cập nhật danh sách địa chỉ
        if (
          profile.listShippingAddress &&
          profile.listShippingAddress.length > 0
        ) {
          console.log('address:', profile.listShippingAddress);
          // Xử lý cấu trúc dữ liệu
          if ('address' in profile.listShippingAddress[0]) {
            this.addresses = profile.listShippingAddress.map(
              (item: any) => item.address
            );
          } else {
            this.addresses = profile.listShippingAddress as ShippingAddress[];
          }
          console.log('Addresses:', this.addresses);
          // Cập nhật addressOptions cho dropdown
          this.addressOptions = [
            { label: '+ Thêm địa chỉ mới', value: 'new' },
            ...this.addresses.map((address, index) => ({
              label: `${address.recipientName} - ${address.addressLine1}, ${address.ward}, ${address.city}`,
              value: index,
            })),
          ];
        } else {
          // Nếu không có địa chỉ, chỉ hiển thị option thêm mới
          this.addressOptions = [{ label: '+ Thêm địa chỉ mới', value: 'new' }];
        }
      }
    });
  }

  // Xử lý khi thay đổi giá trị của dropdown
  onAddressChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'new') {
      this.createNewAddress();
    } else {
      // Nếu chọn địa chỉ có sẵn
      const index = Number(selectedValue);
      this.selectAddress(this.addresses[index], index);
    }
  }

  // Khi chọn địa chỉ từ danh sách
  selectAddress(address: ShippingAddress, index: number): void {
    this.selectedAddress = address;
    this.editingAddressIndex = index;
    this.isNewAddress = false;
    console.log('Selected address:', address);

    // Điền thông tin vào form
    this.addressForm.patchValue({
      recipientName: address.recipientName || '',
      phoneNumber: address.phoneNumber || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      ward: address.ward || '',
      district: address.district || '',
      city: address.city || '',
      defaultAddress: address.defaultAddress || false,
    });

    // Đánh dấu form là đã touch
    Object.keys(this.addressForm.controls).forEach((key) => {
      this.addressForm.get(key)?.markAsDirty();
      this.addressForm.get(key)?.markAsTouched();
    });
  }

  // Tạo địa chỉ mới
  createNewAddress(): void {
    this.isNewAddress = true;
    this.selectedAddress = null;
    this.editingAddressIndex = -1;

    // Reset form
    this.addressForm.reset({
      isDefault: false,
    });
  }

  // Lưu địa chỉ
  saveAddress(): void {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;
      console.log('Form data:', formData);

      const addressData = {
        profileId: this.profile?.id,
        ...formData,
      };

      if (this.isNewAddress) {
        // Tạo địa chỉ mới
        this.profileService
          .createShippingAddress(addressData)
          .subscribe((response) => {
            console.log('Address created successfully:', response);
            // Cập nhật lại profile trong state
            this.appState.updateProfile(response.data);
            this.profile = response.data;
          });
      } else if (this.selectedAddress) {
        // Cập nhật địa chỉ hiện tại, thêm `id` vào dữ liệu gửi đi
        const updatedAddressData = {
          ...addressData,
          id: this.selectedAddress.id, // Truyền `id` của địa chỉ hiện tại
        };

        this.profileService
          .updateShippingAddress(updatedAddressData)
          .subscribe((response) => {
            console.log('Address updated successfully:', response);
            this.appState.updateProfile(response.data);
            this.profile = response.data;
          });
      }
    }
  }
}
