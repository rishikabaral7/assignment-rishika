import { merchantService, createMerchant as apiCreateMerchant, updateMerchant as apiUpdateMerchant } from "@/services/merchantService";
import { Merchant } from "@/types/merchant";
import { useEffect, useState } from "react";

type SortField = "name" | "merchantId" | "status" | "createdAt" | "email";
type SortOrder = "asc" | "desc";

export const useMerchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filtered, setFiltered] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await merchantService.getAll();
      setMerchants(data);
      setFiltered(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load merchants");
      console.error("Error loading merchants:", err);
    } finally {
      setLoading(false);
    }
  };

  const filter = (search: string, status: string, fromDate?: string, toDate?: string) => {
    let results = merchants;

    if (search) {
      results = results.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.merchantId.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status && status !== "ALL") {
      const s = status.toString().toLowerCase();
      results = results.filter(m => (m.status ?? '').toString().toLowerCase() === s);
    }

    if (fromDate) {
      const fromDateObj = new Date(fromDate);
      results = results.filter(m => new Date(m.createdAt) >= fromDateObj);
    }

    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999); 
      results = results.filter(m => new Date(m.createdAt) <= toDateObj);
    }

    setFiltered(results);
    setCurrentPage(1);
  };

  const sort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedAndPaginatedData = () => {
    let sorted = [...filtered];
    sorted.sort((a, b) => {
      const aValue = a[sortField as keyof Merchant] as any;
      const bValue = b[sortField as keyof Merchant] as any;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sorted.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: sorted.length,
      totalPages: Math.ceil(sorted.length / pageSize),
      currentPage,
    };
  };

  useEffect(() => {
    load();
  }, []);

  return {
    ...getSortedAndPaginatedData(),
    loading,
    error,
    reload: load,
    filter,
    sort,
    sortField,
    sortOrder,
    pageSize,
    createMerchant: async (payload: Partial<Merchant>) => {
      setLoading(true);
      setError(null);
      try {
        let created;
        try {
          created = await apiCreateMerchant(payload as any);
        } catch (apiErr) {
          created = await merchantService.create(payload as any);
        }
        setMerchants(prev => prev.some(p => p.id === created.id) ? prev : [created, ...prev]);
        setFiltered(prev => prev.some(p => p.id === created.id) ? prev : [created, ...prev]);
        return created;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Create failed';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    updateMerchant: async (id: number, updates: Partial<Merchant>) => {
      setLoading(true);
      setError(null);
      try {
        let updated;
        const existing = merchants.find(m => m.id === id) as Merchant | undefined;
        const payload = existing ? { ...existing, ...updates } : updates;
        const apiId = existing?.id ?? existing?.merchantId ?? id;
        try {
          updated = await apiUpdateMerchant(String(apiId), payload as any);
        } catch (apiErr) {
          updated = await merchantService.update(id, updates as any);
        }
        if (updated) {
          setMerchants(prev => prev.map(m => m.id === id ? updated : m));
          setFiltered(prev => prev.map(m => m.id === id ? updated : m));
        }
        return updated;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Update failed';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    setPageSize,
    setCurrentPage,
  };
};
