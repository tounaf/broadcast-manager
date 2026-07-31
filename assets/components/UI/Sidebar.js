import React from 'react';

const Sidebar = ({ currentView, onViewChange, onLogout, isOpen, onClose }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'mediatheque', label: 'Médiathèque', icon: '🎞️' },
        { id: 'programs', label: 'Programmes', icon: '📅' },
        { id: 'playlists', label: 'Playlists', icon: '🎬' },
        { id: 'users', label: 'Utilisateurs', icon: '👥' },
        { id: 'roles', label: 'Rôles & Droits', icon: '🔐' },
        { id: 'profile', label: 'Mon Profil', icon: '👤' },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-800 text-white flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-5 flex justify-between items-center border-b border-slate-700">
                    <h2 className="text-sm font-extrabold text-blue-400 tracking-tight leading-snug uppercase">
                        FVA Vitao ny asan'ny Fahamarinana
                    </h2>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-400 hover:text-white text-lg p-1 focus:outline-none ml-2"
                        title="Fermer"
                    >
                        ✕
                    </button>
                </div>
                <nav className="mt-4 flex-1 space-y-1 px-3 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onViewChange(item.id);
                                onClose();
                            }}
                            className={`w-full flex items-center px-4 py-2.5 rounded-lg transition duration-200 text-xs font-semibold ${
                                currentView === item.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                            }`}
                        >
                            <span className="mr-3 text-base">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center px-4 py-2.5 text-red-400 hover:bg-slate-700 rounded-lg transition text-xs font-semibold"
                    >
                        <span className="mr-3">🚪</span> Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
