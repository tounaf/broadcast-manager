import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Input from '../UI/Input';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const ThemePicker = ({ themes, selectedTheme, onSelect, onAddTheme }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTheme, setNewTheme] = useState({ label: '', color: '#3b82f6' });

    const PRESET_COLORS = [
        '#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#64748b'
    ];

    if (isAdding) {
        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-blue-200 animate-in slide-in-from-top-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Nouveau Thème</h4>
                <div className="space-y-3">
                    <Input
                        placeholder="Nom du thème..." 
                        value={newTheme.label}
                        onChange={e => setNewTheme({...newTheme, label: e.target.value})}
                    />
                    <div className="flex flex-wrap gap-2 mb-3">
                        {PRESET_COLORS.map(c => (
                            <button 
                                key={c} 
                                type="button"
                                onClick={() => setNewTheme({...newTheme, color: c})}
                                className={`w-6 h-6 rounded-full border-2 transition-transform ${newTheme.color === c ? 'scale-125 border-gray-800' : 'border-transparent hover:scale-110'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 text-xs" onClick={() => setIsAdding(false)}>
                            Annuler
                        </Button>
                        <Button className="flex-1 text-xs" onClick={() => {
                            if (newTheme.label) {
                                onAddTheme(newTheme);
                                setIsAdding(false);
                                setNewTheme({ label: '', color: '#3b82f6' });
                            }
                        }}>
                            Créer
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Thématique</label>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                    <span>+ Nouveau</span>
                </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {themes.map(theme => (
                    <button
                        key={theme.id}
                        type="button"
                        onClick={() => onSelect(theme.id)}
                        className={`p-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${selectedTheme === theme.id ? 'border-gray-800 shadow-md ring-1 ring-gray-800 bg-gray-50' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.color }}></span>
                        <span className="truncate">{theme.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const formatDateFR = (date) => {
    if (!date) return '';
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDuration = (sec) => {
    const absSec = Math.abs(sec);
    const h = Math.floor(absSec / 3600);
    const m = Math.floor((absSec % 3600) / 60);
    const s = absSec % 60;
    return `${sec < 0 ? '-' : ''}${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
};

const getSlotDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 3600;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    let duration = (eh * 3600 + em * 60) - (sh * 3600 + sm * 60);
    if (duration < 0) duration += 86400; // end time is next day
    return duration;
};

const getWeekDates = (dateStr) => {
    const current = new Date(dateStr);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push(d);
    }
    return dates;
};

const ProgramManager = () => {
    const [slots, setSlots] = useState([]);
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentSlot, setCurrentSlot] = useState({
        dayOfWeek: 'Lundi',
        label: '',
        startTime: '08:00',
        endTime: '09:00',
        themeId: null
    });
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [playlistInfo, setPlaylistInfo] = useState(null);

    const weekDates = getWeekDates(selectedDate);

    const getSlotDateStr = (dayOfWeek) => {
        const idx = DAYS.indexOf(dayOfWeek.trim());
        if (idx === -1) return null;
        const d = weekDates[idx];
        if (!d) return null;
        return d.toISOString().split('T')[0];
    };

    const changeDate = (days) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    const changeMonth = (months) => {
        const d = new Date(selectedDate);
        d.setMonth(d.getMonth() + months);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!isModalOpen || !currentSlot || !currentSlot.id) {
            setPlaylistInfo(null);
            return;
        }

        const dateStr = getSlotDateStr(currentSlot.dayOfWeek);
        if (!dateStr) return;

        setPlaylistLoading(true);
        setPlaylistInfo(null);

        fetch(`/api/playlists/daily?date=${dateStr}`)
            .then(res => res.json())
            .then(data => {
                const found = data.find(it => it.slot.id === currentSlot.id);
                if (found) {
                    setPlaylistInfo(found.playlist);
                } else {
                    const slotDuration = getSlotDuration(currentSlot.startTime, currentSlot.endTime);
                    setPlaylistInfo({ status: 'empty', items: [], totalDuration: 0, remainingDuration: slotDuration });
                }
                setPlaylistLoading(false);
            })
            .catch(err => {
                console.error('Error fetching slot playlist info:', err);
                setPlaylistLoading(false);
            });
    }, [isModalOpen, currentSlot?.id]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [slotsRes, themesRes] = await Promise.all([
                fetch('/api/programs'),
                fetch('/api/themes')
            ]);
            
            if (!slotsRes.ok || !themesRes.ok) {
                throw new Error('Erreur lors du chargement des données');
            }

            const slotsData = await slotsRes.json();
            const themesData = await themesRes.json();
            
            setSlots(Array.isArray(slotsData) ? slotsData : []);
            setThemes(Array.isArray(themesData) ? themesData : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const handleAddTheme = async (newTheme) => {
        try {
            const response = await fetch('/api/themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTheme),
            });
            if (!response.ok) throw new Error('Erreur création thème');
            const createdTheme = await response.json();
            setThemes([...themes, createdTheme]);
            setCurrentSlot({ ...currentSlot, themeId: createdTheme.id });
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSave = async () => {
        const method = currentSlot.id ? 'PUT' : 'POST';
        const url = currentSlot.id ? `/api/programs/${currentSlot.id}` : '/api/programs';
        
        const payload = {
            ...currentSlot,
            theme: themes.find(t => t.id === currentSlot.themeId)?.label || 'Sans thème'
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'enregistrement');
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce créneau ?')) return;
        try {
            const response = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erreur suppression');
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const getSlotStyle = (slot) => {
        const [startH, startM] = slot.startTime.split(':').map(n => parseInt(n, 10));
        const [endH, endM] = slot.endTime.split(':').map(n => parseInt(n, 10));
        
        const top = (startH * 40) + (startM * 40 / 60);
        const durationMins = (endH * 60 + endM) - (startH * 60 + startM);
        const height = durationMins * (40 / 60);
        
        const theme = themes.find(t => t.label === slot.theme);
        
        return {
            top: `${top}px`,
            height: `${Math.max(height, 20)}px`,
            backgroundColor: theme ? theme.color : '#94a3b8',
        };
    };

    if (loading && slots.length === 0) {
        return <div className="flex items-center justify-center p-12">Chargement...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Grille Hebdomadaire</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Semaine du {formatDateFR(weekDates[0])} au {formatDateFR(weekDates[6])}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center bg-white rounded-lg shadow-sm border overflow-hidden">
                        <button
                            type="button"
                            onClick={() => changeMonth(-1)}
                            className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 border-r"
                            title="Mois précédent"
                        >
                            ⏮️ -1M
                        </button>
                        <button
                            type="button"
                            onClick={() => changeDate(-7)}
                            className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 border-r"
                            title="Semaine précédente"
                        >
                            ◀️ -1S
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                            className="px-3 py-2 text-xs font-bold text-blue-600 hover:bg-gray-50 border-r"
                        >
                            Aujourd'hui
                        </button>
                        <button
                            type="button"
                            onClick={() => changeDate(7)}
                            className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 border-r"
                            title="Semaine suivante"
                        >
                            +1S ▶️
                        </button>
                        <button
                            type="button"
                            onClick={() => changeMonth(1)}
                            className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                            title="Mois suivant"
                        >
                            +1M ⏭️
                        </button>
                    </div>

                    <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="outline-none text-blue-600 font-bold text-sm"
                        />
                    </div>

                    <Button onClick={() => {
                        setCurrentSlot({ dayOfWeek: 'Lundi', label: '', startTime: '08:00', endTime: '09:00', themeId: themes[0]?.id });
                        setIsModalOpen(true);
                    }}>
                        + Nouveau Créneau
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[calc(100vh-200px)] border">
                <div className="flex-1 overflow-auto relative">
                    <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-20 shadow-sm">
                        <div className="p-3 border-r text-center font-bold text-slate-400 text-[10px] flex items-center justify-center uppercase">Heure</div>
                        {DAYS.map((day, idx) => {
                            const dateOfCurrentDay = weekDates[idx];
                            const dateStr = dateOfCurrentDay ? `${dateOfCurrentDay.getDate().toString().padStart(2, '0')}/${(dateOfCurrentDay.getMonth() + 1).toString().padStart(2, '0')}` : '';
                            return (
                                <div key={day} className="p-3 text-center font-bold border-r last:border-r-0 text-xs text-slate-600 uppercase tracking-wider">
                                    <div>{day}</div>
                                    <div className="text-[10px] text-blue-500 font-bold mt-0.5">{dateStr}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-8 relative" style={{ height: '960px' }}>
                        <div className="border-r bg-white">
                            {HOURS.map(h => (
                                <div key={h} className="h-[40px] text-[10px] text-slate-400 text-center border-b border-slate-100 flex items-center justify-center font-mono">
                                    {h.toString().padStart(2, '0')}:00
                                </div>
                            ))}
                        </div>

                        {DAYS.map(day => (
                            <div key={day} className="border-r last:border-r-0 relative group">
                                {HOURS.map(h => (
                                    <div key={h} className="h-[40px] border-b border-slate-100/50 group-hover:bg-gray-50 transition-colors"></div>
                                ))}

                                {slots.filter(s => s.dayOfWeek.trim() === day).map(slot => (
                                    <div
                                        key={slot.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const theme = themes.find(t => t.label === slot.theme);
                                            setCurrentSlot({ ...slot, themeId: theme?.id });
                                            setIsModalOpen(true);
                                        }}
                                        className="absolute left-1 right-1 rounded-lg p-2 text-[11px] text-white font-bold cursor-pointer shadow-sm hover:brightness-110 hover:scale-[1.02] transition-all z-10 overflow-hidden ring-1 ring-white/20"
                                        style={getSlotStyle(slot)}
                                    >
                                        <div className="truncate drop-shadow-sm">{slot.label || slot.theme}</div>
                                        <div className="opacity-70 text-[9px] font-mono">{slot.startTime} - {slot.endTime}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentSlot.id ? 'Modifier le Créneau' : 'Nouveau Créneau'}
                footer={
                    <div className="flex justify-between w-full">
                        {currentSlot.id ? (
                            <Button variant="danger" onClick={() => handleDelete(currentSlot.id)}>Supprimer</Button>
                        ) : <div></div>}
                        <div className="flex space-x-3">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                            <Button onClick={handleSave}>Enregistrer</Button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Libellé du programme"
                        value={currentSlot.label}
                        onChange={e => setCurrentSlot({...currentSlot, label: e.target.value})}
                        placeholder="Ex: Le Grand Journal..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                            <select
                                value={currentSlot.dayOfWeek}
                                onChange={e => setCurrentSlot({...currentSlot, dayOfWeek: e.target.value})}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Horaires</label>
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-200 text-xs font-mono font-bold text-blue-600">
                                <span>{currentSlot.startTime}</span>
                                <span className="text-gray-300">→</span>
                                <span>{currentSlot.endTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 py-2">
                        <div className="relative">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Début</label>
                            <input
                                type="range" min="0" max="1440" step="15"
                                value={parseInt(currentSlot.startTime.split(':')[0]) * 60 + parseInt(currentSlot.startTime.split(':')[1])}
                                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                onChange={e => {
                                    const mins = parseInt(e.target.value);
                                    const h = Math.floor(mins / 60).toString().padStart(2, '0');
                                    const m = (mins % 60).toString().padStart(2, '0');
                                    setCurrentSlot({...currentSlot, startTime: `${h}:${m}`});
                                }}
                            />
                        </div>
                        <div className="relative">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Fin</label>
                            <input
                                type="range" min="0" max="1440" step="15"
                                value={parseInt(currentSlot.endTime.split(':')[0]) * 60 + parseInt(currentSlot.endTime.split(':')[1])}
                                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                onChange={e => {
                                    const mins = parseInt(e.target.value);
                                    const h = Math.floor(mins / 60).toString().padStart(2, '0');
                                    const m = (mins % 60).toString().padStart(2, '0');
                                    setCurrentSlot({...currentSlot, endTime: `${h}:${m}`});
                                }}
                            />
                        </div>
                    </div>

                    <ThemePicker
                        themes={themes}
                        selectedTheme={currentSlot.themeId}
                        onSelect={id => setCurrentSlot({...currentSlot, themeId: id})}
                        onAddTheme={handleAddTheme}
                    />

                    {/* Display playlist status & remaining/available duration */}
                    {currentSlot.id && (
                        <div className="bg-gray-50 rounded-xl border p-4 mt-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Statut de la diffusion</h4>
                            {playlistLoading ? (
                                <p className="text-sm text-gray-500 italic animate-pulse">Chargement des informations de playlist...</p>
                            ) : playlistInfo ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm text-gray-700">
                                        <span>Playlist affectée :</span>
                                        <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${
                                            playlistInfo.status === 'validated' ? 'bg-green-100 text-green-700' :
                                            playlistInfo.status === 'to_validate' ? 'bg-blue-100 text-blue-700' :
                                            playlistInfo.status === 'draft' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {playlistInfo.status === 'empty' ? 'Vide / Non affectée' : playlistInfo.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-700">
                                        <span>Nombre de médias :</span>
                                        <span className="font-bold font-mono">{playlistInfo.items.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-700">
                                        <span>Durée programmée / Durée slot :</span>
                                        <span className="font-bold font-mono">
                                            {formatDuration(playlistInfo.totalDuration)} / {formatDuration(getSlotDuration(currentSlot.startTime, currentSlot.endTime))}
                                        </span>
                                    </div>
                                    <div className="border-t pt-2 mt-2 flex justify-between items-center text-sm font-bold">
                                        <span className={playlistInfo.remainingDuration < 0 ? 'text-red-500' : 'text-blue-600'}>
                                            {playlistInfo.remainingDuration < 0 ? 'Dépassement :' : 'Durée disponible :'}
                                        </span>
                                        <span className={playlistInfo.remainingDuration < 0 ? 'text-red-600 font-mono' : 'text-blue-700 font-mono'}>
                                            {formatDuration(Math.abs(playlistInfo.remainingDuration))}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                                        <div
                                            className={`h-full ${playlistInfo.remainingDuration < 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${Math.min((playlistInfo.totalDuration / getSlotDuration(currentSlot.startTime, currentSlot.endTime)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-red-500 italic">Impossible de charger les données de la playlist.</p>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ProgramManager;
