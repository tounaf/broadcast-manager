import React, { useEffect } from 'react';
import { IconX } from './Icons';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="fixed inset-0 bg-overlay backdrop-blur-sm" onClick={onClose} />

            {/* Mobile: bottom sheet */}
            <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col max-h-[92dvh] rounded-t-2xl border border-border bg-surface shadow-2xl sm:hidden app-safe-bottom">
                <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
                <div className="flex items-start justify-between gap-4 px-4 pt-3 pb-2">
                    <h3 id="modal-title" className="text-lg font-semibold text-fg pr-2">
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="rounded-full bg-surface-2 p-2 text-muted hover:text-fg min-h-11 min-w-11 flex items-center justify-center"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        <IconX size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
                <div className="flex flex-col-reverse gap-2 border-t border-border px-4 py-3">
                    {footer || (
                        <button
                            type="button"
                            className="min-h-11 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-fg"
                            onClick={onClose}
                        >
                            Fermer
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop: centered dialog */}
            <div className="hidden sm:flex min-h-full items-center justify-center p-4">
                <div
                    className="relative z-20 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface px-6 py-5 shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-4">
                        <h3 id="modal-title-desktop" className="text-lg font-semibold text-fg">
                            {title}
                        </h3>
                        <button
                            type="button"
                            className="rounded-full bg-surface-2 p-2 text-muted hover:text-fg"
                            onClick={onClose}
                            aria-label="Fermer"
                        >
                            <IconX size={18} />
                        </button>
                    </div>
                    <div className="mt-4">{children}</div>
                    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                        {footer || (
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-surface-2"
                                onClick={onClose}
                            >
                                Fermer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
