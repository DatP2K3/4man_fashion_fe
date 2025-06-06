import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MembershipTier } from '../models/MembershipTier.model';
import { ApiResponse } from '../models/ApiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class MembershipTierService {
  private apiUrl = 'http://localhost:8686/profile/api/membership-tiers';

  constructor(private http: HttpClient) {}

  createMembershipTier(req: any): Observable<ApiResponse<MembershipTier>> {
    return this.http.post<ApiResponse<MembershipTier>>(this.apiUrl, req);
  }

  updateMembershipTier(req: any): Observable<ApiResponse<MembershipTier>> {
    return this.http.put<ApiResponse<MembershipTier>>(this.apiUrl, req);
  }

  getAllMembershipTiers(): Observable<ApiResponse<MembershipTier[]>> {
    return this.http.get<ApiResponse<MembershipTier[]>>(this.apiUrl);
  }

  toggleMembershipTierVisibility(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/${id}/toggle-visibility`,
      null
    );
  }
}
