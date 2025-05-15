import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse.model';
import {
  CancelOrderRequest,
  CreateOrderRequest,
  CreateShippingOrderRequest,
  OrderDTO,
  OrderFeeDTO,
  PrintOrCancelGHNOrderRequest,
  SearchOrderRequest,
} from '../models/Order.model';
import { Observable } from 'rxjs';
import { PageApiResponse } from '../models/PageApiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8686/order/api';

  constructor(private http: HttpClient) {}

  calculateFee(toAddressId: string): Observable<ApiResponse<OrderFeeDTO>> {
    return this.http.get<ApiResponse<OrderFeeDTO>>(
      `${this.apiUrl}/caculate-fee/${toAddressId}`
    );
  }

  createOrder(request: CreateOrderRequest): Observable<ApiResponse<OrderDTO>> {
    return this.http.post<ApiResponse<OrderDTO>>(
      `${this.apiUrl}/orders`,
      request
    );
  }

  getOrderByOrderCode(orderCode: string): Observable<ApiResponse<OrderDTO>> {
    return this.http.get<ApiResponse<OrderDTO>>(
      `${this.apiUrl}/orders/${orderCode}`
    );
  }

  createGHNOrder(
    request: CreateShippingOrderRequest
  ): Observable<ApiResponse<OrderDTO[]>> {
    return this.http.post<ApiResponse<OrderDTO[]>>(
      `${this.apiUrl}/orders/ghn`,
      request
    );
  }

  printGHNOrder(request: PrintOrCancelGHNOrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/ghn-order/print`, request, {
      responseType: 'text', // Changed from 'blob' to 'text' for HTML content
    });
  }

  searchOrders(
    request: SearchOrderRequest
  ): Observable<PageApiResponse<OrderDTO[]>> {
    const params = new HttpParams({ fromObject: { ...(request as any) } });

    return this.http.get<PageApiResponse<OrderDTO[]>>(
      `${this.apiUrl}/orders/search`,
      { params }
    );
  }

  deleteOrder(request: CancelOrderRequest): Observable<ApiResponse<void>> {
    const url = `${this.apiUrl}/orders`;
    return this.http.request<ApiResponse<void>>('delete', url, {
      body: request,
    });
  }

  getOrders(): Observable<ApiResponse<OrderDTO[]>> {
    return this.http.get<ApiResponse<OrderDTO[]>>(`${this.apiUrl}/orders`);
  }
}
