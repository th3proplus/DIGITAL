import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = 'h-8' }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="16" cy="16" r="16" fill="#F85757"/>
                    <path d="M9 24V8H11.5L20.5 19V8H23V24H20.5L11.5 13V24H9Z" fill="white"/>
                </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-brand-text-primary">NEXUS</span>
        </div>
    );
};
