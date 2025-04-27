import { UUID } from 'crypto';

export interface TagDescription {
  name?: string;
  required?: boolean;
  type?: string;
  description?: string;
}
export interface Category {
  id?: string;
  name?: string;
  productType?: string;
  description?: string;
  tagDescriptions?: TagDescription[];
}
