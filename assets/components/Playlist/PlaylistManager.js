import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
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
            .then(res => res.json())
            .then(data => {
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
            <div className="fixed inset-0 z-40 bg-white">
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
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Planification des Playlists</h2>
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border">
                    <label className="text-sm font-medium text-gray-600">Date :</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="outline-none text-blue-600 font-bold"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20 text-gray-400 italic">Chargement du planning...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {slots.map((item, idx) => {
                        const { slot, playlist } = item;
                        const statusColors = {
                            empty: 'border-gray-200 bg-gray-50',
                            draft: 'border-orange-200 bg-orange-50',
                            to_validate: 'border-blue-200 bg-blue-50',
                            validated: 'border-green-200 bg-green-50'
                        };

                        return (
                            <div
                                key={slot.id}
                                className={`flex items-center p-4 border-2 rounded-xl transition hover:shadow-md cursor-pointer ${statusColors[playlist.status]}`}
                                onClick={() => setEditingSlot(item)}
                            >
                                <div className="w-24 text-center border-r pr-4 mr-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Début</p>
                                    <p className="text-xl font-black text-gray-800">{slot.startTime}</p>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{slot.label}</h3>
                                        <span className="text-[10px] bg-white px-2 py-0.5 rounded border font-bold text-gray-500 uppercase">{slot.theme}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <p>⏱️ Durée slot: {formatDuration(slot.duration)}</p>
                                        <p>🎞️ {playlist.items.length} média(s)</p>
                                        <div className="flex items-center gap-1">
                                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${playlist.remainingDuration < 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min((playlist.totalDuration / slot.duration) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-[10px] font-bold ${playlist.remainingDuration < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {playlist.remainingDuration === 0 ? 'Complet' : (playlist.remainingDuration < 0 ? 'Trop long' : 'Incomplet')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        playlist.status === 'validated' ? 'bg-green-100 text-green-700' :
                                        playlist.status === 'to_validate' ? 'bg-blue-100 text-blue-700' :
                                        playlist.status === 'draft' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {playlist.status === 'empty' ? 'Vide' : playlist.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {slots.length === 0 && (
                        <div className="text-center p-20 border-2 border-dashed rounded-2xl text-gray-400">
                            Aucun créneau programmé pour ce jour dans la structure.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlaylistManager;
