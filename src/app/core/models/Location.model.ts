export interface Ward {
  wardCode: string;
  wardName: string;
  districtId: number;
}

export interface District {
  id: number;
  name: string;
  provinceId: number;
  code: string;
  enabled: boolean;
}

export interface Province {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
}
