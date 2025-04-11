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
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  dob?: Date;
  avatar_file_id?: UUID;
  membership_tier_name?: string;
  next_membershipTier_name?: string;
  list_shipping_address?: Array<{ address: ShippingAddress }>;
  points_to_next_level?: number;
  points?: number;
  total_points?: number;
  total_coins?: number;
  percent?: number;
}
