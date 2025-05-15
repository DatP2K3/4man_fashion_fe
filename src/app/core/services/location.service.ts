import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:8686/location/api/locations';

  constructor(private http: HttpClient) {}

  getWards(districtId: string): Observable<any> {
    console.log(`Fetching wards for district ID: ${districtId}`);
    return this.http
      .get<any>(`${this.apiUrl}/wards-by-district/${districtId}`)
      .pipe(
        tap((response) => console.log('Ward API response:', response)),
        catchError((error) => {
          console.error('Error fetching wards:', error);
          return of({ data: [] });
        })
      );
  }

  getDistricts(provinceId: string): Observable<any> {
    console.log(`Fetching districts for province ID: ${provinceId}`);
    return this.http
      .get<any>(`${this.apiUrl}/districts-by-province/${provinceId}`)
      .pipe(
        tap((response) => console.log('District API response:', response)),
        catchError((error) => {
          console.error('Error fetching districts:', error);
          return of({ data: [] });
        })
      );
  }

  getProvinces(): Observable<any> {
    console.log('Fetching all provinces');
    return this.http.get<any>(`${this.apiUrl}/provinces`).pipe(
      tap((response) => console.log('Province API response:', response)),
      catchError((error) => {
        console.error('Error fetching provinces:', error);
        return of({ data: [] });
      })
    );
  }
}
