import { UUID } from 'node:crypto';

export interface ShippingAddress {
  id?: UUID;
  recipient_name?: string;
  phone_number?: string;
  address_line1?: string; // Địa chỉ cụ thể (Số nhà, tên đường)
  address_line2?: string; // Địa chỉ bổ sung (Tòa nhà, căn hộ)
  ward?: string; // Phường/Xã
  district?: string; // Quận/Huyện
  city?: string; // Tỉnh/Thành phố
  profile_id?: UUID; // ID của người dùng (Profile)
  default_address?: boolean; // Địa chỉ mặc định hay không
}

export interface Profile {
  id?: UUID;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dob?: Date;
  avatarFileId?: UUID;
  memberShipTierName?: string;
  nextMembershipTierName?: string;
  listShippingAddress?: Array<{ address: ShippingAddress }>;
  pointsToNextLevel?: number;
  points?: number;
  totalPoints?: number;
  totalCoins?: number;
  percent?: number;
}
