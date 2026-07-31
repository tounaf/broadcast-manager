import {
    IconCalendar,
    IconClapperboard,
    IconFilm,
    IconLayoutDashboard,
    IconShield,
    IconUser,
    IconUsers,
} from './Icons';

export const NAV_ITEMS = [
    { id: 'dashboard', label: 'Accueil', shortLabel: 'Accueil', icon: IconLayoutDashboard, mobile: true },
    { id: 'programs', label: 'Programmes', shortLabel: 'Grille', icon: IconCalendar, mobile: true },
    { id: 'playlists', label: 'Playlists', shortLabel: 'Playlists', icon: IconClapperboard, mobile: true },
    { id: 'mediatheque', label: 'Médiathèque', shortLabel: 'Médias', icon: IconFilm, mobile: true },
    { id: 'users', label: 'Utilisateurs', shortLabel: 'Users', icon: IconUsers, mobile: false },
    { id: 'roles', label: 'Rôles & Droits', shortLabel: 'Rôles', icon: IconShield, mobile: false },
    { id: 'profile', label: 'Mon Profil', shortLabel: 'Profil', icon: IconUser, mobile: false },
];

export const MOBILE_PRIMARY = NAV_ITEMS.filter((i) => i.mobile);
export const MOBILE_MORE = NAV_ITEMS.filter((i) => !i.mobile);
