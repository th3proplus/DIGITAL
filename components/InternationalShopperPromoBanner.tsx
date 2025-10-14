import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface InternationalShopperPromoBannerProps {
  onLearnMore: () => void;
}

export const InternationalShopperPromoBanner: React.FC<InternationalShopperPromoBannerProps> = ({ onLearnMore }) => {
    const { language } = useI18n();
    const { settings } = useSettings();
    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Icon name="store" className="w-12 h-12 text-blue-500" />
                        <div>
                            <h3 className="font-bold text-lg text-brand-text-primary">{settings.homePage.internationalShopperPromo.title[language]}</h3>
                            <p className="text-sm text-brand-text-secondary">{settings.homePage.internationalShopperPromo.subtitle[language]}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLearnMore}
                        className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                    >
                        {settings.homePage.internationalShopperPromo.cta[language]}
                    </button>
                </div>
            </div>
        </div>
    );
};