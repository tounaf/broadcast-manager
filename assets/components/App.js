import React, { useState } from 'react';
import Sidebar from './UI/Sidebar';
import Header from './UI/Header';
import BottomNav from './UI/BottomNav';
import ProgramManager from './Program/ProgramManager';
import Login from './Login';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import Profile from './Profile';
import PlaylistManager from './Playlist/PlaylistManager';
import MediaLibrary from './Playlist/MediaLibrary';
import {
    IconCalendar,
    IconClapperboard,
    IconFilm,
    IconMegaphone,
    IconShield,
    IconUsers,
} from './UI/Icons';

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
            case 'mediatheque':
                return (
                    <div className="p-4 sm:p-6 h-full flex flex-col">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-fg">Gestion de la Médiathèque</h2>
                            <p className="text-xs text-muted mt-1">
                                Gérez le catalogue global de vos films, clips, publicités et autres médias.
                            </p>
                        </div>
                        <div className="bg-surface rounded-xl shadow-sm p-4 sm:p-6 border border-border flex-1 overflow-hidden">
                            <MediaLibrary />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                        <DashboardCard
                            title="Programmes"
                            description="Gérez la structure de votre grille hebdomadaire."
                            icon={IconCalendar}
                            accent="border-primary"
                            onClick={() => setView('programs')}
                        />
                        <DashboardCard
                            title="Playlists"
                            description="Planifiez le contenu réel des émissions."
                            icon={IconClapperboard}
                            accent="border-success"
                            onClick={() => setView('playlists')}
                        />
                        <DashboardCard
                            title="Utilisateurs"
                            description="Gérez les accès et les comptes utilisateurs."
                            icon={IconUsers}
                            accent="border-primary"
                            onClick={() => setView('users')}
                        />
                        <DashboardCard
                            title="Rôles & Droits"
                            description="Définissez les droits d'accès aux routes."
                            icon={IconShield}
                            accent="border-warning"
                            onClick={() => setView('roles')}
                        />
                        <DashboardCard
                            title="Médiathèque"
                            description="Accédez au catalogue des films et vidéos."
                            icon={IconFilm}
                            accent="border-warning"
                            onClick={() => setView('mediatheque')}
                        />
                        <DashboardCard
                            title="Publicité"
                            description="Gérez les spots et les contrats clients."
                            icon={IconMegaphone}
                            accent="border-danger"
                        />
                    </div>
                );
        }
    };

    const getViewTitle = () => {
        const titles = {
            dashboard: 'Tableau de Bord',
            mediatheque: 'Médiathèque',
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
        <div className="flex min-h-[100dvh] bg-canvas font-sans overflow-hidden">
            <Sidebar
                currentView={view}
                onViewChange={setView}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title={getViewTitle()} user={user} onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-canvas app-main-pad-mobile">
                    {renderContent()}
                </main>
            </div>
            <BottomNav currentView={view} onViewChange={setView} />
        </div>
    );
};

const DashboardCard = ({ title, description, icon: Icon, accent, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={`text-left bg-surface p-5 rounded-xl shadow-sm border border-border border-t-4 ${accent} hover:shadow-md transition cursor-pointer disabled:opacity-60 disabled:cursor-default`}
    >
        <div className="mb-4 w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
            <Icon size={22} />
        </div>
        <h2 className="text-lg font-bold mb-1.5 text-fg">{title}</h2>
        <p className="text-muted mb-4 text-sm leading-relaxed">{description}</p>
        {onClick && <span className="text-primary font-medium text-sm">Ouvrir →</span>}
    </button>
);

export default App;
