import React, { useState } from 'react';
import ProgramManager from './Program/ProgramManager';

const App = () => {
    const [view, setView] = useState('dashboard');

    if (view === 'programs') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
                <ProgramManager onBack={() => setView('dashboard')} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Broadcast Manager</h1>
                <p className="text-lg text-gray-600">Système de gestion Digitalisé TV & RADIO</p>
            </header>
            
            <main className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-2">Programmes</h2>
                    <p className="text-gray-600 mb-4">Gérez la structure de votre grille hebdomadaire.</p>
                    <button 
                        onClick={() => setView('programs')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Ouvrir
                    </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <h2 className="text-xl font-bold mb-2">Playlists</h2>
                    <p className="text-gray-600 mb-4">Planifiez le contenu réel des émissions.</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Ouvrir</button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                    <h2 className="text-xl font-bold mb-2">Médiathèque</h2>
                    <p className="text-gray-600 mb-4">Accédez au catalogue des films et vidéos.</p>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">Parcourir</button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
                    <h2 className="text-xl font-bold mb-2">Publicité</h2>
                    <p className="text-gray-600 mb-4">Gérez les spots et les contrats clients.</p>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">Gérer</button>
                </div>
            </main>
            
            <footer className="mt-12 text-gray-500 text-sm">
                &copy; 2026 Broadcast Manager - Madagascar
            </footer>
        </div>
    );
};

export default App;
