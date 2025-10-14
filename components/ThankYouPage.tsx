import React from 'react';
import { Order, OrderStatus } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface ThankYouPageProps {
  order: Order;
  onContinueShopping: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ order, onContinueShopping }) => {
  const { t, language } = useI18n();
  const { formatCurrency, settings } = useSettings();
  const isAwaitingPayment = order.status === OrderStatus.AwaitingPayment;
  const isAliExpressRequest = order.paymentMethod === 'aliexpress_request';

  const getTitle = () => {
    if (isAliExpressRequest) return settings.services.aliexpress.thankYouTitle[language];
    if (isAwaitingPayment) return t('thankyou.awaiting_payment_title');
    return t('thankyou.title');
  };

  const getSubtitle = () => {
    if (isAliExpressRequest) {
      const contactInfo = order.shippingDetails?.phoneNumber ? `${order.customerEmail} or ${order.shippingDetails.phoneNumber}` : order.customerEmail;
      return settings.services.aliexpress.thankYouSubtitle[language]
        .replace('{{orderId}}', order.id)
        .replace('{{contactInfo}}', contactInfo);
    }
    if (isAwaitingPayment) return t('thankyou.awaiting_payment_subtitle', { email: order.customerEmail });
    return t('thankyou.subtitle', { email: order.customerEmail });
  };
  
  const getIcon = () => {
    if (isAliExpressRequest) return "chat";
    if (isAwaitingPayment) return "bell";
    return "check";
  }
  
  const getIconBgColor = () => {
    if (isAliExpressRequest) return "bg-blue-100";
    if (isAwaitingPayment) return "bg-yellow-100";
    return "bg-green-100";
  }

  const getIconColor = () => {
    if (isAliExpressRequest) return "text-blue-500";
    if (isAwaitingPayment) return "text-yellow-500";
    return "text-brand-green";
  }


  return (
    <main className="flex-grow bg-white flex items-center justify-center py-16">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${getIconBgColor()}`}>
          <Icon name={getIcon()} className={`w-12 h-12 ${getIconColor()}`} />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight mb-3">
          {getTitle()}
        </h1>
        <p className="text-brand-text-secondary text-lg mb-8">
          {getSubtitle()}
        </p>
        
        {isAwaitingPayment && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800 space-y-3 text-left mb-8">
                <h4 className="font-bold">{t('thankyou.payment_instructions')}</h4>
                <p>{t('checkout.bank_transfer_line1')}</p>
                <ul className="pl-4 list-disc list-inside bg-white p-3 rounded-md">
                    {settings.payments.bankTransfer.accountName.enabled && <li><strong>{t('checkout.bank_account_name')}:</strong> {settings.payments.bankTransfer.accountName.value}</li>}
                    {settings.payments.bankTransfer.accountNumber.enabled && <li><strong>{t('checkout.bank_account_number')}:</strong> {settings.payments.bankTransfer.accountNumber.value}</li>}
                    {settings.payments.bankTransfer.bankName.enabled && <li><strong>{t('checkout.bank_name')}:</strong> {settings.payments.bankTransfer.bankName.value}</li>}
                </ul>
                {settings.payments.bankTransfer.whatsappNumber.enabled && <p>{t('checkout.bank_transfer_line2')} <strong className="whitespace-nowrap">{settings.payments.bankTransfer.whatsappNumber.value}</strong></p>}
            </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-start my-10 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
            <div>
              <p className="text-sm text-brand-text-secondary">{t('thankyou.order_number')}</p>
              <p className="font-bold text-brand-text-primary">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary text-end">{t('admin.date')}</p>
              <p className="font-bold text-brand-text-primary">{order.date}</p>
            </div>
          </div>
          
          <h3 className="font-bold text-lg text-brand-text-primary mb-4">{t('thankyou.order_details')}</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4">
                <img src={item.logoUrl} alt={item.metadata?.isCustomOrder ? item.productNameKey : t(item.productNameKey)} className="w-12 h-12 object-contain rounded-lg border border-gray-100 p-1 flex-shrink-0 bg-white"/>
                <div className="flex-grow">
                  <p className="font-semibold text-brand-text-primary">{item.metadata?.isCustomOrder ? item.productNameKey : t(item.productNameKey)} <span className="font-normal text-sm">x{item.quantity}</span></p>
                  <p className="text-sm text-brand-text-secondary">{item.metadata?.customOrderType === 'giftCard' ? item.variantNameKey : t(item.variantNameKey)}</p>
                </div>
                <p className="font-semibold text-brand-text-primary">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          {order.shippingDetails && (
            <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="font-bold text-lg text-brand-text-primary mb-2">Shipping To</h3>
                <div className="text-sm text-brand-text-secondary">
                    <p><strong>{order.customerName}</strong></p>
                    <p>{order.shippingDetails.address}</p>
                    <p>{order.shippingDetails.city}, {order.shippingDetails.postalCode}</p>
                    <p>Phone: {order.shippingDetails.phoneNumber}</p>
                </div>
            </div>
          )}

           <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center font-bold text-xl text-brand-text-primary">
                  <span>{t('cart.total')}</span>
                  <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
        </div>

        <button
          onClick={onContinueShopping}
          className="w-full max-w-xs bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30"
        >
          {t('thankyou.continue_shopping')}
        </button>
      </div>
    </main>
  );
};