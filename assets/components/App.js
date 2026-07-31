import React, { useState } from 'react';
import Sidebar from './UI/Sidebar';
import Header from './UI/Header';
import ProgramManager from './Program/ProgramManager';
import Login from './Login';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import Profile from './Profile';
import PlaylistManager from './Playlist/PlaylistManager';

const App = () => {
    const [user, setUser] = useState(window.user_data);
    const [view, setView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!user) {
        return <Login error={window.login_error} lastUsername={window.last_username} />;
    }

    const renderContent = () => {
        switch (view) {
            case 'programs':
                return <ProgramManager />;
            case 'playlists':
                return <PlaylistManager />;
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
                            title="Playlists"
                            description="Planifiez le contenu réel des émissions."
                            icon="🎬"
                            color="green"
                            onClick={() => setView('playlists')}
                        />
                        <DashboardCard
                            title="Utilisateurs"
                            description="Gérez les accès et les comptes utilisateurs."
                            icon="👥"
                            color="cyan"
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
                            title="Médiathèque"
                            description="Accédez au catalogue des films et vidéos."
                            icon="🎞️"
                            color="orange"
                        />
                        <DashboardCard
                            title="Publicité"
                            description="Gérez les spots et les contrats clients."
                            icon="📢"
                            color="red"
                        />
                    </div>
                );
        }
    };

    const getViewTitle = () => {
        const titles = {
            dashboard: 'Tableau de Bord',
            programs: 'Gestion des Programmes',
            playlists: 'Planification des Playlists',
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
        <div className="flex min-h-screen bg-gray-100 font-sans overflow-hidden">
            <Sidebar
                currentView={view}
                onViewChange={setView}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    title={getViewTitle()}
                    user={user}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
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
        red: 'border-red-500',
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
