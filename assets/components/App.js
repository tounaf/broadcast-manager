import React, { useState } from 'react';
import Sidebar from './UI/Sidebar';
import Header from './UI/Header';
import ProgramManager from './Program/ProgramManager';
import Login from './Login';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import Profile from './Profile';

const App = () => {
    const [user, setUser] = useState(window.user_data);
    const [view, setView] = useState('dashboard');

    if (!user) {
        return <Login error={window.login_error} lastUsername={window.last_username} />;
    }

    const renderContent = () => {
        switch (view) {
            case 'programs':
                return <ProgramManager onBack={() => setView('dashboard')} />;
            case 'users':
                return <UserManagement />;
            case 'roles':
                return <RoleManagement />;
            case 'profile':
                return <Profile user={user} />;
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        <DashboardCard
                            title="Programmes"
                            description="Gérez la structure de votre grille hebdomadaire."
                            icon="📅"
                            color="blue"
                            onClick={() => setView('programs')}
                        />
                        <DashboardCard
                            title="Utilisateurs"
                            description="Gérez les accès et les comptes utilisateurs."
                            icon="👥"
                            color="green"
                            onClick={() => setView('users')}
                        />
                        <DashboardCard
                            title="Rôles & Droits"
                            description="Définissez les droits d'accès aux routes."
                            icon="🔐"
                            color="purple"
                            onClick={() => setView('roles')}
                        />
                        <DashboardCard
                            title="Playlists"
                            description="Planifiez le contenu réel des émissions."
                            icon="🎬"
                            color="green"
                        />
                        <DashboardCard
                            title="Médiathèque"
                            description="Accédez au catalogue des films et vidéos."
                            icon="🎞️"
                            color="purple"
                        />
                        <DashboardCard
                            title="Publicité"
                            description="Gérez les spots et les contrats clients."
                            icon="📢"
                            color="orange"
                        />
                    </div>
                );
        }
    };

    const getViewTitle = () => {
        const titles = {
            dashboard: 'Tableau de Bord',
            programs: 'Gestion des Programmes',
            users: 'Gestion des Utilisateurs',
            roles: 'Gestion des Droits',
            profile: 'Mon Profil',
        };
        return titles[view] || 'Dashboard';
    };

    const handleLogout = () => {
        window.location.href = '/logout';
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Sidebar currentView={view} onViewChange={setView} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={getViewTitle()} user={user} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, description, icon, color, onClick }) => {
    const colors = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        purple: 'border-purple-500',
        orange: 'border-orange-500',
        cyan: 'border-cyan-500',
    };

    return (
        <div
            onClick={onClick}
            className={`bg-white p-6 rounded-lg shadow-sm border-t-4 ${colors[color]} hover:shadow-md transition cursor-pointer`}
        >
            <div className="text-3xl mb-4">{icon}</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
            <p className="text-gray-600 mb-4 text-sm">{description}</p>
            <div className="text-blue-600 font-medium text-sm flex items-center">
                Ouvrir <span className="ml-1">→</span>
            </div>
        </div>
    );
};

export default App;
