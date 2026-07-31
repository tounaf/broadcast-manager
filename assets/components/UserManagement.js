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
            .then((res) => res.json())
            .then((data) => setUsers(data));
    };

    const fetchRoles = () => {
        fetch('/api/roles')
            .then((res) => res.json())
            .then((data) => setRoles(data));
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        }).then(() => {
            fetchUsers();
            setIsModalOpen(false);
            setNewUser({ username: '', email: '', password: '', roles: [] });
        });
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Supprimer cet utilisateur ?')) {
            fetch(`/api/users/${id}`, { method: 'DELETE' }).then(() => fetchUsers());
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-fg">Utilisateurs</h2>
                <Button onClick={() => setIsModalOpen(true)}>+ Nouvel Utilisateur</Button>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
                {users.map((user) => (
                    <div key={user.id} className="bg-surface border border-border rounded-xl p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bold text-fg truncate">{user.username}</p>
                                <p className="text-sm text-muted truncate">{user.email}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                            {user.roles.map((r) => (
                                <span key={r} className="inline-block bg-primary-soft text-primary text-xs px-2 py-1 rounded-md">
                                    {r}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                            <Button variant="outline" className="flex-1 text-sm py-2">
                                Modifier
                            </Button>
                            <Button variant="danger" className="flex-1 text-sm py-2" onClick={() => handleDeleteUser(user.id)}>
                                Supprimer
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table */}
            <Card className="hidden md:block" padding={false}>
                <div className="overflow-x-auto p-5">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="pb-3 font-semibold text-muted">Username</th>
                                <th className="pb-3 font-semibold text-muted">Email</th>
                                <th className="pb-3 font-semibold text-muted">Rôles</th>
                                <th className="pb-3 font-semibold text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-surface-2">
                                    <td className="py-3 text-fg">{user.username}</td>
                                    <td className="py-3 text-fg">{user.email}</td>
                                    <td className="py-3">
                                        {user.roles.map((r) => (
                                            <span
                                                key={r}
                                                className="inline-block bg-primary-soft text-primary text-xs px-2 py-1 rounded mr-1"
                                            >
                                                {r}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="py-3 text-right">
                                        <button type="button" className="text-primary hover:opacity-80 mr-3 text-sm">
                                            Modifier
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-danger hover:opacity-80 text-sm"
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
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleCreateUser}>Enregistrer</Button>
                    </div>
                }
            >
                <form>
                    <Input
                        label="Nom d'utilisateur"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-fg mb-1">Rôles</label>
                        <div className="flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-center text-sm text-fg min-h-11 px-1">
                                    <input
                                        type="checkbox"
                                        className="mr-2 accent-primary"
                                        checked={newUser.roles.includes(role.name)}
                                        onChange={(e) => {
                                            const nextRoles = e.target.checked
                                                ? [...newUser.roles, role.name]
                                                : newUser.roles.filter((r) => r !== role.name);
                                            setNewUser({ ...newUser, roles: nextRoles });
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
