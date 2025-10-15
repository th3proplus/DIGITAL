import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface MobileDataPromoBannerProps {
  onNavigate: () => void;
}

export const MobileDataPromoBanner: React.FC<MobileDataPromoBannerProps> = ({ onNavigate }) => {
    const { language } = useI18n();
    const { settings } = useSettings();
    const { mobileDataPromo } = settings.homePage;

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-6">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Icon name="wallet" className="w-12 h-12 text-teal-500" />
                        <div>
                            <h3 className="font-bold text-lg text-brand-text-primary">{mobileDataPromo.title[language]}</h3>
                            <p className="text-sm text-brand-text-secondary">{mobileDataPromo.subtitle[language]}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onNavigate}
                        className="bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                    >
                        Top-Up Now
                    </button>
                </div>
            </div>
        </div>
    );
};
