export enum BannerType {
  SLIDE = 'SLIDE',
  LEFT_BANNER = 'LEFT_BANNER',
  RIGHT_BANNER = 'RIGHT_BANNER',
}

export interface Banner {
  id: string; // UUID
  title: string;
  fileId: string; // UUID
  position: number;
  type: BannerType;
  deleted: Boolean;
  imageUrl?: string; // Cho hiển thị trên UI
}
