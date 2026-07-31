import React, { useState } from 'react';
import Card from './UI/Card';
import Input from './UI/Input';
import Button from './UI/Button';
import { useTheme } from './theme/ThemeContext';
import { IconMoon, IconPalette, IconSun } from './UI/Icons';

const Login = ({ error: serverError, lastUsername }) => {
    const [credentials, setCredentials] = useState({ _username: lastUsername || '', _password: '' });
    const { theme, cycleTheme } = useTheme();
    const ThemeIcon = theme === 'dark' ? IconMoon : theme === 'brand' ? IconPalette : IconSun;

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-[100dvh] bg-canvas flex items-center justify-center p-4 sm:p-6 relative">
            <button
                type="button"
                onClick={cycleTheme}
                className="absolute top-4 right-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-muted hover:text-fg min-h-11"
                title="Changer de thème"
            >
                <ThemeIcon size={18} />
            </button>
            <Card className="max-w-md w-full shadow-lg" title="Connexion">
                <p className="text-xs text-muted mb-4 -mt-2">FVA Vitao ny asan&apos;ny Fahamarinana</p>
                <form method="post" action="/login">
                    {serverError && <p className="text-danger text-sm mb-4">{serverError}</p>}

                    <Input
                        label="Nom d'utilisateur"
                        name="_username"
                        value={credentials._username}
                        onChange={handleChange}
                        placeholder="admin"
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        name="_password"
                        value={credentials._password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />

                    <input type="hidden" name="_csrf_token" value={window.csrf_token} />

                    <Button type="submit" className="w-full">
                        Se connecter
                    </Button>
                </form>
                <div className="mt-6 text-center text-muted text-xs uppercase font-semibold">
                    &copy; 2026 FVA Vitao ny asan&apos;ny Fahamarinana — Madagascar
                </div>
            </Card>
        </div>
    );
};

export default Login;
