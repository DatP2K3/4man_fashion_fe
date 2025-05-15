import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    // Loại trừ các dependency có thể không tương thích với Vite optimizer
    exclude: [
      '@angular/common',
      '@angular/core',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/router',
      '@angular/animations',
      'primeng/api',
      'primeng/button',
      'primeng/calendar',
      'primeng/carousel',
      'primeng/dropdown',
      'primeng/inputtext',
      'primeng/paginator',
      'primeng/table',
      'primeng/toast',
      'rxjs',
    ],
  },
  build: {
    // Tăng giới hạn chunk để tránh các vấn đề về kích thước
    chunkSizeWarningLimit: 1600,
  },
  server: {
    fs: {
      // Cho phép phục vụ các file từ thư mục gốc của Angular
      allow: ['..'],
    },
  },
});
