import { Merchant } from "@/types/merchant";
import './MerchantCard.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTransactions } from '@/services/transactionService';
import { DEFAULT_FILTERS } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatters';

export const MerchantCard = ({ merchant, onEdit, onView }: { merchant: Merchant, onEdit?: (m: Merchant) => void, onView?: (m: Merchant) => void }) => {
    const navigate = useNavigate();
    const getStatusClass = (status?: string) => {
        const s = String(status ?? '').toUpperCase();
        switch (s) {
            case 'ACTIVE':
                return 'status-active';
            case 'INACTIVE':
                return 'status-inactive';
            case 'SUSPENDED':
            case 'DEACTIVATED':
                return 'status-suspended';
            default:
                return '';
        }
    };

    const displayStatus = (status?: string) => {
        if (!status) return '';
        const s = String(status).toUpperCase();
        if (s === 'ACTIVE') return 'Active';
        if (s === 'INACTIVE') return 'Inactive';
        if (s === 'SUSPENDED' || s === 'DEACTIVATED') return 'Suspended';
        return status;
    };

    const [txnValue, setTxnValue] = useState<number | null>(null);
    const [txnCurrency, setTxnCurrency] = useState<string | null>(null);
    const [txLoading, setTxLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const loadSummary = async () => {
            const mid = merchant.merchantId ?? String(merchant.id);
            if (!mid) return;
            setTxLoading(true);
            try {
                const resp = await getTransactions(String(mid), DEFAULT_FILTERS);
                if (!mounted) return;
                if (resp && resp.summary) {
                    setTxnValue(resp.summary.totalAmount ?? null);
                    setTxnCurrency(resp.summary.currency ?? null);
                }
            } catch (err) {
            } finally {
                if (mounted) setTxLoading(false);
            }
        };
        loadSummary();
        return () => { mounted = false; };
    }, [merchant.merchantId, merchant.id]);

    return (
        <tr className="merchant-row">
            <td>{merchant.merchantId}</td>
            <td onClick={(e) => { e.stopPropagation(); onView ? onView(merchant) : navigate(`/merchants/${merchant.merchantId ?? merchant.id}`); }} style={{ cursor: 'pointer', color: '#0ea5e9' }}>
                {merchant.name}
            </td>
            <td>{txLoading ? '...' : (txnValue != null ? formatCurrency(txnValue, txnCurrency ?? 'USD') : '-')}</td>
            <td>{merchant.email}</td>
            <td>
                <button
                    type="button"
                    className={`status-badge ${getStatusClass(merchant.status)}`}
                    onClick={(e) => { e.stopPropagation(); navigate(`/merchants?status=${encodeURIComponent(String(merchant.status ?? '').toUpperCase())}`); }}
                    style={{ cursor: 'pointer' }}
                    title="Filter by this status"
                >
                    {displayStatus(merchant.status)}
                </button>
            </td>
            <td onClick={(e) => {
                e.stopPropagation(); if (merchant.createdAt) {
                    const d = new Date(merchant.createdAt).toISOString().slice(0, 10);
                    navigate(`/merchants?fromDate=${d}&toDate=${d}`);
                }
            }} style={{ cursor: merchant.createdAt ? 'pointer' : 'default' }}>
                {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : ''}
            </td>
        </tr>
    );
};