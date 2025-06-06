import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { CashbackTransaction } from '../models/CashbackTransaction.model';
import { ApiResponse } from '../models/ApiResponse.model';

@Injectable({ providedIn: 'root' })
export class CashbackTransactionService {
  private apiUrl = 'http://localhost:8686/profile/api/cashback-transaction';

  constructor(private http: HttpClient) {}

  getUserCashbackHistory(): Observable<CashbackTransaction[]> {
    return this.http.get<ApiResponse<CashbackTransaction[]>>(this.apiUrl).pipe(
      map((response) => {
        return response.data || [];
      }),
      catchError((error) => {
        console.error('Error fetching cashback transactions:', error);
        return throwError(() => error);
      })
    );
  }

  // Helper method for paginated results (for future use)
  getUserCashbackHistoryPaginated(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<CashbackTransaction[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<CashbackTransaction[]>>(`${this.apiUrl}/paginated`, {
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching paginated cashback history:', error);
          return throwError(() => error);
        })
      );
  }
}
