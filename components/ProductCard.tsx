import React from 'react';
import { Product } from '../types';
import { useI18n } from '../hooks/useI18n';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { t } = useI18n();
  const { formatCurrency } = useSettings();
  
  const handleCardClick = () => {
    if (product.status === 'available') {
      onSelectProduct(product);
    }
  };

  const name = t(product.nameKey);
  const defaultVariant = product.variants.find(v => v.id === product.defaultVariantId) || product.variants[0];
  const isAvailable = product.status === 'available';

  const isComingSoon = product.status === 'coming_soon';

  return (
    <div 
      onClick={handleCardClick}
      className={`relative rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ${isAvailable ? 'hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer' : 'cursor-not-allowed'} ${isComingSoon ? 'animate-glow' : ''}`}
      aria-label={`View details for ${name}`}
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      style={isComingSoon ? { '--glow-color': product.color } as React.CSSProperties : {}}
    >
      <div className={product.status === 'out_of_stock' ? 'grayscale' : ''}>
        {/* Background Image */}
        <div className="h-40 w-full">
          <img 
            src={product.imageUrl} 
            alt="" // Decorative image
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Content Section */}
        <div 
          className="p-4 pt-12 text-center text-white flex-grow flex flex-col justify-center" 
          style={{ backgroundColor: product.color }}
        >
          <div>
            <h3 className="text-lg font-bold truncate" title={name}>{name}</h3>
            
            <div className="mt-1 h-10">
              {defaultVariant?.isFreeTrial ? (
                  <p className="font-semibold text-lg">{t('product.free_trial')}</p>
              ) : defaultVariant?.price != null ? (
                  <p className="font-semibold text-lg">
                      {formatCurrency(defaultVariant.price)}
                      <span className="text-sm font-medium opacity-80"> {t('product.price_per_month')}</span>
                  </p>
              ) : null}
            </div>
          </div>
        </div>
        
        {/* Overlapping Logo */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white p-1 rounded-full shadow-lg">
            <img 
              src={product.logoUrl} 
              alt={`${name} logo`} 
              className="w-16 h-16 rounded-full object-contain" 
            />
          </div>
        </div>
      </div>
      
      {!isAvailable && (() => {
        if (product.status === 'coming_soon') {
          return (
            <div className="absolute top-0 right-0 h-16 w-16">
              <div className="absolute transform rotate-45 bg-amber-400 text-center text-white font-semibold py-1 right-[-34px] top-[32px] w-[170px] shadow-lg">
                <div className="flex items-center justify-center gap-1">
                  <Icon name="rocket" className="text-base" />
                  <span>{t('status.coming_soon')}</span>
                </div>
              </div>
            </div>
          );
        }

        if (product.status === 'out_of_stock') {
          return (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl p-4 text-center">
               <div className="bg-slate-800 text-white px-5 py-3 rounded-full font-bold tracking-wider uppercase text-sm shadow-lg flex items-center gap-2">
                <Icon name="package" className="text-xl opacity-70" />
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