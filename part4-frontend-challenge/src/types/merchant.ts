export type Merchant = {
  id: number;
  merchantId?: string;
  name: string;
  email: string;
  status?: 'active' | 'inactive' | 'deactivated';
  createdAt?: string;
  businessName?: string;
  category?: string;
  phone?: string;
  registrationNumber?: string;
  businessType?: string;
  registeredName?: string;
  panVatNumber?: string;
  registrationDate?: string;
  approxAnnualTurnover?: string;
  approxDigitalSale?: string;
  address?: {
    country?: string;
    province?: string;
    district?: string;
    city?: string;
    ward?: string;
    street?: string;
  };
};

export type MerchantListResponse = {
  items: Merchant[];
  total: number;
  page: number;
  size: number;
};
export interface MerchantEntity {
  id: number;
  merchantId: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}
