export interface PageableResponse {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PageApiResponse<T> {
  data: T;
  success: boolean;
  code: number;
  message: string;
  timestamp: number;
  status: string;
  pageable: PageableResponse;
}
