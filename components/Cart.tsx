import React from 'react';
import { CartItem } from '../types';
import { Icon } from './Icon';
// FIX: Corrected import paths for hooks.
import { useI18n, useSettings } from '../hooks/useI18n';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveFromCart: (productId: string, variantId: string) => void;
  onCheckout: () => void;
  onIncrement: (productId: string, variantId: string) => void;
  onDecrement: (productId: string, variantId: string) => void;
  onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onRemoveFromCart, onCheckout, onIncrement, onDecrement, onClearCart }) => {
  const { t, language } = useI18n();
  const { formatCurrency } = useSettings();
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const isRtl = language === 'ar';

  const positionClass = isRtl ? 'left-0' : 'right-0';
  const transformClass = isOpen ? 'translate-x-0' : (isRtl ? '-translate-x-full' : 'translate-x-full');

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div
        className={`fixed top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${positionClass} ${transformClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <Icon name="cart" className="text-2xl text-brand-text-primary" />
                <h2 id="cart-heading" className="text-2xl font-bold text-brand-text-primary">{t('cart.title')}</h2>
            </div>
            <div className="flex items-center gap-4">
                {cartItems.length > 0 && (
                    <button onClick={onClearCart} className="text-sm font-medium text-brand-text-secondary hover:text-brand-red transition-colors">
                        {t('cart.clear_cart')}
                    </button>
                )}
                <button onClick={onClose} className="text-gray-500 hover:text-brand-text-primary transition">
                    <Icon name="close" className="text-2xl" />
                </button>
            </div>
          </div>
          <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary px-4">
                <Icon name="cart" className="text-9xl mb-6 text-gray-200" />
                <p className="text-2xl font-bold text-brand-text-primary mb-2">{t('cart.empty_title')}</p>
                <p className="mb-8">{t('cart.empty_subtitle')}</p>
                 <button
                    onClick={onClose}
                    className="w-full max-w-xs bg-brand-red text-white py-3 rounded-lg font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105"
                >
                    {t('cart.continue_shopping')}
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => {
                  const productName = item.metadata?.isCustomOrder ? item.productNameKey : t(item.productNameKey);
                  const variantName = item.metadata?.customOrderType === 'giftCard' 
                      ? item.variantNameKey // Already formatted currency
                      : t(item.variantNameKey);

                  return (
                    <li key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <img src={item.logoUrl} alt={productName} className="w-16 h-16 object-contain rounded-lg border border-gray-100 flex-shrink-0" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-brand-text-primary truncate">{productName}</h4>
                          {item.metadata?.url && (
                            <a href={item.metadata.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-red">
                              <Icon name="external" className="text-base"/>
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-brand-text-secondary">{variantName}</p>
                        {item.metadata?.customOrderType === 'mobileData' && item.metadata.phoneNumber && (
                            <p className="text-sm font-semibold text-brand-text-primary mt-1">{item.metadata.phoneNumber}</p>
                        )}
                         <div className="flex items-center gap-2 mt-3">
                            <button
                                onClick={() => onDecrement(item.productId, item.variantId)}
                                disabled={item.metadata?.isCustomOrder || item.quantity <= 1}
                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Decrease quantity of ${productName} - ${variantName}`}
                            >
                                <Icon name="minus" className="text-base" />
                            </button>
                            <span className="font-bold text-brand-text-primary w-5 text-center">{item.quantity}</span>
                            <button
                                onClick={() => onIncrement(item.productId, item.variantId)}
                                disabled={item.metadata?.isCustomOrder}
                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Increase quantity of ${productName} - ${variantName}`}
                            >
                                <Icon name="plus" className="text-base" />
                            </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0 h-full">
                          <p className="font-bold text-lg text-brand-text-primary">{formatCurrency(item.price * item.quantity)}</p>
                          <button
                              onClick={() => onRemoveFromCart(item.productId, item.variantId)}
                              className="text-gray-400 hover:text-red-600 mt-auto transition-colors"
                              aria-label={`Remove ${productName} - ${variantName} from cart`}
                          >
                              <Icon name="trash" className="text-xl" />
                          </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-white space-y-4">
                <div className="flex justify-between items-center text-brand-text-secondary">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-brand-text-primary">{t('cart.total')}</span>
                    <span className="text-2xl font-bold text-brand-text-primary">{formatCurrency(total)}</span>
                </div>
                <button
                    onClick={onCheckout}
                    className="w-full bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30"
                >
                    {t('cart.checkout')}
                </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};