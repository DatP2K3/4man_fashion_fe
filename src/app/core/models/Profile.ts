import { ShippingAddress } from './ShippingAddress';
import { UUID } from 'node:crypto';

export class Profile {
  public id?: UUID;
  public email?: string;
  public first_name?: string;
  public last_name?: string;
  public phone_number?: string;
  public dob?: Date;
  public avatar_file_id?: UUID;
  public membership_tier_name?: string;
  public next_membershipTier_name?: string;
  public list_shipping_address?: Array<{ address: ShippingAddress }>;
  public points_to_next_level?: number;
  public points?: number;
  public total_points?: number;
  public total_coins?: number;
  public percent?: number;
}
