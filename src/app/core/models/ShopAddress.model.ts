export enum ShopAddressType {
  RETURN_ADDRESS = 'RETURN_ADDRESS', // Địa chỉ trả hàng
  SEND_ADDRESS = 'SEND_ADDRESS', // Địa chỉ gửi hàng
}

export interface ShopAddress {
  id?: string;
  shopName?: string;
  phoneNumber?: string;
  addressLine1?: string; // Địa chỉ cụ thể (Số nhà, tên đường)
  addressLine2?: string; // Địa chỉ bổ sung (Tòa nhà, căn hộ)
  ward?: string; // Tên phường/xã
  wardCode?: string; // Mã phường/xã
  district?: string; // Tên quận/huyện
  districtId?: string; // ID quận/huyện
  city?: string; // Tên tỉnh/thành phố
  cityId?: string; // ID tỉnh/thành phố
  profileId?: string; // ID của người dùng (Profile)
  type?: ShopAddressType; // Địa chỉ mặc định hay không
}
