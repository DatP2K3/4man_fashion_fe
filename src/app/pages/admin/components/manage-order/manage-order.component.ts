import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/core/services/Order.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  OrderDTO,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PrintOrCancelGHNOrderRequest,
  CreateShippingOrderRequest,
  SearchOrderRequest,
} from 'src/app/core/models/Order.model';
import { MenuItem } from 'primeng/api';
import { ProductService } from 'src/app/core/services/Product.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-order',
  standalone: false,
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class ManageOrderComponent implements OnInit {
  // Make OrderStatus accessible in the template
  OrderStatus = OrderStatus;

  // Tab menu items
  orderStatusTabs: MenuItem[] = [];
  activeTab: MenuItem | undefined = undefined;

  // Date filters
  fromDate: Date | null = null;
  toDate: Date | null = null;

  // Orders data
  orders: OrderDTO[] = [];
  totalRecords: number = 0;
  loading: boolean = true;

  // Pagination
  rowsPerPage: number = 10;
  rowsPerPageOptions: number[] = [5, 10, 20, 50];
  currentPage: number = 1; // Changed from 0 to 1 since API pageIndex starts at 1

  // Order status filtering
  currentStatus: OrderStatus | 'ALL' | null = 'ALL'; // Added null to type definition
  currentPrintStatus: boolean | null = null;

  // Order details dialog
  displayOrderDetail: boolean = false;
  selectedOrder: OrderDTO | null = null;

  // Product cache for lookups
  productCache: Map<string, any> = new Map();

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.initTabs();
    this.setupDateRange();
    this.loadOrders();
  }

  initTabs() {
    this.orderStatusTabs = [
      { label: 'Tất cả', command: () => this.filterByStatus(null) },
      {
        label: 'Đã xác nhận',
        command: () => this.filterByStatus(OrderStatus.PENDING_SHIPMENT),
      },
      {
        label: 'Chờ lấy hàng',
        command: () => this.filterByStatus(OrderStatus.WAITING_FOR_PICKUP),
      },
      {
        label: 'Đang vận chuyển',
        command: () => this.filterByStatus(OrderStatus.IN_TRANSIT),
      },
      {
        label: 'Giao thành công',
        command: () => this.filterByStatus(OrderStatus.DELIVERED),
      },
      {
        label: 'Đang hoàn trả',
        command: () => this.filterByStatus(OrderStatus.DELIVERY_FAIL),
      },
      {
        label: 'Đã hủy',
        command: () => this.filterByStatus(OrderStatus.CANCELLED),
      },
      {
        label: 'Chưa in',
        command: () => this.filterPrintStatus(false),
      },
    ];
    this.activeTab = this.orderStatusTabs[0];
  }

  setupDateRange() {
    // Default: This month
    const now = new Date();
    this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  loadOrders() {
    this.loading = true;

    // Create search request with filters, omitting orderStatus for "All"
    const searchRequest: SearchOrderRequest = {
      keyword: '',
      pageIndex: this.currentPage,
      pageSize: this.rowsPerPage,
    };

    // Only add orderStatus if a specific status is selected
    if (this.currentStatus !== 'ALL' && this.currentStatus !== null) {
      searchRequest.orderStatus = this.currentStatus;
    }

    this.orderService
      .searchOrders(searchRequest)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.orders = response.data;
            this.totalRecords = response.pageable.totalElements;

            // Apply client-side print status filtering if needed
            if (this.currentPrintStatus !== null) {
              this.orders = this.orders.filter(
                (order) => order.printed === this.currentPrintStatus
              );
            }
          } else {
            this.orders = [];
            this.totalRecords = 0;
          }
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh sách đơn hàng',
          });
          this.orders = [];
          this.totalRecords = 0;
        },
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // Add 1 because PrimeNG paginator uses 0-based indexing
    this.rowsPerPage = event.rows;
    this.loadOrders();
  }

  filterByStatus(status: OrderStatus | null) {
    this.currentStatus = status;
    this.currentPrintStatus = null; // Reset print status filter
    this.currentPage = 1; // Reset to first page (was 0, now 1)
    this.loadOrders();
  }

  filterPrintStatus(printed: boolean) {
    this.currentPrintStatus = printed;
    this.currentStatus = 'ALL'; // Reset status filter
    this.currentPage = 1; // Reset to first page (was 0, now 1)
    this.loadOrders();
  }

  filterOrders() {
    // Implement date range filtering
    if (this.fromDate && this.toDate) {
      // Validate dates
      if (this.fromDate > this.toDate) {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Ngày bắt đầu không thể sau ngày kết thúc',
        });
        return;
      }
      // Reset to first page
      this.currentPage = 1; // Changed from 0 to 1
      // Apply filters
      this.loadOrders();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn khoảng thời gian',
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  translateOrderStatus(status: OrderStatus): string {
    const statusMap: Record<OrderStatus | string, string> = {
      [OrderStatus.PENDING_SHIPMENT]: 'Đã xác nhận',
      [OrderStatus.WAITING_FOR_PICKUP]: 'Chờ lấy hàng',
      [OrderStatus.DELIVERY_FAIL]: 'Giao hàng thất bại',
      [OrderStatus.IN_TRANSIT]: 'Đang vận chuyển',
      [OrderStatus.DELIVERED]: 'Giao thành công',
      [OrderStatus.UNPAID]: 'Chưa thanh toán',
      [OrderStatus.CANCELLED]: 'Đã hủy',
      RETURNING: 'Đang hoàn trả',
    };
    return statusMap[status] || status;
  }

  translatePaymentMethod(method: PaymentMethod): string {
    return method === PaymentMethod.COD
      ? 'Thanh toán khi nhận hàng'
      : 'Thanh toán trực tuyến';
  }

  translatePaymentStatus(status: PaymentStatus): string {
    const statusMap: Record<PaymentStatus, string> = {
      [PaymentStatus.UNPAID]: 'Chưa thanh toán',
      [PaymentStatus.PAID]: 'Đã thanh toán',
      [PaymentStatus.FAILED]: 'Thanh toán thất bại',
      [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
    };
    return statusMap[status] || status;
  }

  getOrderStatusClass(status: OrderStatus): string {
    const classMap: Record<OrderStatus | string, string> = {
      [OrderStatus.PENDING_SHIPMENT]: 'status-confirmed',
      [OrderStatus.WAITING_FOR_PICKUP]: 'status-waiting',
      [OrderStatus.DELIVERY_FAIL]: 'status-failed',
      [OrderStatus.IN_TRANSIT]: 'status-transit',
      [OrderStatus.DELIVERED]: 'status-delivered',
      [OrderStatus.UNPAID]: 'status-unpaid',
      [OrderStatus.CANCELLED]: 'status-cancelled',
      RETURNING: 'status-transit',
    };
    return classMap[status] || '';
  }

  getPrintStatus(order: OrderDTO): string {
    if (order.orderStatus === OrderStatus.CANCELLED) {
      return order.printed ? 'Đã in' : 'Chưa in';
    }

    if (order.printed) {
      return 'Đã in';
    }

    if (order.orderStatus === OrderStatus.PENDING_SHIPMENT) {
      return 'Chưa sắp xếp vận chuyển';
    }

    return 'Chưa in';
  }

  // Action handlers
  viewOrder(order: OrderDTO) {
    this.selectedOrder = order;
    this.displayOrderDetail = true;
    this.loadProductDetails(order);
  }

  printOrder(order: OrderDTO) {
    if (!order.ghnorderCode) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Đơn hàng chưa được tạo trên GHN',
      });
      return;
    }

    const request: PrintOrCancelGHNOrderRequest = {
      order_codes: [order.ghnorderCode],
    };

    this.orderService.printGHNOrder(request).subscribe({
      next: (response) => {
        // Create a blob with HTML content type
        const blob = new Blob([response], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);

        // Open in a new tab
        const printWindow = window.open(url);
        order.printed = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã tạo phiếu in đơn hàng',
        });
      },
      error: (error) => {
        console.error('Error printing order:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể in đơn hàng',
        });
      },
    });
  }

  confirmCancelOrder(order: OrderDTO) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      header: 'Xác nhận hủy đơn hàng',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cancelOrder(order);
      },
    });
  }

  cancelOrder(order: OrderDTO) {
    // Implement cancel order logic here
    order.orderStatus = OrderStatus.CANCELLED;

    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã hủy đơn hàng ' + order.orderCode,
    });
  }

  arrangeShipping(order: OrderDTO) {
    const request: CreateShippingOrderRequest = {
      orderIds: [order.id],
    };

    this.loading = true;
    this.orderService
      .createGHNOrder(request)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã tạo đơn vận chuyển thành công',
            });
            // Update local state
            const updatedOrder = response.data[0];
            const index = this.orders.findIndex(
              (o) => o.id === updatedOrder.id
            );
            if (index !== -1) {
              this.orders[index] = updatedOrder;
            }
            // Reload to get fresh data
            this.loadOrders();
          }
        },
        error: (error) => {
          console.error('Error creating shipping order:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tạo đơn vận chuyển',
          });
        },
      });
  }

  // Helper methods
  canPrint(order: OrderDTO): boolean {
    // Only show print for WAITING_FOR_PICKUP orders
    return order.orderStatus === OrderStatus.WAITING_FOR_PICKUP;
  }

  canCancel(order: OrderDTO): boolean {
    // Only allow cancellation for PENDING_SHIPMENT or WAITING_FOR_PICKUP
    return (
      order.orderStatus === OrderStatus.PENDING_SHIPMENT ||
      order.orderStatus === OrderStatus.WAITING_FOR_PICKUP
    );
  }

  canArrangeShipping(order: OrderDTO): boolean {
    return order.orderStatus === OrderStatus.PENDING_SHIPMENT;
  }

  loadProductDetails(order: OrderDTO) {
    // Load product information for the order items
    order.orderItems.forEach((item) => {
      if (!this.productCache.has(item.productId)) {
        // Mocking product lookup - would be replaced with API call in real implementation
        this.productCache.set(item.productId, {
          name: 'Sản phẩm #' + item.productId,
          variants: {
            [item.productVariantId]: {
              name: 'Size M, Màu đen',
            },
          },
        });
      }
    });
  }

  getProductName(productId: string, variantId: string): string {
    const product = this.productCache.get(productId);
    if (!product) return 'Sản phẩm không xác định';

    const variantName = product.variants[variantId]?.name || '';
    return `${product.name} (${variantName})`;
  }
}
