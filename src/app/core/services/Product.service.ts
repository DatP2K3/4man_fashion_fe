import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8686/product/api';

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
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }

  getDescriptionKeysByCategoryId(categoryId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/categories/${categoryId}/description-keys`
    );
  }
}
