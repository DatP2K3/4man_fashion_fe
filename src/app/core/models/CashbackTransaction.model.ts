import { UUID } from 'node:crypto';

export enum CashbackTransactionType {
  EARNED = 'EARNED', // Hoàn tiền từ đơn hàng
  USED = 'USED', // Sử dụng để thanh toán
}

export interface CashbackTransaction {
  id: UUID;
  userId: UUID;
  orderId: UUID;
  amount: number;
  type: CashbackTransactionType;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
