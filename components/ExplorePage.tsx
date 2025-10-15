import React from 'react';
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
  onSelectCategory: (categoryName: string) => void;
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
  onSelectCategory,
}) => {
    const { t, language } = useI18n();
    const { settings } = useSettings();
    const { explorePage } = settings;
    const visiblePages = pages.filter(p => p.isVisible);

    return (
        <main className="flex-grow bg-gray-50">
            <div className="container py-10">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-brand-text-primary tracking-tight">{explorePage.title[language]}</h1>
                    <p className="text-lg text-brand-text-secondary mt-2">{explorePage.subtitle[language]}</p>
                </div>
            </div>
            
            {/* Categories Section */}
            {explorePage.sections.categories.enabled && categories.length > 0 && (
                <div className="container pb-10">
                    <Section title={explorePage.sections.categories.title[language]}>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {categories.filter(c => c.name !== 'ALL').map(category => (
                            <div 
                                key={category.id} 
                                onClick={() => onSelectCategory(category.name)}
                                className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-red transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 aspect-square group"
                            >
                                <Icon name={category.icon} className="w-10 h-10 text-brand-red transition-transform group-hover:scale-110" />
                                <h3 className="text-sm font-bold text-brand-text-primary text-center">{category.displayName[language]}</h3>
                            </div>
                            ))}
                        </div>
                    </Section>
                </div>
            )}

            {/* All Products Section */}
            {explorePage.sections.products.enabled && products.length > 0 && (
                <div className="container">
                    <Section title={explorePage.sections.products.title[language]}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
                            ))}
                        </div>
                    </Section>
                </div>
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
                                cta="Shop Now"
                            />
                            <InfoCard 
                                title={t('international_shopper.title')}
                                description={t('international_shopper.subtitle')}
                                icon="store"
                                onClick={onNavigateToInternationalShopper}
                                cta="Get a Quote"
                            />
                             <InfoCard 
                                title={t('request_product.title')}
                                description={t('request_product.subtitle')}
                                icon="package"
                                onClick={onNavigateToRequestProduct}
                                cta="Request"
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