import { UUID } from 'crypto';

export class ShippingAddress {
  public id?: UUID;
  public recipient_name?: string;
  public phone_number?: string;
  public address_line1?: string; // Địa chỉ cụ thể (Số nhà, tên đường)
  public address_line2?: string; // Địa chỉ bổ sung (Tòa nhà, căn hộ)
  public ward?: string; // Phường/Xã
  public district?: string; // Quận/Huyện
  public city?: string; // Tỉnh/Thành phố
  public profile_id?: UUID; // ID của người dùng (Profile)
  public default_address?: boolean; // Địa chỉ mặc định hay không
}
