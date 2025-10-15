import React from 'react';
import { useSettings } from '../hooks/useI18n';

interface LogoProps {
    storeName?: string;
}

export const Logo: React.FC<LogoProps> = ({ storeName: propStoreName }) => {
    let settings;
    try {
        settings = useSettings().settings;
    } catch (e) {
        settings = null;
    }

    const logoUrl = settings?.logoUrl;
    const storeName = propStoreName || settings?.storeName || 'NEXUS';

    if (logoUrl) {
        return (
            <img 
                src={logoUrl} 
                alt={storeName} 
                className="h-10 object-contain max-w-[200px]"
            />
        );
    }
    
    // The span will inherit its color from its parent.
    return (
        <span className="text-2xl font-extrabold tracking-tight">
            {storeName}
        </span>
    );
};
