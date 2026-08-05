import React from 'react';

export default function PaginationControls({ meta, onPageChange }) {
    if (!meta) return null;

    const { current_page, last_page, per_page, total } = meta;

    const pages = [];
    const start = Math.max(1, current_page - 2);
    const end = Math.min(last_page, current_page + 2);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="d-flex justify-content-center my-4">
            <nav>
                <ul className="pagination">
                    <li className={`page-item ${current_page === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(current_page - 1)}
                        >
                            Previous
                        </button>
                    </li>

                    {pages.map(page => (
                        <li key={page} className={`page-item ${page === current_page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(page)}>
                                {page}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${current_page === last_page ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(current_page + 1)}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
