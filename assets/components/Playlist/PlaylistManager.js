import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import PlaylistEditor from './PlaylistEditor';

const PlaylistManager = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSlot, setEditingSlot] = useState(null);

    useEffect(() => {
        fetchDailySchedule();
    }, [date]);

    const fetchDailySchedule = () => {
        setLoading(true);
        fetch(`/api/playlists/daily?date=${date}`)
            .then((res) => res.json())
            .then((data) => {
                setSlots(data);
                setLoading(false);
            });
    };

    const formatDuration = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}m ${s}s`;
    };

    if (editingSlot) {
        return (
            <div className="fixed inset-0 z-40 bg-surface">
                <PlaylistEditor
                    slot={editingSlot}
                    date={date}
                    onSave={() => {
                        setEditingSlot(null);
                        fetchDailySchedule();
                    }}
                    onCancel={() => setEditingSlot(null)}
                />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-fg">Planification des Playlists</h2>
                <div className="flex items-center gap-3 bg-surface p-2 rounded-xl shadow-sm border border-border min-h-11">
                    <label className="text-sm font-medium text-muted">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="outline-none text-primary font-bold bg-surface text-fg"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20 text-muted italic">Chargement du planning...</div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {slots.map((item) => {
                        const { slot, playlist } = item;
                        const statusColors = {
                            empty: 'border-border bg-surface-2',
                            draft: 'border-warning/40 bg-warning-soft',
                            to_validate: 'border-primary/40 bg-primary-soft',
                            validated: 'border-success/40 bg-success-soft',
                        };

                        return (
                            <button
                                key={slot.id}
                                type="button"
                                className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-2 rounded-xl transition hover:shadow-md text-left ${statusColors[playlist.status]}`}
                                onClick={() => setEditingSlot(item)}
                            >
                                <div className="flex items-center gap-3 sm:w-auto">
                                    <div className="w-20 text-center border-r border-border/60 pr-3">
                                        <p className="text-[10px] font-bold text-muted uppercase">Début</p>
                                        <p className="text-xl font-black text-fg font-mono">{slot.startTime}</p>
                                    </div>
                                    <div className="flex-1 sm:hidden min-w-0">
                                        <h3 className="font-bold text-fg truncate">{slot.label}</h3>
                                        <p className="text-[10px] text-muted uppercase">{slot.theme}</p>
                                    </div>
                                    <span
                                        className={`sm:hidden inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                                            playlist.status === 'validated'
                                                ? 'bg-success-soft text-success'
                                                : playlist.status === 'to_validate'
                                                  ? 'bg-primary-soft text-primary'
                                                  : playlist.status === 'draft'
                                                    ? 'bg-warning-soft text-warning'
                                                    : 'bg-surface text-muted'
                                        }`}
                                    >
                                        {playlist.status === 'empty' ? 'Vide' : playlist.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="flex-1 hidden sm:block min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-bold text-fg text-lg">{slot.label}</h3>
                                        <span className="text-[10px] bg-surface px-2 py-0.5 rounded border border-border font-bold text-muted uppercase">
                                            {slot.theme}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                                        <p>Durée slot: {formatDuration(slot.duration)}</p>
                                        <p>{playlist.items.length} média(s)</p>
                                        <div className="flex items-center gap-1">
                                            <div className="w-20 h-2 bg-surface rounded-full overflow-hidden border border-border">
                                                <div
                                                    className={`h-full ${playlist.remainingDuration < 0 ? 'bg-danger' : 'bg-success'}`}
                                                    style={{
                                                        width: `${Math.min((playlist.totalDuration / slot.duration) * 100, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold ${playlist.remainingDuration < 0 ? 'text-danger' : 'text-muted'}`}
                                            >
                                                {playlist.remainingDuration === 0
                                                    ? 'Complet'
                                                    : playlist.remainingDuration < 0
                                                      ? 'Trop long'
                                                      : 'Incomplet'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block text-right shrink-0">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            playlist.status === 'validated'
                                                ? 'bg-success-soft text-success'
                                                : playlist.status === 'to_validate'
                                                  ? 'bg-primary-soft text-primary'
                                                  : playlist.status === 'draft'
                                                    ? 'bg-warning-soft text-warning'
                                                    : 'bg-surface text-muted'
                                        }`}
                                    >
                                        {playlist.status === 'empty' ? 'Vide' : playlist.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="sm:hidden flex items-center justify-between text-xs text-muted pt-1 border-t border-border/50">
                                    <span>{formatDuration(slot.duration)}</span>
                                    <span>{playlist.items.length} média(s)</span>
                                    <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${playlist.remainingDuration < 0 ? 'bg-danger' : 'bg-success'}`}
                                            style={{
                                                width: `${Math.min((playlist.totalDuration / slot.duration) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                    {slots.length === 0 && (
                        <div className="text-center p-16 border-2 border-dashed border-border rounded-2xl text-muted">
                            Aucun créneau programmé pour ce jour dans la structure.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlaylistManager;
