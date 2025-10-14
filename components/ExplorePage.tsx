import React from 'react';
import { Product, GiftCard, MobileDataProvider, CustomPage, Category } from '../types';
import { useI18n } from '../hooks/useI18n';
import { Icon } from './Icon';
import { ProductCard } from './ProductCard';

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
    const visiblePages = pages.filter(p => p.isVisible);

    return (
        <main className="flex-grow bg-gray-50">
            <div className="container py-10">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-brand-text-primary tracking-tight">Explore Our Catalog</h1>
                    <p className="text-lg text-brand-text-secondary mt-2">Everything we offer, all in one place.</p>
                </div>

                {/* All Products Section */}
                <Section title="All Products">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
                        ))}
                    </div>
                </Section>
                
                {/* Services Section */}
                <Section title="Special Services" className="bg-white rounded-2xl my-10 p-8 shadow-sm">
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

                {/* Gift Cards Section */}
                <Section title="Gift Cards">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                       {giftCards.map(card => (
                            <div key={card.id} onClick={() => onSelectGiftCard(card)} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-red transition-all duration-300 cursor-pointer text-center">
                                <img src={card.logoUrl} alt={card.name} className="w-full h-20 object-contain mb-3" />
                                <h3 className="font-bold text-brand-text-primary">{card.name}</h3>
                            </div>
                       ))}
                    </div>
                </Section>

                {/* Mobile Data Section */}
                <Section title="Mobile Data Providers">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                       {mobileDataProviders.map(provider => (
                             <div key={provider.id} onClick={() => onSelectMobileDataProvider(provider)} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-red transition-all duration-300 cursor-pointer text-center">
                                <img src={provider.logoUrl} alt={provider.name} className="w-full h-20 object-contain mb-3" />
                                <h3 className="font-bold text-brand-text-primary">{provider.name}</h3>
                            </div>
                       ))}
                    </div>
                </Section>

                {/* Pages Section */}
                 {visiblePages.length > 0 && (
                    <Section title="Information Pages">
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
                )}
            </div>
        </main>
    );
};