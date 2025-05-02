import { UUID } from 'node:crypto';

export interface ShippingAddress {
  id?: string;
  recipientName?: string;
  phoneNumber?: string;
  addressLine1?: string; // Địa chỉ cụ thể (Số nhà, tên đường)
  addressLine2?: string; // Địa chỉ bổ sung (Tòa nhà, căn hộ)
  ward?: string; // Phường/Xã
  district?: string; // Quận/Huyện
  city?: string; // Tỉnh/Thành phố
  profileId?: string; // ID của người dùng (Profile)
  defaultAddress?: boolean; // Địa chỉ mặc định hay không
}

export interface Profile {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dob?: Date;
  avatarFileId?: string;
  memberShipTierName?: string;
  nextMembershipTierName?: string;
  listShippingAddress?: Array<ShippingAddress>;
  pointsToNextLevel?: number;
  points?: number;
  totalPoints?: number;
  totalCoins?: number;
  percent?: number;
}
