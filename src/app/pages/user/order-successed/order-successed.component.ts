import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Navigation } from '@angular/router';
import { OrderDTO, PaymentMethod } from '@app/core/models/Order.model';
import { OrderService } from '@app/core/services/Order.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-order-successed',
  standalone: false,
  templateUrl: './order-successed.component.html',
  styleUrls: ['./order-successed.component.scss'],
})
export class OrderSuccessedComponent implements OnInit {
  order: OrderDTO | null = null;
  loading = true;
  orderCode: string = '';
  customerName: string = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private messageService: MessageService
  ) {
    // Capture navigation state khi component được tạo, không phải trong ngOnInit
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      const state = currentNavigation.extras.state as { order?: OrderDTO };
      console.log('Navigation state captured in constructor:', state);
      if (state?.order) {
        this.order = state.order;
        this.orderCode = this.order.orderCode || '';
        this.customerName = this.order.toName || '';
      }
    }
  }

  ngOnInit(): void {
    // Xử lý các tham số URL trước
    const urlParams = new URLSearchParams(window.location.search);
    this.orderCode = urlParams.get('orderCode') || '';

    if (this.orderCode) {
      // Nếu có mã từ VNPay hoặc query param
      this.fetchOrderDetails();
    } else if (!this.order) {
      // Nếu không có mã trong URL và không lấy được từ state
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không tìm thấy thông tin đơn hàng',
      });
    } else {
      // Đã lấy được order từ state trong constructor
      this.loading = false;
    }
  }

  private fetchOrderDetails(): void {
    if (!this.orderCode) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không tìm thấy mã đơn hàng',
      });
      this.router.navigate(['/']);
      return;
    }

    this.orderService.getOrderByOrderCode(this.orderCode).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.order = response.data;
          this.customerName = this.order.toName || '';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching order:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.',
        });
        this.loading = false;
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

  navigateToOrderManagement(): void {
    this.router.navigate(['/account/orders']);
  }
}
