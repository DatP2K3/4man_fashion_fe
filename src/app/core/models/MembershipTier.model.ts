export interface MembershipTier {
  id: string;
  name: string;
  cashbackPercentage: number;
  minPoints: number;
  deleted: boolean;
  defaultTier: boolean;
}
