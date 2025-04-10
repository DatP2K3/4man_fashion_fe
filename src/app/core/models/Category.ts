import { UUID } from 'crypto';
import { TagDescription } from './TagDescription';

export class Category {
  public id?: UUID;
  public name?: string;
  public product_type?: string;
  public description?: string;
  public tag_descriptions?: TagDescription[];
}
