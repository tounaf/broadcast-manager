import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
    const baseClasses =
        'inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-11 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
        secondary: 'bg-surface-2 text-fg hover:opacity-90 focus:ring-primary border border-border',
        success: 'bg-success text-white hover:opacity-90 focus:ring-success',
        danger: 'bg-danger text-white hover:opacity-90 focus:ring-danger',
        outline: 'border border-border text-fg bg-surface hover:bg-surface-2 focus:ring-primary',
        ghost: 'text-muted hover:bg-surface-2 hover:text-fg focus:ring-primary',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
