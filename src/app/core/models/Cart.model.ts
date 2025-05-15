export interface CartItem {
  id?: string;
  productId?: string;
  productVariantId: string;
  quantity: number;
  deleted: boolean;
  name: string;
  originPrice: number;
  discountPrice: number;
  discountPercent: number;
  discountType: number;
  avatarId: string;
  imageUrl?: string;
  size?: string;
  color?: string;
}

export interface Cart {
  id?: string;
  userId: string;
  cartItems?: CartItem[];
}
