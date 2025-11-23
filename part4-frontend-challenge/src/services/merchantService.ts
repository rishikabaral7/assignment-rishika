import { get, post, put, del } from './api';
import { Merchant, MerchantListResponse } from '@/types/merchant';

const BASE = '/merchants';

export const getMerchants = async (page = 1, size = 20, search?: string): Promise<MerchantListResponse> => {
  const params: any = { page, size };
  if (search) params.q = search;
  try {
    return await get<MerchantListResponse>(BASE, { params });
  } catch (err) {
    console.error('getMerchants error', err);
    throw err;
  }
};

export const getMerchantById = async (id: string): Promise<Merchant> => {
  try {
    return await get<Merchant>(`${BASE}/${id}`);
  } catch (err) {
    console.error('getMerchantById error', err);
    throw err;
  }
};

export const createMerchant = async (payload: Partial<Merchant>): Promise<Merchant> => {
  try {
    return await post<Merchant>(BASE, payload);
  } catch (err) {
    console.error('createMerchant error', err);
    throw err;
  }
};

export const updateMerchant = async (id: string, payload: Partial<Merchant>): Promise<Merchant> => {
  try {
    return await put<Merchant>(`${BASE}/${id}`, payload);
  } catch (err) {
    console.error('updateMerchant error', err);
    throw err;
  }
};

export const deleteMerchant = async (id: string): Promise<void> => {
  try {
    await del<void>(`${BASE}/${id}`);
  } catch (err) {
    console.error('deleteMerchant error', err);
    throw err;
  }
};

export default {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
};

let merchantsMock: Merchant[] = [
  {
    id: 1,
    merchantId: "d2596441-93b6-47c5-8abb-e891b3d3092a",
    name: "TechNova USA",
    email: "support@techstore.com",
    phone: "+1-555-1234",
    address: { country: 'USA', city: 'Los Angeles' },
    status: "active",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 2,
    merchantId: "3e7b42c8-1085-4f06-aee4-934a323d63da",
    name: "Himalayan Tech Hub",
    email: "info@himelectronics.com",
    phone: "9800001234",
    address: { country: 'Nepal', city: 'Kathmandu' },
    status: "active",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 3,
    merchantId: "77e242a8-a181-48da-8da9-5c3bab3aed24",
    name: "Global Gadgetry",
    email: "contact@globalgadgets.com",
    phone: "+44 20 7946 0000",
    address: { country: 'UK', city: 'Manchester' },
    status: "inactive",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 4,
    merchantId: "7730ce2e-2eff-428c-bf39-7a00270ab193",
    name: "Smart Tech Solutions",
    email: "hello@smarttech.com",
    phone: "9876543210",
    address: { country: 'India', city: 'New Delhi' },
    status: "active",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 5,
    merchantId: "9c4d068d-7624-4741-bd22-c489e5916c99",
    name: "Digital Planet Store",
    email: "service@digitalworld.com",
    phone: "9801122334",
    address: { country: 'Nepal', city: 'Pokhara' },
    status: "inactive",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 6,
    merchantId: "94b219a0-9566-4c59-a8c6-5cf4b1394ccf",
    name: "Everest Tech Center",
    email: "info@everesthub.com",
    phone: "9812345678",
    address: { country: 'Nepal', city: 'Lalitpur' },
    status: "active",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 7,
    merchantId: "8ff50e3c-79e0-4c13-b724-cce4586d528c",
    name: "Asia Electronics Hub",
    email: "support@asiaelectronics.com",
    phone: "+65 6789 4321",
    address: { country: 'Singapore', city: 'Singapore' },
    status: "active",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 8,
    merchantId: "47757f7a-221f-4fc8-a358-7bbc03b0f099",
    name: "Prime Tech World",
    email: "contact@primetech.com",
    phone: "+61 421 789 123",
    address: { country: 'Australia', city: 'Sydney' },
    status: "inactive",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  },
  {
    id: 9,
    merchantId: "5c923eef-7806-4a62-b077-9d09c9508552",
    name: "Urban Gadget Market",
    email: "hello@urbantech.com",
    phone: "9841231234",
    address: { country: 'Nepal', city: 'Kathmandu' },
    status: "active",
    createdAt: "2025-11-23T14:37:13.922655Z",
    updatedAt: "2025-11-23T14:37:13.922655Z",
  }
];

