import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="flex min-h-screen items-center justify-center px-4 py-6 text-center sm:p-0">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                    &#8203;
                </span>

                <div
                    className="relative z-20 inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-2xl shadow-slate-900/20 transition-all sm:my-8 sm:align-middle sm:px-6"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 id="modal-title" className="text-lg font-semibold leading-6 text-slate-900">
                                {title}
                            </h3>
                        </div>
                        <button
                            type="button"
                            className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={onClose}
                            aria-label="Fermer la fenêtre modale"
                        >
                            ×
                        </button>
                    </div>

                    <div className="mt-4">
                        {children}
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                        {footer || (
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
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
