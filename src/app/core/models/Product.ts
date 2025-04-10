import { ProductVariant } from './ProductVariant';
import { ProductImage } from './ProductImage';

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
