import { UUID } from 'crypto';

export interface ProductImage {
  id?: UUID;
  productId?: string;
  fileId?: string;
  avatar?: boolean;
  deleted?: boolean;
}

export interface ProductVariant {
  id?: UUID;
  productId?: UUID;
  size?: string;
  color?: string;
  quantity?: number;
  sku?: string;
  deleted?: boolean;
}

export class Product {
  public id?: string; // UUID
  public name?: string;
  public originPrice?: number; // Long
  public categoryId?: string; // UUID
  public description?: Record<string, string>; // Map<String, String>
  public introduce?: string; // Short description of the product (HTML)
  public weight?: number;
  public length?: number;
  public width?: number;
  public height?: number;
  public hidden?: boolean;
  public totalSold?: number; // Long
  public averageRating?: number; // BigDecimal
  public productVariants?: ProductVariant[];
  public productImages?: ProductImage[];
}
