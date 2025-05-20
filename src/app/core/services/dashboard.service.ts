import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse.model';
import { DashboardDTO, DashboardTime } from '../models/Dashboard.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8686/dashboard/api/dashboard';
  constructor(private http: HttpClient) {}

  getDashboard(time: DashboardTime): Observable<ApiResponse<DashboardDTO>> {
    const params = new HttpParams().set('dashboardTime', time);
    return this.http.get<ApiResponse<DashboardDTO>>(this.apiUrl, { params });
  }
}
