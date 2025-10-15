import React, { useState } from 'react';
import { Product, GiftCard, MobileDataProvider, CustomPage, Category } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';
import { ProductCard } from './ProductCard';
import { GiftCardGallery } from './GiftCardGallery';
import { MobileDataGallery } from './MobileDataGallery';

interface ExplorePageProps {
  products: Product[];
  giftCards: GiftCard[];
  mobileDataProviders: MobileDataProvider[];
  pages: CustomPage[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onSelectGiftCard: (card: GiftCard) => void;
  onSelectMobileDataProvider: (provider: MobileDataProvider) => void;
  onNavigateToPage: (slug: string) => void;
  onNavigateToAliExpress: () => void;
  onNavigateToInternationalShopper: () => void;
  onNavigateToRequestProduct: () => void;
}

// A generic card for services, pages, etc.
const InfoCard: React.FC<{ title: string; description: string; icon: string; onClick: () => void; cta: string }> = ({ title, description, icon, onClick, cta }) => (
    <div onClick={onClick} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-red transition-all duration-300 cursor-pointer flex flex-col group">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <Icon name={icon} className="w-6 h-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-bold text-brand-text-primary">{title}</h3>
        </div>
        <p className="text-sm text-brand-text-secondary flex-grow">{description}</p>
        <div className="mt-4 text-right">
            <span className="font-semibold text-brand-red group-hover:underline">{cta} &rarr;</span>
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <section className={`py-12 ${className}`}>
        <h2 className="text-3xl font-extrabold text-brand-text-primary text-center mb-8">{title}</h2>
        {children}
    </section>
);

export const ExplorePage: React.FC<ExplorePageProps> = ({
  products,
  giftCards,
  mobileDataProviders,
  pages,
  categories,
  onSelectProduct,
  onSelectGiftCard,
  onSelectMobileDataProvider,
  onNavigateToPage,
  onNavigateToAliExpress,
  onNavigateToInternationalShopper,
  onNavigateToRequestProduct,
}) => {
    const { t, language } = useI18n();
    const { settings } = useSettings();
    const { explorePage } = settings;
    const visiblePages = pages.filter(p => p.isVisible);

    const [activeCategory, setActiveCategory] = useState('ALL');
    const filteredProducts = activeCategory === 'ALL' ? products : products.filter(p => p.category === activeCategory);

    return (
        <main className="flex-grow bg-gray-50">
            <div className="container py-10">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-brand-text-primary tracking-tight">{explorePage.title[language]}</h1>
                    <p className="text-lg text-brand-text-secondary mt-2">{explorePage.subtitle[language]}</p>
                </div>
            </div>
            
            {/* All Products Section with sticky category bar */}
            {explorePage.sections.products.enabled && products.length > 0 && (
                <>
                    <nav className="bg-white shadow-sm sticky top-20 z-10">
                        <div className="container">
                          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
                             {settings.categories.map((category) => (
                                <button 
                                    key={category.id} 
                                    onClick={() => setActiveCategory(category.name)}
                                    className={`flex flex-col items-center gap-2 pt-4 pb-3 px-2 text-sm font-medium transition-colors duration-200 shrink-0 border-b-2 whitespace-nowrap ${
                                        activeCategory === category.name 
                                        ? 'text-brand-red border-brand-red' 
                                        : 'text-brand-text-secondary border-transparent hover:text-brand-red'
                                    }`}>
                                    <Icon name={category.icon} className="text-2xl" />
                                    <span>{category.displayName[language]}</span>
                                </button>
                             ))}
                          </div>
                        </div>
                    </nav>
                    <div className="container">
                        <Section title={explorePage.sections.products.title[language]}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
                                ))}
                            </div>
                        </Section>
                    </div>
                </>
            )}
            
            {/* Services Section */}
            {explorePage.sections.services.enabled && (
                 <div className="container">
                    <Section title={explorePage.sections.services.title[language]} className="bg-white rounded-2xl my-10 p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InfoCard 
                                title={t('nav.aliexpress_shopper')}
                                description={t('aliexpress_shopper.subtitle')}
                                icon="cart"
                                onClick={onNavigateToAliExpress}
                                cta={t('explore.cta.shop_now')}
                            />
                            <InfoCard 
                                title={t('international_shopper.title')}
                                description={t('international_shopper.subtitle')}
                                icon="store"
                                onClick={onNavigateToInternationalShopper}
                                cta={t('explore.cta.get_a_quote')}
                            />
                             <InfoCard 
                                title={t('request_product.title')}
                                description={t('request_product.subtitle')}
                                icon="package"
                                onClick={onNavigateToRequestProduct}
                                cta={t('explore.cta.request')}
                            />
                        </div>
                    </Section>
                </div>
            )}

            {/* Gift Cards Section */}
            {explorePage.sections.giftCards.enabled && giftCards.length > 0 && (
                <GiftCardGallery 
                    giftCards={giftCards}
                    onSelectGiftCard={onSelectGiftCard}
                    title={explorePage.sections.giftCards.title[language]}
                    subtitle=""
                />
            )}

            {/* Mobile Data Section */}
            {explorePage.sections.mobileData.enabled && mobileDataProviders.length > 0 && (
                <MobileDataGallery 
                    providers={mobileDataProviders}
                    onSelectProvider={onSelectMobileDataProvider}
                    title={explorePage.sections.mobileData.title[language]}
                    subtitle=""
                />
            )}

            {/* Pages Section */}
             {explorePage.sections.pages.enabled && visiblePages.length > 0 && (
                <div className="container">
                    <Section title={explorePage.sections.pages.title[language]}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visiblePages.map(page => (
                                 <div key={page.id} onClick={() => onNavigateToPage(page.slug)} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-red transition-all duration-300 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <Icon name="file-search" className="w-6 h-6 text-brand-red"/>
                                        <h3 className="text-lg font-bold text-brand-text-primary">{page.title[language as keyof typeof page.title]}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            )}
        </main>
    );
};