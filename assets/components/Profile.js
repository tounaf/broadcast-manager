import React from 'react';
import Card from './UI/Card';
import Input from './UI/Input';
import Button from './UI/Button';

const Profile = ({ user }) => {
    return (
        <div className="p-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mon Profil</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card className="text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mx-auto mb-4">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{user?.username}</h3>
                        <p className="text-gray-500 mb-4">{user?.roles.join(', ')}</p>
                        <Button variant="outline" className="w-full text-sm">Changer l'avatar</Button>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card title="Informations Personnelles">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Nom d'utilisateur" value={user?.username} disabled />
                            <Input label="Email" value="admin@example.com" />
                            <Input label="Prénom" placeholder="Jean" />
                            <Input label="Nom" placeholder="Dupont" />
                        </div>
                        <div className="mt-6">
                            <Button>Mettre à jour</Button>
                        </div>
                    </Card>

                    <div className="mt-6">
                        <Card title="Sécurité">
                            <p className="text-sm text-gray-600 mb-4">Il est recommandé de changer votre mot de passe régulièrement.</p>
                            <Button variant="outline" className="text-sm">Changer le mot de passe</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
