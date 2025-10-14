import React, { useState } from 'react';
import { Product, ProductVariant, Category, ProductStatus } from './types';
import { useI18n } from './useI18n';
import { Icon } from './Icon';
import { useSettings } from './useI18n';

interface ProductPageProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onBackToStore: () => void;
  onBuyNow: (product: Product, variant: ProductVariant) => void;
  categories: Category[];
}

const StarRating: React.FC<{ rating: number, reviewsCount: number }> = ({ rating, reviewsCount }) => {
    const { t } = useI18n();
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => <Icon key={`full-${i}`} name="star" variant="filled" className="text-xl text-yellow-400" />)}
                {/* Note: Half star icon is not available, so we'll just show full/empty for now */}
                {[...Array(emptyStars)].map((_, i) => <Icon key={`empty-${i}`} name="star" className="text-xl text-gray-300" />)}
            </div>
            <span className="font-semibold text-brand-text-primary">{rating.toFixed(1)}</span>
            <span>({reviewsCount} {t('product.reviews')})</span>
        </div>
    );
};

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
                <Icon name="rocket" className="text-base" />
                {t(`status.${status}`)}
            </span>
        );
    }
    
    // Unchanged style for out_of_stock
    if (status === 'out_of_stock') {
        return (
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300/50`}>
                <Icon name="package" className="text-base" />
                {t(`status.${status}`)}
            </span>
        );
    }
    
    return null;
}


export const ProductPage: React.FC<ProductPageProps> = ({ product, onAddToCart, onBackToStore, onBuyNow, categories }) => {
  const { t, language } = useI18n();
  const { formatCurrency } = useSettings();
  const name = t(product.nameKey);
  const [selectedVariantId, setSelectedVariantId] = useState(product.defaultVariantId);

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const hasVariants = product.variants.length > 0;
  const isAvailable = product.status === 'available';
  
  const category = categories.find(c => c.name === product.category);
  const categoryName = category ? category.displayName[language] : product.category;

  return (
    <main className="flex-grow bg-white">
      <div className="container py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-brand-text-secondary mb-8" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={onBackToStore} className="hover:text-brand-red">{t('nav.home')}</button>
            </li>
            <li className="flex items-center mx-2">/</li>
            <li className="flex items-center">
              <span className="font-medium">{categoryName}</span>
            </li>
             <li className="flex items-center mx-2">/</li>
            <li className="flex items-center text-brand-text-primary font-semibold">
              <span>{name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Product Image */}
          <div>
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg">
                <img src={product.imageUrl} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div>
            <div className="flex items-center gap-4 mb-4">
                <img src={product.logoUrl} alt={`${name} logo`} className="w-16 h-16 rounded-2xl object-contain bg-white shadow-md p-1" />
                <div className="flex-grow">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">{name}</h1>
                        <StatusBadge status={product.status} />
                    </div>
                    {product.specialTagKey && (
                      <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1 inline-block">{t(product.specialTagKey)}</span>
                    )}
                </div>
            </div>
            
            {product.rating && product.reviewsCount && (
                <div className="mb-6">
                    <StarRating rating={product.rating} reviewsCount={product.reviewsCount} />
                </div>
            )}

            <div className="border-y border-gray-200 py-6 my-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">{t('product.select_plan')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.variants.map(variant => (
                        <button 
                            key={variant.id}
                            onClick={() => setSelectedVariantId(variant.id)}
                            disabled={!isAvailable}
                            className={`p-4 rounded-xl border-2 text-start transition-all duration-200 ${
                                selectedVariantId === variant.id 
                                    ? 'border-brand-red bg-red-50 shadow-lg' 
                                    : 'border-gray-200 hover:border-brand-red hover:bg-red-50/50'
                            } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            <p className="font-bold text-brand-text-primary">{t(variant.nameKey)}</p>
                            {variant.isFreeTrial ? (
                                <p className="text-lg font-semibold text-brand-green mt-1">{t('product.free_trial')}</p>
                            ) : (
                                <p className="text-lg font-semibold text-brand-text-primary mt-1">{formatCurrency(variant.price || 0)}</p>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                    onClick={() => selectedVariant && onAddToCart(product, selectedVariant)}
                    disabled={!hasVariants || !isAvailable}
                    className="w-full flex-1 bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                    <Icon name="cart" className="text-2xl" />
                    {t('product.add_to_cart')}
                </button>
                 <button 
                    onClick={() => selectedVariant && onBuyNow(product, selectedVariant)}
                    disabled={!hasVariants || !isAvailable}
                    className="w-full flex-1 bg-brand-text-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {t('product.buy_now')}
                </button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">{t('product.key_features')}</h3>
                <ul className="space-y-3 text-brand-text-secondary">
                    {product.featuresKeys.map(key => (
                        <li key={key} className="flex items-start gap-3">
                            <Icon name="check" className="text-xl text-brand-green mt-1 flex-shrink-0" />
                            <span>{t(key)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            {product.socialProof.textKey && (
                <div className="mt-8 bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {product.socialProof.avatars.map((avatar, index) => (
                            <img key={index} src={avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
                        ))}
                    </div>
                    <p className="text-sm text-brand-text-secondary">{t(product.socialProof.textKey)}</p>
                </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
};
