export interface RegisterOrUpdateDeviceRequest {
  userId: string;
  deviceToken: string;
  deviceId: string;
  topics?: string[];
  enabled: boolean;
}

export interface UnRegisterDeviceRequest {
  userId: string;
  deviceId: string;
  deviceToken: string;
}
