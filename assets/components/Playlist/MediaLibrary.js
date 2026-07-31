import React, { useState, useEffect, useRef } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';

const MediaLibrary = ({ onSelect, typeFilter }) => {
    const [medias, setMedias] = useState([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'new', 'broadcasted'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMedia, setNewMedia] = useState({ title: '', duration: '', type: 'film' });
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const fileInputRef = useRef(null);

    const isStandalone = !onSelect;

    const handleDragStart = (event, media) => {
        console.log('[MediaLibrary] dragstart', media);
        event.dataTransfer.setData('application/json', JSON.stringify(media));
        event.dataTransfer.effectAllowed = 'copy';
    };

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

    const handleDeleteMedia = (id) => {
        if (!confirm('Supprimer définitivement ce média ?')) return;
        fetch(`/api/medias/${id}`, {
            method: 'DELETE'
        }).then(() => {
            fetchMedias();
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        setImportProgress(0);

        const reader = new FileReader();
        reader.onprogress = (ev) => {
            if (ev.lengthComputable) {
                const pct = Math.round((ev.loaded / ev.total) * 60); // up to 60%
                setImportProgress(pct);
            }
        };
        reader.onloadend = () => {
            setImportProgress(65);
            const url = URL.createObjectURL(file);
            const mediaEl = document.createElement(file.type.startsWith('video') ? 'video' : 'audio');
            mediaEl.preload = 'metadata';
            mediaEl.src = url;
            const cleanup = () => {
                URL.revokeObjectURL(url);
            };
            mediaEl.onloadedmetadata = () => {
                const duration = Math.round(mediaEl.duration || 0);
                setImportProgress(90);
                setNewMedia({ title: file.name.replace(/\.[^/.]+$/, ''), duration: duration, type: 'film' });
                setIsAddModalOpen(true);
                setIsImporting(false);
                setImportProgress(100);
                cleanup();
            };
            mediaEl.onerror = (err) => {
                console.warn('Erreur lecture média ou codec non supporté (ex: .avi). Utilisation d’un fallback de saisie manuelle.', err);
                setNewMedia({ title: file.name.replace(/\.[^/.]+$/, ''), duration: '', type: 'film' });
                setIsAddModalOpen(true);
                setIsImporting(false);
                setImportProgress(100);
                cleanup();
            };
        };
        reader.readAsArrayBuffer(file);
        e.target.value = '';
    };

    const formatDuration = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
    };

    const filteredMedias = medias.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
        if (activeTab === 'new') return !m.is_broadcasted;
        if (activeTab === 'broadcasted') return m.is_broadcasted;
        return true;
    });

    const ItemContainer = onSelect ? 'button' : 'div';
    const cardClassName = `w-full text-left p-3 border rounded-lg transition flex justify-between items-center bg-white ${
        onSelect ? 'hover:bg-blue-50 cursor-pointer' : 'border-slate-200 shadow-sm'
    }`;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <Input
                    placeholder="Rechercher un média..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="mb-0 flex-1 bg-white"
                />
                <div className="flex items-center gap-2 shrink-0">
                    <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="shrink-0 font-bold">+</Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,video/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e)}
                    />
                    <Button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        variant="outline"
                        className="shrink-0 font-bold"
                    >
                        Importer un fichier
                    </Button>
                </div>
            </div>

            {/* Tab navigation to filter by broadcast status */}
            <div className="flex border-b mb-4">
                <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 pb-2.5 text-xs font-extrabold border-b-2 transition ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Tous
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className={`flex-1 pb-2.5 text-xs font-extrabold border-b-2 transition ${activeTab === 'new' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Non diffusés
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('broadcasted')}
                    className={`flex-1 pb-2.5 text-xs font-extrabold border-b-2 transition ${activeTab === 'broadcasted' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Déjà diffusés
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
                <div className={isStandalone ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
                    {filteredMedias.map(media => (
                        <ItemContainer
                            key={media.id}
                            type={onSelect ? "button" : undefined}
                            draggable="true"
                            onDragStart={(event) => handleDragStart(event, media)}
                            onClick={onSelect ? () => onSelect(media) : undefined}
                            className={cardClassName}
                        >
                            <div className="min-w-0 flex-1 pr-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <p className="font-bold text-sm text-gray-800 truncate" title={media.title}>
                                        {media.title}
                                    </p>
                                    {media.is_broadcasted && (
                                        <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0" title="Déjà diffusé dans un programme passé">
                                            ⏱️ Diffusé
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase font-semibold mt-0.5">
                                    {media.type} • {formatDuration(media.duration)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {onSelect && <span className="text-blue-500 text-lg font-bold">+</span>}
                                {isStandalone && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteMedia(media.id);
                                        }}
                                        className="px-2.5 py-1 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-colors shrink-0 font-bold text-xs flex items-center gap-1 bg-white"
                                        title="Supprimer ce média de la médiathèque"
                                    >
                                        <span>🗑️</span>
                                        <span className="hidden sm:inline">Supprimer</span>
                                    </button>
                                )}
                            </div>
                        </ItemContainer>
                    ))}
                </div>
                {filteredMedias.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8 italic">Aucun média trouvé</p>
                )}
                {isImporting && (
                    <div className="mt-4 px-2">
                        <div className="text-sm text-gray-600 mb-1">Import en cours...</div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all" style={{ width: `${importProgress}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{importProgress}%</div>
                    </div>
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
                            className="w-full border rounded-md p-2 text-sm bg-white"
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
