import React, { useState, useEffect } from 'react';
import Card from './UI/Card';
import Button from './UI/Button';
import Modal from './UI/Modal';
import Input from './UI/Input';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [appRoutes, setAppRoutes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', permissions: [] });

    useEffect(() => {
        fetchRoles();
        fetchRoutes();
    }, []);

    const fetchRoles = () => {
        fetch('/api/roles').then(res => res.json()).then(setRoles);
    };

    const fetchRoutes = () => {
        fetch('/api/routes').then(res => res.json()).then(setAppRoutes);
    };

    const handleCreateRole = (e) => {
        e.preventDefault();
        fetch('/api/roles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRole)
        }).then(() => {
            fetchRoles();
            setIsModalOpen(false);
            setNewRole({ name: '', permissions: [] });
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Rôles et Droits</h2>
                <Button onClick={() => setIsModalOpen(true)}>+ Nouveau Rôle</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <Card key={role.id} title={role.name}>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Permissions (Routes)</h4>
                        <div className="flex flex-wrap gap-1">
                            {role.permissions.length > 0 ? (
                                role.permissions.map(p => (
                                    <span key={p} className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded">
                                        {p}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-xs italic">Aucune permission</span>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-end">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Créer un Rôle"
                footer={
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button onClick={handleCreateRole}>Enregistrer</Button>
                    </div>
                }
            >
                <form>
                    <Input
                        label="Nom du Rôle (ex: MANAGER)"
                        value={newRole.name}
                        onChange={e => setNewRole({...newRole, name: e.target.value.toUpperCase()})}
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Associer à des Routes (Droits)</label>
                        <div className="max-h-60 overflow-y-auto border rounded-md p-3 bg-gray-50">
                            {appRoutes.map(route => (
                                <label key={route.name} className="flex items-center mb-2 last:mb-0 cursor-pointer hover:bg-white p-1 rounded">
                                    <input
                                        type="checkbox"
                                        className="mr-3"
                                        checked={newRole.permissions.includes(route.name)}
                                        onChange={e => {
                                            const nextPerms = e.target.checked
                                                ? [...newRole.permissions, route.name]
                                                : newRole.permissions.filter(p => p !== route.name);
                                            setNewRole({...newRole, permissions: nextPerms});
                                        }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{route.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono">{route.path} [{route.methods.join(',')}]</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RoleManagement;
