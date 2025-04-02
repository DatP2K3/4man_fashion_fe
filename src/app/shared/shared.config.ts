import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PrimeIcons } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

// Import các services, components shared
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
// Import các modules khác nếu cần

// Các token và services
export const API_URL = 'http://localhost:8080/api';

// Hàm trả về tất cả providers cho shared module
export function provideShared(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    provideAnimations(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          typography: {
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
    }),
    {
      provide: 'API_URL',
      useValue: API_URL,
    },
  ];
}

// Export tất cả components dùng chung
export const SHARED_COMPONENTS = [HeaderComponent, FooterComponent];
