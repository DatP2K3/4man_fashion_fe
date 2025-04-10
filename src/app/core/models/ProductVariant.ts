import { UUID } from 'crypto';

export class ProductVariant {
  public id?: UUID;
  public product_id?: UUID;
  public size?: string;
  public color?: string;
  public quantity?: number;
  public sku?: string;
}
