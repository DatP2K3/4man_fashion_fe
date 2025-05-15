import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopInfoService } from '../../../../core/services/ShopInfo.service';
import { LocationService } from '../../../../core/services/location.service';
import {
  ShopAddress,
  ShopAddressType,
} from '../../../../core/models/ShopAddress.model';
import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { catchError, retry, of, Observable, from, throwError } from 'rxjs';

@Component({
  selector: 'app-manage-shop-address',
  standalone: false,
  templateUrl: './manage-shop-address.component.html',
  styleUrls: ['./manage-shop-address.component.scss'],
})
export class ManageShopAddressComponent implements OnInit, AfterViewInit {
  @ViewChild('pickupProvinceDropdown') pickupProvinceDropdown!: Dropdown;
  @ViewChild('pickupDistrictDropdown') pickupDistrictDropdown!: Dropdown;
  @ViewChild('pickupWardDropdown') pickupWardDropdown!: Dropdown;

  @ViewChild('returnProvinceDropdown') returnProvinceDropdown!: Dropdown;
  @ViewChild('returnDistrictDropdown') returnDistrictDropdown!: Dropdown;
  @ViewChild('returnWardDropdown') returnWardDropdown!: Dropdown;

  pickupForm: FormGroup;
  returnForm: FormGroup;
  loading = false;

  // Initialize accordionIndex to ensure accordion tabs are open
  accordionIndex: number[] = [0, 1];

  // Location data
  provinces: any[] = [];
  pickupFilteredDistricts: any[] = [];
  pickupFilteredWards: any[] = [];
  returnFilteredDistricts: any[] = [];
  returnFilteredWards: any[] = [];

  isLoadingPickupDistricts: boolean = false;
  isLoadingPickupWards: boolean = false;
  isLoadingReturnDistricts: boolean = false;
  isLoadingReturnWards: boolean = false;

  constructor(
    private fb: FormBuilder,
    private shopInfoService: ShopInfoService,
    private locationService: LocationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.pickupForm = this.createAddressForm();
    this.returnForm = this.createAddressForm();
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadShopAddresses();
  }

  ngAfterViewInit() {
    // Required for dropdown reference
  }

  loadProvinces(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.provinces.length > 0) {
        resolve();
        return;
      }

