import React from 'react';

const Header = ({ title, user, onMenuClick }) => {
    return (
        <header className="bg-white shadow-sm px-4 lg:px-8 py-3.5 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center space-x-3">
                {/* Hamburger Button for Mobile */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
                    title="Menu"
                >
                    <span className="text-xl">☰</span>
                </button>
                <h1 className="text-lg lg:text-2xl font-bold text-gray-800 tracking-tight truncate">{title}</h1>
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.username || 'Utilisateur'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{user?.role || 'Administrateur'}</p>
                </div>
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold shadow-sm border border-blue-100">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Header;
