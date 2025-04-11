import { UUID } from 'crypto';

export interface TagDescription {
  name?: string;
  required?: boolean;
  type?: string;
  description?: string;
}
export interface Category {
  id?: UUID;
  name?: string;
  product_type?: string;
  description?: string;
  tag_descriptions?: TagDescription[];
}
