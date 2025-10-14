import React, { useState } from 'react';
import { GiftCard, ProductStatus } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface GiftCardPageProps {
  giftCard: GiftCard;
  onAddToCart: (card: GiftCard, amount: number) => void;
  onBuyNow: (card: GiftCard, amount: number) => void;
  onBackToStore: () => void;
}

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
    const { t } = useI18n();
    if (status === 'available') return null;

    if (status === 'coming_soon') {
        return (
            <span className="relative inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-amber-400 text-white shadow-lg shadow-amber-400/30">
                <span className="absolute -top-1 -right-1 h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <Icon name="rocket" className="w-4 h-4" />
                {t(`status.${status}`)}
            </span>
        );
    }

    if (status === 'out_of_stock') {
        return (
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300/50`}>
                <Icon name="package" className="w-4 h-4" />
                {t(`status.${status}`)}
            </span>
        );
    }
    
    return null;
}

export const GiftCardPage: React.FC<GiftCardPageProps> = ({ giftCard, onAddToCart, onBuyNow, onBackToStore }) => {
  const { t } = useI18n();
  const { formatCurrency } = useSettings();
  const [selectedAmount, setSelectedAmount] = useState<number>(giftCard.denominations[0]);
  const isAvailable = giftCard.status === 'available';
  
  return (
    <main className="flex-grow bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-brand-text-secondary mb-8" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={onBackToStore} className="hover:text-brand-red">{t('nav.home')}</button>
            </li>
            <li className="flex items-center mx-2">/</li>
            <li className="flex items-center">
              <span className="font-medium">{t('nav.gift_cards')}</span>
            </li>
             <li className="flex items-center mx-2">/</li>
            <li className="flex items-center text-brand-text-primary font-semibold">
              <span>{giftCard.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Gift Card Image */}
          <div>
            <div className="aspect-[9/14] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <img src={giftCard.pageImageUrl} alt={giftCard.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Column: Details & Purchase */}
          <div>
            <div className="flex items-start gap-4 mb-6">
                <img src={giftCard.logoUrl} alt={`${giftCard.name} logo`} className="w-16 h-16 rounded-2xl object-contain bg-white shadow-md p-1" />
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">{giftCard.name}</h1>
                        <StatusBadge status={giftCard.status} />
                    </div>
                    <p className="text-lg text-brand-text-secondary mt-1">Digital Gift Card</p>
                </div>
            </div>
            
            <div className="border-y border-gray-200 py-6 my-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">{t('services.select_amount')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {giftCard.denominations.map(amount => (
                        <button 
                            key={amount}
                            onClick={() => setSelectedAmount(amount)}
                            disabled={!isAvailable}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                                selectedAmount === amount 
                                    ? 'border-brand-red bg-red-50 shadow-lg' 
                                    : 'border-gray-200 hover:border-brand-red hover:bg-red-50/50'
                            } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            <p className="text-2xl font-bold text-brand-text-primary">{formatCurrency(amount)}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                    onClick={() => onAddToCart(giftCard, selectedAmount)}
                    disabled={!isAvailable}
                    className="w-full flex-1 bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                >
                    <Icon name="cart" className="w-6 h-6" />
                    {t('product.add_to_cart')}
                </button>
                 <button 
                    onClick={() => onBuyNow(giftCard, selectedAmount)}
                    disabled={!isAvailable}
                    className="w-full flex-1 bg-brand-text-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {t('product.buy_now')}
                </button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">Description</h3>
                <p className="text-brand-text-secondary">
                    Give the gift of choice with a {giftCard.name} digital gift card. Perfect for any occasion, this card can be redeemed for movies, music, games, apps, and more. Delivered instantly via email.
                </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};