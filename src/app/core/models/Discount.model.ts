export enum DiscountStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

export enum DiscountType {
  PROMOTION = 'PROMOTION',
  FLASH_SALE = 'FLASH_SALE',
}

export interface Discount {
  id?: string;
  name?: string;
  productId: string;
  startDate: Date;
  endDate: Date;
  status?: DiscountStatus; // Changed to optional since backend will handle this
  discountType: DiscountType;
  discountPercentage?: number;
  discountPrice?: number;
}
