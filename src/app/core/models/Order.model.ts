export interface OrderFeeDTO {
  totalQuantity: number;
  totalPrice: number;
  shippingFee: number;
  totalWeight: number;
  totalHeight: number;
  totalWidth: number;
  totalLength: number;
}

export enum PaymentMethod {
  COD = 'COD',
  ONLINE = 'ONLINE',
}

export enum OrderStatus {
  PENDING_SHIPMENT = 'PENDING_SHIPMENT',
  WAITING_FOR_PICKUP = 'WAITING_FOR_PICKUP',
  DELIVERY_FAIL = 'DELIVERY_FAIL',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  UNPAID = 'UNPAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface OrderItemDTO {
  id?: string;
  orderId?: string;
  productId: string;
  productVariantId: string;
  quantity: number;
  price: number;
  weight: number;
  height: number;
  width: number;
  length: number;
}

export interface OrderDTO {
  id: string;
  userId: string;
  orderCode: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fromName: string;
  fromPhoneNumber: string;
  fromAddressLine1: string;
  fromAddressLine2: string;
  fromWard: string;
  fromWardCode: string;
  fromDistrict: string;
  fromDistrictId: string;
  fromCity: string;
  toName: string;
  toPhoneNumber: string;
  toAddressLine1: string;
  toAddressLine2: string;
  toWard: string;
  toWardCode: string;
  toDistrict: string;
  toDistrictId: string;
  toCity: string;
  returnName: string;
  returnPhoneNumber: string;
  returnAddressLine1: string;
  returnAddressLine2: string;
  returnWard: string;
  returnWardCode: string;
  returnDistrict: string;
  returnDistrictId: string;
  returnCity: string;
  totalProductVariant: number;
  shipmentFee: number;
  totalPrice: number;
  rejectReason: string;
  note: string;
  referencesId: string;
  totalWeight: number;
  totalHeight: number;
  totalWidth: number;
  totalLength: number;
  printed: boolean;
  paymentUrl: string;
  ghnorderCode: string;
  orderItems: OrderItemDTO[];
}

export interface CreateOrderRequest {
  toAddressId: string;
  paymentMethod: PaymentMethod;
  note?: string;
  referencesId?: string;
}

export interface CreateShippingOrderRequest {
  orderIds: string[];
}

export interface PrintOrCancelGHNOrderRequest {
  order_codes: string[];
}

export interface SearchOrderRequest {
  keyword?: string;
  userId?: string; // UUID dưới dạng string
  orderStatus?: OrderStatus | null; // Changed from status to orderStatus
  pageIndex: number;
  pageSize: number;
}
