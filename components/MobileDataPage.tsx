import React, { useState } from 'react';
import { MobileDataProvider, DataPlan, CartItem } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface MobileDataPageProps {
  provider: MobileDataProvider;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  onBackToStore: () => void;
}

export const MobileDataPage: React.FC<MobileDataPageProps> = ({ provider, onAddToCart, onBuyNow, onBackToStore }) => {
  const { t } = useI18n();
  const { formatCurrency } = useSettings();
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(provider.plans.find(p => p.status === 'available') || null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleAction = (action: 'addToCart' | 'buyNow') => {
    if (!selectedPlan) return;
    if (phoneNumber.length !== 8) {
      setPhoneError(t('services.mobile_data_page.error_phone_number'));
      return;
    }
    setPhoneError(null);

    const newItem: CartItem = {
      productId: `mobiledata-${provider.id}`,
      variantId: selectedPlan.id,
      quantity: 1,
      productNameKey: t('services.mobile_data_item'),
      variantNameKey: `${provider.name} - ${selectedPlan.dataAmount}`,
      logoUrl: provider.logoUrl,
      price: selectedPlan.price,
      isFreeTrial: false,
      metadata: {
        isCustomOrder: true,
        customOrderType: 'mobileData',
        provider: provider.name,
        phoneNumber: phoneNumber,
        planName: selectedPlan.name,
        dataAmount: selectedPlan.dataAmount,
      },
    };
    
    if (action === 'addToCart') {
        onAddToCart(newItem);
    } else {
        onBuyNow(newItem);
    }
  };

  return (
    <main className="flex-grow bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        <nav className="text-sm text-brand-text-secondary mb-8" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={onBackToStore} className="hover:text-brand-red">{t('nav.home')}</button>
            </li>
            <li className="flex items-center mx-2">/</li>
            <li className="flex items-center">
              <span className="font-medium">{t('services.mobile_data_page.title')}</span>
            </li>
             <li className="flex items-center mx-2">/</li>
            <li className="flex items-center text-brand-text-primary font-semibold">
              <span>{provider.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-lg">
                <img src={provider.pageImageUrl} alt={provider.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
                <img src={provider.logoUrl} alt={`${provider.name} logo`} className="w-16 h-16 rounded-2xl object-contain bg-white shadow-md p-1" />
                <div>
                    <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">{provider.name}</h1>
                    <p className="text-lg text-brand-text-secondary mt-1">{t('services.mobile_data_page.title')}</p>
                </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 my-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">{t('services.mobile_data_page.select_plan')}</h3>
                <div className="grid grid-cols-2 gap-4">
                    {provider.plans.map(plan => {
                      const isAvailable = plan.status === 'available';
                      const isComingSoon = plan.status === 'coming_soon';
                      return (
                        <div key={plan.id} className="relative rounded-xl overflow-hidden">
                            <div className={plan.status === 'out_of_stock' ? 'grayscale' : ''}>
                                <button 
                                    onClick={() => isAvailable && setSelectedPlan(plan)}
                                    disabled={!isAvailable}
                                    className={`w-full p-4 border-2 text-start transition-all duration-200 rounded-xl ${
                                        selectedPlan?.id === plan.id 
                                            ? 'border-brand-red bg-red-50 shadow-lg' 
                                            : 'border-gray-200 bg-white'
                                    } ${!isAvailable ? 'cursor-not-allowed' : 'hover:border-brand-red hover:bg-red-50/50'} ${isComingSoon ? 'animate-glow' : ''}`}
                                    style={isComingSoon ? { '--glow-color': '#FBBF24' } as React.CSSProperties : {}}
                                >
                                    <p className="font-bold text-brand-text-primary">{plan.dataAmount}</p>
                                    <p className="text-lg font-semibold text-brand-text-primary mt-1">{formatCurrency(plan.price)}</p>
                                </button>
                            </div>
                             {!isAvailable && (() => {
                                if (plan.status === 'coming_soon') {
                                    return (
                                        <div className="absolute inset-0 bg-amber-900/70 flex items-center justify-center p-2 text-center rounded-xl">
                                            <div className="bg-amber-500 text-white px-4 py-2 rounded-full font-bold tracking-wider uppercase text-sm shadow-lg flex items-center gap-2">
                                                <Icon name="bell" className="w-5 h-5" />
                                                {t('status.coming_soon')}
                                            </div>
                                        </div>
                                    );
                                }
                                if (plan.status === 'out_of_stock') {
                                     return (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2 text-center rounded-xl">
                                            <div className="bg-slate-800 text-white px-3 py-1.5 rounded-full font-bold tracking-wider uppercase text-xs shadow-lg flex items-center gap-1.5">
                                                <Icon name="package" className="w-4 h-4 opacity-70" />
                                                {t(`status.out_of_stock`)}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                      );
                    })}
                </div>
            </div>
            
            <div className="mb-6">
                 <label htmlFor="phoneNumber" className="block text-sm font-bold text-brand-text-primary mb-2">{t('services.mobile_data_page.phone_number')}</label>
                 <div className="relative">
                    <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value.replace(/\D/g, ''));
                            if (phoneError) setPhoneError(null);
                        }}
                        placeholder={t('services.mobile_data_page.phone_number_placeholder')}
                        maxLength={8}
                        className={`w-full bg-slate-50 border ${phoneError ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-3 text-gray-800 focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors`}
                    />
                 </div>
                 {phoneError && <p className="text-xs text-red-600 mt-1">{phoneError}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                    onClick={() => handleAction('buyNow')}
                    disabled={!selectedPlan}
                    className="w-full flex-1 bg-brand-text-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {t('product.buy_now')}
                </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};