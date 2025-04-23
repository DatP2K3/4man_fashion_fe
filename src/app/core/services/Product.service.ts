import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import {
  ProductSearchRequest,
  ProductSearchResponse,
} from '@app/core/models/product-search.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8686/product/api';

  // Add refresh mechanism
  private refreshNeededSubject = new BehaviorSubject<boolean>(false);
  refreshNeeded$ = this.refreshNeededSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  uploadFile(file: File): Observable<{ fileId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileId: string }>('/api/files/upload', formData);
  }

  createProduct(product: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/products`, product, {
      headers,
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  getDescriptionKeysByCategoryId(categoryId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/categories/${categoryId}/description-keys`
    );
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products-with-no-discount`);
  }

  searchProducts(
    searchRequest: ProductSearchRequest
  ): Observable<ProductSearchResponse> {
    return this.http
      .post<ProductSearchResponse>(
        'http://localhost:8686/elasticsearch/api/products/search',
        searchRequest
      )
      .pipe(
        map((response) => {
          // Đảm bảo các trường hidden được xử lý đúng nếu tên trường khác nhau
          return response;
        })
      );
  }

  toggleProductVisibility(productId: string, hidden: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${productId}/visibility`, {
      hidden,
    });
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products`, product);
  }

  // Method to trigger a refresh
  triggerRefresh() {
    this.refreshNeededSubject.next(true);
  }

  // Reset refresh state
  resetRefreshState() {
    this.refreshNeededSubject.next(false);
  }
}
