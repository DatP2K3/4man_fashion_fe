import { Component, OnInit, OnDestroy } from '@angular/core';
import { FcmService } from './core/services/fcm.service';
import { KeycloakService } from 'keycloak-angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = '4Man Fashion';
  private keycloakInitialized = false;

  constructor(
    private fcmService: FcmService,
    private keycloakService: KeycloakService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('==== KHỞI TẠO ỨNG DỤNG ====');
    this.initializeApp();
    this.setupDirectKeycloakEventListeners();
    this.monitorRouteChanges();
    this.saveCurrentUrl(); // Thêm dòng này
    this.checkInitialLoginState();
  }

  ngOnDestroy() {
    // Clean up listeners if needed
    if (
      this.keycloakInitialized &&
      this.keycloakService.getKeycloakInstance()
    ) {
      console.log('Dọn dẹp các listeners Keycloak');
      this.keycloakService.getKeycloakInstance().onAuthSuccess = undefined;
      this.keycloakService.getKeycloakInstance().onAuthLogout = undefined;
    }
  }

  private async initializeApp() {
    try {
      console.log('==== BẮT ĐẦU KHỞI TẠO FCM... ====');

      // Kiểm tra nếu browser hỗ trợ thông báo
      if ('Notification' in window) {
        console.log('✓ Browser hỗ trợ Notifications API');

        // Yêu cầu quyền notification
        if (Notification.permission === 'default') {
          console.log('Đang yêu cầu quyền thông báo...');
          await Notification.requestPermission();
        }

        console.log('✓ Trạng thái quyền thông báo:', Notification.permission);

        // Chỉ yêu cầu token khi đã có quyền
        if (Notification.permission === 'granted') {
          console.log('Đang yêu cầu FCM token...');
          const token = await this.fcmService.requestPermission();

          if (token) {
            console.log('✓ Đã lấy được FCM token thành công:', token);
            console.log('Thiết lập lắng nghe thông báo...');
            this.fcmService.listen();
            console.log('✓ Đã thiết lập lắng nghe thông báo thành công');
          } else {
            console.log(
              '✘ Không lấy được FCM token - kiểm tra lỗi trong console'
            );
          }
        } else {
          console.log(
            '✘ Chưa được cấp quyền thông báo, không thể lấy FCM token'
          );
        }
      } else {
        console.log('✘ Browser không hỗ trợ thông báo');
      }

      console.log('==== HOÀN TẤT KHỞI TẠO FCM ====');
    } catch (error) {
      console.error('✘ LỖI KHỞI TẠO FCM:', error);
    }
  }

  /**
   * Sử dụng trực tiếp các hàm callback của Keycloak instance
   */
  private setupDirectKeycloakEventListeners() {
    console.log('==== THIẾT LẬP LISTENER TRỰC TIẾP KEYCLOAK ====');

    // Đảm bảo keycloakInstance đã được khởi tạo
    if (!this.keycloakService.getKeycloakInstance()) {
      console.log(
        '⚠️ Keycloak Instance chưa được khởi tạo, sẽ thử lại sau 2 giây'
      );
      setTimeout(() => this.setupDirectKeycloakEventListeners(), 2000);
      return;
    }

    this.keycloakInitialized = true;
    console.log('✓ Keycloak Instance đã được khởi tạo');

    // Đăng ký callback onAuthSuccess trực tiếp
    this.keycloakService.getKeycloakInstance().onAuthSuccess = async () => {
      console.log(
        '==== NGƯỜI DÙNG ĐĂNG NHẬP THÀNH CÔNG (callback trực tiếp) ===='
      );
      try {
        const isLoggedIn = await this.keycloakService.isLoggedIn();
        if (isLoggedIn) {
          const userProfile = await this.keycloakService.loadUserProfile();
          console.log('Thông tin người dùng:', userProfile);
          const userId = userProfile.id || userProfile.username;
          if (userId) {
            console.log('Đang đăng ký thiết bị cho người dùng:', userId);
            await this.fcmService.registerDevice(userId);
            console.log(
              '✓ ĐĂNG KÝ THIẾT BỊ FCM THÀNH CÔNG CHO NGƯỜI DÙNG:',
              userId
            );
          }

          // Handle role-based navigation
          await this.authService.handleSuccessfulLogin();
        }
      } catch (error) {
        console.error('✘ LỖI KHI ĐĂNG KÝ THIẾT BỊ SAU ĐĂNG NHẬP:', error);
      }
    };

    // Đăng ký callback onAuthLogout trực tiếp
    this.keycloakService.getKeycloakInstance().onAuthLogout = async () => {
      console.log('==== NGƯỜI DÙNG ĐĂNG XUẤT (callback trực tiếp) ====');
      try {
        // Lấy thông tin người dùng từ localStorage trước khi xóa
        const userProfile =
          localStorage.getItem('keycloak_user') ||
          localStorage.getItem('userProfile');
        if (userProfile) {
          console.log('Đã tìm thấy thông tin người dùng trong localStorage');
          const user = JSON.parse(userProfile);
          const userId = user.id || user.sub || user.username;
          if (userId) {
            console.log('Đang hủy đăng ký thiết bị cho người dùng:', userId);
            await this.fcmService.unregisterDevice(userId);
            console.log('✓ HỦY ĐĂNG KÝ THIẾT BỊ FCM THÀNH CÔNG');
          }
        }
      } catch (error) {
        console.error('✘ LỖI KHI HỦY ĐĂNG KÝ THIẾT BỊ SAU ĐĂNG XUẤT:', error);
      }
    };

    console.log('✓ Đã thiết lập callback trực tiếp cho Keycloak Instance');

    // Fallback: Lưu thông tin người dùng vào localStorage khi đăng nhập
    this.saveUserInfoToStorage();
  }

  /**
   * Lưu thông tin người dùng vào localStorage để sử dụng khi logout
   */
  private async saveUserInfoToStorage() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        localStorage.setItem('keycloak_user', JSON.stringify(userProfile));
        console.log('✓ Đã lưu thông tin người dùng vào localStorage');
      }
    } catch (error) {
      console.error('Lỗi khi lưu thông tin người dùng:', error);
    }
  }

  /**
   * Theo dõi thay đổi route để phát hiện đăng nhập/đăng xuất
   */
  private monitorRouteChanges() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(async () => {
        try {
          const currentLoginState = await this.keycloakService.isLoggedIn();
          const previousLoginState =
            localStorage.getItem('isLoggedIn') === 'true';

          console.log(
            `Trạng thái đăng nhập - Trước: ${previousLoginState}, Hiện tại: ${currentLoginState}`
          );

          // Phát hiện đăng nhập mới
          if (!previousLoginState && currentLoginState) {
            console.log('Phát hiện đăng nhập mới qua route change!');
            this.saveUserInfoToStorage();
            // Trigger đăng ký thiết bị
            const userProfile = await this.keycloakService.loadUserProfile();
            const userId = userProfile.id || userProfile.username;
            if (userId) {
              await this.fcmService.registerDevice(userId);
              console.log('✓ ĐĂNG KÝ THIẾT BỊ FCM THÀNH CÔNG QUA ROUTE CHANGE');
            }
          }

          // Phát hiện đăng xuất
          if (previousLoginState && !currentLoginState) {
            console.log('Phát hiện đăng xuất qua route change!');
            // Xử lý đăng xuất đã được xử lý bởi onAuthLogout
          }

          // Cập nhật trạng thái đăng nhập vào localStorage
          localStorage.setItem('isLoggedIn', currentLoginState.toString());
        } catch (error) {
          console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
        }
      });
  }

  /**
   * Lưu lại URL hiện tại để có thể quay lại sau khi làm mới trang
   */
  private saveCurrentUrl() {
    const currentUrl = window.location.pathname;
    const excludedUrls = ['/', '/login', '/unauthorized', '/auth'];

    // Chỉ lưu URL khi không phải là các trang loại trừ
    if (!excludedUrls.includes(currentUrl) && !currentUrl.startsWith('/auth')) {
      localStorage.setItem('lastVisitedUrl', currentUrl);
      console.log('Đã lưu URL hiện tại:', currentUrl);
    }
  }

  /**
   * Kiểm tra trạng thái đăng nhập khi khởi động ứng dụng
   */
  private async checkInitialLoginState() {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      console.log('Trạng thái đăng nhập ban đầu:', isLoggedIn);

      if (isLoggedIn) {
        console.log('Người dùng đã đăng nhập khi khởi động app');
        const userProfile = await this.keycloakService.loadUserProfile();
        console.log('Thông tin người dùng:', userProfile);

        // Lưu vào localStorage
        localStorage.setItem('keycloak_user', JSON.stringify(userProfile));
        localStorage.setItem('isLoggedIn', 'true');

        // Đăng ký thiết bị
        const userId = userProfile.id || userProfile.username;
        if (userId) {
          await this.fcmService.registerDevice(userId);
          console.log('✓ ĐĂNG KÝ THIẾT BỊ FCM THÀNH CÔNG KHI KHỞI ĐỘNG APP');
        }

        // Kiểm tra xem có đang ở trang cần điều hướng không
        const currentUrl = this.router.url;
        const publicPaths = ['/', '/login', '/unauthorized', '/auth'];
        const shouldRedirect = publicPaths.some((path) =>
          currentUrl.startsWith(path)
        );

        // Chỉ điều hướng nếu đang ở trang công khai
        if (shouldRedirect) {
          // Kiểm tra URL đã lưu và điều hướng về đó nếu có
          const lastVisitedUrl = localStorage.getItem('lastVisitedUrl');
          if (lastVisitedUrl && lastVisitedUrl !== '/') {
            console.log('Điều hướng về trang đã lưu:', lastVisitedUrl);
            this.router.navigateByUrl(lastVisitedUrl);
          } else {
            // Nếu không có URL đã lưu, thực hiện điều hướng mặc định
            await this.authService.handleSuccessfulLogin();
          }
        } else {
          console.log('Giữ nguyên tại trang hiện tại:', currentUrl);
        }
      } else {
        localStorage.setItem('isLoggedIn', 'false');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái đăng nhập ban đầu:', error);
    }
  }
}
