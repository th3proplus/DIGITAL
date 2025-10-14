import React, { useState, useMemo } from 'react';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';
import { CartItem } from '../types';

interface InternationalShopperPageProps {
  onAddToCart: (item: CartItem) => void;
  onBackToStore: () => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <input
            id={id}
            className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-3 text-gray-800 focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400`}
            {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);

const HowItWorksStep: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 h-full">
        <div className="bg-red-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-5">
            <Icon name={icon} className="w-8 h-8 text-brand-red" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary mb-2">{title}</h3>
        <p className="text-sm text-brand-text-secondary">{description}</p>
    </div>
);


export const InternationalShopperPage: React.FC<InternationalShopperPageProps> = ({ onAddToCart, onBackToStore }) => {
    const { t, language } = useI18n();
    const { settings } = useSettings();

    const [url, setUrl] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [shippingPrice, setShippingPrice] = useState<number | ''>(0);
    const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
    const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState<{ url?: string; price?: string; shippingPrice?: string }>({});

    const exchangeRates = {
        USD: { TND: 3.6, EUR: 0.92, GBP: 0.79, USD: 1 },
        EUR: { TND: 3.9, USD: 1.08, GBP: 0.85, EUR: 1 },
    };

    const serviceFeePercentage = 0; // 0%

    const formatTND = (amount: number) => {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: 'TND',
        }).format(amount);
    };

    const priceCalculation = useMemo(() => {
        if (price === '' || price < 0 || shippingPrice === '' || shippingPrice < 0) return null;

        const productTotal = price * quantity;
        const subtotalInOriginalCurrency = productTotal + shippingPrice;
        const rateToTND = exchangeRates[currency]['TND'] || 1;
        const convertedPriceInTND = subtotalInOriginalCurrency * rateToTND;
        const serviceFeeInTND = convertedPriceInTND * serviceFeePercentage;
        const finalTotalInTND = convertedPriceInTND + serviceFeeInTND;
        
        return {
            originalProductCostFormatted: `${productTotal.toFixed(2)} ${currency}`,
            originalShippingCostFormatted: `${shippingPrice.toFixed(2)} ${currency}`,
            serviceFeeFormatted: formatTND(serviceFeeInTND),
            totalFormatted: formatTND(finalTotalInTND),
            finalTotalInTND: finalTotalInTND
        };
    }, [price, shippingPrice, quantity, currency, language]);
    
    const validate = () => {
        const newErrors: { url?: string; price?: string; shippingPrice?: string } = {};
        if (!url.startsWith('https://')) {
            newErrors.url = t('international_shopper.error_url');
        }
        if (price === '' || price <= 0) {
            newErrors.price = t('international_shopper.error_price');
        }
        if (shippingPrice === '' || shippingPrice < 0) {
            newErrors.shippingPrice = t('international_shopper.error_shipping_price');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !priceCalculation) return;

        const finalTotalInTND = priceCalculation.finalTotalInTND;
        
        let finalPriceInStoreCurrency: number;
        if (settings.currency === 'TND') {
            finalPriceInStoreCurrency = finalTotalInTND;
        } else {
            const tndToOtherRates = { 'USD': 1 / 3.6, 'EUR': 1 / 3.9, 'GBP': 1 / (3.6 / 0.79), 'TND': 1 };
            const conversionRate = tndToOtherRates[settings.currency] || 1;
            finalPriceInStoreCurrency = finalTotalInTND * conversionRate;
        }

        const newItem: CartItem = {
            productId: 'international-shopper',
            variantId: `custom-${Date.now()}`,
            quantity: 1, 
            productNameKey: productName || 'International Item', 
            variantNameKey: t('international_shopper.custom_order_variant'),
            logoUrl: 'https://i.imgur.com/L44z63p.png',
            price: finalPriceInStoreCurrency,
            isFreeTrial: false,
            metadata: {
                isCustomOrder: true,
                customOrderType: 'international',
                url: url,
                originalPrice: price as number,
                originalShippingPrice: shippingPrice as number,
                originalCurrency: currency,
            }
        };
        onAddToCart(newItem);
    };

    return (
        <main className="flex-grow bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-6 text-center pt-16 pb-20">
                    <Icon name="store" className="w-16 h-16 text-brand-red mx-auto mb-4 opacity-50"/>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text-primary tracking-tight mb-3">{t('international_shopper.title')}</h1>
                    <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">{t('international_shopper.subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                {/* How It Works Section */}
                <section className="text-center">
                    <h2 className="text-3xl font-bold text-brand-text-primary mb-12">{t('international_shopper.how_it_works_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                       <HowItWorksStep icon="link" title={t('international_shopper.step1_title')} description={t('international_shopper.step1_desc')} />
                       <HowItWorksStep icon="wallet" title={t('international_shopper.step2_title')} description={t('international_shopper.step2_desc')} />
                       <HowItWorksStep icon="package" title={t('international_shopper.step3_title')} description={t('international_shopper.step3_desc')} />
                    </div>
                </section>

                {/* Form & Price Section */}
                <section className="mt-20 max-w-6xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-5 mb-8 flex items-start gap-4">
                        <Icon name="sparkles" className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold">{settings.services.internationalShopper.noteTitle[language]}</h4>
                            <p className="text-sm mt-1">{settings.services.internationalShopper.noteBody[language]}</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                            {/* Form fields */}
                            <div className="lg:col-span-3">
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-6">{t('international_shopper.form_title')}</h2>
                                <div className="space-y-5">
                                    <InputField 
                                        label={t('international_shopper.form_url')} 
                                        id="url" 
                                        type="url" 
                                        value={url} 
                                        onChange={(e) => setUrl(e.target.value)} 
                                        required 
                                        placeholder={t('international_shopper.form_url_placeholder')}
                                        error={errors.url}
                                    />
                                    <InputField 
                                        label={t('international_shopper.form_product_name')} 
                                        id="productName" 
                                        type="text" 
                                        value={productName} 
                                        onChange={(e) => setProductName(e.target.value)} 
                                        required 
                                        placeholder={t('international_shopper.form_product_name_placeholder')}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label={t('international_shopper.form_price_per_item')}
                                            id="price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            required
                                            placeholder="19.99"
                                            step="0.01"
                                            min="0.01"
                                            error={errors.price}
                                        />
                                        <InputField
                                            label={t('international_shopper.form_shipping_price')}
                                            id="shipping_price"
                                            type="number"
                                            value={shippingPrice}
                                            onChange={(e) => setShippingPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            required
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            error={errors.shippingPrice}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1.5">{t('international_shopper.form_currency')}</label>
                                            <select
                                                id="currency"
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR')}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-gray-800 focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">{t('international_shopper.form_quantity')}</label>
                                            <input
                                                id="quantity"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                required
                                                min="1"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-gray-800 focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Price Breakdown & CTA (Sticky) */}
                            <div className="lg:col-span-2 lg:sticky top-24">
                                <h3 className="text-lg font-bold text-brand-text-primary mb-4">{t('international_shopper.price_breakdown')}</h3>
                                {priceCalculation ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-brand-text-secondary text-sm">
                                            <span>{t('international_shopper.original_price')}</span>
                                            <span className="font-medium">{priceCalculation.originalProductCostFormatted}</span>
                                        </div>
                                        <div className="flex justify-between text-brand-text-secondary text-sm">
                                            <span>{t('international_shopper.shipping_cost')}</span>
                                            <span className="font-medium">{priceCalculation.originalShippingCostFormatted}</span>
                                        </div>
                                        <div className="border-t border-gray-200 my-3"></div>
                                        <div className="flex justify-between items-center font-bold text-2xl text-brand-text-primary">
                                            <span>{t('international_shopper.total_price')}</span>
                                            <span className="text-brand-red">{priceCalculation.totalFormatted}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-brand-text-secondary text-center py-8 text-sm">
                                        Fill in the form to see your total price.
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    className="w-full bg-brand-red text-white py-4 mt-6 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={!priceCalculation}
                                >
                                    <Icon name="cart" className="w-5 h-5"/>
                                    {t('international_shopper.add_to_cart_btn')}
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                 <div className="text-center mt-12">
                     <button onClick={onBackToStore} className="text-sm font-semibold text-brand-red hover:underline">
                       &larr; Or continue shopping
                     </button>
                 </div>
            </div>
        </main>
    );
};