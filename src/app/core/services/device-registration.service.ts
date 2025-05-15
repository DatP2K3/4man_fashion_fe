import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RegisterOrUpdateDeviceRequest,
  UnRegisterDeviceRequest,
} from '../models/register-device.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceRegistrationService {
  private readonly API_URL = 'http://localhost:3333/api/device-registration';

  constructor(private http: HttpClient) {}

  registerDevice(request: RegisterOrUpdateDeviceRequest): Observable<any> {
    console.log('Gửi yêu cầu đăng ký thiết bị:', request);
    return this.http.post(`${this.API_URL}/register`, request);
  }

  unregisterDevice(request: UnRegisterDeviceRequest): Observable<any> {
    console.log('Gửi yêu cầu hủy đăng ký thiết bị:', request);
    return this.http.delete(`${this.API_URL}/unregister`, { body: request });
  }
}
