import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DiscountService } from '@app/core/services/Discount.service';
import {
  Discount,
  DiscountStatus,
  DiscountType,
} from '@app/core/models/Discount.model';

@Component({
  selector: 'app-manage-promotion',
  standalone: false,
  templateUrl: './manage-promotion.component.html',
  styleUrl: './manage-promotion.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class ManagePromotionComponent implements OnInit, OnDestroy {
  // Dữ liệu khuyến mãi
  promotions: Discount[] = [];
  filteredPromotions: Discount[] = [];
  searchKeyword: string = '';
  totalRecords: number = 0;
  loading: boolean = false;

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 10;

  // Tab trạng thái active
  activeStatusTab: string = 'ALL';

  // Các tùy chọn lọc trạng thái
  statusOptions = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'Đang diễn ra', value: DiscountStatus.ACTIVE },
    { label: 'Sắp diễn ra', value: DiscountStatus.SCHEDULED },
    { label: 'Đã huỷ', value: DiscountStatus.CANCELED },
    { label: 'Đã kết thúc', value: DiscountStatus.EXPIRED },
  ];

  // Các tùy chọn lọc loại khuyến mãi
  selectedPromotionType: string | null = null;
  promotionTypeOptions = [
    { label: 'Tất cả loại', value: null },
    { label: 'Giảm giá sản phẩm', value: DiscountType.PROMOTION },
    { label: 'Flash Sale', value: DiscountType.FLASH_SALE },
  ];

  // Xử lý debounce cho tìm kiếm
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private discountService: DiscountService
  ) {}

  ngOnInit() {
    // Thiết lập debounce cho search
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((keyword) => {
        this.searchKeyword = keyword;
        this.currentPage = 1;
        this.applyFilters();
      });

    // Tải dữ liệu khuyến mãi từ API
    this.loadPromotions();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Kích hoạt tìm kiếm
  searchPromotions() {
    this.searchSubject.next(this.searchKeyword);
  }

  // Xử lý thay đổi trang
  onPageChange(event: any) {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.applyFilters();
  }

  // Tải dữ liệu khuyến mãi từ API
  loadPromotions() {
    this.loading = true;
    console.log('Đang tải dữ liệu khuyến mãi...');

    this.discountService.getAllDiscounts().subscribe({
      next: (response: any) => {
        console.log('Phản hồi API:', response);

        // Kiểm tra cấu trúc phản hồi và lấy dữ liệu mảng
        if (response && response.success && Array.isArray(response.data)) {
          console.log('Tìm thấy', response.data.length, 'khuyến mãi');
          this.promotions = response.data;
        } else if (Array.isArray(response)) {
          // Trường hợp API trả về mảng trực tiếp
          console.log('Tìm thấy', response.length, 'khuyến mãi');
          this.promotions = response;
        } else {
          console.warn('Cấu trúc dữ liệu không đúng:', response);
          this.promotions = [];
        }

        // Áp dụng bộ lọc và hiển thị dữ liệu
        this.applyFilters();
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu khuyến mãi:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải dữ liệu khuyến mãi',
          life: 5000,
        });
        this.promotions = [];
        this.applyFilters();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });

    // Thiết lập timeout để tránh loading vô hạn
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }, 5000);
  }

  // Áp dụng các bộ lọc lên dữ liệu
  applyFilters() {
    try {
      // Đảm bảo promotions là mảng hợp lệ
      if (!this.promotions || !Array.isArray(this.promotions)) {
        this.promotions = [];
      }

      // Bắt đầu với toàn bộ dữ liệu
      let filtered = [...this.promotions];

      // Lọc theo trạng thái
      if (this.activeStatusTab !== 'ALL') {
        filtered = filtered.filter(
          (p) => p && p.status === this.activeStatusTab
        );
      }

      // Lọc theo từ khóa tìm kiếm
      if (this.searchKeyword?.trim()) {
        const keyword = this.searchKeyword.toLowerCase().trim();
        filtered = filtered.filter((p) => {
          // Tìm theo tên hoặc mã nếu có
          const nameMatch = p.name?.toLowerCase().includes(keyword);
          const idMatch = p.id?.toLowerCase().includes(keyword);
          return nameMatch || idMatch;
        });
      }

      // Lọc theo loại khuyến mãi
      if (this.selectedPromotionType) {
        filtered = filtered.filter(
          (p) => p.discountType === this.selectedPromotionType
        );
      }

      // Cập nhật tổng số bản ghi
      this.totalRecords = filtered.length;

      // Thực hiện phân trang
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, filtered.length);
      this.filteredPromotions = filtered.slice(startIndex, endIndex);

      console.log(
        `Hiển thị ${this.filteredPromotions.length}/${this.totalRecords} khuyến mãi`
      );
    } catch (error) {
      console.error('Lỗi khi lọc dữ liệu:', error);
      this.filteredPromotions = [];
      this.totalRecords = 0;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // Xử lý thay đổi loại khuyến mãi
  onPromotionTypeChange(event: any) {
    this.selectedPromotionType = event.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCustomTabChange(tab: any, i: number) {
    this.activeStatusTab = tab.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Các phương thức điều hướng
  createDiscount() {
    this.router.navigate(['/admin/manage-promotions/promotion']);
  }

  createFlashSale() {
    this.router.navigate(['/admin/manage-promotions/flash-sale']);
  }

  editPromotion(promotion: Discount) {
    this.router.navigate(['/admin/manage-promotions/edit', promotion.id]);
  }

  // Xác nhận xóa
  confirmDelete(promotion: Discount) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa khuyến mãi "${
        promotion.name || promotion.id
      }" không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePromotion(promotion);
      },
    });
  }

  // Xóa khuyến mãi
  deletePromotion(promotion: Discount) {
    this.loading = true;

    if (promotion.id) {
      this.discountService.deleteDiscount(promotion.id).subscribe({
        next: () => {
          this.promotions = this.promotions.filter(
            (p) => p.id !== promotion.id
          );
          this.applyFilters();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: `Đã xóa khuyến mãi "${promotion.name || promotion.id}"`,
          });
        },
        error: (error) => {
          console.error('Lỗi khi xóa khuyến mãi:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể xóa khuyến mãi',
          });
        },
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.loading = false;
    }
  }

  // Đổi trạng thái kích hoạt của khuyến mãi
  toggleVisibility(promotion: Discount) {
    if (!promotion.id) return;
    this.loading = true;
    this.discountService.visibilityDiscount(promotion.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail:
            promotion.status === DiscountStatus.CANCELED
              ? 'Kích hoạt thành công'
              : 'Huỷ kích hoạt thành công',
          life: 3000,
        });
        // Reload lại danh sách hoặc cập nhật trạng thái local
        this.loadPromotions();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể thay đổi trạng thái khuyến mãi',
        });
        this.loading = false;
      },
    });
  }

  // Lấy class hiển thị theo trạng thái
  getStatusClass(status: string): string {
    switch (status) {
      case DiscountStatus.ACTIVE:
        return 'status-active';
      case DiscountStatus.CANCELED:
        return 'status-inactive';
      case DiscountStatus.SCHEDULED:
        return 'status-upcoming';
      case DiscountStatus.EXPIRED:
        return 'status-ended';
      default:
        return '';
    }
  }

  // Lấy nhãn hiển thị theo trạng thái
  getStatusLabel(status: string): string {
    switch (status) {
      case DiscountStatus.ACTIVE:
        return 'Đang diễn ra';
      case DiscountStatus.CANCELED:
        return 'Đã huỷ';
      case DiscountStatus.SCHEDULED:
        return 'Sắp diễn ra';
      case DiscountStatus.EXPIRED:
        return 'Đã kết thúc';
      default:
        return status || 'Không xác định';
    }
  }

  // Lấy nhãn hiển thị theo loại khuyến mãi
  getDiscountTypeLabel(type: string): string {
    switch (type) {
      case DiscountType.PROMOTION:
        return 'Giảm giá sản phẩm';
      case DiscountType.FLASH_SALE:
        return 'Flash Sale';
      default:
        return type || 'Không xác định';
    }
  }

  // Định dạng ngày tháng
  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
