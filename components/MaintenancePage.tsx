import React from 'react';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';
import { Logo } from './Logo';

export const MaintenancePage: React.FC = () => {
    const { language } = useI18n();
    const { settings } = useSettings();

    const { maintenancePage, footer } = settings;

    return (
        <div className="bg-slate-900 text-white min-h-screen flex flex-col p-6">
            <header className="flex justify-start">
                <Logo />
            </header>
            <main className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-8 relative animate-pulse">
                    <Icon name="settings" className="w-12 h-12 text-brand-red animate-spin-slow" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    {maintenancePage.title[language]}
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                    {maintenancePage.subtitle[language]}
                </p>

                <div className="mt-12">
                    <p className="text-sm text-slate-500 mb-4">Stay tuned for updates</p>
                    <div className="flex justify-center gap-4">
                        {footer.socialLinks.map(icon => (
                            <a
                                key={icon.name}
                                href={icon.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-brand-red rounded-full text-slate-400 hover:text-white transition-all duration-300"
                                aria-label={icon.name}
                            >
                                <Icon name={icon.name} className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </main>
            {/* The footer with the admin panel button has been removed */}
             <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
            `}</style>
        </div>
    );
};