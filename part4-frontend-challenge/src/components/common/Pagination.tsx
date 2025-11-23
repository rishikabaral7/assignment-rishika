import './Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    total: number;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    total,
}: PaginationProps) => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    return (
        <div className="pagination-container">
            <div className="pagination-top">
                <div className="pagination-info">
                    <span>Showing {startItem} to {endItem} of {total} results</span>
                </div>

                <div className="pagination-right">
                    <select
                        value={pageSize}
                        onChange={e => onPageSizeChange(Number(e.target.value))}
                        className="page-size-select"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <div className="pagination-nav-right">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-nav-btn prev-btn"
                            title="Previous page"
                        >
                            ←
                        </button>

                        <span className="page-indicator">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-nav-btn next-btn"
                            title="Next page"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
