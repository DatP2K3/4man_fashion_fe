import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategoriesUrl = 'http://localhost:8686/product/api/category';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiCategoriesUrl);
  }
}
