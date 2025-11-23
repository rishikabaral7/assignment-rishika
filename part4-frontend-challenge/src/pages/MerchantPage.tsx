import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { merchantService, updateMerchant as apiUpdateMerchant } from '@/services/merchantService';
import { Merchant } from '@/types/merchant';
import MerchantDetails from '@/components/merchants/MerchantDetails';
import MerchantForm from '@/components/merchants/MerchantForm';
import './Merchants.css';
import './MerchantPage.css';

export const MerchantPage: React.FC = () => {
    const { id } = useParams();
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);

    const loadMerchant = async (mid: string) => {
        setLoading(true);
        setError(null);
        try {
            let data: any | undefined = undefined;
            try {
                data = await merchantService.getOne(mid as any);
            } catch (e) {
            }

            if (!data) {
                const all = await merchantService.getAll();
                data = all.find((m: any) => String(m.merchantId) === String(mid) || String(m.id) === String(mid));
            }

            if (data) setMerchant(data);
            else setError('Merchant not found');
        } catch (err: any) {
            setError(err?.message || 'Failed to load merchant');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        const mid = String(id);
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await loadMerchant(mid);
        })();
        return () => { mounted = false; };
    }, [id]);

    const handleUpdate = async (updated: Merchant) => {
        if (!updated) return;
        setMerchant(updated);
        setEditing(false);
    };

    return (
        <div className="merchant-page">
            <div className="breadcrumbs">
                <Link to="/merchants">Merchants</Link> &nbsp; / &nbsp; <span>Details</span>
            </div>

            {loading && <div>Loading merchant...</div>}
            {error && <div className="error-text">{error}</div>}

            {merchant && (
                <div className="merchant-page-body">
                    <div className="merchant-page-actions">
                        <button className="btn-primary" onClick={() => setEditing(prev => !prev)}>{editing ? 'Cancel' : 'Edit Merchant'}</button>
                    </div>

                    {editing ? (
                        <div className="modal-overlay" onMouseDown={() => setEditing(false)}>
                            <div className="modal" onMouseDown={e => e.stopPropagation()}>
                                <button className="modal-close" onClick={() => setEditing(false)}>×</button>
                                <MerchantForm
                                    initial={merchant}
                                    onUpdate={async (idNum, data) => {
                                        try {
                                            const updated = await apiUpdateMerchant(String(idNum), data as any);
                                            if (updated) {
                                                handleUpdate(updated);
                                                return updated;
                                            }
                                        } catch (err) {
                                            const updated = await merchantService.update(idNum, data as any);
                                            if (updated) handleUpdate(updated);
                                            return updated;
                                        }
                                    }}
                                    onSuccess={(m) => handleUpdate(m)}
                                />
                            </div>
                        </div>
                    ) : (
                        <MerchantDetails merchant={merchant} />
                    )}
                </div>
            )}
        </div>
    );
};

export default MerchantPage;
