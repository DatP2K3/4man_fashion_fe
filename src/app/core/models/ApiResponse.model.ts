/**
 * Generic API response interface for wrapping all API responses
 */
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T | null;
  timestamp?: string;
  error?: string;
}
