import React, { useState } from 'react';

export default function ProductFilters({ filters, onChange, onApply }) {
    const [local, setLocal] = useState(filters);

    const handleChange = (key, value) => {
        setLocal({ ...local, [key]: value });
    };

    const handleApply = () => {
        onChange(local);
        onApply && onApply();
    };

    const handleReset = () => {
        const reset = {
            category: '',
            color: '',
            size: '',
            min_price: '',
            max_price: '',
        };
        setLocal(reset);
        onChange(reset);
        onApply && onApply();
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h6 className="mb-3">Filters</h6>

                <div className="mb-2">
                    <label className="small text-muted">Category</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Electronics"
                        value={local.category || ''}
                        onChange={e => handleChange('category', e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label className="small text-muted">Color</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Red"
                        value={local.color || ''}
                        onChange={e => handleChange('color', e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label className="small text-muted">Size</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. M"
                        value={local.size || ''}
                        onChange={e => handleChange('size', e.target.value)}
                    />
                </div>

                <div className="row g-2 mb-2">
                    <div className="col">
                        <label className="small text-muted">Min Price</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="0"
                            value={local.min_price || ''}
                            onChange={e => handleChange('min_price', e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <label className="small text-muted">Max Price</label>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="1000"
                            value={local.max_price || ''}
                            onChange={e => handleChange('max_price', e.target.value)}
                        />
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleApply}>
                        Apply
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
