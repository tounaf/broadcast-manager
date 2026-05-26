import React, { useState, useEffect } from 'react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const THEMES = [
    { id: 'musique', label: 'Musique', color: 'bg-green-500' },
    { id: 'info', label: 'Information', color: 'bg-blue-500' },
    { id: 'film', label: 'Film/Série', color: 'bg-purple-500' },
    { id: 'pub', label: 'Publicité', color: 'bg-orange-500' },
    { id: 'talk', label: 'Talk Show', color: 'bg-pink-500' },
];

const ProgramManager = ({ onBack }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState({
        dayOfWeek: 'Lundi',
        label: '',
        startTime: '08:00',
        endTime: '09:00',
        theme: 'musique'
    });

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const response = await fetch('/api/programs');
            const data = await response.json();
            setSlots(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching slots:', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const method = currentSlot.id ? 'PUT' : 'POST';
        const url = currentSlot.id ? `/api/programs/${currentSlot.id}` : '/api/programs';
        
        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentSlot),
            });
            setIsModalOpen(false);
            fetchSlots();
        } catch (error) {
            console.error('Error saving slot:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce créneau ?')) return;
        try {
            await fetch(`/api/programs/${id}`, { method: 'DELETE' });
            fetchSlots();
        } catch (error) {
            console.error('Error deleting slot:', error);
        }
    };

    const getSlotStyle = (slot) => {
        const startHour = parseInt(slot.startTime.split(':')[0]);
        const startMin = parseInt(slot.startTime.split(':')[1]);
        const endHour = parseInt(slot.endTime.split(':')[0]);
        const endMin = parseInt(slot.endTime.split(':')[1]);
        
        const top = (startHour * 60 + startMin) * (60 / 60); // 1px per minute? No, let's say 40px per hour
        const height = ((endHour * 60 + endMin) - (startHour * 60 + startMin)) * (40 / 60);
        
        const theme = THEMES.find(t => t.id === slot.theme) || THEMES[0];
        
        return {
            top: `${(startHour * 40) + (startMin * 40 / 60)}px`,
            height: `${height}px`,
        };
    };

    return (
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
            <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="hover:bg-blue-700 p-2 rounded-full transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold">Grille de Programmes hebdomadaire</h1>
                </div>
                <button 
                    onClick={() => { setCurrentSlot({ dayOfWeek: 'Lundi', label: '', startTime: '08:00', endTime: '09:00', theme: 'musique' }); setIsModalOpen(true); }}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition"
                >
                    + Nouveau Créneau
                </button>
            </header>

            <div className="flex-1 overflow-auto relative">
                <div className="grid grid-cols-8 border-b sticky top-0 bg-gray-50 z-10">
                    <div className="p-2 border-r text-center font-bold text-gray-400 text-xs">GMT</div>
                    {DAYS.map(day => (
                        <div key={day} className="p-2 text-center font-bold border-r last:border-r-0 text-sm">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-8 relative" style={{ height: '960px' }}> {/* 24h * 40px */}
                    {/* Time labels */}
                    <div className="border-r bg-gray-50">
                        {HOURS.map(h => (
                            <div key={h} className="h-[40px] text-[10px] text-gray-400 text-center border-b flex items-center justify-center">
                                {h.toString().padStart(2, '0')}:00
                            </div>
                        ))}
                    </div>

                    {/* Columns for each day */}
                    {DAYS.map(day => (
                        <div key={day} className="border-r last:border-r-0 relative bg-white/50">
                            {HOURS.map(h => (
                                <div key={h} className="h-[40px] border-b border-gray-100"></div>
                            ))}
                            
                            {/* Slots for this day */}
                            {slots.filter(s => s.dayOfWeek === day).map(slot => (
                                <div 
                                    key={slot.id}
                                    onClick={() => { setCurrentSlot(slot); setIsModalOpen(true); }}
                                    className={`absolute left-1 right-1 rounded-md p-1 text-[10px] text-white font-bold cursor-pointer shadow-sm hover:brightness-110 transition-all z-1 overflow-hidden border border-white/20 ${THEMES.find(t => t.id === slot.theme)?.color || 'bg-gray-500'}`}
                                    style={getSlotStyle(slot)}
                                >
                                    <div className="truncate">{slot.label || slot.theme.toUpperCase()}</div>
                                    <div className="opacity-80">{slot.startTime} - {slot.endTime}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for editing */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <header className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">{currentSlot.id ? 'Modifier' : 'Nouveau'} Créneau</h2>
                        </header>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Libellé du programme</label>
                                <input 
                                    type="text"
                                    value={currentSlot.label}
                                    onChange={e => setCurrentSlot({...currentSlot, label: e.target.value})}
                                    placeholder="Ex: Le Grand Journal, Mix Matinal..."
                                    className="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jour de la semaine</label>
                                <select 
                                    value={currentSlot.dayOfWeek}
                                    onChange={e => setCurrentSlot({...currentSlot, dayOfWeek: e.target.value})}
                                    className="w-full border rounded-lg p-2 bg-gray-50"
                                >
                                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Plage Horaire (Range Picker)</label>
                                <div className="space-y-4">
                                    <input 
                                        type="range" min="0" max="1440" step="15" 
                                        className="w-full accent-blue-600"
                                        onChange={e => {
                                            const mins = parseInt(e.target.value);
                                            const h = Math.floor(mins / 60).toString().padStart(2, '0');
                                            const m = (mins % 60).toString().padStart(2, '0');
                                            setCurrentSlot({...currentSlot, startTime: `${h}:${m}`});
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 font-mono">
                                        <span>Début: <b className="text-blue-600">{currentSlot.startTime}</b></span>
                                        <span>Fin: <b className="text-blue-600">{currentSlot.endTime}</b></span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1440" step="15" 
                                        className="w-full accent-blue-600"
                                        onChange={e => {
                                            const mins = parseInt(e.target.value);
                                            const h = Math.floor(mins / 60).toString().padStart(2, '0');
                                            const m = (mins % 60).toString().padStart(2, '0');
                                            setCurrentSlot({...currentSlot, endTime: `${h}:${m}`});
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thématique</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {THEMES.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setCurrentSlot({...currentSlot, theme: theme.id})}
                                            className={`p-2 rounded-lg border text-sm font-medium transition-all ${currentSlot.theme === theme.id ? `${theme.color} text-white border-transparent shadow-lg` : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {theme.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <footer className="p-6 bg-gray-50 border-t flex justify-between gap-4">
                            {currentSlot.id && (
                                <button onClick={() => handleDelete(currentSlot.id)} className="text-red-600 hover:text-red-700 font-medium px-4 py-2">
                                    Supprimer
                                </button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">Annuler</button>
                                <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">Enregistrer</button>
                            </div>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramManager;
