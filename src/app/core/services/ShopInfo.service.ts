import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShopInfoService {
  private apiUrl = 'http://localhost:8686/shopinfo/api/shop-address';
  private maxRetries = 3;

  constructor(private http: HttpClient) {}

  getShopInfo(): Promise<any> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(
        retry(this.maxRetries), // Retry failed requests up to maxRetries times
        map((response) => {
          console.log('Shop Info API response:', response);
          return response.data;
        }),
        catchError((error) => {
          console.error('Error fetching shop info:', error);
          return throwError(() => error);
        })
      )
      .toPromise();
  }

  updateShopInfo(shopInfo: any): Promise<any> {
    return this.http
      .put<any>(this.apiUrl, shopInfo)
      .pipe(
        retry(this.maxRetries), // Retry failed requests up to maxRetries times
        map((response) => {
          console.log('Shop Info updated successfully:', response);
          return response.data;
        }),
        catchError((error) => {
          console.error('Error updating shop info:', error);
          return throwError(() => error);
        })
      )
      .toPromise();
  }

  // Helper method to retry a function with exponential backoff
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 300
  ): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
