import React from 'react';

export default function SortSelect({ value, onChange }) {
    return (
        <div className="d-flex align-items-center mb-3">
            <label className="me-2 mb-0 small text-muted">Sort by:</label>
            <select
                className="form-select form-select-sm w-auto"
                value={value.sort_by || 'created_at'}
                onChange={e => onChange({ ...value, sort_by: e.target.value, page: 1 })}
            >
                <option value="created_at">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
            </select>
            <select
                className="form-select form-select-sm w-auto ms-2"
                value={value.sort_dir || 'desc'}
                onChange={e => onChange({ ...value, sort_dir: e.target.value, page: 1 })}
            >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </div>
    );
}
