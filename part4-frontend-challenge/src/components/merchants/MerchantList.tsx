import { useMerchants } from "@/hooks/useMerchants";
import { MerchantFilters } from "./MerchantFilters";
import { MerchantForm } from "./MerchantForm";
import MerchantDetails from './MerchantDetails';
import { MerchantCard } from "./MerchantCard";
import { Pagination } from "@/components/common/Pagination";
import './MerchantList.css';
import './MerchantForm.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const MerchantList = () => {
    const {
        data: merchants,
        total,
        totalPages,
        currentPage,
        loading,
        error,
        filter,
        sort,
        sortField,
        sortOrder,
        createMerchant,
        updateMerchant,
        pageSize,
        setPageSize,
        setCurrentPage,
    } = useMerchants();

    const getSortIndicator = (field: string) => {
        if (sortField !== field) return '';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    const [isModalOpen, setModalOpen] = useState(false);
    const [notif, setNotif] = useState<string | null>(null);
    const [editingMerchant, setEditingMerchant] = useState<import('@/types/merchant').Merchant | null>(null);
    const [viewMerchant, setViewMerchant] = useState<import('@/types/merchant').Merchant | null>(null);
    const navigate = useNavigate();

    const openModal = () => {
        setEditingMerchant(null);
        setViewMerchant(null);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search') ?? '';
        const status = params.get('status') ?? 'ALL';
        const fromDate = params.get('fromDate') ?? '';
        const toDate = params.get('toDate') ?? '';
        filter(search, status, fromDate || undefined, toDate || undefined);
    }, [location.search]);

    const handleCreateSuccess = (created: any) => {
        setNotif('Merchant created successfully');
        closeModal();
        setTimeout(() => setNotif(null), 3000);
    };

    const openEdit = (m: any) => {
        setEditingMerchant(m);
        setViewMerchant(null);
        setModalOpen(true);
    };

    const openView = (m: import('@/types/merchant').Merchant) => {
        navigate(`/merchants/${m.merchantId ?? m.id}`);
    };

    return (
        <div className="merchant-list">
            <h2>Merchants</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {notif && <div className="merchant-notif">{notif}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={openModal} className="btn-primary">Add New Merchant</button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onMouseDown={closeModal}>
                    <div className="modal" onMouseDown={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => { setEditingMerchant(null); closeModal(); }}>×</button>
                        {viewMerchant && !editingMerchant ? (
                            <div>
                                <MerchantDetails merchant={viewMerchant} />
                                <div style={{ marginTop: 12 }}>
                                    <button className="btn-primary" onClick={() => { setEditingMerchant(viewMerchant); setViewMerchant(null); }}>Edit</button>
                                </div>
                            </div>
                        ) : (
                            <MerchantForm initial={editingMerchant ?? undefined} onCreate={createMerchant} onUpdate={updateMerchant} onSuccess={(m) => {
                                handleCreateSuccess(m);
                                setEditingMerchant(null);
                            }} />
                        )}
                    </div>
                </div>
            )}
            <MerchantFilters onFilter={(search, status, fromDate, toDate) => {
                const params = new URLSearchParams();
                if (search) params.set('search', search);
                if (status && status !== 'ALL') params.set('status', status);
                if (fromDate) params.set('fromDate', fromDate);
                if (toDate) params.set('toDate', toDate);
                navigate({ pathname: '/merchants', search: params.toString() });
                filter(search, status, fromDate, toDate);
            }} />

            {error && (
                <div className="error-message">
                    <span>⚠️ {error}</span>
                </div>
            )}

            {loading && <p className="merchants-loading">Loading merchants...</p>}

            {!loading && merchants.length === 0 && (
                <p className="merchants-empty">No merchants found</p>
            )}

            {!loading && merchants.length > 0 && (
                <>
                    <table className="merchants-table">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => sort('merchantId')}
                                    className="sortable-header"
                                >
                                    Merchant ID {getSortIndicator('merchantId')}
                                </th>
                                <th
                                    onClick={() => sort('name')}
                                    className="sortable-header"
                                >
                                    Name {getSortIndicator('name')}
                                </th>
                                <th>Txn Value</th>
                                <th
                                    onClick={() => sort('email')}
                                    className="sortable-header"
                                >
                                    Email {getSortIndicator('email')}
                                </th>
                                <th
                                    onClick={() => sort('status')}
                                    className="sortable-header"
                                >
                                    Status {getSortIndicator('status')}
                                </th>
                                <th
                                    onClick={() => sort('createdAt')}
                                    className="sortable-header"
                                >
                                    Created {getSortIndicator('createdAt')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {merchants.map(m => (
                                <MerchantCard key={m.id} merchant={m} onEdit={openEdit} onView={openView} />
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        total={total}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                </>
            )}
        </div>
    );
};