      this.locationService
        .getProvinces()
        .pipe(
          retry(3), // Retry up to 3 times
          catchError((err) => {
            console.error('Error loading provinces after retries:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể tải danh sách tỉnh/thành phố. Đang thử lại...',
            });
            return of({ data: [] });
          })
        )
        .subscribe({
          next: (res) => {
            this.provinces = res.data || [];
            resolve();
          },
          error: (err) => {
            console.error('Error loading provinces:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail:
                'Không thể tải danh sách tỉnh/thành phố sau nhiều lần thử',
            });
            resolve();
          },
        });
    });
  }

  createAddressForm(): FormGroup {
    return this.fb.group({
      shopName: [''],
      phoneNumber: [''],
      addressLine1: [''],
      addressLine2: [''],
      ward: [''],
      wardCode: [''],
      district: [''],
      districtId: [''],
      city: [''],
      cityId: [''],
      id: [''],
      profileId: [''],
      type: [''],
    });
  }

  // Add a helper method for retrying API calls
  private retryApiCall<T>(
    apiCall: Observable<T>,
    retries: number = 3
  ): Observable<T> {
    return apiCall.pipe(
      retry(retries),
      catchError((error) => {
        console.error('API call failed after retries:', error);
        return throwError(() => error);
      })
    );
  }

  loadShopAddresses(): void {
    this.loading = true;

    this.retryPromise(() => this.shopInfoService.getShopInfo(), 3)
      .then((addresses: ShopAddress[]) => {
        console.log('Loaded shop addresses:', addresses);

        if (addresses && addresses.length) {
          // Find the SEND_ADDRESS for pickup warehouse form
          const pickupAddress = addresses.find(
            (a) => a.type === ShopAddressType.SEND_ADDRESS
          );

          // Find the RETURN_ADDRESS for return warehouse form
          const returnAddress = addresses.find(
            (a) => a.type === ShopAddressType.RETURN_ADDRESS
          );

          console.log('Pickup address found:', pickupAddress);
          console.log('Return address found:', returnAddress);

          if (pickupAddress) {
            this.pickupForm.patchValue(pickupAddress);
            this.loadAddressLocationData(pickupAddress, 'pickup');
          } else {
            // Initialize with empty form for new pickup address
            this.pickupForm.patchValue({
              type: ShopAddressType.SEND_ADDRESS,
            });
            console.log('No pickup address found, initialized empty form');
          }

          if (returnAddress) {
            this.returnForm.patchValue(returnAddress);
            this.loadAddressLocationData(returnAddress, 'return');
          } else {
            // Initialize with empty form for new return address
            this.returnForm.patchValue({
              type: ShopAddressType.RETURN_ADDRESS,
            });
            console.log('No return address found, initialized empty form');
          }
        } else {
          // If no addresses at all, initialize both forms with their types
          this.pickupForm.patchValue({
            type: ShopAddressType.SEND_ADDRESS,
          });
          this.returnForm.patchValue({
            type: ShopAddressType.RETURN_ADDRESS,
          });
          console.log('No addresses found, initialized both forms');
        }

        this.loading = false;
      })
      .catch((error) => {
        console.error('Failed to load addresses after retries:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail:
            'Không thể tải thông tin địa chỉ sau nhiều lần thử. Vui lòng thử lại sau.',
        });
        this.loading = false;
      });
  }

  loadAddressLocationData(address: ShopAddress, formType: 'pickup' | 'return') {
    if (!address.city) {
      console.log(`No city data for ${formType} address`);
      return;
    }

    console.log(`Loading location data for ${formType} address:`, address);

    // Find the province by name with retry
    this.retryApiCall(this.locationService.getProvinces(), 3).subscribe({
      next: (provinces) => {
        // Store provinces for dropdown
        this.provinces = provinces.data || [];

        // Find matching province by name
        const matchingProvince = this.provinces.find(
          (p) => p.name === address.city
        );

        if (matchingProvince) {
          console.log(
            `Found matching province for ${address.city}:`,
            matchingProvince
          );

          if (formType === 'pickup') {
            this.pickupForm.patchValue({
              cityId: matchingProvince.id,
              city: matchingProvince.name,
            });
            setTimeout(() => this.cdr.detectChanges(), 0);

            // Load districts with retry
            this.retryApiCall(
              this.locationService.getDistricts(matchingProvince.id),
              3
            ).subscribe({
              next: (districts) => {
                this.pickupFilteredDistricts = districts.data || [];
                this.isLoadingPickupDistricts = false;

                // Find matching district
                const matchingDistrict = this.pickupFilteredDistricts.find(
                  (d) => d.name === address.district
                );

                if (matchingDistrict) {
                  console.log(
                    `Found matching district for ${address.district}:`,
                    matchingDistrict
                  );
                  this.pickupForm.patchValue({
                    districtId: matchingDistrict.id,
                    district: matchingDistrict.name,
                  });
                  setTimeout(() => this.cdr.detectChanges(), 0);

                  // Load wards with retry
                  this.retryApiCall(
                    this.locationService.getWards(matchingDistrict.id),
                    3
                  ).subscribe({
                    next: (wards) => {
                      this.pickupFilteredWards = wards.data || [];
                      this.isLoadingPickupWards = false;

                      // Find matching ward
                      const matchingWard = this.pickupFilteredWards.find(
                        (w) =>
                          w.wardName === address.ward ||
                          w.wardCode === address.wardCode
                      );

                      if (matchingWard) {
                        console.log(
                          `Found matching ward for ${address.ward}:`,
                          matchingWard
                        );
                        this.pickupForm.patchValue({
                          wardCode: matchingWard.wardCode,
                          ward: matchingWard.wardName,
                        });
                        setTimeout(() => this.cdr.detectChanges(), 0);
                      }
                    },
                    error: (err) => console.error('Error loading wards:', err),
                  });
                }
              },
              error: (err) => console.error('Error loading districts:', err),
            });
          } else {
            // Return address - Same structure as pickup address
            this.returnForm.patchValue({
              cityId: matchingProvince.id,
              city: matchingProvince.name,
            });
            setTimeout(() => this.cdr.detectChanges(), 0);

            // Load districts with retry
            this.retryApiCall(
              this.locationService.getDistricts(matchingProvince.id),
              3
            ).subscribe({
              next: (districts) => {
                this.returnFilteredDistricts = districts.data || [];
                this.isLoadingReturnDistricts = false;

                // Find matching district
                const matchingDistrict = this.returnFilteredDistricts.find(
                  (d) => d.name === address.district
                );

                if (matchingDistrict) {
                  console.log(
                    `Found matching district for ${address.district}:`,
                    matchingDistrict
                  );
                  this.returnForm.patchValue({
                    districtId: matchingDistrict.id,
                    district: matchingDistrict.name,
                  });
                  setTimeout(() => this.cdr.detectChanges(), 0);

                  // Load wards with retry
                  this.retryApiCall(
                    this.locationService.getWards(matchingDistrict.id),
                    3
                  ).subscribe({
                    next: (wards) => {
                      this.returnFilteredWards = wards.data || [];
                      this.isLoadingReturnWards = false;

                      // Find matching ward
                      const matchingWard = this.returnFilteredWards.find(
                        (w) =>
                          w.wardName === address.ward ||
                          w.wardCode === address.wardCode
                      );

                      if (matchingWard) {
                        console.log(
                          `Found matching ward for ${address.ward}:`,
                          matchingWard
                        );
                        this.returnForm.patchValue({
                          wardCode: matchingWard.wardCode,
                          ward: matchingWard.wardName,
                        });
                        setTimeout(() => this.cdr.detectChanges(), 0);
                      }
                    },
                    error: (err) => console.error('Error loading wards:', err),
                  });
                }
              },
              error: (err) => console.error('Error loading districts:', err),
            });
          }
        }
      },
      error: (err) => {
        console.error('Error loading provinces after retries:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu địa chỉ sau nhiều lần thử',
        });
      },
    });
  }

  // Load districts for a selected province with retry
  loadDistrictsForProvince(
    provinceId: string,
    formType: 'pickup' | 'return'
  ): void {
    if (formType === 'pickup') {
      this.isLoadingPickupDistricts = true;
      this.pickupForm.patchValue({
        district: '',
        districtId: '',
        ward: '',
        wardCode: '',
      });
      this.pickupFilteredWards = [];
    } else {
      this.isLoadingReturnDistricts = true;
      this.returnForm.patchValue({
        district: '',
        districtId: '',
        ward: '',
        wardCode: '',
      });
      this.returnFilteredWards = [];
    }

    if (provinceId) {
      this.retryApiCall(
        this.locationService.getDistricts(provinceId),
        3
      ).subscribe({
        next: (res) => {
          if (formType === 'pickup') {
            this.pickupFilteredDistricts = res.data || [];
            this.isLoadingPickupDistricts = false;

            // If we have the district name, find and select it
            const form = this.pickupForm.value;
            if (form.district) {
              const matchingDistrict = this.pickupFilteredDistricts.find(
                (d) => d.name === form.district
              );
              if (matchingDistrict) {
                this.pickupForm
                  .get('districtId')
                  ?.setValue(matchingDistrict.id);
                this.loadWardsForDistrict(matchingDistrict.id, formType);
              }
            }
          } else {
            this.returnFilteredDistricts = res.data || [];
            this.isLoadingReturnDistricts = false;

            // If we have the district name, find and select it
            const form = this.returnForm.value;
            if (form.district) {
              const matchingDistrict = this.returnFilteredDistricts.find(
                (d) => d.name === form.district
              );
              if (matchingDistrict) {
                this.returnForm
                  .get('districtId')
                  ?.setValue(matchingDistrict.id);
                this.loadWardsForDistrict(matchingDistrict.id, formType);
              }
            }
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading districts:', err);
          if (formType === 'pickup') {
            this.isLoadingPickupDistricts = false;
          } else {
            this.isLoadingReturnDistricts = false;
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh sách quận/huyện',
          });
        },
      });
    }
  }

  // Load wards for a selected district with retry
  loadWardsForDistrict(
    districtId: string,
    formType: 'pickup' | 'return'
  ): void {
    if (formType === 'pickup') {
      this.isLoadingPickupWards = true;
      this.pickupForm.patchValue({
        ward: '',
        wardCode: '',
      });
    } else {
      this.isLoadingReturnWards = true;
      this.returnForm.patchValue({
        ward: '',
        wardCode: '',
      });
    }

    if (districtId) {
      this.retryApiCall(this.locationService.getWards(districtId), 3).subscribe(
        {
          next: (res) => {
            if (formType === 'pickup') {
              this.pickupFilteredWards = res.data || [];
              this.isLoadingPickupWards = false;

              // If we have the ward name, find and select it
              const form = this.pickupForm.value;
              if (form.ward) {
                const matchingWard = this.pickupFilteredWards.find(
                  (w) => w.wardName === form.ward
                );
                if (matchingWard) {
                  this.pickupForm
                    .get('wardCode')
                    ?.setValue(matchingWard.wardCode);
                }
              }
            } else {
              this.returnFilteredWards = res.data || [];
              this.isLoadingReturnWards = false;

              // If we have the ward name, find and select it
              const form = this.returnForm.value;
              if (form.ward) {
                const matchingWard = this.returnFilteredWards.find(
                  (w) => w.wardName === form.ward
                );
                if (matchingWard) {
                  this.returnForm
                    .get('wardCode')
                    ?.setValue(matchingWard.wardCode);
                }
              }
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading wards:', err);
            if (formType === 'pickup') {
              this.isLoadingPickupWards = false;
            } else {
              this.isLoadingReturnWards = false;
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể tải danh sách phường/xã',
            });
          },
        }
      );
    }
  }

  // Add a method to handle promise-based API calls with retry
  private async retryPromise<T>(
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        console.log(`Attempt ${i + 1}/${maxRetries} failed. Retrying...`);
        lastError = error;
        // Add exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 300)
        );
      }
    }
    throw lastError;
  }

  // Event handlers for dropdown changes
  onPickupProvinceChange(event: any): void {
    const provinceId = event.value;
    const selectedProvince = this.provinces.find((p) => p.id === provinceId);

    if (selectedProvince) {
      this.pickupForm.patchValue({
        city: selectedProvince.name,
        cityId: selectedProvince.id,
      });
      this.loadDistrictsForProvince(provinceId, 'pickup');
    }
  }

  onPickupDistrictChange(event: any): void {
    const districtId = event.value;
    const selectedDistrict = this.pickupFilteredDistricts.find(
      (d) => d.id === districtId
    );

    if (selectedDistrict) {
      this.pickupForm.patchValue({
        district: selectedDistrict.name,
        districtId: selectedDistrict.id,
      });
      this.loadWardsForDistrict(districtId, 'pickup');
    }
  }

  onPickupWardChange(event: any): void {
    const wardCode = event.value;
    const selectedWard = this.pickupFilteredWards.find(
      (w) => w.wardCode === wardCode
    );

    if (selectedWard) {
      this.pickupForm.patchValue({
        ward: selectedWard.wardName,
        wardCode: selectedWard.wardCode,
      });
    }
  }

  onReturnProvinceChange(event: any): void {
    const provinceId = event.value;
    const selectedProvince = this.provinces.find((p) => p.id === provinceId);

    if (selectedProvince) {
      this.returnForm.patchValue({
        city: selectedProvince.name,
        cityId: selectedProvince.id,
      });
      this.loadDistrictsForProvince(provinceId, 'return');
    }
  }

  onReturnDistrictChange(event: any): void {
    const districtId = event.value;
    const selectedDistrict = this.returnFilteredDistricts.find(
      (d) => d.id === districtId
    );

    if (selectedDistrict) {
      this.returnForm.patchValue({
        district: selectedDistrict.name,
        districtId: selectedDistrict.id,
      });
      this.loadWardsForDistrict(districtId, 'return');
    }
  }

  onReturnWardChange(event: any): void {
    const wardCode = event.value;
    const selectedWard = this.returnFilteredWards.find(
      (w) => w.wardCode === wardCode
    );

    if (selectedWard) {
      this.returnForm.patchValue({
        ward: selectedWard.wardName,
        wardCode: selectedWard.wardCode,
      });
    }
  }

  savePickupAddress(): void {
    if (this.pickupForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin địa chỉ kho lấy hàng',
      });
      return;
    }

    const formValue = this.pickupForm.value;
    formValue.type = ShopAddressType.SEND_ADDRESS;

    console.log('Saving pickup address:', formValue);
    this.saveAddress(formValue);
  }

  saveReturnAddress(): void {
    if (this.returnForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin địa chỉ kho trả hàng',
      });
      return;
    }

    const formValue = this.returnForm.value;
    formValue.type = ShopAddressType.RETURN_ADDRESS;

    console.log('Saving return address:', formValue);
    this.saveAddress(formValue);
  }

  private saveAddress(address: ShopAddress): void {
    this.loading = true;

    this.retryPromise(() => this.shopInfoService.updateShopInfo(address), 3)
      .then((response) => {
        console.log('Address updated successfully:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Địa chỉ đã được cập nhật thành công',
        });
        this.loading = false;

        // Reload addresses to get the latest data with IDs
        this.loadShopAddresses();
      })
      .catch((error) => {
        console.error('Failed to save address after retries:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail:
            'Không thể lưu địa chỉ sau nhiều lần thử. Vui lòng thử lại sau.',
        });
        this.loading = false;
      });
  }
}
