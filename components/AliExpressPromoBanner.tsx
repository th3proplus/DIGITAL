import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { useSettings } from '../hooks/useI18n';

interface AliExpressPromoBannerProps {
  onLearnMore: () => void;
}

export const AliExpressPromoBanner: React.FC<AliExpressPromoBannerProps> = ({ onLearnMore }) => {
    const { language } = useI18n();
    const { settings } = useSettings();
    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <img src="https://i.imgur.com/24H2s2t.png" alt="AliExpress Logo" className="w-12 h-12" />
                        <div>
                            <h3 className="font-bold text-lg text-brand-text-primary">{settings.homePage.aliexpressPromo.title[language]}</h3>
                            <p className="text-sm text-brand-text-secondary">{settings.homePage.aliexpressPromo.subtitle[language]}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLearnMore}
                        className="bg-brand-red text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                    >
                        {settings.homePage.aliexpressPromo.cta[language]}
                    </button>
                </div>
            </div>
        </div>
    );
};