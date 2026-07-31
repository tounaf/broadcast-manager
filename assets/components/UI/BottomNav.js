import React, { useState } from 'react';
import { MOBILE_MORE, MOBILE_PRIMARY } from './navItems';
import { IconMoreHorizontal, IconX } from './Icons';

const BottomNav = ({ currentView, onViewChange }) => {
    const [moreOpen, setMoreOpen] = useState(false);
    const moreActive = MOBILE_MORE.some((i) => i.id === currentView);

    return (
        <>
            {moreOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMoreOpen(false)}>
                    <div className="absolute inset-0 bg-overlay/80" />
                    <div
                        className="absolute inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] mx-3 rounded-2xl border border-border bg-surface shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <span className="text-sm font-bold text-fg">Plus</span>
                            <button
                                type="button"
                                className="p-2 text-muted rounded-lg hover:bg-surface-2 min-h-11 min-w-11 flex items-center justify-center"
                                onClick={() => setMoreOpen(false)}
                            >
                                <IconX size={18} />
                            </button>
                        </div>
                        <div className="p-2">
                            {MOBILE_MORE.map((item) => {
                                const Icon = item.icon;
                                const active = currentView === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            onViewChange(item.id);
                                            setMoreOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold min-h-12 ${
                                            active ? 'bg-primary-soft text-primary' : 'text-fg hover:bg-surface-2'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border bg-surface/95 backdrop-blur app-safe-bottom">
                <div className="grid grid-cols-5 h-[4.25rem]">
                    {MOBILE_PRIMARY.map((item) => {
                        const Icon = item.icon;
                        const active = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setMoreOpen(false);
                                    onViewChange(item.id);
                                }}
                                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
                                    active ? 'text-primary' : 'text-muted'
                                }`}
                            >
                                <span
                                    className={`flex items-center justify-center w-10 h-8 rounded-xl ${
                                        active ? 'bg-primary-soft' : ''
                                    }`}
                                >
                                    <Icon size={20} />
                                </span>
                                {item.shortLabel}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => setMoreOpen((v) => !v)}
                        className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
                            moreOpen || moreActive ? 'text-primary' : 'text-muted'
                        }`}
                    >
                        <span
                            className={`flex items-center justify-center w-10 h-8 rounded-xl ${
                                moreOpen || moreActive ? 'bg-primary-soft' : ''
                            }`}
                        >
                            <IconMoreHorizontal size={20} />
                        </span>
                        Plus
                    </button>
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
