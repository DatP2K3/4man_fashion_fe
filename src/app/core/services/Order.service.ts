import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse.model';
import { OrderFeeDTO } from '../models/Order.model';
import { Observable } from 'rxjs';

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
}
