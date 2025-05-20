import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeviceRegistrationService } from './device-registration.service';
import { DeviceIdService } from './device-id.service';
import {
  RegisterOrUpdateDeviceRequest,
  UnRegisterDeviceRequest,
} from '../models/register-device.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  private firebaseApp;
  private currentFcmToken: string | null = null;
  currentMessage = new BehaviorSubject<any>(null);

  constructor(
    private deviceRegistrationService: DeviceRegistrationService,
    private deviceIdService: DeviceIdService
  ) {
    console.log('FCM Service được khởi tạo');
    // Kiểm tra và in ra cấu hình để debug
    console.log('Cấu hình Firebase:', JSON.stringify(environment.firebase));

    // Khởi tạo Firebase App ngay khi service được tạo
    try {
      this.firebaseApp = initializeApp(environment.firebase);
      console.log('Firebase đã được khởi tạo thành công');
    } catch (error) {
      console.error('Lỗi khởi tạo Firebase:', error);
    }
  }

  /**
   * Yêu cầu quyền và lấy token FCM
   */
  async requestPermission(): Promise<string | null> {
    console.log('Đang yêu cầu quyền thông báo...');
    console.log('vapidKey được sử dụng:', environment.firebase.vapidKey);

    try {
      // Đảm bảo rằng Firebase đã được khởi tạo
      if (!this.firebaseApp) {
        this.firebaseApp = initializeApp(environment.firebase);
      }

      const messaging = getMessaging(this.firebaseApp);
      console.log('Đã khởi tạo messaging');

      // Luôn yêu cầu token mới từ Firebase
      const currentToken = await getToken(messaging, {
        vapidKey: environment.firebase.vapidKey,
      });

      if (currentToken) {
        console.log('Token FCM hiện tại: ', currentToken);
        this.currentFcmToken = currentToken;
        return currentToken;
      } else {
        console.log('Không thể lấy token. Yêu cầu quyền trước.');
        // Yêu cầu quyền thông báo từ người dùng
        if (Notification.permission !== 'granted') {
          console.log('Yêu cầu quyền Notification...');
          await Notification.requestPermission();
        }
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo messaging:', error);
      return null;
    }
  }

  /**
   * Đăng ký thiết bị sau khi đăng nhập
   * @param userId ID người dùng từ Keycloak
   */
  async registerDevice(userId: string): Promise<boolean> {
    console.log('==== BẮT ĐẦU ĐĂNG KÝ THIẾT BỊ FCM ====');
    try {
      // Yêu cầu FCM token mới mỗi khi đăng nhập
      console.log('Đang yêu cầu FCM token mới...');
      const token = await this.requestPermission();
      if (!token) {
        console.error('Không thể lấy FCM token để đăng ký');
        return false;
      }
      console.log('✓ Đã nhận FCM token');
      this.currentFcmToken = token;

      // Lấy deviceId hoặc tạo mới nếu chưa có
      const deviceId = this.deviceIdService.getDeviceId();
      const deviceInfo = this.deviceIdService.getDeviceInfo();

      console.log('Chuẩn bị gọi API đăng ký thiết bị với thông tin:');
      const request: RegisterOrUpdateDeviceRequest = {
        userId: userId,
        deviceToken: this.currentFcmToken,
        deviceId: deviceId,
        topics: [], // Có thể thiết lập topics nếu cần
        enabled: true,
      };
      console.log('Thông tin yêu cầu đăng ký thiết bị:', request);

      console.log('Gửi yêu cầu đăng ký thiết bị đến server...');
      await firstValueFrom(
        this.deviceRegistrationService.registerDevice(request)
      );
      console.log('==== ĐĂNG KÝ THIẾT BỊ FCM THÀNH CÔNG ====');
      return true;
    } catch (error) {
      console.error('✘ LỖI KHI ĐĂNG KÝ THIẾT BỊ:', error);
      return false;
    }
  }

  /**
   * Hủy đăng ký thiết bị khi đăng xuất - Chỉ hủy đăng ký trên server, không xóa token
   * @param userId ID người dùng từ Keycloak
   */
  async unregisterDevice(userId: string): Promise<boolean> {
    console.log('==== BẮT ĐẦU HỦY ĐĂNG KÝ THIẾT BỊ FCM ====');
    try {
      if (!this.currentFcmToken) {
        console.log('Không có token FCM để hủy đăng ký');
        return false;
      }

      // Lấy deviceId đã lưu
      const deviceId = this.deviceIdService.getDeviceId();

      const request: UnRegisterDeviceRequest = {
        userId: userId,
        deviceId: deviceId,
        deviceToken: this.currentFcmToken,
      };
      console.log('Thông tin yêu cầu hủy đăng ký thiết bị:', request);

      await firstValueFrom(
        this.deviceRegistrationService.unregisterDevice(request)
      );

      // THAY ĐỔI: Không xóa FCM token nữa
      // Chỉ giải phóng biến currentFcmToken
      this.currentFcmToken = null;

      console.log('==== HỦY ĐĂNG KÝ THIẾT BỊ FCM THÀNH CÔNG ====');
      return true;
    } catch (error) {
      console.error('✘ LỖI KHI HỦY ĐĂNG KÝ THIẾT BỊ:', error);
      return false;
    }
  }

  /**
   * Lắng nghe thông báo khi ứng dụng đang mở
   */
  listen() {
    try {
      // Đảm bảo rằng Firebase đã được khởi tạo
      if (!this.firebaseApp) {
        this.firebaseApp = initializeApp(environment.firebase);
      }

      const messaging = getMessaging(this.firebaseApp);

      onMessage(messaging, (payload) => {
        console.log('Thông báo nhận được: ', payload);
        this.currentMessage.next(payload);

        // Hiển thị thông báo ngay cả khi tab đang mở
        if (Notification.permission === 'granted') {
          const notification = new Notification(
            payload.notification?.title || 'Thông báo mới',
            {
              body: payload.notification?.body,
              icon: '/assets/icons/icon-72x72.png',
            }
          );

          notification.onclick = () => {
            notification.close();
            window.focus();
          };
        }
      });
    } catch (error) {
      console.error('Lỗi khi lắng nghe thông báo:', error);
    }
  }
}
