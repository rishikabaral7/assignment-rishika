import React, { useEffect, useState } from 'react';
import { Merchant } from '@/types/merchant';
import './MerchantDetails.css';
import { getTransactions } from '@/services/transactionService';
import { DEFAULT_FILTERS, Transaction, TransactionResponse } from '@/types/transaction';
import { formatCurrency, formatDateShort } from '@/utils/formatters';

type Props = { merchant: Merchant };

export const MerchantDetails: React.FC<Props> = ({ merchant }) => {
    const [summary, setSummary] = useState<TransactionResponse | null>(null);
    const [recent, setRecent] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!merchant) return;
            setLoading(true);
            setError(null);
            try {
                const mid = merchant.merchantId ?? String(merchant.id);
                const resp = await getTransactions(String(mid), { ...DEFAULT_FILTERS, page: 0, size: 10 });
                if (!mounted) return;
                setSummary(resp as any);
                setRecent((resp && resp.transactions) ? resp.transactions.slice(0, 5) : []);
            } catch (err: any) {
                console.error('Failed loading transactions', err);
                if (mounted) setError('Failed to load transactions');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [merchant]);

    const handleExport = async () => {
        try {
            const mid = merchant.merchantId ?? String(merchant.id);
            // fetch a large page to get all transactions (backend should support pagination in real app)
            const resp = await getTransactions(String(mid), { ...DEFAULT_FILTERS, page: 0, size: 1000 });
            const list = resp.transactions || [];
            const csvRows = [];
            const headers = ['txnId', 'timestamp', 'amount', 'currency', 'status', 'cardType', 'cardLast4', 'acquirer', 'issuer'];
            csvRows.push(headers.join(','));
            for (const t of list) {
                csvRows.push([t.txnId, t.timestamp, t.amount, t.currency, t.status, t.cardType, t.cardLast4, t.acquirer, t.issuer].map(v => `"${String(v ?? '')}"`).join(','));
            }
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${merchant.name || 'merchant'}-transactions.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed', err);
            setError('Export failed');
        }
    };

    return (
        <div className="merchant-details-panel">
            <div className="merchant-details-header">
                <div>
                    <h2>{merchant.name}</h2>
                    <div className="merchant-meta below-name">
                        <div><strong>ID:</strong> {merchant.merchantId ?? merchant.id}</div>
                        <div><strong>Status:</strong> {merchant.status ?? 'N/A'}</div>
                        <div><strong>Created:</strong> {merchant.createdAt ? new Date(merchant.createdAt).toLocaleString() : '—'}</div>
                    </div>
                </div>
                <div>
                    <button className="btn-primary" onClick={handleExport}>Export Transactions</button>
                </div>
            </div>

            <div className="merchant-contact">
                <div className="business-section">
                    <h3>Profile & Contact</h3>
                    <div className="business-grid">
                        {merchant.businessName ? (
                            <div>
                                <div className="label">Business Name:</div>
                                <div className="value">{merchant.businessName}</div>
                            </div>
                        ) : null}

                        {merchant.email ? (
                            <div>
                                <div className="label">Email:</div>
                                <div className="value">{merchant.email}</div>
                            </div>
                        ) : null}

                        {merchant.phone ? (
                            <div>
                                <div className="label">Phone:</div>
                                <div className="value">{merchant.phone}</div>
                            </div>
                        ) : null}

                        {merchant.createdAt ? (
                            <div>
                                <div className="label">Registration / Created:</div>
                                <div className="value">{new Date(merchant.createdAt).toLocaleString()}</div>
                            </div>
                        ) : null}

                        {((merchant as any).updatedAt) ? (
                            <div>
                                <div className="label">Last Updated:</div>
                                <div className="value">{new Date((merchant as any).updatedAt).toLocaleString()}</div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {merchant.address ? (
                    <div className="business-address">
                        <h3>Address</h3>
                        <div className="address-grid">
                            {typeof merchant.address === 'string' ? (
                                <div>
                                    <div className="value">{merchant.address}</div>
                                </div>
                            ) : (
                                <>
                                    {merchant.address?.country && (
                                        <div>
                                            <div className="label">Country:</div>
                                            <div className="value">{merchant.address.country}</div>
                                        </div>
                                    )}
                                    {merchant.address?.province && (
                                        <div>
                                            <div className="label">Province:</div>
                                            <div className="value">{merchant.address.province}</div>
                                        </div>
                                    )}
                                    {merchant.address?.district && (
                                        <div>
                                            <div className="label">District:</div>
                                            <div className="value">{merchant.address.district}</div>
                                        </div>
                                    )}
                                    {merchant.address?.city && (
                                        <div>
                                            <div className="label">City/Town:</div>
                                            <div className="value">{merchant.address.city}</div>
                                        </div>
                                    )}
                                    {merchant.address?.ward && (
                                        <div>
                                            <div className="label">Ward no:</div>
                                            <div className="value">{merchant.address.ward}</div>
                                        </div>
                                    )}
                                    {merchant.address?.street && (
                                        <div>
                                            <div className="label">Street Name:</div>
                                            <div className="value">{merchant.address.street}</div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="transactions-section">
                <h3>Transaction Statistics</h3>
                {loading && <div>Loading transactions...</div>}
                {error && <div className="error-text">{error}</div>}
                {!loading && summary && (
                    <div className="summary-grid">
                        <div>
                            <div className="label">Total Transactions</div>
                            <div className="value">{summary.summary?.totalTransactions ?? 0}</div>
                        </div>
                        <div>
                            <div className="label">Total Amount</div>
                            <div className="value">{formatCurrency(summary.summary?.totalAmount ?? 0, summary.summary?.currency ?? 'USD')}</div>
                        </div>
                        <div>
                            <div className="label">Currency</div>
                            <div className="value">{summary.summary?.currency ?? '-'}</div>
                        </div>
                        <div>
                            <div className="label">Completed</div>
                            <div className="value">{summary.summary?.byStatus?.completed ?? 0}</div>
                        </div>
                        <div>
                            <div className="label">Pending</div>
                            <div className="value">{summary.summary?.byStatus?.pending ?? 0}</div>
                        </div>
                        <div>
                            <div className="label">Failed</div>
                            <div className="value">{summary.summary?.byStatus?.failed ?? 0}</div>
                        </div>
                    </div>
                )}

                <h4>Recent Transactions</h4>
                {!loading && recent.length === 0 && <div>No recent transactions</div>}
                {!loading && recent.length > 0 && (
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Card</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map(tx => (
                                <tr key={tx.txnId}>
                                    <td>{tx.txnId}</td>
                                    <td>{formatDateShort(tx.timestamp)}</td>
                                    <td>{formatCurrency(tx.amount, tx.currency)}</td>
                                    <td>{tx.status}</td>
                                    <td>{tx.cardType} • {tx.cardLast4}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <h4>Activity Timeline</h4>
                {!loading && recent.length === 0 && <div>No activity</div>}
                {!loading && recent.length > 0 && (
                    <div className="timeline">
                        {recent.map(tx => (
                            <div key={tx.txnId} className="timeline-item">
                                <div className="timeline-date">{formatDateShort(tx.timestamp)}</div>
                                <div className="timeline-content">{tx.status} — {formatCurrency(tx.amount, tx.currency)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchantDetails;