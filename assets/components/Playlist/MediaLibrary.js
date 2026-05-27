import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';

const MediaLibrary = ({ onSelect, typeFilter }) => {
    const [medias, setMedias] = useState([]);
    const [search, setSearch] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMedia, setNewMedia] = useState({ title: '', duration: '', type: 'film' });

    useEffect(() => {
        fetchMedias();
    }, [typeFilter]);

    const fetchMedias = () => {
        let url = '/api/medias';
        if (typeFilter) url += `?type=${typeFilter}`;
        fetch(url).then(res => res.json()).then(setMedias);
    };

    const handleCreateMedia = (e) => {
        e.preventDefault();
        fetch('/api/medias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMedia)
        }).then(() => {
            fetchMedias();
            setIsAddModalOpen(false);
            setNewMedia({ title: '', duration: '', type: 'film' });
        });
    };

    const formatDuration = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
    };

    const filteredMedias = medias.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <Input
                    placeholder="Rechercher un média..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="mb-0 flex-1"
                />
                <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="shrink-0">+</Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {filteredMedias.map(media => (
                    <div
                        key={media.id}
                        onClick={() => onSelect && onSelect(media)}
                        className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition flex justify-between items-center bg-white"
                    >
                        <div>
                            <p className="font-bold text-sm text-gray-800">{media.title}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-semibold">{media.type} • {formatDuration(media.duration)}</p>
                        </div>
                        {onSelect && <span className="text-blue-500 text-lg">+</span>}
                    </div>
                ))}
                {filteredMedias.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8 italic">Aucun média trouvé</p>
                )}
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Nouveau Média"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                        <Button onClick={handleCreateMedia}>Enregistrer</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input label="Titre" value={newMedia.title} onChange={e => setNewMedia({...newMedia, title: e.target.value})} />
                    <Input label="Durée (secondes)" type="number" value={newMedia.duration} onChange={e => setNewMedia({...newMedia, duration: e.target.value})} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={newMedia.type}
                            onChange={e => setNewMedia({...newMedia, type: e.target.value})}
                            className="w-full border rounded-md p-2 text-sm"
                        >
                            <option value="film">Film</option>
                            <option value="clip">Clip</option>
                            <option value="pub">Publicité</option>
                            <option value="filler">Filler (Autopromo, etc.)</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MediaLibrary;
