import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/Cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:8686/cart/api';

  constructor(private http: HttpClient) {}

  getAllCarts(): Observable<{ data: Cart[]; success: boolean }> {
    return this.http.get<{ data: Cart[]; success: boolean }>(
      `${this.apiUrl}/carts`
    );
  }

  getorInitCart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/carts/get-or-init`);
  }

  updateCart(cart: Cart): Observable<any> {
    return this.http.put<Cart>(`${this.apiUrl}/carts`, cart);
  }

  // Removed searchOrders method as it belongs in OrderService
}
