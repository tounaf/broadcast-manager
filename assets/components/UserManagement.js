import React, { useState, useEffect } from 'react';
import Card from './UI/Card';
import Button from './UI/Button';
import Modal from './UI/Modal';
import Input from './UI/Input';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', roles: [] });

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = () => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data));
    };

    const fetchRoles = () => {
        fetch('/api/roles')
            .then(res => res.json())
            .then(data => setRoles(data));
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        }).then(() => {
            fetchUsers();
            setIsModalOpen(false);
            setNewUser({ username: '', email: '', password: '', roles: [] });
        });
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Supprimer cet utilisateur ?')) {
            fetch(`/api/users/${id}`, { method: 'DELETE' })
                .then(() => fetchUsers());
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Utilisateurs</h2>
                <Button onClick={() => setIsModalOpen(true)}>+ Nouvel Utilisateur</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="pb-3 font-semibold text-gray-600">Username</th>
                                <th className="pb-3 font-semibold text-gray-600">Email</th>
                                <th className="pb-3 font-semibold text-gray-600">Rôles</th>
                                <th className="pb-3 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-3">{user.username}</td>
                                    <td className="py-3">{user.email}</td>
                                    <td className="py-3">
                                        {user.roles.map(r => (
                                            <span key={r} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                                                {r}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="py-3 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 mr-3 text-sm">Modifier</button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ajouter un Utilisateur"
                footer={
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button onClick={handleCreateUser}>Enregistrer</Button>
                    </div>
                }
            >
                <form>
                    <Input
                        label="Nom d'utilisateur"
                        value={newUser.username}
                        onChange={e => setNewUser({...newUser, username: e.target.value})}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={newUser.email}
                        onChange={e => setNewUser({...newUser, email: e.target.value})}
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        value={newUser.password}
                        onChange={e => setNewUser({...newUser, password: e.target.value})}
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôles</label>
                        <div className="flex flex-wrap gap-2">
                            {roles.map(role => (
                                <label key={role.id} className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={newUser.roles.includes(role.name)}
                                        onChange={e => {
                                            const nextRoles = e.target.checked
                                                ? [...newUser.roles, role.name]
                                                : newUser.roles.filter(r => r !== role.name);
                                            setNewUser({...newUser, roles: nextRoles});
                                        }}
                                    />
                                    {role.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;