const STORAGE_KEY = 'merchantsMock_v2';

function loadFromStorage(): Merchant[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Merchant[];
  } catch (err) {
    console.warn('Failed to load merchants from localStorage', err);
    return null;
  }
}

function saveToStorage(list: Merchant[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save merchants to localStorage', err);
  }
}

const stored = typeof localStorage !== 'undefined' ? loadFromStorage() : null;
if (stored && stored.length) {
  merchantsMock = stored;
} else {
  try { saveToStorage(merchantsMock); } catch (e) { /* ignore */ }
}

export const merchantService = {
  getAll: async (): Promise<Merchant[]> => {
    try {
      const resp: any = await getMerchants(1, 1000);
      const items: any[] = Array.isArray(resp) ? resp : (resp && Array.isArray(resp.items) ? resp.items : null);
      if (items) return items.map(mapEntityToMerchant);
      return merchantsMock;
    } catch (err) {
      console.warn('API getAll failed, falling back to mock', err);
      return new Promise(resolve => setTimeout(() => resolve(merchantsMock), 300));
    }
  },

  getOne: async (id: number | string): Promise<Merchant | undefined> => {
    try {
      const resp = await getMerchantById(String(id));
      if (resp) return mapEntityToMerchant(resp as any);
      return merchantsMock.find(m => String(m.id) === String(id) || m.merchantId === String(id));
    } catch (err) {
      console.warn('API getOne failed, falling back to mock', err);
      return merchantsMock.find(m => m.id === Number(id) || m.merchantId === String(id));
    }
  },

  create: async (merchant: Omit<Merchant, "id" | "createdAt" | "updatedAt">) => {
    try {
      const created = await createMerchant(merchant as any);
      return mapEntityToMerchant(created as any);
    } catch (err) {
      console.warn('API create failed, falling back to mock', err);
      const newMerchant: Merchant = {
        id: merchantsMock.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...merchant,
      };
      merchantsMock.unshift(newMerchant);
      saveToStorage(merchantsMock);
      return newMerchant;
    }
  },

  update: async (id: number, updates: Partial<Merchant>) => {
    try {
      const updated = await updateMerchant(String(id), updates as any);
      return mapEntityToMerchant(updated as any);
    } catch (err) {
      console.warn('API update failed, falling back to mock', err);
      merchantsMock = merchantsMock.map(m =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
      );
      saveToStorage(merchantsMock);
      return merchantsMock.find(m => m.id === id);
    }
  },

  delete: async (id: number) => {
    try {
      await deleteMerchant(String(id));
      return true;
    } catch (err) {
      console.warn('API delete failed, falling back to mock', err);
      merchantsMock = merchantsMock.map(m =>
        m.id === id ? { ...m, status: "inactive", updatedAt: new Date().toISOString() } : m
      );
      saveToStorage(merchantsMock);
      return true;
    }
  }
};

function mapEntityToMerchant(entity: any): Merchant {
  if (!entity) return entity;
  return {
    id: (entity.id ?? entity.internalId ?? 0) as number,
    merchantId: entity.merchantId ?? entity.id ?? undefined,
    name: entity.name,
    email: entity.email,
    status: (entity.status ? String(entity.status).toLowerCase() : undefined) as any,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    businessName: entity.businessName,
    category: entity.category,
    phone: entity.phone,
    registrationNumber: entity.registrationNumber,
    businessType: entity.businessType,
    registeredName: entity.registeredName,
    panVatNumber: entity.panVatNumber,
    registrationDate: entity.registrationDate,
    approxAnnualTurnover: entity.approxAnnualTurnover,
    approxDigitalSale: entity.approxDigitalSale,
    address: entity.address ?? undefined,
  } as Merchant;
}
