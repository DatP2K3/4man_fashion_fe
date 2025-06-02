import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Category,
  CreateOrUpdateCategoryRequest,
} from '../models/Category.model';
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

  // Create a new category (ADMIN only)
  createCategory(
    category: CreateOrUpdateCategoryRequest
  ): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(
      `${this.apiCategoriesUrl}`,
      category
    );
  }

  // Update an existing category (ADMIN only)
  updateCategory(
    category: CreateOrUpdateCategoryRequest
  ): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(
      `${this.apiCategoriesUrl}`,
      category
    );
  }

  /**
   * Thay đổi trạng thái deleted (ẩn/xoá mềm) của category
   * @param id UUID của category
   */
  visibilityCategory(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiCategoriesUrl}/${id}/visibility`,
      null
    );
  }
}
