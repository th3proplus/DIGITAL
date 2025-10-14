import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface RequestProductPromoBannerProps {
  onNavigate: () => void;
}

export const RequestProductPromoBanner: React.FC<RequestProductPromoBannerProps> = ({ onNavigate }) => {
    const { language } = useI18n();
    const { settings } = useSettings();
    const { requestProductPromo } = settings.homePage;

    return (
        <div className="bg-slate-50">
            <div className="container mx-auto px-6 py-6">
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Icon name="package" className="w-12 h-12 text-brand-text-secondary" />
                        <div>
                            <h3 className="font-bold text-lg text-brand-text-primary">{requestProductPromo.title[language]}</h3>
                            <p className="text-sm text-brand-text-secondary">{requestProductPromo.subtitle[language]}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onNavigate}
                        className="bg-brand-text-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                    >
                        {requestProductPromo.cta[language]}
                    </button>
                </div>
            </div>
        </div>
    );
};