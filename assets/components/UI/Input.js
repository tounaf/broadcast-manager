import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, className = '', error, disabled }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="block text-sm font-medium text-fg mb-1.5">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full min-h-11 px-3 py-2 border rounded-lg bg-surface text-fg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                    error ? 'border-danger' : 'border-border'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
};

export default Input;
