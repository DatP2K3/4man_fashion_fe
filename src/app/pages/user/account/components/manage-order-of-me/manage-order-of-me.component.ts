import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../../core/services/Order.service';
import { OrderDTO, OrderStatus } from '../../../../../core/models/Order.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../../../core/models/ApiResponse.model';
import { ProductService } from '../../../../../core/services/Product.service';
import { FileUploadService } from '../../../../../core/services/FileUpload.service';

@Component({
  selector: 'app-manage-order-of-me',
  standalone: false,
  templateUrl: './manage-order-of-me.component.html',
  styleUrls: ['./manage-order-of-me.component.scss'],
})
export class ManageOrderOfMeComponent implements OnInit {
  orders: OrderDTO[] = [];
  filteredOrders: OrderDTO[] = [];
  loading = false;
  dateRangeForm: FormGroup;
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  selectedOrder: OrderDTO | null = null;
  showOrderModal = false;
  orderItemImages: { [productId: string]: string } = {};
  orderItemProductInfo: {
    [productId: string]: { name: string; imageUrl?: string };
  } = {};

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private productService: ProductService,
    private fileUploadService: FileUploadService // Thêm dòng này
  ) {
    this.dateRangeForm = this.fb.group({
      fromDate: [new Date(new Date().setDate(new Date().getDate() - 30))],
      toDate: [new Date()],
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;

    this.orderService
      .getOrders()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.orders = response.data || [];
            this.applyFilters();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load orders',
            });
          }
        },
        error: (error) => {
          console.error('Error loading orders', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Failed to load orders: ' + (error.message || 'Unknown error'),
          });
        },
      });
  }

  applyFilters(): void {
    const fromDate = this.dateRangeForm.get('fromDate')?.value;
    const toDate = this.dateRangeForm.get('toDate')?.value;

    if (fromDate && toDate) {
      const fromDateTime = new Date(fromDate).setHours(0, 0, 0, 0);
      const toDateTime = new Date(toDate).setHours(23, 59, 59, 999);

      this.filteredOrders = this.orders.filter((order) => {
        const orderDate = new Date(order.createdAt || new Date()).getTime();
        return orderDate >= fromDateTime && orderDate <= toDateTime;
      });
    } else {
      this.filteredOrders = [...this.orders];
    }

    this.totalItems = this.filteredOrders.length;
    this.applyPagination();
  }

  applyPagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  filterOrders(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  paginate(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.applyPagination();
  }

  getStatusTranslation(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING_SHIPMENT]: 'Đã xác nhận',
      [OrderStatus.WAITING_FOR_PICKUP]: 'Chờ lấy hàng',
      [OrderStatus.IN_TRANSIT]: 'Đang vận chuyển',
      [OrderStatus.DELIVERED]: 'Giao thành công',
      [OrderStatus.DELIVERY_FAIL]: 'Giao thất bại',
      [OrderStatus.UNPAID]: 'Chưa thanh toán',
      [OrderStatus.CANCELLED]: 'Đã hủy',
    };
    return statusMap[status] || status;
  }

  viewOrder(orderCode: string): void {
    this.loading = true;
    this.orderService
      .getOrderByOrderCode(orderCode)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: ApiResponse<OrderDTO>) => {
          if (response.success && response.data) {
            this.selectedOrder = response.data;
            this.showOrderModal = true;
            this.loadOrderItemImages();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể lấy thông tin đơn hàng',
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail:
              'Không thể lấy thông tin đơn hàng: ' +
              (error.message || 'Unknown error'),
          });
        },
      });
  }

  loadOrderItemImages(): void {
    this.orderItemImages = {};
    this.orderItemProductInfo = {};
    if (this.selectedOrder && this.selectedOrder.orderItems) {
      this.selectedOrder.orderItems.forEach((item) => {
        const productId = item.productId;
        if (productId) {
          this.productService.getProductById(productId).subscribe({
            next: (res) => {
              const productData = res?.data;
              const avatarId = productData?.avatarId;
              const name = productData?.name || '';
              if (name) {
                this.orderItemProductInfo[productId] = { name };
              }
              if (avatarId) {
                this.fileUploadService.getFile(avatarId).subscribe({
                  next: (fileRes) => {
                    if (fileRes && fileRes.data && fileRes.data.url) {
                      this.orderItemProductInfo[productId] = {
                        name,
                        imageUrl: fileRes.data.url,
                      };
                      this.orderItemImages[productId] = fileRes.data.url;
                    }
                  },
                  error: () => {
                    // Không cần xử lý lỗi ở đây
                  },
                });
              }
            },
            error: () => {
              // Không cần xử lý lỗi ở đây
            },
          });
        }
      });
    }
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
    this.selectedOrder = null;
    this.orderItemImages = {};
    this.orderItemProductInfo = {};
  }

  cancelOrder(orderCode: string): void {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      this.loading = true;
      this.orderService
        .deleteOrder({ orderIds: [orderCode] })
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã hủy đơn hàng thành công',
              });
              this.loadOrders();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể hủy đơn hàng',
              });
            }
          },
          error: (error) => {
            console.error('Error cancelling order', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail:
                'Không thể hủy đơn hàng: ' + (error.message || 'Unknown error'),
            });
          },
        });
    }
  }

  payOrder(orderCode: string): void {
    // First, get the order details to access the payment URL
    this.loading = true;
    this.orderService
      .getOrderByOrderCode(orderCode)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            if (response.data.paymentUrl) {
              // Open payment URL in a new tab
              window.open(response.data.paymentUrl, '_blank');
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không tìm thấy địa chỉ thanh toán cho đơn hàng này',
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể thanh toán đơn hàng',
            });
          }
        },
        error: (error) => {
          console.error('Error processing payment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail:
              'Không thể thanh toán đơn hàng: ' +
              (error.message || 'Unknown error'),
          });
        },
      });
  }
}
