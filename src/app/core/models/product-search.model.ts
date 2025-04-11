export interface ProductSearchRequest {
  keyword?: string;
  categoryId?: string;
  hidden?: boolean;
  page?: number;
  size?: number;
  sortField?: string;
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
