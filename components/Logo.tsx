import React from 'react';
import { useSettings } from '../hooks/useI18n';

export const Logo: React.FC = () => {
    const { settings } = useSettings();

    if (settings.logoUrl) {
        return (
            <img 
                src={settings.logoUrl} 
                alt={settings.storeName} 
                className="h-10 object-contain max-w-[200px]"
            />
        );
    }

    return (
        <span className="text-2xl font-extrabold tracking-tight text-brand-text-primary">
            {settings.storeName}
        </span>
    );
};