import React, { useState, useEffect, useMemo } from 'react';
import { CartItem, User, PlaceOrderDetails } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onPlaceOrder: (details: PlaceOrderDetails, paymentMethod: string) => void;
  onBackToStore: () => void;
  currentUser: User | null;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: string }> = ({ label, id, icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                id={id}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400"
                {...props}
            />
        </div>
    </div>
);

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onPlaceOrder, onBackToStore, currentUser }) => {
    const { t, language } = useI18n();
    const { formatCurrency, settings } = useSettings();
    const [email, setEmail] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    // State for AliExpress form
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const isAliExpressOrder = useMemo(() => cartItems.some(item => item.metadata?.customOrderType === 'aliexpress'), [cartItems]);

    const paymentMethods = [
        { id: 'card', name: 'Credit / Debit Card', icon: 'credit-card', enabled: true },
        { id: 'paypal', name: 'PayPal', icon: 'paypal', enabled: settings.payments.paypal.enabled },
        { id: 'stripe', name: 'Stripe', icon: 'stripe', enabled: settings.payments.stripe.enabled },
        { id: 'binance', name: 'Binance Pay', icon: 'binance', enabled: settings.payments.binance.enabled },
        { id: 'bankTransfer', name: settings.payments.bankTransfer.name.value, icon: 'dollar-sign', enabled: settings.payments.bankTransfer.enabled },
        { id: 'click2pay', name: 'Click2Pay', icon: 'dollar-sign', enabled: settings.payments.click2pay.enabled }
    ].filter(p => p.enabled);

    const redirectProvider = paymentMethods.find(p => p.id === selectedPaymentMethod);

    useEffect(() => {
        if (currentUser) {
            setEmail(currentUser.email);
            setCardholderName(currentUser.name);
        }
    }, [currentUser]);

    useEffect(() => {
        if (isRedirecting) {
            const timer = setTimeout(() => {
                onPlaceOrder({ name: cardholderName, email }, selectedPaymentMethod);
                setIsRedirecting(false);
            }, 3000); // 3-second simulation for redirection

            return () => clearTimeout(timer);
        }
    }, [isRedirecting, onPlaceOrder, cardholderName, email, selectedPaymentMethod]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAliExpressOrder) {
            onPlaceOrder({
                name: cardholderName,
                email,
                shipping: { phoneNumber, address: shippingAddress, city, postalCode }
            }, 'aliexpress_request');
        } else {
            if (selectedPaymentMethod !== 'card' && selectedPaymentMethod !== 'bankTransfer') {
                setIsRedirecting(true);
            } else {
                onPlaceOrder({ name: cardholderName, email }, selectedPaymentMethod);
            }
        }
    };

    const getSubmitButtonText = () => {
        if (selectedPaymentMethod === 'card') {
            return t('checkout.place_order');
        }
        if (selectedPaymentMethod === 'bankTransfer') {
            return t('checkout.confirm_order');
        }
        return `Continue to ${redirectProvider?.name}`;
    };

    if (isAliExpressOrder) {
        return (
            <main className="flex-grow bg-gray-50">
                <div className="container py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">{settings.services.aliexpress.checkoutTitle[language]}</h1>
                        <p className="text-brand-text-secondary mt-2">{settings.services.aliexpress.checkoutSubtitle[language]}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 order-last lg:order-first">
                             <h2 className="text-2xl font-bold text-brand-text-primary mb-6">Contact & Shipping Information</h2>
                             <form onSubmit={handleSubmit} className="space-y-5">
                                <InputField label="Full Name" id="name" type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} required placeholder="John Doe" />
                                <InputField label={t('checkout.email')} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                                <InputField label="Phone Number" id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="e.g. 22123456" />
                                <div>
                                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">Full Shipping Address</label>
                                    <textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required rows={3} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400" placeholder="Street name, number, apartment, etc."></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="City" id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Tunis" />
                                    <InputField label="Postal Code" id="postalCode" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="e.g. 2080" />
                                </div>
                                <div className="!mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
                                    <p dangerouslySetInnerHTML={{ __html: settings.services.aliexpress.checkoutNextSteps[language] }} />
                                </div>
                                <button type="submit" className="w-full bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30">
                                    Submit Request
                                </button>
                             </form>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-brand-text-primary mb-6">{t('checkout.order_summary')}</h2>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={item.logoUrl} alt={t(item.productNameKey)} className="w-16 h-16 object-contain rounded-lg border border-gray-100 p-1"/>
                                            <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{item.quantity}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-brand-text-primary">{item.metadata?.isCustomOrder ? item.productNameKey : t(item.productNameKey)}</p>
                                            <p className="text-sm text-brand-text-secondary">{item.metadata?.customOrderType === 'giftCard' ? item.variantNameKey : t(item.variantNameKey)}</p>
                                        </div>
                                        <p className="font-semibold text-brand-text-primary">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 mt-6 pt-6">
                                <div className="flex justify-between items-center font-bold text-xl text-brand-text-primary">
                                    <span>{t('cart.total')}</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="flex-grow bg-gray-50">
                <div className="container py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">{t('checkout.title')}</h1>
                        <button onClick={onBackToStore} className="text-sm text-brand-red font-semibold mt-2 hover:underline">
                            {t('checkout.back_to_store')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Order Summary */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 order-last lg:order-first">
                            <h2 className="text-2xl font-bold text-brand-text-primary mb-6">{t('checkout.order_summary')}</h2>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={item.logoUrl} alt={t(item.productNameKey)} className="w-16 h-16 object-contain rounded-lg border border-gray-100 p-1"/>
                                            <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{item.quantity}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-brand-text-primary">{t(item.productNameKey)}</p>
                                            <p className="text-sm text-brand-text-secondary">{t(item.variantNameKey)}</p>
                                        </div>
                                        <p className="font-semibold text-brand-text-primary">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 mt-6 pt-6">
                                <div className="flex justify-between items-center font-bold text-xl text-brand-text-primary">
                                    <span>{t('cart.total')}</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Payment Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-brand-text-primary mb-6">{t('checkout.payment_details')}</h2>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                {paymentMethods.map(method => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 flex flex-col justify-center items-center h-24 ${
                                            selectedPaymentMethod === method.id 
                                                ? 'border-brand-red bg-red-50 shadow-md' 
                                                : 'border-gray-200 hover:border-brand-red hover:bg-red-50/50'
                                        }`}
                                    >
                                        <Icon name={method.icon} className="h-8 w-8 text-brand-text-primary mb-2" />
                                        <span className="font-semibold text-xs text-brand-text-primary">{method.name}</span>
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {selectedPaymentMethod === 'card' ? (
                                    <>
                                        <InputField label={t('checkout.email')} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                                        <InputField label={t('checkout.cardholder_name')} id="cardholderName" type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} required placeholder="John Doe" />
                                        
                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.card_number')}</label>
                                            <div className="relative">
                                                <input id="cardNumber" type="text" required placeholder="0000 0000 0000 0000" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400"/>
                                                <div className="absolute inset-y-0 end-0 flex items-center pe-3 gap-1">
                                                    <Icon name="visa" className="w-8 h-8" />
                                                    <Icon name="mastercard" className="w-8 h-8" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label={t('checkout.expiry_date')} id="expiryDate" type="text" required placeholder="MM / YY" />
                                            <InputField label={t('checkout.cvc')} id="cvc" type="text" required placeholder="123" />
                                        </div>
                                    </>
                                ) : selectedPaymentMethod === 'bankTransfer' ? (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800 space-y-3">
                                        <h4 className="font-bold">{t('checkout.bank_transfer_info_title')}</h4>
                                        <p>{t('checkout.bank_transfer_line1')}</p>
                                        <ul className="pl-4 list-disc list-inside bg-white p-3 rounded-md">
                                            {settings.payments.bankTransfer.accountName.enabled && <li><strong>{t('checkout.bank_account_name')}:</strong> {settings.payments.bankTransfer.accountName.value}</li>}
                                            {settings.payments.bankTransfer.accountNumber.enabled && <li><strong>{t('checkout.bank_account_number')}:</strong> {settings.payments.bankTransfer.accountNumber.value}</li>}
                                            {settings.payments.bankTransfer.bankName.enabled && <li><strong>{t('checkout.bank_name')}:</strong> {settings.payments.bankTransfer.bankName.value}</li>}
                                        </ul>
                                        {settings.payments.bankTransfer.whatsappNumber.enabled && <p>{t('checkout.bank_transfer_line2')} <strong className="whitespace-nowrap">{settings.payments.bankTransfer.whatsappNumber.value}</strong></p>}
                                        <p>{t('checkout.bank_transfer_line3')}</p>
                                    </div>
                                ) : (
                                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-brand-text-secondary text-sm">You will be redirected to complete your payment with <span className="font-semibold">{redirectProvider?.name}</span>.</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30"
                                >
                                    {getSubmitButtonText()}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            {isRedirecting && redirectProvider && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl text-center shadow-2xl max-w-sm w-full">
                        <Icon name={redirectProvider.icon} className="h-16 w-16 mx-auto mb-5 text-brand-text-primary" />
                        <h3 className="text-2xl font-bold text-brand-text-primary">Redirecting to {redirectProvider.name}...</h3>
                        <p className="text-brand-text-secondary mt-2">Please wait while we securely transfer you to complete your payment.</p>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mt-8"></div>
                    </div>
                </div>
            )}
        </>
    );
};