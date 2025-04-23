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
  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalProducts: number = 0;
  filterValue: string = '';
  // Enum cho loại giảm giá
  discountTypes = [
    { label: 'Tỷ lệ phần trăm giảm giá', value: 'PERCENTAGE' },
    { label: 'Giá cố định', value: 'FIXED_PRICE' },
  ];

  // Add this property to make Math available in template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private discountService: DiscountService,
    private messageService: MessageService,
    private productService: ProductService // Add ProductService
  ) {
    // Khởi tạo form
    this.promotionForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.maxLength(this.maxNameLength)],
      ],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      discountType: ['PERCENTAGE', Validators.required],
      discountPercentage: [0],
      discountPrice: [0],
      productId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.id; // Fix typo in property name

    if (this.isEditMode) {
      this.loadPromotionDetails(); // Fix function name
    }

    // Thêm validator cho discountPercentage khi chọn loại PERCENTAGE
    this.promotionForm.get('discountType')?.valueChanges.subscribe((type) => {
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
      this.promotionForm.get('discountPrice')?.updateValueAndValidity(); // Fix unclosed string
    });
  }

  loadPromotionDetails() {
    if (!this.id) return;

    this.loading = true;
    this.discountService.getDiscountById(this.id).subscribe({
      next: (promotion) => {
        this.promotionForm.patchValue({
          name: promotion.name || '',
          startDate: new Date(promotion.startDate),
          endDate: new Date(promotion.endDate),
          discountType: promotion.discountType,
          discountPercentage: promotion.discountPercentage || 0,
          discountPrice: promotion.discountPrice || 0,
          productId: promotion.productId || '',
        });
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
    if (this.productsLoaded) return; // Skip if already loaded

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
      name: formValue.name,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      status: this.determineDiscountStatus(
        formValue.startDate,
        formValue.endDate
      ),
      discountType: formValue.discountType as DiscountType,
      productId: formValue.productId,
    };

    if (formValue.discountType === 'PERCENTAGE') {
      promotionData.discountPercentage = formValue.discountPercentage;
    } else {
      promotionData.discountPrice = formValue.discountPrice;
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
