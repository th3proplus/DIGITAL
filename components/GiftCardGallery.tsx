import React, { useRef } from 'react';
import { GiftCard } from '../types';
// FIX: Import 'useSettings' hook to access settings context.
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface GiftCardGalleryProps {
  giftCards: GiftCard[];
  onSelectGiftCard: (card: GiftCard) => void;
}

const GiftCardItem: React.FC<{ card: GiftCard; onSelect: () => void; }> = ({ card, onSelect }) => {
    const { t } = useI18n();
    const isAvailable = card.status === 'available';
    const isComingSoon = card.status === 'coming_soon';
    
    return (
        <div 
            onClick={isAvailable ? onSelect : undefined}
            className={`relative aspect-[9/14] w-60 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 transition-all duration-300 ${isAvailable ? 'group hover:shadow-2xl transform hover:-translate-y-2' : 'cursor-not-allowed'} ${isComingSoon ? 'animate-glow' : ''}`}
            aria-label={`Shop ${card.name} gift cards`}
            style={isComingSoon ? { '--glow-color': '#FBBF24' } as React.CSSProperties : {}}
        >
            <div className={card.status === 'out_of_stock' ? 'grayscale' : ''}>
                <img draggable="false" src={card.galleryImageUrl} alt={card.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-between p-5 text-white">
                    <div className="flex justify-end">
                        {card.showLogoOnGallery && (
                            <img draggable="false" src={card.logoUrl} alt={`${card.name} Logo`} className="w-16 h-10 object-contain drop-shadow-lg" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{card.name}</h3>
                        <p className="text-sm opacity-80">Digital Gift Card</p>
                        {isAvailable && (
                            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                                Shop Now <Icon name="chevrons-right" className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
             {!isAvailable && (() => {
                if (card.status === 'coming_soon') {
                  return (
                    <div className="absolute top-0 right-0 h-16 w-16">
                      <div className="absolute transform rotate-45 bg-amber-400 text-center text-white font-semibold py-1 right-[-34px] top-[32px] w-[170px] shadow-lg">
                        <div className="flex items-center justify-center gap-1">
                          <Icon name="rocket" className="w-4 h-4" />
                          <span>{t('status.coming_soon')}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
        
                if (card.status === 'out_of_stock') {
                  return (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-4 text-center">
                       <div className="bg-slate-800 text-white px-5 py-3 rounded-full font-bold tracking-wider uppercase text-sm shadow-lg flex items-center gap-2">
                        <Icon name="package" className="w-5 h-5 opacity-70" />
                        {t(`status.out_of_stock`)}
                      </div>
                    </div>
                  );
                }
        
                return null;
             })()}
        </div>
    );
};


export const GiftCardGallery: React.FC<GiftCardGalleryProps> = ({ giftCards, onSelectGiftCard }) => {
    const { language, t } = useI18n();
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
        <section className="bg-slate-50 py-16">
            <div className="container">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-brand-text-primary">{settings.homePage.giftCardPromo.title[language]}</h2>
                    <p className="text-lg text-brand-text-secondary mt-2 max-w-2xl mx-auto">{settings.homePage.giftCardPromo.subtitle[language]}</p>
                </div>
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6 cursor-grab active:cursor-grabbing select-none"
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
                    {/* Spacer to offset the first card from the edge */}
                    <div className="w-0 flex-shrink-0"></div>
                    {giftCards.map(card => (
                        <GiftCardItem key={card.id} card={card} onSelect={() => onSelectGiftCard(card)} />
                    ))}
                     {/* Spacer to offset the last card from the edge */}
                    <div className="w-0 flex-shrink-0"></div>
                </div>
            </div>
        </section>
    );
};