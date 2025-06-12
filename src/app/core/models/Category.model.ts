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
  deleted?: boolean; // Thêm trường deleted để phản ánh trạng thái ẩn/xoá mềm
}

export interface Tag {
  id?: string;
  name?: string;
  CategoryId?: string;
}

export interface CreateOrUpdateCategoryRequest {
  id?: string;
  name: string;
  productType: string;
  description?: string;
  tagDescriptions?: Tag[];
}
