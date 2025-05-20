import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import {
  DashboardDTO,
  DashboardTime,
  RevenueAndOrdersDTO,
} from 'src/app/core/models/Dashboard.model';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading: boolean = true;
  dashboardData: DashboardDTO | null = null;
  selectedTimeRange: DashboardTime = DashboardTime.DAY;
  timeRangeOptions = [
    { label: 'Theo Ngày', value: DashboardTime.DAY },
    { label: 'Theo Tuần', value: DashboardTime.WEEK },
    { label: 'Theo Tháng', value: DashboardTime.MONTH },
  ];

  // Chart data
  revenueChartData: any;
  revenueChartOptions: any;
  ordersChartData: any;
  ordersChartOptions: any;
  cityChartData: any;
  cityChartOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService
      .getDashboard(this.selectedTimeRange)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.dashboardData = response.data;
            this.prepareChartData();
            console.log('Dashboard data loaded:', this.dashboardData);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể tải dữ liệu dashboard',
            });
          }
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Đã xảy ra lỗi khi tải dữ liệu dashboard',
          });
        },
      });
  }

  onTimeRangeChange(): void {
    this.loadDashboardData();
  }

  prepareChartData(): void {
    if (!this.dashboardData) return;

    // Prepare Revenue Chart Data
    this.prepareRevenueChartData();

    // Prepare Orders Chart Data
    this.prepareOrdersChartData();

    // Prepare City Chart Data
    this.prepareCityChartData();
  }

  prepareRevenueChartData(): void {
    const labels = this.dashboardData!.revenueAndOrders.map(
      (item) => item.dateLabel
    );
    const revenueData = this.dashboardData!.revenueAndOrders.map(
      (item) => item.totalRevenue
    );

    this.revenueChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: revenueData,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
        },
      ],
    };

    this.revenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: number) => {
              return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
              }).format(value);
            },
          },
        },
      },
    };
  }

  prepareOrdersChartData(): void {
    const labels = this.dashboardData!.revenueAndOrders.map(
      (item) => item.dateLabel
    );
    const ordersData = this.dashboardData!.revenueAndOrders.map(
      (item) => item.totalOrders
    );

    this.ordersChartData = {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Số đơn hàng',
          data: ordersData,
          backgroundColor: '#FF9800',
          borderColor: '#FF9800',
          borderWidth: 1,
        },
      ],
    };

    this.ordersChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
      },
    };
  }

  prepareCityChartData(): void {
    const labels = this.dashboardData!.orderByCity.map((item) => item.city);
    const data = this.dashboardData!.orderByCity.map(
      (item) => item.totalOrders
    );
    const colors = this.generateRandomColors(labels.length);

    this.cityChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors.map((color) =>
            this.adjustBrightness(color, 20)
          ),
        },
      ],
    };

    this.cityChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              size: 14,
            },
          },
        },
        datalabels: {
          formatter: (value: number, ctx: any) => {
            const total = ctx.chart.data.datasets[0].data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value * 100) / total).toFixed(1) + '%';
            return percentage;
          },
          color: '#ffffff',
          font: {
            weight: 'bold',
            size: 12,
          },
        },
      },
    };
  }

  generateRandomColors(count: number): string[] {
    // Predefined colors for consistency
    const baseColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#8AC926',
      '#1982C4',
      '#6A4C93',
      '#FF595E',
    ];

    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // If we need more colors than in our predefined list
    const result = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      result.push(`rgb(${r}, ${g}, ${b})`);
    }

    return result;
  }

  adjustBrightness(color: string, amount: number): string {
    // Handle rgb or rgba colors
    if (color.startsWith('rgb')) {
      // Extract the rgb values
      const rgbMatch = color.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = Math.max(0, Math.min(255, parseInt(rgbMatch[0]) + amount));
        const g = Math.max(0, Math.min(255, parseInt(rgbMatch[1]) + amount));
        const b = Math.max(0, Math.min(255, parseInt(rgbMatch[2]) + amount));
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
    return color;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }
}
