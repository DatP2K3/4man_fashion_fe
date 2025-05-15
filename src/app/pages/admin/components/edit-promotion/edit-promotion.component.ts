import { FileUploadService } from './../../../../core/services/FileUpload.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  Discount,
  DiscountType,
  DiscountStatus,
} from '@app/core/models/Discount.model';
import { DiscountService } from '@app/core/services/Discount.service';
import { ProductService } from '@app/core/services/Product.service';

@Component({
  selector: 'app-edit-promotion',
  standalone: false,
  templateUrl: './edit-promotion.component.html',
  styleUrls: ['./edit-promotion.component.scss'],
  providers: [MessageService],
})
export class EditPromotionComponent implements OnInit {
  promotionForm: FormGroup;
  isEditMode = false;
  loading = false;
  id: string | null = null;
  maxNameLength = 50;
  products: any[] = []; // All products
  productsLoaded = false; // Track if products have been loaded
  selectedProduct: any = null; // Hold selected product details

  // Enum cho loại giảm giá
  discountCases = [
    { label: 'Tỷ lệ phần trăm giảm giá', value: 'PERCENTAGE' },
    { label: 'Giá cố định', value: 'FIXED_PRICE' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private discountService: DiscountService,
    private messageService: MessageService,
    private productService: ProductService,
    private fileUploadService: FileUploadService
  ) {
    // Khởi tạo form
    this.promotionForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.maxLength(this.maxNameLength)],
      ],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      discountType: [null, Validators.required],
      discountCase: ['PERCENTAGE', Validators.required],
      discountPercentage: [0],
      discountPrice: [0],
      productId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const urlSegments = this.router.url.split('/');
    if (urlSegments[urlSegments.length - 1] == 'promotion') {
      this.promotionForm.get('discountType')?.setValue(DiscountType.PROMOTION);
    } else if (urlSegments[urlSegments.length - 1] == 'flash-sale') {
      this.promotionForm.get('discountType')?.setValue(DiscountType.FLASH_SALE);
    } else {
      this.id = urlSegments[urlSegments.length - 1];
    }

    this.isEditMode = !!this.id;

    // Always load products first
    this.loadProducts();

    // Then load promotion details if in edit mode
    if (this.isEditMode) {
      this.loadPromotionDetails();
    }

