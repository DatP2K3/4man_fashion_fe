import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class DeviceIdService {
  private readonly DEVICE_ID_KEY = 'fcm_device_id';

  constructor() {}

  /**
   * Lấy deviceId hiện tại hoặc tạo mới nếu chưa có
   */
  getDeviceId(): string {
    const deviceId = localStorage.getItem(this.DEVICE_ID_KEY);

    if (!deviceId) {
      // Tạo UUID mới cho thiết bị
      const newDeviceId = uuidv4();
      // Lưu vào localStorage để sử dụng lại
      localStorage.setItem(this.DEVICE_ID_KEY, newDeviceId);
      console.log('✓ Đã tạo deviceId mới:', newDeviceId);
      return newDeviceId;
    } else {
      console.log('✓ Sử dụng deviceId đã lưu:', deviceId);
      return deviceId;
    }
  }

  /**
   * Lấy thông tin về thiết bị hiện tại
   */
  getDeviceInfo(): { name: string; platform: string } {
    const userAgent = navigator.userAgent;
    let deviceName = 'Web Browser';
    let platform = 'WEB';

    // Xác định tên thiết bị cụ thể hơn dựa trên User Agent
    if (userAgent.includes('iPhone')) {
      deviceName = 'iPhone (Web)';
    } else if (userAgent.includes('iPad')) {
      deviceName = 'iPad (Web)';
    } else if (userAgent.includes('Android')) {
      deviceName = 'Android (Web)';
    } else if (userAgent.includes('Windows')) {
      deviceName = 'Windows (Web)';
    } else if (userAgent.includes('Mac')) {
      deviceName = 'Mac (Web)';
    } else if (userAgent.includes('Linux')) {
      deviceName = 'Linux (Web)';
    }

    return { name: deviceName, platform };
  }
}
