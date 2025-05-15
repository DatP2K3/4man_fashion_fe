export enum DashboardTime {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export interface OrderStatisticByCityDTO {
  city: string;
  totalOrders: number;
}

export interface RevenueAndOrdersDTO {
  dateLabel: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface SummaryTodayDTO {
  totalRevenue: number;
  totalOrders: number;
  totalNewUsers: number;
}

export interface DashboardDTO {
  orderByCity: OrderStatisticByCityDTO[];
  revenueAndOrders: RevenueAndOrdersDTO[];
  todaySummary: SummaryTodayDTO;
}