    // Thêm validator cho discountPercentage khi chọn loại PERCENTAGE
    this.promotionForm.get('discountCase')?.valueChanges.subscribe((type) => {
      if (type === 'PERCENTAGE') {
        this.promotionForm
          .get('discountPercentage')
          ?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(100),
          ]);
        this.promotionForm.get('discountPrice')?.clearValidators();
      } else {
        this.promotionForm
          .get('discountPrice')
          ?.setValidators([Validators.required, Validators.min(1)]);
        this.promotionForm.get('discountPercentage')?.clearValidators();
      }
      this.promotionForm.get('discountPercentage')?.updateValueAndValidity();
      this.promotionForm.get('discountPrice')?.updateValueAndValidity();
    });
  }

  loadPromotionDetails() {
    if (!this.id) return;

    this.loading = true;
    this.discountService.getDiscountById(this.id).subscribe({
      next: (res) => {
        const promotion = res.data;
        // Set form values with promotion data
        this.promotionForm.patchValue({
          name: promotion.name || '',
          startDate: promotion.startDate ? new Date(promotion.startDate) : null,
          endDate: promotion.endDate ? new Date(promotion.endDate) : null,
          discountType: promotion.discountType,
          // Don't set productId yet
        });

        // Determine and set the discount case based on which value is present
        if (promotion.discountPercentage) {
          this.promotionForm.patchValue({
            discountCase: 'PERCENTAGE',
            discountPercentage: promotion.discountPercentage,
          });
        } else {
          this.promotionForm.patchValue({
            discountCase: 'FIXED_PRICE',
            discountPrice: promotion.discountPrice,
          });
        }

        // Load product details for the promotion
        if (promotion.productId) {
          // Simply store the productId for reference, we'll set form later
          const productId = promotion.productId;
          this.loadProductDetails(productId);
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin khuyến mãi:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin khuyến mãi',
        });
        this.loading = false;
      },
    });
  }

  loadProducts() {
    if (this.productsLoaded) return;

    // Remove the early return for edit mode, always load products from API
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res.data.map((product: any) => ({
          id: product.id,
          name: product.name,
        }));
        this.productsLoaded = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách sản phẩm',
        });
        this.loading = false;
      },
    });
  }

  // New method to handle product selection
  onProductSelect(event: any) {
    const productId = event.value;
    if (productId) {
      this.loadProductDetails(productId);
    } else {
      this.selectedProduct = null;
    }

    // Update the form value
    this.promotionForm.patchValue({
      productId: productId,
    });
  }

  // Load product details including price and image
  loadProductDetails(productId: string) {
    // First check if we already have this product in our products array
    const existingProduct = this.products.find((p) => p.id === productId);
    if (existingProduct && existingProduct.price) {
      // If we already have detailed product info, use it instead of making API call
      this.selectedProduct = { ...existingProduct };
      // Set the product ID in the form now that we have the product details
      this.promotionForm.get('productId')?.setValue(productId);
      return;
    }

    // Otherwise load from API as before
    this.loading = true;
    this.productService.getProductById(productId).subscribe({
      next: (res) => {
        console.log('Product details:', res.data);

        this.selectedProduct = {
          id: res.data.id,
          name: res.data.name,
          price: res.data.originPrice,
          imageUrl:
            res.data.images?.find((img: any) => img.type === 'main')?.url ||
            res.data.images?.[0]?.url,
        };

        // Set the product ID in the form now that we have the product details
        this.promotionForm.get('productId')?.setValue(productId);

        this.fileUploadService.getFile(res.data.avatarId).subscribe({
          next: (res) => {
            console.log('Image URL:', res.data.url);
            this.selectedProduct.imageUrl = res.data.url;
          },
          error: (error) => {
            console.error('Error loading product image:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể tải hình ảnh sản phẩm',
            });
          },
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin sản phẩm',
        });
        this.loading = false;
      },
    });
  }

  // Format price as VND currency
  formatPrice(price: number): string {
    return price
      ? new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price)
      : '';
  }

  onSubmit() {
    if (this.promotionForm.invalid) {
      this.markFormGroupTouched(this.promotionForm);
      return;
    }

    const promotionData: Discount = this.prepareFormData();
    this.loading = true;

    if (this.isEditMode && this.id) {
      this.discountService.updateDiscount(this.id, promotionData).subscribe({
        next: () => this.handleSuccess('Cập nhật khuyến mãi thành công'),
        error: (error) => this.handleError(error),
      });
    } else {
      this.discountService.createDiscount(promotionData).subscribe({
        next: () => this.handleSuccess('Tạo khuyến mãi thành công'),
        error: (error) => this.handleError(error),
      });
    }
  }

  prepareFormData(): Discount {
    const formValue = this.promotionForm.value;
    const promotionData: Discount = {
      id: this.id || undefined,
      name: formValue.name,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      discountType: formValue.discountType as DiscountType,
      productId: formValue.productId,
    };

    if (formValue.discountCase === 'PERCENTAGE') {
      promotionData.discountPercentage = formValue.discountPercentage;
      promotionData.discountPrice = undefined;
    } else {
      promotionData.discountPrice = formValue.discountPrice;
      promotionData.discountPercentage = undefined;
    }

    return promotionData;
  }

  // Helper method to determine discount status based on dates
  determineDiscountStatus(startDate: Date, endDate: Date): DiscountStatus {
    const now = new Date();

    if (!startDate || !endDate) {
      return DiscountStatus.SCHEDULED;
    }

    // Đã kết thúc
    if (new Date(endDate) < now) {
      return DiscountStatus.EXPIRED;
    }

    // Đang diễn ra
    if (new Date(startDate) <= now && new Date(endDate) >= now) {
      return DiscountStatus.ACTIVE;
    }

    // Sắp diễn ra (mặc định cho khuyến mãi mới)
    return DiscountStatus.SCHEDULED;
  }

  handleSuccess(message: string) {
    this.loading = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
    });
    this.router.navigate(['/admin/manage-promotions']);
  }

  handleError(error: any) {
    console.error('Lỗi xử lý khuyến mãi:', error);
    this.loading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Xảy ra lỗi khi xử lý khuyến mãi',
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.promotionForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Trường này là bắt buộc';
    }
    if (control.errors['maxlength']) {
      return `Không vượt quá ${this.maxNameLength} ký tự`;
    }
    if (control.errors['min']) {
      return `Giá trị tối thiểu là ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `Giá trị tối đa là ${control.errors['max'].max}`;
    }

    return 'Giá trị không hợp lệ';
  }

  cancel() {
    this.router.navigate(['/admin/manage-promotions']);
  }
}
