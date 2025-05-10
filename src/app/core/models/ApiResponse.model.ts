/**
 * Generic API response interface for wrapping all API responses
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  code?: number;
  message?: string;
  timestamp?: number;
  status?: string;
}
