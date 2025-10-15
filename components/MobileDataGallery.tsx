import React, { useRef } from 'react';
import { MobileDataProvider } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface MobileDataGalleryProps {
  providers: MobileDataProvider[];
  onSelectProvider: (provider: MobileDataProvider) => void;
}

const ProviderCard: React.FC<{ provider: MobileDataProvider; onSelect: () => void; }> = ({ provider, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className="relative aspect-video w-80 rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0"
            aria-label={`Shop ${provider.name} data plans`}
        >
            <img draggable="false" src={provider.galleryImageUrl} alt={provider.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-4">
                    {provider.showLogoOnGallery && (
                        <img draggable="false" src={provider.logoUrl} alt={`${provider.name} Logo`} className="w-12 h-12 object-contain drop-shadow-lg bg-white/20 p-1 rounded-lg" />
                    )}
                    <div>
                        <h3 className="text-2xl font-bold">{provider.name}</h3>
                        <p className="text-sm opacity-80">Mobile Data</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MobileDataGallery: React.FC<MobileDataGalleryProps> = ({ providers, onSelectProvider }) => {
    const { language } = useI18n();
    const { settings } = useSettings();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const hasDraggedRef = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        isDraggingRef.current = true;
        startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
        hasDraggedRef.current = false;
    };

    const handleMouseLeave = () => {
        isDraggingRef.current = false;
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        setTimeout(() => {
            hasDraggedRef.current = false;
        }, 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = x - startXRef.current;
        if (Math.abs(walk) > 5) {
            hasDraggedRef.current = true;
        }
        scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    return (
        <section className="bg-white py-16">
            <div className="container">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-brand-text-primary">{settings.homePage.mobileDataPromo.title[language]}</h2>
                    <p className="text-lg text-brand-text-secondary mt-2 max-w-2xl mx-auto">{settings.homePage.mobileDataPromo.subtitle[language]}</p>
                </div>
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6 justify-center cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onClickCapture={(e) => {
                        if (hasDraggedRef.current) {
                            e.stopPropagation();
                        }
                    }}
                >
                    {providers.map(provider => (
                        <ProviderCard key={provider.id} provider={provider} onSelect={() => onSelectProvider(provider)} />
                    ))}
                </div>
            </div>
        </section>
    );
};