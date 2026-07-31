import React from 'react';
import { NAV_ITEMS } from './navItems';
import { IconLogOut, IconX } from './Icons';

const Sidebar = ({ currentView, onViewChange, onLogout, isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-overlay backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-fg flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen app-safe-top ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-5 flex justify-between items-center border-b border-white/10">
                    <h2 className="text-sm font-extrabold text-primary tracking-tight leading-snug uppercase">
                        FVA Vitao ny asan&apos;ny Fahamarinana
                    </h2>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-sidebar-muted hover:text-sidebar-fg p-2 rounded-lg focus:outline-none min-h-11 min-w-11 flex items-center justify-center"
                        title="Fermer"
                        type="button"
                    >
                        <IconX size={18} />
                    </button>
                </div>
                <nav className="mt-4 flex-1 space-y-1 px-3 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    onViewChange(item.id);
                                    onClose();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 text-sm font-semibold min-h-11 ${
                                    active
                                        ? 'bg-primary text-white shadow-md'
                                        : 'hover:bg-sidebar-hover text-sidebar-muted hover:text-sidebar-fg'
                                }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-white/10 app-safe-bottom">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-sidebar-hover rounded-xl transition text-sm font-semibold min-h-11"
                    >
                        <IconLogOut size={18} /> Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
