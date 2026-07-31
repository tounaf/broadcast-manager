import React, { useRef, useState } from 'react';
import Button from '../UI/Button';
import MediaLibrary from './MediaLibrary';
import { IconLibrary, IconTrash, IconX } from '../UI/Icons';

const PlaylistEditor = ({ slot, date, onSave, onCancel }) => {
    const libraryRef = useRef(null);
    const [items, setItems] = useState(slot.playlist.items || []);
    const [saving, setSaving] = useState(false);
    const [libraryOpen, setLibraryOpen] = useState(false);

    const totalDuration = items.reduce((sum, item) => sum + item.media.duration, 0);
    const remaining = slot.slot.duration - totalDuration;
    const isOver = remaining < 0;

    const handleDrop = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('application/json');
        if (!data) return;

        try {
            const media = JSON.parse(data);
            handleAddMedia(media);
        } catch (error) {
            console.error('Impossible d’ajouter le média depuis le glisser-déposer', error);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const formatDuration = (sec) => {
        const absSec = Math.abs(sec);
        const h = Math.floor(absSec / 3600);
        const m = Math.floor((absSec % 3600) / 60);
        const s = absSec % 60;
        return `${sec < 0 ? '-' : ''}${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
    };

    const handleAddMedia = (media) => {
        setItems((prev) => [...prev, { media, position: prev.length }]);
        setLibraryOpen(false);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        setSaving(true);
        const payload = {
            date,
            items: items.map((it) => ({ mediaId: it.media.id })),
            status: 'to_validate',
        };

        fetch(`/api/playlists/${slot.slot.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).then(() => {
            setSaving(false);
            onSave();
        });
    };

    const handleOpenLibrary = () => {
        if (window.matchMedia('(max-width: 1023px)').matches) {
            setLibraryOpen(true);
            return;
        }
        libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    return (
        <div className="flex h-full bg-canvas overflow-hidden relative">
            <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold text-fg truncate">{slot.slot.label}</h2>
                        <p className="text-sm text-muted">
                            {slot.slot.startTime} - {slot.slot.endTime} ({formatDuration(slot.slot.duration)})
                        </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
                            Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none">
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </div>

                <div className="bg-surface rounded-xl shadow-sm border border-border p-4 mb-4 sm:mb-6">
                    <div className="flex justify-between items-center mb-2 gap-2">
                        <span className="text-sm font-semibold text-muted">Progression</span>
                        <span className={`text-sm font-bold ${isOver ? 'text-danger' : 'text-primary'}`}>
                            {isOver ? 'Dépassement: ' : 'Restant: '} {formatDuration(remaining)}
                        </span>
                    </div>
                    <div className="w-full h-3 sm:h-4 bg-surface-2 rounded-full overflow-hidden flex">
                        <div
                            className={`h-full transition-all duration-500 ${isOver ? 'bg-danger' : 'bg-primary'}`}
                            style={{ width: `${Math.min((totalDuration / slot.slot.duration) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3 lg:hidden">
                    <span className="text-sm font-semibold text-fg">{items.length} média(s)</span>
                    <Button onClick={() => setLibraryOpen(true)} className="text-sm py-2">
                        <IconLibrary size={16} /> Ajouter
                    </Button>
                </div>

                <div
                    className="flex-1 overflow-y-auto space-y-3 pr-1"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="mb-2 text-sm text-muted hidden lg:block">
                        Glissez un média depuis la médiathèque ici, ou cliquez sur un média pour l’ajouter.
                    </div>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border shadow-sm"
                        >
                            <div className="w-8 h-8 bg-surface-2 rounded-full flex items-center justify-center text-xs font-bold text-muted shrink-0">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-fg truncate">{item.media.title}</p>
                                <p className="text-[10px] text-muted uppercase">
                                    {item.media.type} • {formatDuration(item.media.duration)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="p-2.5 text-danger hover:bg-danger-soft rounded-lg border border-border transition min-h-11 min-w-11 flex items-center justify-center"
                                title="Retirer"
                            >
                                <IconTrash size={16} />
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <button
                            type="button"
                            onClick={handleOpenLibrary}
                            className="h-36 w-full border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted text-sm px-4 text-center transition hover:border-primary hover:text-primary"
                        >
                            Touchez pour ouvrir la médiathèque et ajouter un média
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop library sidebar */}
            <div className="hidden lg:flex w-80 bg-surface border-l border-border p-4 flex-col shadow-xl">
                <div ref={libraryRef} className="-mt-2" />
                <h3 className="font-bold text-fg mb-4 flex items-center gap-2">
                    <IconLibrary size={18} /> Médiathèque
                </h3>
                <MediaLibrary onSelect={handleAddMedia} />
            </div>

            {/* Mobile library sheet */}
            {libraryOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
                    <div className="absolute inset-0 bg-overlay" onClick={() => setLibraryOpen(false)} />
                    <div className="relative mt-auto max-h-[88dvh] rounded-t-2xl bg-surface border border-border shadow-2xl flex flex-col app-safe-bottom">
                        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-fg flex items-center gap-2">
                                <IconLibrary size={18} /> Médiathèque
                            </h3>
                            <button
                                type="button"
                                onClick={() => setLibraryOpen(false)}
                                className="p-2 rounded-lg text-muted hover:bg-surface-2 min-h-11 min-w-11 flex items-center justify-center"
                            >
                                <IconX size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <MediaLibrary onSelect={handleAddMedia} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistEditor;
