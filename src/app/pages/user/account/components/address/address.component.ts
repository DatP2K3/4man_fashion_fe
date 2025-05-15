import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile, ShippingAddress } from '@app/core/models/Profile.model';
import { LocationService } from '@app/core/services/location.service';
import { ProfileService } from '@app/core/services/Profile.service';
import { AppStateService } from '@app/shared/state/AppState.service';

@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit, AfterViewInit {
  @ViewChild('provinceDropdown') provinceDropdown!: Dropdown;
  @ViewChild('districtDropdown') districtDropdown!: Dropdown;
  @ViewChild('wardDropdown') wardDropdown!: Dropdown;

  addressForm!: FormGroup;
  public profile: Profile | null = null;
  public addresses: ShippingAddress[] = [];
  public selectedAddress: ShippingAddress | null = null;
  public editingAddressIndex: number = -1;
  public isNewAddress: boolean = true;

  public addressOptions: any[] = [];

  public provinces: any[] = [];
  public filteredDistricts: any[] = [];
  public filteredWards: any[] = [];
  public isLoadingDistricts: boolean = false;
  public isLoadingWards: boolean = false;

  constructor(
    private fb: FormBuilder,
    private appState: AppStateService,
    private profileService: ProfileService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      recipientName: [''],
      phoneNumber: [''],
      addressLine1: [''],
      addressLine2: [''],
      ward: [''],
      wardCode: [''],
      district: [''],
      districtId: [''],
      city: [''],
      cityId: [''],
      defaultAddress: [false],
    });

    this.loadProvinces();

    this.appState.profile$.subscribe((profile) => {
      if (profile) {
        this.profile = profile;

        if (
          profile.listShippingAddress &&
          profile.listShippingAddress.length > 0
        ) {
          if ('address' in profile.listShippingAddress[0]) {
            this.addresses = profile.listShippingAddress.map(
              (item: any) => item.address
            );
          } else {
            this.addresses = profile.listShippingAddress as ShippingAddress[];
          }
          this.addressOptions = [
            { label: '+ Thêm địa chỉ mới', value: 'new' },
            ...this.addresses.map((address, index) => ({
              label: `${address.recipientName} - ${address.addressLine1}, ${address.ward}, ${address.city}`,
              value: index,
            })),
          ];
        } else {
          this.addressOptions = [{ label: '+ Thêm địa chỉ mới', value: 'new' }];
        }
      }
    });

    this.addressForm.get('city')?.valueChanges.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          this.loadDistrictsForProvince(value);
        }, 0);
      } else {
        this.filteredDistricts = [];
        this.filteredWards = [];
      }
    });
  }

  ngAfterViewInit() {
    // View initialization logic
  }

  loadProvinces(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.provinces.length > 0) {
        resolve();
        return;
      }

      this.locationService.getProvinces().subscribe({
        next: (res) => {
          this.provinces = res.data || [];
          resolve();
        },
        error: (err) => {
          console.error('Error loading provinces:', err);
          resolve();
        },
      });
    });
  }

  loadDistrictsForProvince(provinceCode: string): void {
    this.addressForm.patchValue({
      district: '',
      ward: '',
    });

    this.filteredWards = [];

    if (provinceCode) {
      this.isLoadingDistricts = true;
      this.locationService.getDistricts(provinceCode).subscribe({
        next: (res) => {
          this.filteredDistricts = res.data || [];
          this.isLoadingDistricts = false;
        },
        error: (err) => {
          console.error('Error loading districts:', err);
          this.isLoadingDistricts = false;
        },
      });
    } else {
      this.filteredDistricts = [];
    }
  }

  onProvinceChange(event: any): void {
    const provinceId = event.value;

    const selectedProvince = this.provinces.find((p) => p.id === provinceId);
    if (selectedProvince) {
      this.addressForm.patchValue({
        city: selectedProvince.name,
        cityId: selectedProvince.id,
      });
    }

    if (provinceId) {
      this.loadDistrictsForProvince(provinceId);
    }
  }

  onDistrictChange(event: any): void {
    const districtId = event.value;

    const selectedDistrict = this.filteredDistricts.find(
      (d) => d.id === districtId
    );
    if (selectedDistrict) {
      this.addressForm.patchValue({
        district: selectedDistrict.name,
        districtId: selectedDistrict.id,
      });
    }

    this.addressForm.patchValue({
      ward: '',
      wardCode: '',
    });

    if (districtId) {
      this.isLoadingWards = true;
      this.locationService.getWards(districtId).subscribe({
        next: (res) => {
          this.filteredWards = res.data || [];
          this.isLoadingWards = false;
        },
        error: (err) => {
          console.error('Error loading wards:', err);
          this.isLoadingWards = false;
        },
      });
    } else {
      this.filteredWards = [];
    }
  }

  onWardChange(event: any): void {
    const wardCode = event.value;

    const selectedWard = this.filteredWards.find(
      (w) => w.wardCode === wardCode
    );
    if (selectedWard) {
      this.addressForm.patchValue({
        ward: selectedWard.wardName,
        wardCode: selectedWard.wardCode,
      });
    }
  }

  onAddressChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'new') {
      this.createNewAddress();
    } else {
      const index = Number(selectedValue);
      this.selectAddress(this.addresses[index], index);
    }
  }

  selectAddress(address: ShippingAddress, index: number): void {
    this.selectedAddress = address;
    this.editingAddressIndex = index;
    this.isNewAddress = false;

    this.filteredDistricts = [];
    this.filteredWards = [];

    this.loadAddressData(address);
  }

  loadAddressData(address: ShippingAddress) {
    this.addressForm.patchValue({
      recipientName: address.recipientName || '',
      phoneNumber: address.phoneNumber || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      defaultAddress: address.defaultAddress || false,
      city: address.city || '',
      district: address.district || '',
      ward: address.ward || '',
      cityId: '',
      districtId: '',
      wardCode: '',
    });

    this.locationService.getProvinces().subscribe((provinces) => {
      this.provinces = provinces.data || [];

      const matchingProvince = this.provinces.find(
        (p) => p.name === address.city
      );
      if (matchingProvince) {
        this.addressForm.get('cityId')?.setValue(matchingProvince.id);
        setTimeout(() => this.cdr.detectChanges(), 0);

        this.locationService
          .getDistricts(matchingProvince.id)
          .subscribe((districts) => {
            this.filteredDistricts = districts.data || [];

            const matchingDistrict = this.filteredDistricts.find(
              (d) => d.name === address.district
            );
            if (matchingDistrict) {
              this.addressForm.get('districtId')?.setValue(matchingDistrict.id);
              setTimeout(() => this.cdr.detectChanges(), 0);

              this.locationService
                .getWards(matchingDistrict.id)
                .subscribe((wards) => {
                  this.filteredWards = wards.data || [];

                  const matchingWard = this.filteredWards.find(
                    (w) =>
                      w.wardName === address.ward ||
                      w.wardCode === address.wardCode
                  );

                  if (matchingWard) {
                    this.addressForm
                      .get('wardCode')
                      ?.setValue(matchingWard.wardCode);
                    setTimeout(() => this.cdr.detectChanges(), 0);
                  }
                });
            }
          });
      }
    });
  }

  createNewAddress(): void {
    this.isNewAddress = true;
    this.selectedAddress = null;
    this.editingAddressIndex = -1;

    this.addressForm.reset({
      isDefault: false,
    });
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;

      const addressData = {
        profileId: this.profile?.id,
        recipientName: formData.recipientName,
        phoneNumber: formData.phoneNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        ward: formData.ward,
        wardCode: formData.wardCode,
        district: formData.district,
        districtId: formData.districtId,
        city: formData.city,
        cityId: formData.cityId,
        defaultAddress: formData.defaultAddress,
      };

      if (this.isNewAddress) {
        this.profileService
          .createShippingAddress(addressData)
          .subscribe((response) => {
            this.appState.updateProfile(response.data);
            this.profile = response.data;
          });
      } else if (this.selectedAddress) {
        const updatedAddressData = {
          ...addressData,
          id: this.selectedAddress.id,
        };

        this.profileService
          .updateShippingAddress(updatedAddressData)
          .subscribe((response) => {
            this.appState.updateProfile(response.data);
            this.profile = response.data;
          });
      }
    }
  }

  // Debug methods removed
}
