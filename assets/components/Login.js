import React, { useState } from 'react';
import Card from './UI/Card';
import Input from './UI/Input';
import Button from './UI/Button';

const Login = ({ error: serverError, lastUsername }) => {
    const [credentials, setCredentials] = useState({ _username: lastUsername || '', _password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <Card className="max-w-md w-full" title="Connexion">
                <form method="post" action="/login">
                    {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

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

                    {/* Symfony CSRF token could be passed here if needed,
                        but standard form_login handles it if enable_csrf is true */}
                    <input type="hidden" name="_csrf_token" value={window.csrf_token} />

                    <Button type="submit" className="w-full">Se connecter</Button>
                </form>
                <div className="mt-6 text-center text-gray-500 text-xs">
                    &copy; 2026 Broadcast Manager - Madagascar
                </div>
            </Card>
        </div>
    );
};

export default Login;
