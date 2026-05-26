import React from 'react';

const Header = ({ title, user }) => {
    return (
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Administrateur'}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Header;
