import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Discount,
  DiscountStatus,
  DiscountType,
} from '../models/Discount.model';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private apiUrl = 'http://localhost:8686/product/api/discounts';

  constructor(private http: HttpClient) {}

  // Cập nhật để không trả về dữ liệu mẫu khi có lỗi
  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Lỗi khi tải danh sách khuyến mãi:', error);
        // Trả về mảng rỗng thay vì dữ liệu mẫu
        return of([]);
      })
    );
  }

  // Get discount by ID
  getDiscountById(id: string): Observable<any> {
    return this.http
      .get<Discount>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create new discount
  createDiscount(discount: Discount): Observable<Discount> {
    return this.http
      .post<Discount>(
        'http://localhost:8686/product/api/products/discounts',
        discount
      )
      .pipe(catchError(this.handleError));
  }

  // Update discount
  updateDiscount(id: string, discount: Discount): Observable<Discount> {
    return this.http
      .put<Discount>(
        'http://localhost:8686/product/api/products/discounts',
        discount
      )
      .pipe(catchError(this.handleError));
  }

  // Delete discount
  deleteDiscount(id: string): Observable<void> {
    return this.http
      .delete<void>(
        'http://localhost:8686/product/api/products/discounts/' + id
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Thay đổi trạng thái hiển thị (kích hoạt/huỷ kích hoạt) của discount
   */
  visibilityDiscount(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/visibility`, null);
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Đã xảy ra lỗi không xác định';
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía client
      errorMsg = `Lỗi Client: ${error.error.message}`;
    } else {
      // Lỗi phía server
      errorMsg = `Mã lỗi Server: ${error.status}, Thông báo: ${error.message}`;
    }

    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }

  // Xóa phương thức getMockDiscounts vì không cần sử dụng nữa
}
