import React, { useState } from 'react';
import { FilterState } from '../../types/transaction';
import { TRANSACTION_STATUSES } from '@/utils/constants';
import './TransactionFilters.css';

type Props = {
    filters: FilterState;
    onChange: (f: FilterState) => void;
};

export const TransactionFilters: React.FC<Props> = ({ filters, onChange }) => {
    const [startDate, setStartDate] = useState(filters.startDate || '');
    const [endDate, setEndDate] = useState(filters.endDate || '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [search, setSearch] = useState(filters.searchQuery ?? '');

    const apply = () => {
        onChange({ ...filters, startDate, endDate, status: status || undefined, searchQuery: search || undefined, page: 0 });
    };

    const clear = () => {
        setStartDate('');
        setEndDate('');
        setStatus('');
        setSearch('');
        onChange({ ...filters, startDate: '', endDate: '', status: undefined, searchQuery: undefined, page: 0 });
    };

    return (
        <div className="txn-filters">
            <div className="txn-filter-row">
                <input type="date" className="txn-date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <span className="txn-to">to</span>
                <input type="date" className="txn-date" value={endDate} onChange={e => setEndDate(e.target.value)} />

                <select className="txn-status" value={status} onChange={e => setStatus(e.target.value)}>
                    {TRANSACTION_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                <input className="txn-search" placeholder="Search txn id or card..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="txn-filter-actions">
                <button className="btn-apply" onClick={apply}>Apply</button>
                <button className="btn-clear" onClick={clear}>Clear</button>
            </div>
        </div>
    );
};

export default TransactionFilters;
