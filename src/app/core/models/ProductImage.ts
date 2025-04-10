import { UUID } from 'crypto';

export class ProductImage {
  public id?: UUID;
  public product_id?: UUID;
  public file_id?: UUID;
  public avatar?: boolean;
}
