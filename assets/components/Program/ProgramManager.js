import React, { useState, useEffect } from 'react';

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
                    <input 
                        type="text" 
                        placeholder="Nom du thème..." 
                        value={newTheme.label}
                        onChange={e => setNewTheme({...newTheme, label: e.target.value})}
                        className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map(c => (
                            <button 
                                key={c} 
                                onClick={() => setNewTheme({...newTheme, color: c})}
                                className={`w-6 h-6 rounded-full border-2 transition-transform ${newTheme.color === c ? 'scale-125 border-gray-800' : 'border-transparent hover:scale-110'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsAdding(false)}
                            className="flex-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded transition"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={() => {
                                if (newTheme.label) {
                                    onAddTheme(newTheme);
                                    setIsAdding(false);
                                    setNewTheme({ label: '', color: '#3b82f6' });
                                }
                            }}
                            className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
                        >
                            Créer
                        </button>
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
                        onClick={() => onSelect(theme.id)}
                        className={`p-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${selectedTheme === theme.id ? 'border-gray-800 shadow-md ring-1 ring-gray-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.color }}></span>
                        <span className="truncate">{theme.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const ProgramManager = ({ onBack }) => {
    const [slots, setSlots] = useState([]);
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState({
        dayOfWeek: 'Lundi',
        label: '',
        startTime: '08:00',
        endTime: '09:00',
        themeId: null
    });

    useEffect(() => {
        fetchData();
    }, []);

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
            
            console.log('Slots fetched:', slotsData);
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
            height: `${Math.max(height, 20)}px`, // Minimum 20px height to be visible
            backgroundColor: theme ? theme.color : '#94a3b8',
        };
    };

    if (loading && slots.length === 0) {
        return <div className="flex items-center justify-center h-full text-white">Chargement...</div>;
    }

    return (
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            <header className="bg-slate-800 p-4 text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="hover:bg-slate-700 p-2 rounded-full transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Structure des Programmes</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Grille Hebdomadaire</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {error && <span className="text-red-400 text-xs flex items-center mr-4">{error}</span>}
                    <button 
                        onClick={() => { 
                            setCurrentSlot({ dayOfWeek: 'Lundi', label: '', startTime: '08:00', endTime: '09:00', themeId: themes[0]?.id }); 
                            setIsModalOpen(true); 
                        }}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 flex items-center gap-2"
                    >
                        <span className="text-xl leading-none">+</span> Nouveau
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-auto relative bg-slate-50">
                <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-20 shadow-sm">
                    <div className="p-3 border-r text-center font-bold text-slate-400 text-[10px] flex items-center justify-center uppercase">Heure</div>
                    {DAYS.map(day => (
                        <div key={day} className="p-3 text-center font-bold border-r last:border-r-0 text-xs text-slate-600 uppercase tracking-wider">{day}</div>
                    ))}
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
                                <div key={h} className="h-[40px] border-b border-slate-100/50 group-hover:bg-white/40 transition-colors"></div>
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
                                    className="absolute left-1 right-1 rounded-lg p-2 text-[11px] text-white font-bold cursor-pointer shadow-md hover:brightness-110 hover:scale-[1.02] transition-all z-10 overflow-hidden ring-1 ring-white/20"
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <header className="p-8 pb-4">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{currentSlot.id ? 'Modifier' : 'Nouveau'} Créneau</h2>
                            <p className="text-sm text-slate-500">Définissez les détails de votre programme</p>
                        </header>
                        
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Libellé du programme</label>
                                <input 
                                    type="text"
                                    value={currentSlot.label}
                                    onChange={e => setCurrentSlot({...currentSlot, label: e.target.value})}
                                    placeholder="Ex: Le Grand Journal..."
                                    className="w-full border-2 border-slate-100 rounded-2xl p-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Jour</label>
                                    <select 
                                        value={currentSlot.dayOfWeek}
                                        onChange={e => setCurrentSlot({...currentSlot, dayOfWeek: e.target.value})}
                                        className="w-full border-2 border-slate-100 rounded-2xl p-3 bg-slate-50 focus:bg-white outline-none transition-all text-sm appearance-none"
                                    >
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Horaires</label>
                                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 text-xs font-mono font-bold text-blue-600">
                                        <span>{currentSlot.startTime}</span>
                                        <span className="text-slate-300">→</span>
                                        <span>{currentSlot.endTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-700">Ajuster la plage (Range)</label>
                                <div className="space-y-6 py-2">
                                    <div className="relative">
                                        <input 
                                            type="range" min="0" max="1440" step="15" 
                                            value={parseInt(currentSlot.startTime.split(':')[0]) * 60 + parseInt(currentSlot.startTime.split(':')[1])}
                                            className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                            onChange={e => {
                                                const mins = parseInt(e.target.value);
                                                const h = Math.floor(mins / 60).toString().padStart(2, '0');
                                                const m = (mins % 60).toString().padStart(2, '0');
                                                setCurrentSlot({...currentSlot, startTime: `${h}:${m}`});
                                            }}
                                        />
                                        <span className="absolute -top-4 left-0 text-[10px] font-bold text-slate-400 uppercase">Début</span>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="range" min="0" max="1440" step="15" 
                                            value={parseInt(currentSlot.endTime.split(':')[0]) * 60 + parseInt(currentSlot.endTime.split(':')[1])}
                                            className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                            onChange={e => {
                                                const mins = parseInt(e.target.value);
                                                const h = Math.floor(mins / 60).toString().padStart(2, '0');
                                                const m = (mins % 60).toString().padStart(2, '0');
                                                setCurrentSlot({...currentSlot, endTime: `${h}:${m}`});
                                            }}
                                        />
                                        <span className="absolute -top-4 left-0 text-[10px] font-bold text-slate-400 uppercase">Fin</span>
                                    </div>
                                </div>
                            </div>

                            <ThemePicker 
                                themes={themes} 
                                selectedTheme={currentSlot.themeId} 
                                onSelect={id => setCurrentSlot({...currentSlot, themeId: id})}
                                onAddTheme={handleAddTheme}
                            />
                        </div>

                        <footer className="p-8 bg-slate-50 border-t flex justify-between gap-4">
                            {currentSlot.id && (
                                <button onClick={() => handleDelete(currentSlot.id)} className="text-red-500 hover:text-red-600 font-bold px-4 py-2 text-sm transition-colors">
                                    Supprimer
                                </button>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-200 rounded-2xl transition-all text-sm">Annuler</button>
                                <button onClick={handleSave} className="px-8 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/20 text-sm">Enregistrer</button>
                            </div>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramManager;
