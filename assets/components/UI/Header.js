import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { IconMenu, IconMoon, IconPalette, IconSun } from './Icons';

const Header = ({ title, user, onMenuClick }) => {
    const { theme, cycleTheme } = useTheme();

    const ThemeIcon = theme === 'dark' ? IconMoon : theme === 'brand' ? IconPalette : IconSun;
    const themeLabel = theme === 'dark' ? 'Sombre' : theme === 'brand' ? 'Marque' : 'Clair';

    return (
        <header className="bg-surface/95 backdrop-blur border-b border-border px-3 sm:px-4 lg:px-8 py-2.5 lg:py-3.5 flex justify-between items-center sticky top-0 z-30 app-safe-top">
            <div className="flex items-center gap-2 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-muted hover:text-primary p-2.5 rounded-xl hover:bg-surface-2 focus:outline-none transition-colors min-h-11 min-w-11 flex items-center justify-center"
                    title="Menu"
                    type="button"
                >
                    <IconMenu size={22} />
                </button>
                <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-fg tracking-tight truncate">{title}</h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                <button
                    type="button"
                    onClick={cycleTheme}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-2.5 py-2 text-muted hover:text-fg hover:border-primary/40 transition min-h-11"
                    title={`Thème : ${themeLabel} (cliquer pour changer)`}
                >
                    <ThemeIcon size={18} />
                    <span className="hidden md:inline text-xs font-semibold capitalize">{themeLabel}</span>
                </button>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-fg leading-tight">{user?.username || 'Utilisateur'}</p>
                    <p className="text-[10px] text-muted font-bold uppercase">{user?.role || 'Administrateur'}</p>
                </div>
                <div className="w-9 h-9 bg-primary-soft text-primary rounded-full flex items-center justify-center font-bold text-sm border border-border">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Header;
