import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banner } from '../models/Banner.model';
import { Observable } from 'rxjs';
import { UUID } from 'node:crypto';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private apiUrl = 'http://localhost:8686/banner/api/banners';

  constructor(private http: HttpClient) {}

  getAllBanners(): Observable<{ data: Banner[]; success: boolean }> {
    return this.http.get<{ data: Banner[]; success: boolean }>(this.apiUrl);
  }

  createBanner(banner: Omit<Banner, 'id'>): Observable<Banner> {
    return this.http.post<Banner>(this.apiUrl, banner);
  }

  deleteBanner(id: string): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, null);
  }
}
