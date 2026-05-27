import React from 'react';

const Sidebar = ({ currentView, onViewChange, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'programs', label: 'Programmes', icon: '📅' },
        { id: 'playlists', label: 'Playlists', icon: '🎬' },
        { id: 'users', label: 'Utilisateurs', icon: '👥' },
        { id: 'roles', label: 'Rôles & Droits', icon: '🔐' },
        { id: 'profile', label: 'Mon Profil', icon: '👤' },
    ];

    return (
        <aside className="w-64 bg-slate-800 text-white flex-shrink-0">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-400">Broadcast Manager</h2>
            </div>
            <nav className="mt-6 flex-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`w-full flex items-center px-6 py-3 transition duration-200 ${
                            currentView === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : 'hover:bg-slate-700'
                        }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="p-6 border-t border-slate-700">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-slate-700 rounded transition"
                >
                    <span className="mr-3">🚪</span> Déconnexion
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
