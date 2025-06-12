export interface ProductSearchRequest {
  keyword?: string;
  categoryId?: string;
  productType?: string; // Add this field to support searching by product type
  hidden?: boolean;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface Pageable {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProductSearchResponse {
  data: any[]; // Sẽ được cast sang Product model khi sử dụng
  success: boolean;
  code: number;
  message: string;
  timestamp: number;
  status: string;
  pageable: Pageable;
}
