import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import MediaLibrary from './MediaLibrary';

const PlaylistEditor = ({ slot, date, onSave, onCancel }) => {
    const [items, setItems] = useState(slot.playlist.items || []);
    const [saving, setSaving] = useState(false);

    const totalDuration = items.reduce((sum, item) => sum + item.media.duration, 0);
    const remaining = slot.slot.duration - totalDuration;
    const isOver = remaining < 0;

    const formatDuration = (sec) => {
        const absSec = Math.abs(sec);
        const h = Math.floor(absSec / 3600);
        const m = Math.floor((absSec % 3600) / 60);
        const s = absSec % 60;
        return `${sec < 0 ? '-' : ''}${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
    };

    const handleAddMedia = (media) => {
        setItems([...items, { media, position: items.length }]);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        setSaving(true);
        const payload = {
            date,
            items: items.map(it => ({ mediaId: it.media.id })),
            status: 'to_validate'
        };

        fetch(`/api/playlists/${slot.slot.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(() => {
            setSaving(false);
            onSave();
        });
    };

    return (
        <div className="flex h-full bg-gray-50 overflow-hidden">
            {/* Left side: Playlist sequence */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{slot.slot.label}</h2>
                        <p className="text-sm text-gray-500">{slot.slot.startTime} - {slot.slot.endTime} ({formatDuration(slot.slot.duration)})</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onCancel}>Annuler</Button>
                        <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600">Progression de la durée</span>
                        <span className={`text-sm font-bold ${isOver ? 'text-red-500' : 'text-blue-600'}`}>
                            {isOver ? 'Dépassement: ' : 'Restant: '} {formatDuration(remaining)}
                        </span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                            className={`h-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min((totalDuration / slot.slot.duration) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm group">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-800">{item.media.title}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{item.media.type} • {formatDuration(item.media.duration)}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 italic">
                            Glissez ou cliquez sur un média pour l'ajouter
                        </div>
                    )}
                </div>
            </div>

            {/* Right side: Media Library */}
            <div className="w-80 bg-white border-l p-4 flex flex-col shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📚</span> Médiathèque
                </h3>
                <MediaLibrary onSelect={handleAddMedia} />
            </div>
        </div>
    );
};

export default PlaylistEditor;
