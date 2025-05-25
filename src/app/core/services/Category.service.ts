import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category.model';
import { ApiResponse } from '../models/ApiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategoriesUrl = 'http://localhost:8686/product/api/category';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiCategoriesUrl);
  }

  getCategoriesByProductType(
    productType: string
  ): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('productType', productType);
    return this.http.get<ApiResponse<Category[]>>(
      `${this.apiCategoriesUrl}/category-by-productType`,
      { params }
    );
  }

  // Add method to get a category by ID
  getCategoryById(categoryId: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(
      `${this.apiCategoriesUrl}/${categoryId}`
    );
  }
}
