import React from 'react';

export default function SearchBar({ value, onChange, onSearch }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form className="d-flex mb-3" onSubmit={handleSubmit}>
            <input
                type="text"
                className="form-control me-2"
                placeholder="Search products..."
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
                Search
            </button>
        </form>
    );
}
