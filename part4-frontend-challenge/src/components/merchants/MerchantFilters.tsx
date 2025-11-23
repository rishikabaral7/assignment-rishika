import { useState } from "react";
import './MerchantFilters.css';

export const MerchantFilters = ({ onFilter }: { onFilter: (search: string, status: string, fromDate?: string, toDate?: string) => void }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const applyFilters = () => {
        onFilter(search, status, fromDate, toDate);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("ALL");
        setFromDate("");
        setToDate("");
        onFilter("", "ALL", "", "");
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (value === "") {
            onFilter("", status, fromDate, toDate);
        }
    };

    return (
        <div className="merchant-filters">
            <div className="filter-inputs">
                <input
                    type="text"
                    placeholder="Search by name, ID, or email..."
                    value={search}
                    onChange={e => handleSearchChange(e.target.value)}
                    className="search-input"
                />

                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="status-select"
                >
                    <option value="ALL">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="deactivated">Deactivated</option>
                </select>

                <div className="date-filter-group">
                    <input
                        type="date"
                        placeholder="From Date"
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        className="date-input"
                        title="Filter from date"
                    />
                    <span className="date-separator">to</span>
                    <input
                        type="date"
                        placeholder="To Date"
                        value={toDate}
                        onChange={e => setToDate(e.target.value)}
                        className="date-input"
                        title="Filter to date"
                    />
                </div>
            </div>

            <div className="filter-actions">
                <button onClick={applyFilters} className="btn-apply">Apply Filters</button>
                <button onClick={clearFilters} className="btn-clear">Clear</button>
            </div>
        </div>
    );
};
