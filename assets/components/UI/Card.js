import React from 'react';

const Card = ({ children, title, className = '', footer, padding = true }) => {
    return (
        <div className={`bg-surface rounded-xl shadow-sm border border-border overflow-hidden ${className}`}>
            {title && (
                <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-lg font-bold text-fg">{title}</h3>
                </div>
            )}
            <div className={padding ? 'p-5' : ''}>{children}</div>
            {footer && (
                <div className="px-5 py-4 bg-surface-2 border-t border-border">{footer}</div>
            )}
        </div>
    );
};

export default Card;
