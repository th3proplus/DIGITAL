import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { Icon } from './Icon';

interface RequestProductThankYouPageProps {
  onContinueShopping: () => void;
}

export const RequestProductThankYouPage: React.FC<RequestProductThankYouPageProps> = ({ onContinueShopping }) => {
  const { t } = useI18n();

  return (
    <main className="flex-grow bg-white flex items-center justify-center py-16">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100`}>
          <Icon name="check" className={`w-12 h-12 text-brand-green`} />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight mb-3">
          {t('request_product_thank_you.title')}
        </h1>
        <p className="text-brand-text-secondary text-lg mb-8">
          {t('request_product_thank_you.subtitle')}
        </p>
        
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
