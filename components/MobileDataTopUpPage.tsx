import React, { useState } from 'react';
import { MobileDataProvider, DataPlan, CartItem, ProductStatus } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface MobileDataTopUpPageProps {
  providers: MobileDataProvider[];
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  onBackToStore: () => void;
}

const StatusBadge: React.FC<{ status: ProductStatus }> = ({ status }) => {
    const { t } = useI18n();
    if (status === 'available') return null;

    const commonClasses = "absolute top-2 right-2 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5";

    if (status === 'coming_soon') {
        return (
            <div className={`${commonClasses} bg-amber-400`}>
                <Icon name="bell" className="w-4 h-4" />
                {t('status.coming_soon')}
            </div>
        );
    }
    if (status === 'out_of_stock') {
        return (
            <div className={`${commonClasses} bg-slate-600`}>
                <Icon name="package" className="w-4 h-4" />
                {t('status.out_of_stock')}
            </div>
        );
    }
    return null;
};

export const MobileDataTopUpPage: React.FC<MobileDataTopUpPageProps> = ({ providers, onAddToCart, onBuyNow, onBackToStore }) => {
  const { t } = useI18n();
  const { formatCurrency } = useSettings();
  const [selectedProvider, setSelectedProvider] = useState<MobileDataProvider | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const handleSelectProvider = (provider: MobileDataProvider) => {
    setSelectedProvider(provider);
    const firstAvailablePlan = provider.plans.find(p => p.status === 'available');
    setSelectedPlan(firstAvailablePlan || null);
  };

  const handleBackToProviders = () => {
    setSelectedProvider(null);
    setSelectedPlan(null);
  };

  const handleAction = (action: 'addToCart' | 'buyNow') => {
    if (!selectedPlan) return;
    if (phoneNumber.length !== 8 || !/^\d{8}$/.test(phoneNumber)) {
      setPhoneError(t('services.mobile_data_page.error_phone_number'));
      return;
    }
    setPhoneError(null);

    const newItem: CartItem = {
      productId: `mobiledata-${selectedProvider!.id}`,
      variantId: selectedPlan.id,
      quantity: 1,
      productNameKey: t('services.mobile_data_item'),
      variantNameKey: `${selectedProvider!.name} - ${selectedPlan.dataAmount}`,
      logoUrl: selectedProvider!.logoUrl,
      price: selectedPlan.price,
      isFreeTrial: false,
      metadata: {
        isCustomOrder: true,
        customOrderType: 'mobileData',
        provider: selectedProvider!.name,
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

  const providerSelectionView = (
    <div className="animate-fade-in">
        <div className="text-center mb-12 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text-primary tracking-tight">{t('services.mobile_data_page.title')}</h1>
            <p className="text-brand-text-secondary mt-3 text-lg">Choose your mobile operator to get started.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map(provider => (
                <div key={provider.id} onClick={() => handleSelectProvider(provider)} className="relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <img src={provider.galleryImageUrl} alt={provider.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="relative h-full flex flex-col justify-end p-6 text-white min-h-[200px]">
                        <div className="flex items-center gap-4">
                            <img src={provider.logoUrl} alt={`${provider.name} Logo`} className="w-14 h-14 object-contain drop-shadow-lg bg-white/20 p-2 rounded-xl" />
                            <h3 className="text-3xl font-bold">{provider.name}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const planSelectionView = (
    <div className="animate-fade-in">
        <button onClick={handleBackToProviders} className="flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline mb-8">
            <Icon name="chevrons-left" className="w-4 h-4" />
            Back to All Providers
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col">
                 <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg mb-6">
                    <img src={selectedProvider!.pageImageUrl} alt={selectedProvider!.name} className="w-full h-full object-cover" />
                </div>
                 <div className="flex items-center gap-4">
                    <img src={selectedProvider!.logoUrl} alt={`${selectedProvider!.name} logo`} className="w-16 h-16 rounded-2xl object-contain bg-white shadow-md p-1" />
                    <div>
                        <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">{selectedProvider!.name}</h1>
                        <p className="text-lg text-brand-text-secondary mt-1">{t('services.mobile_data_page.title')}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <h3 className="text-lg font-bold text-brand-text-primary mb-4">{t('services.mobile_data_page.select_plan')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {selectedProvider!.plans.map(plan => (
                             <div key={plan.id} className="relative rounded-xl">
                                <button
                                    onClick={() => plan.status === 'available' && setSelectedPlan(plan)}
                                    disabled={plan.status !== 'available'}
                                    className={`w-full p-4 border-2 text-center transition-all duration-200 rounded-xl disabled:cursor-not-allowed disabled:opacity-60 ${selectedPlan?.id === plan.id ? 'border-brand-red bg-red-50 shadow-md' : 'border-gray-200 bg-slate-50 hover:border-brand-red'}`}
                                >
                                    <p className="font-bold text-lg text-brand-text-primary">{plan.dataAmount}</p>
                                    <p className="font-semibold text-brand-text-primary mt-1">{formatCurrency(plan.price)}</p>
                                </button>
                                <StatusBadge status={plan.status} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                     <label htmlFor="phoneNumber" className="block text-sm font-bold text-brand-text-primary mb-2">{t('services.mobile_data_page.phone_number')}</label>
                     <div className="relative">
                        <input
                            id="phoneNumber" type="tel" value={phoneNumber}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '');
                                if (digits.length <= 8) {
                                    setPhoneNumber(digits);
                                }
                                if (phoneError) setPhoneError(null);
                            }}
                            placeholder={t('services.mobile_data_page.phone_number_placeholder')}
                            className={`w-full bg-slate-50 border ${phoneError ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-3 text-gray-800 text-lg focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors`}
                        />
                     </div>
                     {phoneError && <p className="text-xs text-red-600 mt-1.5">{phoneError}</p>}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => handleAction('addToCart')} disabled={!selectedPlan} className="w-full flex-1 bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none">
                        <Icon name="cart" className="w-6 h-6" /> {t('product.add_to_cart')}
                    </button>
                    <button onClick={() => handleAction('buyNow')} disabled={!selectedPlan} className="w-full flex-1 bg-brand-text-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400">
                        {t('product.buy_now')}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <main className="flex-grow bg-slate-50">
      <div className="container py-12">
        {selectedProvider ? planSelectionView : providerSelectionView}
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
       `}</style>
    </main>
  );
};
