import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiGetOrInitOrUpdateProfileUrl =
    'http://localhost:8686/profile/api/profiles';
  private apiUploadAvatarUrl =
    'http://localhost:8686/profile/api/profiles/avatar';
  private apiGetAvatarUrl = 'http://localhost:8686/storage/api/public/file';
  private apiCreateOrUpdateShippingAddressUrl =
    'http://localhost:8686/profile/api/profiles/shipping-address';

  constructor(private http: HttpClient) {}

  getOrInit(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiGetOrInitOrUpdateProfileUrl, null, {
      headers,
    });
  }

  updateInfo(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(this.apiGetOrInitOrUpdateProfileUrl, formData, {
      headers,
    });
  }

  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<any>(this.apiUploadAvatarUrl, formData);
  }

  getAvatar(fileId: string): Observable<any> {
    return this.http.get<any>(`${this.apiGetAvatarUrl}/${fileId}`);
  }

  createShippingAddress(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(
      this.apiCreateOrUpdateShippingAddressUrl,
      formData,
      { headers }
    );
  }

  updateShippingAddress(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(
      this.apiCreateOrUpdateShippingAddressUrl,
      formData,
      { headers }
    );
  }
}
