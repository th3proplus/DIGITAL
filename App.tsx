import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, ProductVariant, Settings, OrderStatus, User, Subscriber, Campaign, CustomPage, GiftCard, MobileDataProvider, PlaceOrderDetails, DataPlan, ProductRequest, Subscription, UserPanelTab } from './types';
import { ProductCard } from './components/ProductCard';
import { Icon } from './components/Icon';
import { Cart } from './components/Cart';
import { AdminLayout } from './components/AdminLayout';
import { Footer } from './components/Footer';
import { WhyUs } from './components/WhyUs';
import { ProductPage } from './components/ProductPage';
import { AdminSettingsPage } from './components/AdminSettingsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminProductsPage } from './components/AdminProductsPage';
import { AdminOrdersPage } from './components/AdminOrdersPage';
import { AdminPagesPage } from './components/AdminPagesPage';
import { AdminEditPage } from './components/AdminEditPage';
import { AuthModal } from './components/AuthModal';
import { CheckoutPage } from './components/CheckoutPage';
import { ThankYouPage } from './components/ThankYouPage';
import { AdminAddProductPage } from './components/AdminAddProductPage';
import { AdminEditProductPage } from './components/AdminEditProductPage';
import { AdminMobileDataProvidersPage } from './components/AdminMobileDataProvidersPage';
import { AdminEditMobileDataProviderPage } from './components/AdminEditMobileDataProviderPage';
import { AdminGiftCardsPage } from './components/AdminGiftCardsPage';
import { AdminEditGiftCardPage } from './components/AdminEditGiftCardPage';
import { SearchModal } from './components/SearchModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CustomPageViewer } from './components/CustomPageViewer';
import { GiftCardGallery } from './components/GiftCardGallery';
import { GiftCardPage } from './components/GiftCardPage';
import { AliExpressPage } from './components/AliExpressPage';
import { InternationalShopperPage } from './components/InternationalShopperPage';
import { InternationalShopperPromoBanner } from './components/InternationalShopperPromoBanner';
import { MobileDataGallery } from './components/MobileDataGallery';
import { MobileDataPage } from './components/MobileDataPage';
import { RequestProductPage } from './components/RequestProductPage';
import { RequestProductThankYouPage } from './components/RequestProductThankYouPage';
import { RequestProductPromoBanner } from './components/RequestProductPromoBanner';
import { AdminMarketingPage } from './components/AdminMarketingPage';
import { AdminComposeCampaignPage } from './components/AdminComposeCampaignPage';
import { UserPanelPage } from './components/UserPanelPage';
import { ContactUsPage } from './components/ContactUsPage';
import { Toast } from './components/Toast';
import { useI18n } from './hooks/useI18n';
import type { Language } from './contexts/I18nContext';
import { SettingsContext } from './contexts/I18nContext';
import { Logo } from './components/Logo';
import { useSettings } from './hooks/useI18n';

type ActiveServiceTab = 'mobile-recharge' | 'aliexpress';

const initialProducts: Product[] = [
    { 
        id: '1', 
        nameKey: 'product_1_name',
        logoUrl: 'https://i.imgur.com/v1r8Y7k.png', 
        imageUrl: 'https://images.unsplash.com/photo-1678483789004-a8c7b8a7c2b2?q=80&w=800&auto=format&fit=crop',
        color: '#1a2a5a',
        category: 'AI', 
        status: 'available',
        specialTagKey: 'product_1_specialTag',
        rating: 4.8,
        reviewsCount: 120,
        socialProof: {
            avatars: ['https://i.pravatar.cc/40?img=1', 'https://i.pravatar.cc/40?img=2', 'https://i.pravatar.cc/40?img=3'],
            textKey: 'product_1_socialProof',
        },
        featuresKeys: [
            'product_1_feature_1',
            'product_1_feature_2',
            'product_1_feature_3',
        ],
        pageIndicator: '1/3',
        defaultVariantId: '1-1',
        variants: [
            { id: '1-1', nameKey: 'variant.1_month', price: 5.65 },
            { id: '1-2', nameKey: 'variant.3_month', price: 15.00 },
            { id: '1-3', nameKey: 'variant.12_month', price: 50.00 },
        ],
    },
    { 
        id: '2', 
        nameKey: 'product_2_name',
        logoUrl: 'https://i.imgur.com/s63lGTc.png', 
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
        color: '#105a30',
        category: 'Music', 
        status: 'available',
        rating: 4.9,
        reviewsCount: 250,
        socialProof: {
            avatars: ['https://i.pravatar.cc/40?img=4', 'https://i.pravatar.cc/40?img=5', 'https://i.pravatar.cc/40?img=6'],
            textKey: 'product_2_socialProof',
        },
        featuresKeys: [
            'product_2_feature_1',
            'product_2_feature_2',
            'product_2_feature_3',
        ],
        defaultVariantId: '2-1',
        variants: [
            { id: '2-1', nameKey: 'variant.1_month', price: 3.50 },
        ],
    },
    { 
        id: '3', 
        nameKey: 'product_3_name',
        logoUrl: 'https://i.imgur.com/v1r8Y7k.png', 
        imageUrl: 'https://images.unsplash.com/photo-1696205022839-439073180b35?q=80&w=800&auto=format&fit=crop',
        color: '#4a4a6a',
        category: 'AI',
        status: 'available',
        rating: 4.5,
        reviewsCount: 80,
        socialProof: {
            avatars: [],
            textKey: 'product_3_socialProof',
        },
        featuresKeys: [
            'product_3_feature_1',
            'product_3_feature_2',
            'product_3_feature_3',
        ],
        defaultVariantId: '3-1',
        variants: [
            { id: '3-1', nameKey: 'variant.trial', isFreeTrial: true },
        ],
    },
    { 
        id: '4', 
        nameKey: 'product_4_name',
        logoUrl: 'https://i.imgur.com/vHq1FpI.png', 
        imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop',
        color: '#002b5c',
        category: 'SVOD',
        status: 'available',
        rating: 4.7,
        reviewsCount: 180,
        socialProof: {
            avatars: ['https://i.pravatar.cc/40?img=7', 'https://i.pravatar.cc/40?img=8', 'https://i.pravatar.cc/40?img=9'],
            textKey: 'product_4_socialProof',
        },
        featuresKeys: [
            'product_4_feature_1',
            'product_4_feature_2',
            'product_4_feature_3',
        ],
        defaultVariantId: '4-1',
        variants: [
            { id: '4-1', nameKey: 'variant.1_month', price: 2.74 },
            { id: '4-2', nameKey: 'variant.12_month', price: 25.00 },
        ],
    },
    {
        id: '5',
        nameKey: 'product_5_name',
        logoUrl: 'https://i.imgur.com/uSti7S1.png',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff98c87ed85a?q=80&w=800&auto=format&fit=crop',
        color: '#0d3d6b',
        category: 'Software',
        status: 'available',
        rating: 4.9,
        reviewsCount: 310,
        socialProof: {
            avatars: ['https://i.pravatar.cc/40?img=11', 'https://i.pravatar.cc/40?img=12'],
            textKey: 'product_5_socialProof',
        },
        featuresKeys: [
            'product_5_feature_1',
            'product_5_feature_2',
            'product_5_feature_3',
        ],
        defaultVariantId: '5-2',
        variants: [
            { id: '5-1', nameKey: 'variant.1_month', price: 12.99 },
            { id: '5-2', nameKey: 'variant.12_month', price: 120.00 },
        ],
    },
    {
        id: '6',
        nameKey: 'product_6_name',
        logoUrl: 'https://i.imgur.com/3yS2d6P.png',
        imageUrl: 'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?q=80&w=800&auto=format&fit=crop',
        color: '#8a2be2',
        category: 'Learning',
        status: 'available',
        rating: 4.7,
        reviewsCount: 95,
        socialProof: {
            avatars: ['https://i.pravatar.cc/40?img=14'],
            textKey: 'product_6_socialProof',
        },
        featuresKeys: [
            'product_6_feature_1',
            'product_6_feature_2',
            'product_6_feature_3',
        ],
        defaultVariantId: '6-1',
        variants: [
            { id: '6-1', nameKey: 'variant.12_month', price: 89.99 },
        ],
    },
    {
        id: '7',
        nameKey: 'product_7_name',
        logoUrl: 'https://i.imgur.com/mZ6ZVJk.png',
        imageUrl: 'https://images.unsplash.com/photo-1506880018603-23d5b41a0206?q=80&w=800&auto=format&fit=crop',
        color: '#b24700',
        category: 'Reading',
        status: 'available',
        specialTagKey: 'product_7_specialTag',
        rating: 4.8,
        reviewsCount: 150,
        socialProof: {
            avatars: ['https://i.pravatar.cc/40?img=15', 'https://i.pravatar.cc/40?img=16'],
            textKey: 'product_7_socialProof',
        },
        featuresKeys: [
            'product_7_feature_1',
            'product_7_feature_2',
        ],
        defaultVariantId: '7-1',
        variants: [
            { id: '7-1', nameKey: 'variant.1_month', price: 9.99 },
        ],
    },
    {
        id: '8',
        nameKey: 'product_8_name',
        logoUrl: 'https://i.imgur.com/Y3j4j3j.png',
        imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
        color: '#4a154b',
        category: 'Software',
        status: 'available',
        rating: 4.6,
        reviewsCount: 220,
        socialProof: {
            avatars: ['https://i.pravatar.cc/40?img=18', 'https://i.pravatar.cc/40?img=19', 'https://i.pravatar.cc/40?img=20'],
            textKey: 'product_8_socialProof',
        },
        featuresKeys: [
            'product_8_feature_1',
            'product_8_feature_2',
            'product_8_feature_3',
        ],
        defaultVariantId: '8-1',
        variants: [
            { id: '8-1', nameKey: 'variant.1_month', price: 8.75 },
            { id: '8-2', nameKey: 'variant.12_month', price: 85.00 },
        ],
    },
];

const initialGiftCards: GiftCard[] = [
    { id: 'netflix', name: 'Netflix', logoUrl: 'https://i.imgur.com/vHq1FpI.png', galleryImageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop', pageImageUrl: 'https://images.unsplash.com/photo-1601642263916-3914a1a5b5c9?q=80&w=800&auto=format&fit=crop', denominations: [15, 25, 50], showLogoOnGallery: true, status: 'available' },
    { id: 'spotify', name: 'Spotify', logoUrl: 'https://i.imgur.com/s63lGTc.png', galleryImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop', pageImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop', denominations: [10, 30, 60], showLogoOnGallery: false, status: 'available' },
    { id: 'amazon', name: 'Amazon', logoUrl: 'https://i.imgur.com/O1hS13A.png', galleryImageUrl: 'https://images.unsplash.com/photo-1594995958332-9b04d6b637e5?q=80&w=800&auto=format&fit=crop', pageImageUrl: 'https://images.unsplash.com/photo-1572584642822-6f8de0243c93?q=80&w=800&auto=format&fit=crop', denominations: [25, 50, 100], showLogoOnGallery: true, status: 'available' },
    { id: 'steam', name: 'Steam', logoUrl: 'https://i.imgur.com/nJgRG3P.png', galleryImageUrl: 'https://images.unsplash.com/photo-1612287230202-95a04162e201?q=80&w=800&auto=format&fit=crop', pageImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=800&auto=format&fit=crop', denominations: [20, 50, 100], showLogoOnGallery: false, status: 'available' },
];

const initialMobileDataProviders: MobileDataProvider[] = [
    { 
        id: 'ooredoo', 
        name: 'Ooredoo', 
        logoUrl: 'https://i.imgur.com/gHkArsS.png', 
        galleryImageUrl: 'https://images.unsplash.com/photo-1592582236294-a1a7fe509559?q=80&w=800&auto=format&fit=crop', 
        pageImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
        showLogoOnGallery: true,
        plans: [
            { id: 'o-1', name: 'plan.2gb', dataAmount: '2 GB', price: 5, status: 'available' },
            { id: 'o-2', name: 'plan.5gb', dataAmount: '5 GB', price: 10, status: 'out_of_stock' },
            { id: 'o-3', name: 'plan.10gb', dataAmount: '10 GB', price: 18, status: 'available' },
            { id: 'o-4', name: 'plan.25gb_social', dataAmount: '25 GB (Social)', price: 25, status: 'coming_soon' },
        ] 
    },
    { 
        id: 'orange', 
        name: 'Orange', 
        logoUrl: 'https://i.imgur.com/G5O6b0s.png', 
        galleryImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop', 
        pageImageUrl: 'https://images.unsplash.com/photo-1580974928064-07b358366141?q=80&w=800&auto=format&fit=crop',
        showLogoOnGallery: false,
        plans: [
            { id: 'or-1', name: 'plan.1gb', dataAmount: '1 GB', price: 4, status: 'available' },
            { id: 'or-2', name: 'plan.4gb', dataAmount: '4 GB', price: 9, status: 'available' },
            { id: 'or-3', name: 'plan.12gb', dataAmount: '12 GB', price: 20, status: 'out_of_stock' },
            { id: 'or-4', name: 'plan.30gb_night', dataAmount: '30 GB (Night)', price: 22, status: 'available' },
        ] 
    },
    { 
        id: 'tt', 
        name: 'Tunisie Telecom', 
        logoUrl: 'https://i.imgur.com/w1pdCEV.png', 
        galleryImageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800&auto=format&fit=crop', 
        pageImageUrl: 'https://images.unsplash.com/photo-1618347346597-450ec45a25aa?q=80&w=800&auto=format&fit=crop',
        showLogoOnGallery: true,
        plans: [
            { id: 'tt-1', name: 'plan.2_5gb', dataAmount: '2.5 GB', price: 5, status: 'available' },
            { id: 'tt-2', name: 'plan.6gb', dataAmount: '6 GB', price: 11, status: 'available' },
            { id: 'tt-3', name: 'plan.15gb', dataAmount: '15 GB', price: 21, status: 'available' },
            { id: 'tt-4', name: 'plan.50gb', dataAmount: '50 GB', price: 40, status: 'coming_soon' },
        ] 
    },
];


const initialOrders: Order[] = [
    { id: 'ORD-001', customerName: 'John Doe', customerEmail: 'john.d@example.com', items: [], total: 50.00, date: '2024-07-20', status: OrderStatus.Completed, paymentMethod: 'card' },
    { id: 'ORD-002', customerName: 'Jane Smith', customerEmail: 'jane.s@example.com', items: [], total: 15.00, date: '2024-07-20', status: OrderStatus.Completed, paymentMethod: 'paypal' },
    { id: 'ORD-003', customerName: 'Mike Johnson', customerEmail: 'mike.j@example.com', items: [], total: 5.65, date: '2024-07-21', status: OrderStatus.Pending, paymentMethod: 'card' },
    { id: 'ORD-004', customerName: 'Emily Davis', customerEmail: 'emily.d@example.com', items: [], total: 25.00, date: '2024-07-21', status: OrderStatus.Failed, paymentMethod: 'card' },
    { id: 'ORD-005', customerName: 'Chris Lee', customerEmail: 'chris.l@example.com', items: [], total: 3.50, date: '2024-07-22', status: OrderStatus.Completed, paymentMethod: 'card' },
    { id: 'ORD-006', customerName: 'Sarah Wilson', customerEmail: 'sarah.w@example.com', items: [], total: 120.00, date: '2024-07-22', status: OrderStatus.Completed, paymentMethod: 'stripe' },
    { id: 'ORD-007', customerName: 'David Brown', customerEmail: 'david.b@example.com', items: [], total: 89.99, date: '2024-07-23', status: OrderStatus.Completed, paymentMethod: 'card' },
    { id: 'ORD-008', customerName: 'Laura Taylor', customerEmail: 'laura.t@example.com', items: [], total: 9.99, date: '2024-07-23', status: OrderStatus.Pending, paymentMethod: 'card' },
    { id: 'ORD-009', customerName: 'James Miller', customerEmail: 'james.m@example.com', items: [], total: 85.00, date: '2024-07-24', status: OrderStatus.Completed, paymentMethod: 'card' },
    { id: 'ORD-010', customerName: 'Olivia Martinez', customerEmail: 'olivia.m@example.com', items: [], total: 12.99, date: '2024-07-24', status: OrderStatus.Failed, paymentMethod: 'card' },
    { id: 'ORD-011', customerName: 'Daniel Anderson', customerEmail: 'daniel.a@example.com', items: [], total: 5.65, date: '2024-07-25', status: OrderStatus.Completed, paymentMethod: 'card' },
];

const initialSubscriptions: Subscription[] = [
    { id: 'sub-1', userId: '1', productId: '1', variantId: '1-2', productNameKey: 'product_1_name', variantNameKey: 'variant.3_month', logoUrl: 'https://i.imgur.com/v1r8Y7k.png', startDate: '2024-07-01', endDate: '2024-10-01', status: 'Active' },
    { id: 'sub-2', userId: '1', productId: '2', variantId: '2-1', productNameKey: 'product_2_name', variantNameKey: 'variant.1_month', logoUrl: 'https://i.imgur.com/s63lGTc.png', startDate: '2024-07-15', endDate: '2024-08-15', status: 'Active' },
    { id: 'sub-3', userId: '1', productId: '4', variantId: '4-2', productNameKey: 'product_4_name', variantNameKey: 'variant.12_month', logoUrl: 'https://i.imgur.com/vHq1FpI.png', startDate: '2023-06-20', endDate: '2024-06-20', status: 'Expired' },
];


const initialPages: CustomPage[] = [
    { id: 'page-1', slug: 'about-us', title: { en: 'About Us', fr: 'À propos de nous', ar: 'من نحن' }, content: { en: '<h3>Welcome to Our Store!</h3><p>This is the about us page content. You can edit this from the admin panel.</p>', fr: '<h3>Bienvenue dans notre boutique !</h3><p>Ceci est le contenu de la page à propos de nous. Vous pouvez le modifier depuis le panneau d\'administration.</p>', ar: '<h3>مرحباً بكم في متجرنا!</h3><p>هذا هو محتوى صفحة من نحن. يمكنك تعديل هذا من لوحة الإدارة.</p>' }, isVisible: true, showInHeader: true, showInFooter: true },
    { id: 'page-2', slug: 'privacy-policy', title: { en: 'Privacy Policy', fr: 'Politique de confidentialité', ar: 'سياسة الخصوصية' }, content: { en: 'Privacy policy content goes here.', fr: 'Le contenu de la politique de confidentialité va ici.', ar: 'محتوى سياسة الخصوصية يذهب هنا.' }, isVisible: true, showInHeader: false, showInFooter: true },
];

const Header: React.FC<{ 
    onAdminClick: () => void; 
    onCartClick: () => void;
    onSearchClick: () => void;
    cartItemCount: number; 
    isAuthenticated: boolean;
    currentUser: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    onGoHome: () => void;
    pages: CustomPage[];
    onNavigateToPage: (slug: string) => void;
    onNavigateToServices: () => void;
    onNavigateToUserPanel: () => void;
    onNavigateToSubscriptions: () => void;
    onNavigateToContact: () => void;
}> = ({ onAdminClick, onCartClick, onSearchClick, cartItemCount, isAuthenticated, currentUser, onLoginClick, onLogout, onGoHome, pages, onNavigateToPage, onNavigateToServices, onNavigateToUserPanel, onNavigateToSubscriptions, onNavigateToContact }) => {
    const { t, language, setLanguage } = useI18n();
    const { settings } = useSettings();
    const isRtl = language === 'ar';
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const staticNavItems = [
      { key: 'nav.home', label: t('nav.home'), isCustom: false, slug: '#' },
      { key: 'nav.all_services', label: t('nav.all_services'), isCustom: false, slug: '#services' },
      { key: 'nav.contact_us', label: t('nav.contact_us'), isCustom: false, slug: '#contact' },
      { key: 'nav.become_seller', label: t('nav.become_seller'), isCustom: false, slug: '#' },
      { key: 'nav.support', label: t('nav.support'), isCustom: false, slug: '#' },
      { key: 'nav.subscription', label: t('nav.subscription'), isCustom: false, slug: '#' },
    ];
    
    const pageNavItems = pages
        .filter(p => p.isVisible && p.showInHeader)
        .map(p => ({ key: p.id, label: p.title[language], isCustom: true, slug: p.slug }));

    const navItems = [...staticNavItems, ...pageNavItems];
    
    const languages: { code: Language, labelKey: string }[] = [
      { code: 'en', labelKey: 'language.english' },
      { code: 'fr', labelKey: 'language.french' },
      { code: 'ar', labelKey: 'language.arabic' },
    ];

    const flagMap: { [key in Language]: string } = {
        en: '🇬🇧',
        fr: '🇫🇷',
        ar: '🇸🇦',
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [language]);

    const LogoComponent = () => {
        if (settings.logoUrl) {
            return <img src={settings.logoUrl} alt={t('header.store_name')} className="h-10 object-contain max-w-[150px]" />;
        }
        return <Logo />;
    };
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
      if (item.isCustom) {
          e.preventDefault();
          onNavigateToPage(item.slug);
          setIsMobileMenuOpen(false);
      } else if (item.key === 'nav.home') {
          e.preventDefault();
          onGoHome();
          setIsMobileMenuOpen(false);
      } else if (item.key === 'nav.all_services') {
          e.preventDefault();
          onNavigateToServices();
          setIsMobileMenuOpen(false);
      } else if (item.key === 'nav.contact_us') {
          e.preventDefault();
          onNavigateToContact();
          setIsMobileMenuOpen(false);
      }
    };

    // --- Reusable JSX Chunks for Desktop ---

    const NavMenu = (
        <nav className="flex items-center gap-8">
            {navItems.map(item => (
                <a 
                   key={item.key} 
                   href={item.slug} 
                   onClick={(e) => handleNavClick(e, item)}
                   className={`text-base font-medium transition-colors whitespace-nowrap ${
                       item.key === 'nav.home'
                       ? 'text-brand-red' 
                       : 'text-brand-text-secondary hover:text-brand-red'
                   }`}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
    
    const ActionIcons = (
        <div className={`flex items-center gap-1 md:gap-2 flex-row-reverse`}>
            <button onClick={onAdminClick} className="ms-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-red-light transition-colors inline-flex">{t('nav.admin_panel')}</button>
            <button onClick={onCartClick} className="p-2.5 hover:bg-gray-100 rounded-full relative text-brand-text-secondary" aria-label={`Open cart with ${cartItemCount} items`}>
                <Icon name="cart" className="text-xl"/>
                {cartItemCount > 0 && (
                    <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-brand-red text-white text-xs font-bold ring-2 ring-white flex items-center justify-center">{cartItemCount}</span>
                )}
            </button>
            {isAuthenticated && currentUser ? (
                <div className="relative">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 ps-2 pe-3 py-2 hover:bg-gray-100 rounded-full">
                        <img src={`https://i.pravatar.cc/40?u=${currentUser.id}`} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                        <span className="hidden md:inline font-medium text-sm text-brand-text-secondary">{currentUser.name}</span>
                        <Icon name="chevronDown" className="text-base text-brand-text-secondary hidden md:inline"/>
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute top-full mt-2 end-0 w-48 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-100">
                            <button onClick={() => { onNavigateToUserPanel(); setIsUserMenuOpen(false); }} className="flex items-center gap-3 w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Icon name="user" className="text-base" /> {t('user_menu.my_account')}
                            </button>
                            <button onClick={() => { onNavigateToSubscriptions(); setIsUserMenuOpen(false); }} className="flex items-center gap-3 w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Icon name="products" className="text-base" /> {t('user_menu.subscriptions')}
                            </button>
                            <div className="my-1 h-px bg-gray-100"></div>
                            <button onClick={() => { onLogout(); setIsUserMenuOpen(false); }} className="flex items-center gap-3 w-full text-start px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <Icon name="logout" className="text-base" /> {t('user_menu.logout')}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={onLoginClick} className="flex items-center gap-2 ps-2 pe-3 py-2 lg:p-2.5 hover:bg-gray-100 rounded-full text-sm font-medium text-brand-text-secondary">
                    <Icon name="user" className="text-xl"/>
                    <span className="whitespace-nowrap lg:hidden">{t('nav.login_signup')}</span>
                </button>
            )}
            <div className="relative">
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full text-xl">
                    <span>{flagMap[language]}</span>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute top-full mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20 end-0">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => { setLanguage(lang.code); setIsLangMenuOpen(false); }}
                                className="flex items-center gap-3 w-full text-start px-4 py-2 text-sm text-brand-text-primary hover:bg-gray-100"
                            >
                                <span className="text-lg">{flagMap[lang.code]}</span>
                                <span>{t(lang.labelKey)}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={onSearchClick} className="p-2.5 hover:bg-gray-100 rounded-full text-brand-text-secondary"><Icon name="search" className="text-xl"/></button>
        </div>
    );

    return (
        <>
            <div className="container mx-auto px-6">
                 {/* --- Mobile & Tablet Header --- */}
                <div className="lg:hidden relative flex items-center justify-between text-brand-text-primary h-20">
                    <div className="flex-1">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2.5 hover:bg-gray-100 rounded-full text-brand-text-secondary">
                            <Icon name="menu" className="text-2xl" />
                        </button>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <button onClick={onGoHome} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red/50 rounded-lg" aria-label="Go to homepage">
                            <LogoComponent />
                        </button>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <div className="flex items-center gap-1 md:gap-2">
                            <button onClick={onSearchClick} className="p-2.5 hover:bg-gray-100 rounded-full text-brand-text-secondary"><Icon name="search" className="text-xl"/></button>
                            <button onClick={onCartClick} className="p-2.5 hover:bg-gray-100 rounded-full relative text-brand-text-secondary" aria-label={`Open cart with ${cartItemCount} items`}>
                                <Icon name="cart" className="text-xl"/>
                                {cartItemCount > 0 && (
                                    <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-brand-red text-white text-xs font-bold ring-2 ring-white flex items-center justify-center">{cartItemCount}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>


                {/* --- Desktop Header --- */}
                <div className="hidden lg:relative lg:flex items-center justify-between h-20">
                    {/* Left Side: Logo */}
                    <div className="flex-shrink-0">
                        <button onClick={onGoHome} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red/50 rounded-lg" aria-label="Go to homepage">
                            <LogoComponent />
                        </button>
                    </div>

                    {/* Center: Nav Menu */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {NavMenu}
                    </div>

                    {/* Right Side: Actions */}
                    {ActionIcons}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 h-full w-full max-w-xs bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isRtl ? (isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full') : (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')} ${isRtl ? 'right-0' : 'left-0'}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b">
                         <div onClick={onGoHome} className="cursor-pointer">
                            <LogoComponent />
                         </div>
                         <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-800">
                            <Icon name="close" className="text-2xl" />
                         </button>
                    </div>
                    <nav className="flex-grow p-6 space-y-4">
                        {navItems.map((item) => (
                             <a 
                               key={item.key} 
                               href={item.slug} 
                               onClick={(e) => handleNavClick(e, item)}
                               className={`block text-lg font-medium transition-colors ${
                                   item.key === 'nav.home'
                                   ? 'text-brand-red' 
                                   : 'text-brand-text-secondary hover:text-brand-red'
                               }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                    <div className="p-6 border-t bg-gray-50">
                        {/* Language switcher in mobile menu */}
                        <div className="mb-6">
                             <p className="font-semibold text-gray-500 text-sm mb-2 px-3">{t('footer.language')}</p>
                             <div className="flex flex-col items-start gap-1">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setLanguage(lang.code); }}
                                        className={`flex items-center gap-3 w-full text-start px-3 py-2 rounded-md font-medium text-brand-text-secondary ${language === lang.code ? 'bg-red-100 text-brand-red' : 'hover:bg-gray-200'}`}
                                    >
                                        <span className="text-lg">{flagMap[lang.code]}</span>
                                        <span>{t(lang.labelKey)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* User actions in mobile menu */}
                        {isAuthenticated && currentUser ? (
                             <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <img src={`https://i.pravatar.cc/40?u=${currentUser.id}`} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-sm">{currentUser.name}</p>
                                        <button onClick={() => { onNavigateToUserPanel(); setIsMobileMenuOpen(false); }} className="text-xs text-gray-500 hover:underline">{t('user_menu.my_account')}</button>
                                    </div>
                                </div>
                                <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="text-red-600 p-2 rounded-md hover:bg-red-50">
                                    <Icon name="logout" className="text-xl"/>
                                </button>
                             </div>
                        ) : (
                            <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full text-center bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-brand-red-light transition-colors">
                                {t('nav.login_signup')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const AliExpressPromoBanner: React.FC<{ onLearnMore: () => void }> = ({ onLearnMore }) => {
    const { language } = useI18n();
    const { settings } = useSettings();
    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <img src="https://i.imgur.com/24H2s2t.png" alt="AliExpress Logo" className="w-12 h-12" />
                        <div>
                            <h3 className="font-bold text-lg text-brand-text-primary">{settings.homePage.aliexpressPromo.title[language]}</h3>
                            <p className="text-sm text-brand-text-secondary">{settings.homePage.aliexpressPromo.subtitle[language]}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLearnMore}
                        className="bg-brand-red text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                    >
                        {settings.homePage.aliexpressPromo.cta[language]}
                    </button>
                </div>
            </div>
        </div>
    );
};


const StoreFront: React.FC<{ products: Product[]; onSelectProduct: (product: Product) => void; }> = ({ products, onSelectProduct }) => {
    return (
      <main className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                  <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
              ))}
          </div>
      </main>
    );
};

const WhatsappSupportButton: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
  const { language } = useI18n();
  const isRtl = language === 'ar';

  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  if (!cleanPhoneNumber) {
    return null;
  }
  
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;
  
  const positionClass = isRtl ? 'left-6' : 'right-6';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${positionClass} z-30 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#1EBE57] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-subtle-pulse`}
      aria-label="Contact us on WhatsApp"
    >
      <Icon name="whatsapp" className="text-5xl" />
    </a>
  );
};

type ViewState = 'store' | 'admin' | 'product' | 'checkout' | 'thankyou' | 'page' | 'giftCard' | 'aliexpress' | 'mobileData' | 'requestProduct' | 'requestProductThankYou' | 'internationalShopper' | 'userPanel' | 'contact';
type AdminView = 'dashboard' | 'products' | 'orders' | 'settings' | 'addProduct' | 'editProduct' | 'pages' | 'addPage' | 'editPage' | 'mobileDataProviders' | 'addMobileDataProvider' | 'editMobileDataProvider' | 'giftCards' | 'addGiftCard' | 'editGiftCard' | 'marketing' | 'composeCampaign' | 'contactPage';


function App() {
  const [view, setView] = useState<ViewState>('store');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [selectedMobileDataProvider, setSelectedMobileDataProvider] = useState<MobileDataProvider | null>(null);
  const [currentPageSlug, setCurrentPageSlug] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [giftCards, setGiftCards] = useState<GiftCard[]>(initialGiftCards);
  const [mobileDataProviders, setMobileDataProviders] = useState<MobileDataProvider[]>(initialMobileDataProviders);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [pages, setPages] = useState<CustomPage[]>(initialPages);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([]);

  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [editingMobileDataProvider, setEditingMobileDataProvider] = useState<MobileDataProvider | null>(null);
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCard | null>(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  
  const [isConfirmDeletePageModalOpen, setIsConfirmDeletePageModalOpen] = useState(false);
  const [pageToDeleteId, setPageToDeleteId] = useState<string | null>(null);

  const [isConfirmDeleteMobileDataProviderModalOpen, setIsConfirmDeleteMobileDataProviderModalOpen] = useState(false);
  const [mobileDataProviderToDeleteId, setMobileDataProviderToDeleteId] = useState<string | null>(null);
  
  const [isConfirmDeleteGiftCardModalOpen, setIsConfirmDeleteGiftCardModalOpen] = useState(false);
  const [giftCardToDeleteId, setGiftCardToDeleteId] = useState<string | null>(null);
  
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alex Turner', email: 'admin@nexus.store', password: 'password123' },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAuthenticated = !!currentUser;

  const [initialUserPanelTab, setInitialUserPanelTab] = useState<UserPanelTab>('dashboard');
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { t, language } = useI18n();
  
  const [settings, setSettings] = useState<Settings>({
    storeName: 'Nexus Digital Store',
    storeDescription: 'Your one-stop shop for the best digital products and subscriptions.',
    contactEmail: 'support@jarya.tn',
    supportWhatsappNumber: '+15551234567',
    supportTelegramUsername: 'nexus_support',
    currency: 'TND',
    logoUrl: '',
    themeColor: '#F85757',
    adminUsername: 'admin@nexus.store',
    categories: [
      { id: 'cat-1', name: 'ALL', icon: 'grid', displayName: { en: 'ALL', fr: 'TOUS', ar: 'الكل' } },
      { id: 'cat-2', name: 'SVOD', icon: 'video', displayName: { en: 'SVOD', fr: 'SVOD', ar: 'فيديو حسب الطلب' } },
      { id: 'cat-3', name: 'Music', icon: 'music', displayName: { en: 'Music', fr: 'Musique', ar: 'موسيقى' } },
      { id: 'cat-4', name: 'AI', icon: 'ai', displayName: { en: 'AI', fr: 'IA', ar: 'ذكاء اصطناعي' } },
      { id: 'cat-5', name: 'Software', icon: 'code', displayName: { en: 'Software', fr: 'Logiciel', ar: 'برامج' } },
      { id: 'cat-6', name: 'Discover AI', icon: 'search', displayName: { en: 'Discover AI', fr: 'Découvrir l\'IA', ar: 'اكتشف الذكاء الاصطناعي' } },
      { id: 'cat-7', name: 'Reading', icon: 'book', displayName: { en: 'Reading', fr: 'Lecture', ar: 'قراءة' } },
      { id: 'cat-8', name: 'Learning', icon: 'edit', displayName: { en: 'Learning', fr: 'Apprentissage', ar: 'تعلم' } },
      { id: 'cat-9', name: 'New', icon: 'sparkles', displayName: { en: 'New', fr: 'Nouveau', ar: 'جديد' } },
      { id: 'cat-10', name: 'Marketplace', icon: 'cart', displayName: { en: 'Marketplace', fr: 'Marché', ar: 'المتجر' } },
    ],
    homePage: {
      hero: {
        title: {
          en: 'Shared premium subscription with lower price on GamsGo',
          fr: 'Abonnement premium partagé à prix réduit sur GamsGo',
          ar: 'اشتراك بريميوم مشترك بسعر أقل على GamsGo'
        },
        subtitle: {
          en: 'Providing high-quality, affordable streaming for 6 years',
          fr: 'Fournir un streaming de haute qualité et abordable depuis 6 ans',
          ar: 'توفير بث عالي الجودة وبأسعار معقولة لمدة 6 سنوات'
        }
      },
      whyUs: {
        titlePart1: { en: 'Why', fr: 'Pourquoi', ar: 'لماذا يستخدم' },
        titleHighlight: { en: 'more and more', fr: 'de plus en plus', ar: 'المزيد والمزيد' },
        titlePart2: { en: 'people use GamsGo?', fr: 'de gens utilisent GamsGo ?', ar: 'من الناس GamsGo؟' },
        features: [
          { icon: 'check', title: { en: 'REAL-TIME DELIVERY', fr: 'LIVRAISON EN TEMPS RÉEL', ar: 'توصيل فوري' }, description: { en: 'Real-time delivery after payment without waiting, fast arrival to dispel your worries.', fr: 'Livraison en temps réel après paiement sans attente, arrivée rapide pour dissiper vos soucis.', ar: 'توصيل فوري بعد الدفع دون انتظار، وصول سريع لتبديد مخاوفك.' } },
          { icon: 'passkey', title: { en: 'QUICK RESET PASSKEY', fr: 'CLÉ D\'ACCÈS À RÉINITIALISATION RAPIDE', ar: 'إعادة تعيين مفتاح المرور بسرعة' }, description: { en: 'Click reset passkey on the subscription page without waiting and manual operation.', fr: 'Cliquez sur réinitialiser la clé d\'accès sur la page d\'abonnement sans attente ni opération manuelle.', ar: 'انقر على إعادة تعيين مفتاح المرور في صفحة الاشتراك دون انتظار وعملية يدوية.' } },
          { icon: 'shield', title: { en: 'SSL CERTIFICATE', fr: 'CERTIFICAT SSL', ar: 'شهادة SSL' }, description: { en: 'Payments take place in a secure environment with an SSL security certificate.', fr: 'Les paiements s\'effectuent dans un environnement sécurisé avec un certificat de sécurité SSL.', ar: 'تتم عمليات الدفع في بيئة آمنة مع شهادة أمان SSL.' } },
          { icon: 'headset', title: { en: '24/7 LIVE SUPPORT', fr: 'SUPPORT EN DIRECT 24/7', ar: 'دعم مباشر 24/7' }, description: { en: 'GamsGo provides 24/7 online private customer service, help you have a good experience.', fr: 'GamsGo fournit un service client privé en ligne 24/7, pour vous aider à avoir une bonne expérience.', ar: 'يوفر GamsGo خدمة عملاء خاصة عبر الإنترنت على مدار الساعة طوال أيام الأسبوع، لمساعدتك في الحصول على تجربة جيدة.' } },
          { icon: 'handshake', title: { en: 'AFFORDABLE PREMIUM', fr: 'PREMIUM ABORDABLE', ar: 'بريميوم بأسعار معقولة' }, description: { en: 'Get premium subscription at lower price.', fr: 'Obtenez un abonnement premium à un prix inférieur.', ar: 'احصل على اشتراك بريميوم بسعر أقل.' } },
          { icon: 'refund-heart', title: { en: 'REFUND GUARANTEE', fr: 'GARANTIE DE REMBOURSEMENT', ar: 'ضمان استرداد الأموال' }, description: { en: 'We offer buyer protection, with refunds available within 24 hours.', fr: 'Nous offrons une protection à l\'acheteur, avec des remboursements disponibles dans les 24 heures.', ar: 'نحن نقدم حماية للمشتري، مع توفر المبالغ المستردة في غضون 24 ساعة.' }, link: { en: 'Refund Policy >', fr: 'Politique de remboursement >', ar: 'سياسة الاسترداد >' } },
        ]
      },
      aliexpressPromo: {
        title: {
          en: 'Shop from AliExpress, Pay Locally!',
          fr: 'Achetez sur AliExpress, Payez Localement !',
          ar: 'تسوق من AliExpress، وادفع محلياً!'
        },
        subtitle: {
          en: 'We buy for you from any international site.',
          fr: 'Nous achetons pour vous sur n\'importe quel site international.',
          ar: 'نشتري لك من أي موقع عالمي.'
        },
        cta: {
          en: 'Learn More',
          fr: 'En savoir plus',
          ar: 'اعرف المزيد'
        }
      },
      internationalShopperPromo: {
        title: { en: 'Shop from Any Store Worldwide', fr: 'Achetez dans n\'importe quelle boutique du monde', ar: 'تسوق من أي متجر في جميع أنحاء العالم' },
        subtitle: { en: 'We buy and ship physical products from Amazon, eBay, and more directly to you.', fr: 'Nous achetons et expédions des produits physiques depuis Amazon, eBay, et plus directement à vous.', ar: 'نشتري ونشحن المنتجات المادية من أمازون وإيباي والمزيد مباشرة إليك.' },
        cta: { en: 'Get a Quote', fr: 'Obtenir un devis', ar: 'احصل على عرض سعر' }
      },
      requestProductPromo: {
        title: {
          en: "Can't find what you're looking for?",
          fr: 'Vous ne trouvez pas ce que vous cherchez ?',
          ar: 'لا تجد ما تبحث عنه؟'
        },
        subtitle: {
          en: 'Let us know which product you wish to see in our store.',
          fr: 'Faites-nous savoir quel produit vous souhaitez voir dans notre boutique.',
          ar: 'أخبرنا بالمنتج الذي تود رؤيته في متجرنا.'
        },
        cta: {
          en: 'Request a Product',
          fr: 'Demander un produit',
          ar: 'اطلب منتج'
        }
      },
      mobileDataPromo: {
        title: {
          en: 'Top-Up Your Mobile Data',
          fr: 'Rechargez vos données mobiles',
          ar: 'اشحن بيانات هاتفك المحمول'
        },
        subtitle: {
          en: 'Get fast and reliable internet packs from your favorite operators.',
          fr: 'Obtenez des forfaits Internet rapides et fiables de vos opérateurs préférés.',
          ar: 'احصل على باقات إنترنت سريعة وموثوقة من مشغليك المفضلين.'
        }
      },
      giftCardPromo: {
        title: {
          en: 'Explore Our Gift Cards',
          fr: 'Découvrez nos cartes-cadeaux',
          ar: 'اكتشف بطاقات الهدايا لدينا'
        },
        subtitle: {
          en: 'The perfect gift for any occasion, delivered instantly.',
          fr: 'Le cadeau parfait pour toute occasion, livré instantanément.',
          ar: 'الهدية المثالية لأي مناسبة، تسلم على الفور.'
        }
      },
      footerNewsletter: {
        title: {
          en: 'Join Our Digital Universe',
          fr: 'Rejoignez notre univers numérique',
          ar: 'انضم إلى عالمنا الرقمي'
        },
        subtitle: {
          en: 'Get the latest deals, new products, and promotions straight to your inbox.',
          fr: 'Recevez les dernières offres, les nouveaux produits et les promotions directement dans votre boîte de réception.',
          ar: 'احصل على أحدث العروض والمنتجات الجديدة والعروض الترويجية مباشرة في بريدك الوارد.'
        },
        placeholder: {
          en: 'Enter your email address',
          fr: 'Entrez votre adresse e-mail',
          ar: 'أدخل عنوان بريدك الإلكتروني'
        },
        buttonText: {
          en: 'Subscribe',
          fr: 'S\'abonner',
          ar: 'اشتراك'
        }
      },
      componentsOrder: [
        'mobileData',
        'giftCards',
        'requestProductPromo',
        'internationalShopperPromo',
        'aliexpressPromo',
        'whyUs'
      ]
    },
    contactPage: {
      title: {
        en: 'Get In Touch',
        fr: 'Prenez contact',
        ar: 'تواصل معنا',
      },
      subtitle: {
        en: "Have questions or feedback? We'd love to hear from you. Reach out to us through any of the channels below.",
        fr: 'Avez-vous des questions ou des commentaires ? Nous aimerions avoir de vos nouvelles. Contactez-nous via l\'un des canaux ci-dessous.',
        ar: 'هل لديك أسئلة أو ملاحظات؟ نود أن نسمع منك. تواصل معنا عبر أي من القنوات أدناه.',
      },
      formTitle: {
        en: 'Send Us a Message',
        fr: 'Envoyez-nous un message',
        ar: 'أرسل لنا رسالة',
      },
      whatsappTitle: {
        en: 'Chat on WhatsApp',
        fr: 'Discuter sur WhatsApp',
        ar: 'الدردشة على WhatsApp',
      },
      whatsappSubtitle: {
        en: 'Need a quick answer? Chat with us live on WhatsApp for immediate support.',
        fr: 'Besoin d\'une réponse rapide ? Discutez avec nous en direct sur WhatsApp pour une assistance immédiate.',
        ar: 'هل تحتاج إلى إجابة سريعة؟ تحدث معنا مباشرة على WhatsApp للحصول على دعم فوري.',
      },
      whatsappCta: {
        en: 'Start Chat',
        fr: 'Commencer la discussion',
        ar: 'ابدأ الدردشة',
      },
      telegramTitle: {
        en: 'Chat on Telegram',
        fr: 'Discuter sur Telegram',
        ar: 'الدردشة على Telegram',
      },
      telegramSubtitle: {
        en: 'Prefer Telegram? Message us for quick assistance and support.',
        fr: 'Vous préférez Telegram ? Envoyez-nous un message pour une assistance rapide.',
        ar: 'هل تفضل تيليجرام؟ راسلنا للحصول على مساعدة ودعم سريع.',
      },
      telegramCta: {
        en: 'Open Telegram',
        fr: 'Ouvrir Telegram',
        ar: 'افتح تيليجرام',
      },
      socialTitle: {
        en: 'Follow Us',
        fr: 'Suivez-nous',
        ar: 'تابعنا',
      },
      socialLinks: [
        { name: 'facebook', href: '#' },
        { name: 'telegram', href: '#' },
        { name: 'tiktok', href: '#' },
        { name: 'youtube', href: '#' },
        { name: 'twitter-x', href: '#' },
      ],
      formLabels: {
        name: {
          en: 'Full Name',
          fr: 'Nom complet',
          ar: 'الاسم الكامل',
        },
        email: {
          en: 'Email Address',
          fr: 'Adresse e-mail',
          ar: 'البريد الإلكتروني',
        },
        message: {
          en: 'Your Message',
          fr: 'Votre message',
          ar: 'رسالتك',
        },
        sendButtonText: {
          en: 'Send Message',
          fr: 'Envoyer le message',
          ar: 'إرسال الرسالة',
        },
      },
      formSuccessMessage: {
        en: "Your message has been sent successfully! We'll get back to you shortly.",
        fr: "Votre message a été envoyé avec succès ! Nous vous répondrons sous peu.",
        ar: "تم إرسال رسالتك بنجاح! سوف نرد عليك قريبا.",
      },
    },
    footer: {
      staticLinks: [
        { key: 'nav.home', slug: '#' },
        { key: 'nav.subscription', slug: '#' },
        { key: 'footer.blog', slug: '#' },
        { key: 'nav.support', slug: '#' },
        { key: 'footer.contact.us', slug: '#' },
      ],
      socialLinks: [
        { name: 'facebook', href: '#' },
        { name: 'telegram', href: '#' },
        { name: 'tiktok', href: '#' },
        { name: 'youtube', href: '#' },
        { name: 'twitter-x', href: '#' },
      ],
      copyrightText: {
        en: '© 2025 NEXUS. All Rights Reserved.',
        fr: '© 2025 NEXUS. Tous droits réservés.',
        ar: '© 2025 NEXUS. جميع الحقوق محفوظة.',
      },
      subfooterLinks: [
        { key: 'footer.terms_of_service', slug: '#' },
        { key: 'footer.privacy_policy', slug: '#' },
      ]
    },
    services: {
      aliexpress: {
        checkoutTitle: {
          en: 'Confirm Your AliExpress Request',
          fr: 'Confirmez Votre Demande AliExpress',
          ar: 'تأكيد طلب AliExpress الخاص بك'
        },
        checkoutSubtitle: {
          en: 'Please provide your details below. We will contact you to finalize the order.',
          fr: 'Veuillez fournir vos coordonnées ci-dessous. Nous vous contacterons pour finaliser la commande.',
          ar: 'يرجى تقديم التفاصيل الخاصة بك أدناه. سنتصل بك لإنهاء الطلب.'
        },
        checkoutNextSteps: {
          en: '<strong>Next Steps:</strong> After submitting, our team will review your request and contact you via WhatsApp or Email to confirm the final details and arrange for local payment.',
          fr: '<strong>Prochaines Étapes :</strong> Après soumission, notre équipe examinera votre demande et vous contactera par WhatsApp ou par e-mail pour confirmer les détails finaux et organiser le paiement local.',
          ar: '<strong>الخطوات التالية:</strong> بعد الإرسال، سيقوم فريقنا بمراجعة طلبك والاتصال بك عبر WhatsApp أو البريد الإلكتروني لتأكيد التفاصيل النهائية وترتيب الدفع المحلي.'
        },
        thankYouTitle: {
          en: 'Request Received!',
          fr: 'Demande Reçue !',
          ar: 'تم استلام الطلب!'
        },
        thankYouSubtitle: {
          en: "We've received your request for order {{orderId}}. Our team will contact you at {{contactInfo}} shortly to finalize the details.",
          fr: "Nous avons reçu votre demande pour la commande {{orderId}}. Notre équipe vous contactera à {{contactInfo}} sous peu pour finaliser les détails.",
          ar: "لقد تلقينا طلبك رقم {{orderId}}. سيتصل بك فريقنا على {{contactInfo}} قريبًا لوضع اللمسات الأخيرة على التفاصيل."
        }
      },
      internationalShopper: {
        checkoutTitle: { en: 'Confirm Your International Order', fr: 'Confirmez votre commande internationale', ar: 'تأكيد طلبك الدولي' },
        checkoutSubtitle: { en: 'Provide your shipping details. We will contact you to finalize the payment.', fr: 'Fournissez vos détails d\'expédition. Nous vous contacterons pour finaliser le paiement.', ar: 'قدم تفاصيل الشحن الخاصة بك. سوف نتصل بك لإنهاء الدفع.' },
        checkoutNextSteps: { en: '<strong>Next Steps:</strong> Our team will contact you to confirm the final cost, including shipping and customs, and arrange for local payment.', fr: '<strong>Prochaines Étapes :</strong> Notre équipe vous contactera pour confirmer le coût final, y compris l\'expédition et les douanes, et organiser le paiement local.', ar: '<strong>الخطوات التالية:</strong> سيتصل بك فريقنا لتأكيد التكلفة النهائية، بما في ذلك الشحن والجمارك، وترتيب الدفع المحلي.' },
        thankYouTitle: { en: 'Request Received!', fr: 'Demande Reçue !', ar: 'تم استلام الطلب!' },
        thankYouSubtitle: { en: 'We will review your request for order {{orderId}} and contact you at {{contactInfo}} with a final quote.', fr: 'Nous examinerons votre demande pour la commande {{orderId}} et vous contacteros à {{contactInfo}} avec un devis final.', ar: 'سنراجع طلبك رقم {{orderId}} ونتصل بك على {{contactInfo}} مع عرض أسعار نهائي.' },
        noteTitle: { en: 'Please Note', fr: 'Veuillez noter', ar: 'يرجى ملاحظة' },
        noteBody: { en: 'This service is for physical products only. After you submit, we will provide a final quote including product cost, international shipping, customs, and our service fee. We\'ll contact you to confirm before any payment is required.', fr: 'Ce service est uniquement pour les produits physiques. Après votre soumission, nous vous fournirons un devis final incluant le coût du produit, la livraison internationale, les douanes et nos frais de service. Nous vous contacterons pour confirmer avant tout paiement.', ar: 'هذه الخدمة مخصصة للمنتجات المادية فقط. بعد تقديم طلبك، سنوفر لك عرض سعر نهائي يشمل تكلفة المنتج، الشحن الدولي، الجمارك، ورسوم خدمتنا. سنتواصل معك للتأكيد قبل طلب أي دفعة.' }
      },
      requestProduct: {
        fields: [
          { id: 'productName', type: 'text', label: { en: 'Product Name', fr: 'Nom du produit', ar: 'اسم المنتج' }, placeholder: { en: 'e.g., Adobe Photoshop', fr: 'ex: Adobe Photoshop', ar: 'مثال: Adobe Photoshop' }, enabled: true, required: true, isDefault: true },
          { id: 'category', type: 'text', label: { en: 'Product Category/Type', fr: 'Catégorie/Type de produit', ar: 'فئة/نوع المنتج' }, placeholder: { en: 'e.g., Software, Subscription', fr: 'ex: Logiciel, Abonnement', ar: 'مثال: برامج, اشتراك' }, enabled: true, required: true, isDefault: true },
          { id: 'link', type: 'url', label: { en: 'Product Link (Optional)', fr: 'Lien vers le produit (Optionnel)', ar: 'رابط المنتج (اختياري)' }, placeholder: { en: 'https://example.com/product', fr: 'https://example.com/product', ar: 'https://example.com/product' }, enabled: true, required: false, isDefault: true },
          { id: 'description', type: 'textarea', label: { en: 'Why do you want this product?', fr: 'Pourquoi voulez-vous ce produit ?', ar: 'لماذا تريد هذا المنتج؟' }, placeholder: { en: 'I need this for my design work...', fr: 'J\'ai besoin de ceci pour mon travail de conception...', ar: 'أحتاج هذا لعملي في التصميم...' }, enabled: true, required: true, isDefault: true },
          { id: 'userName', type: 'text', label: { en: 'Your Name', fr: 'Votre nom', ar: 'اسمك' }, placeholder: { en: 'John Doe', fr: 'John Doe', ar: 'جون دو' }, enabled: true, required: true, isDefault: true },
          { id: 'userEmail', type: 'email', label: { en: 'Your Email', fr: 'Votre e-mail', ar: 'بريدك الإلكتروني' }, placeholder: { en: 'you@example.com', fr: 'vous@example.com', ar: 'you@example.com' }, enabled: true, required: true, isDefault: true },
        ]
      },
    },
    payments: {
      stripe: { enabled: true, apiKey: '' },
      paypal: { enabled: false, clientId: '' },
      binance: { enabled: true, apiKey: '', secretKey: '' },
      bankTransfer: { 
          enabled: true,
          name: { value: 'Bank Transfer', enabled: true },
          accountName: { value: 'NEXUS DIGITAL SARL', enabled: true },
          accountNumber: { value: 'TN59 0100 5031 0012 3456 789', enabled: true },
          bankName: { value: 'International Bank of Tunis', enabled: true },
          whatsappNumber: { value: '+216 22 123 456', enabled: true }
      },
      click2pay: { enabled: false, apiKey: '' },
    },
    accessControl: {
        requireLoginToCheckout: false,
        googleLogin: { enabled: true, clientId: '' },
        facebookLogin: { enabled: true, appId: '' },
    },
    marketing: {
      facebookPixelId: '',
      googleAnalyticsId: '',
      mailchimp: { enabled: false, apiKey: '', listId: '' },
      sendgrid: { enabled: false, apiKey: '' },
    },
    advanced: {
      developerMode: false,
      customCss: '',
      customJs: '',
    }
  });

  const [activeCategory, setActiveCategory] = useState(settings.categories[0]?.name || 'ALL');

  const navigateTo = (newView: ViewState, scrollToTop = true) => {
    setView(newView);
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (!settings.categories.some(c => c.name === activeCategory)) {
      setActiveCategory(settings.categories[0]?.name || 'ALL');
    }
  }, [settings.categories, activeCategory]);


  const formatCurrency = (amount: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: settings.currency,
        ...options,
    }).format(amount);
  };

  const filteredProducts = activeCategory === 'ALL' ? products : products.filter(p => p.category === activeCategory);

  const searchResults = searchQuery
    ? products.filter(p => t(p.nameKey).toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
    
  const handleSelectProductFromSearch = (product: Product) => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
    handleSelectProduct(product);
  };

  const handleLogin = (email: string, password: string):boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };
  
  const handleSignup = (name: string, email: string, password: string):boolean => {
      if (users.some(u => u.email === email)) {
        return false; // User already exists
      }
      const newUser: User = { id: String(users.length + 1), name, email, password };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      return true;
  }

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, ...updatedData };
      
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);

      setToast({ message: t('user_panel.profile_updated_success'), type: 'success' });
  };

  const proceedToCheckout = () => {
    if (settings.accessControl.requireLoginToCheckout && !isAuthenticated) {
        setIsAuthModalOpen(true);
    } else {
        navigateTo('checkout');
    }
  };

  const handleAddItemToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
        if (newItem.metadata?.isCustomOrder) {
            return [...prevItems, newItem];
        }
        const existingItem = prevItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId);
        if (existingItem) {
            return prevItems.map(item =>
                item.productId === newItem.productId && item.variantId === newItem.variantId
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
            );
        }
        return [...prevItems, newItem];
    });
    setIsCartOpen(true);
  };

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    const newItem: CartItem = {
        productId: product.id,
        variantId: variant.id,
        quantity: 1,
        productNameKey: product.nameKey,
        variantNameKey: variant.nameKey,
        logoUrl: product.logoUrl,
        price: variant.price || 0,
        isFreeTrial: variant.isFreeTrial || false,
    };
    handleAddItemToCart(newItem);
  };
  
  const handleBuyNow = (product: Product, variant: ProductVariant) => {
    const newItem: CartItem = {
        productId: product.id,
        variantId: variant.id,
        quantity: 1,
        productNameKey: product.nameKey,
        variantNameKey: variant.nameKey,
        logoUrl: product.logoUrl,
        price: variant.price || 0,
        isFreeTrial: variant.isFreeTrial || false,
    };
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId);
      if (existingItem) return prevItems;
      return [...prevItems, newItem];
    });
    proceedToCheckout();
  };
  
  const handleGiftCardAddToCart = (card: GiftCard, amount: number) => {
    const newItem: CartItem = {
        productId: `giftcard-${card.id}`,
        variantId: `amount-${amount}`,
        quantity: 1,
        productNameKey: card.name,
        variantNameKey: formatCurrency(amount),
        logoUrl: card.logoUrl,
        price: amount,
        isFreeTrial: false,
        metadata: {
            isCustomOrder: true,
            customOrderType: 'giftCard',
            giftCardBrand: card.name,
            denomination: amount,
        },
    };
    handleAddItemToCart(newItem);
  };

  const handleGiftCardBuyNow = (card: GiftCard, amount: number) => {
      const newItem: CartItem = {
          productId: `giftcard-${card.id}`,
          variantId: `amount-${amount}`,
          quantity: 1,
          productNameKey: card.name,
          variantNameKey: formatCurrency(amount),
          logoUrl: card.logoUrl,
          price: amount,
          isFreeTrial: false,
          metadata: {
              isCustomOrder: true,
              customOrderType: 'giftCard',
              giftCardBrand: card.name,
              denomination: amount,
          },
      };
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId);
        if (existingItem) return prevItems;
        return [...prevItems, newItem];
      });
      proceedToCheckout();
  };

  const handleMobileDataAddToCart = (newItem: CartItem) => {
    handleAddItemToCart(newItem);
  };

  const handleMobileDataBuyNow = (newItem: CartItem) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => 
            item.productId === newItem.productId && 
            item.variantId === newItem.variantId && 
            item.metadata?.phoneNumber === newItem.metadata?.phoneNumber
        );
        if (existingItem) return prevItems;
        return [...prevItems, newItem];
    });
    proceedToCheckout();
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('product');
  };

  const handleSelectGiftCard = (card: GiftCard) => {
    setSelectedGiftCard(card);
    navigateTo('giftCard');
  };
  
  const handleSelectMobileDataProvider = (provider: MobileDataProvider) => {
    setSelectedMobileDataProvider(provider);
    navigateTo('mobileData');
  };

  const handleBackToStore = () => {
    setSelectedProduct(null);
    setCurrentPageSlug(null);
    setSelectedGiftCard(null);
    setSelectedMobileDataProvider(null);
    navigateTo('store');
  };
  
  const handleIncrementCartItem = (productId: string, variantId: string) => {
    setCartItems(prevItems => {
        return prevItems.map(item =>
            item.productId === productId && item.variantId === variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
    });
  };

  const handleDecrementCartItem = (productId: string, variantId: string) => {
    setCartItems(prevItems => 
        prevItems.map(item => 
            item.productId === productId && item.variantId === variantId
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string, variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    proceedToCheckout();
  };
  
  const handlePlaceOrder = (details: PlaceOrderDetails, paymentMethod: string) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: details.name,
      customerEmail: details.email,
      items: [...cartItems],
      total: total,
      date: new Date().toISOString().split('T')[0],
      status: paymentMethod === 'bankTransfer' 
                ? OrderStatus.AwaitingPayment 
                : (paymentMethod.endsWith('_request') ? OrderStatus.Pending : OrderStatus.Completed),
      paymentMethod: paymentMethod,
      shippingDetails: details.shipping,
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setLastOrder(newOrder);
    navigateTo('thankyou');
  };

  const handleNavigateToEditProduct = (product: Product) => {
    setEditingProduct(product);
    setAdminView('editProduct');
  };

  const handleSaveProduct = (productDataFromForm: Product) => {
    if (editingProduct) {
      setProducts(prevProducts =>
        prevProducts.map(p => {
          if (p.id !== editingProduct.id) {
            return p;
          }
          const updatedVariants = productDataFromForm.variants.map((variant, index) => {
            if (variant.id.startsWith('new-')) {
              return { ...variant, id: `${p.id}-variant-${Date.now() + index}` };
            }
            return variant;
          });
          
          let updatedDefaultVariantId = productDataFromForm.defaultVariantId;
          const tempDefaultVariantIndex = productDataFromForm.variants.findIndex(v => v.id === productDataFromForm.defaultVariantId);

          if (tempDefaultVariantIndex !== -1 && productDataFromForm.variants[tempDefaultVariantIndex].id.startsWith('new-')) {
              updatedDefaultVariantId = updatedVariants[tempDefaultVariantIndex].id;
          }
          if (!updatedVariants.some(v => v.id === updatedDefaultVariantId) && updatedVariants.length > 0) {
            updatedDefaultVariantId = updatedVariants[0].id;
          }

          return { ...p, ...productDataFromForm, id: p.id, variants: updatedVariants, defaultVariantId: updatedDefaultVariantId };
        })
      );
    } else {
      const newProductId = `prod_${Date.now()}`;
      const newVariants: ProductVariant[] = (productDataFromForm.variants || []).map((variant, index) => ({
        ...variant,
        id: `${newProductId}-variant-${index + 1}`,
        price: variant.isFreeTrial ? undefined : Number(variant.price || 0),
      }));

      let newDefaultVariantId = '';
      const tempDefaultVariantIndex = productDataFromForm.variants.findIndex(v => v.id === productDataFromForm.defaultVariantId);
      
      if (tempDefaultVariantIndex !== -1 && newVariants[tempDefaultVariantIndex]) {
        newDefaultVariantId = newVariants[tempDefaultVariantIndex].id;
      } else if (newVariants.length > 0) {
        newDefaultVariantId = newVariants[0].id;
      }

      const newProduct: Product = {
        ...productDataFromForm,
        id: newProductId,
        variants: newVariants,
        defaultVariantId: newDefaultVariantId,
        featuresKeys: productDataFromForm.featuresKeys || [],
        socialProof: { avatars: [], textKey: '' },
        specialTagKey: productDataFromForm.specialTagKey || undefined,
        rating: undefined,
        reviewsCount: undefined,
      };

      setProducts(prevProducts => [newProduct, ...prevProducts]);
    }
    setAdminView('products');
    setEditingProduct(null);
  };

  const handleAddNewProduct = (productData: Product) => { handleSaveProduct(productData); };
  const handleUpdateOrder = (updatedOrder: Order) => { setOrders(prevOrders => prevOrders.map(order => order.id === updatedOrder.id ? updatedOrder : order)); };
  const handleDeleteOrders = (orderIds: string[]) => { setOrders(prevOrders => prevOrders.filter(order => !orderIds.includes(order.id))); };
  const handleDeleteProductClick = (productId: string) => { setProductToDeleteId(productId); setIsConfirmDeleteModalOpen(true); };
  const handleConfirmDelete = () => { if (productToDeleteId) { setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDeleteId)); setProductToDeleteId(null); setIsConfirmDeleteModalOpen(false); } };
  const handleCloseConfirmDeleteModal = () => { setProductToDeleteId(null); setIsConfirmDeleteModalOpen(false); };
  const handleNavigateToPage = (slug: string) => { setCurrentPageSlug(slug); navigateTo('page'); };
  
  const handleNavigateToServices = () => {
    const servicesSection = document.getElementById('services-section');
    servicesSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const handleNavigateToAliExpress = () => { navigateTo('aliexpress'); };
  const handleNavigateToInternationalShopper = () => { navigateTo('internationalShopper'); };
  const handleNavigateToRequestProduct = () => { navigateTo('requestProduct'); };

  const handleNavigateToUserPanel = (tab: UserPanelTab = 'dashboard') => {
    setInitialUserPanelTab(tab);
    navigateTo('userPanel');
  };

  const handleNavigateToSubscriptions = () => {
    handleNavigateToUserPanel('subscriptions');
  };
  
  const handleNavigateToContact = () => {
    navigateTo('contact');
  };

  const handleProductRequestSubmit = (submission: { formData: Record<string, string>, userName: string, userEmail: string }) => {
    const newRequest: ProductRequest = {
        id: `req-${Date.now()}`,
        requestedAt: new Date().toISOString(),
        status: 'Pending',
        userName: submission.userName,
        userEmail: submission.userEmail,
        formData: submission.formData,
    };
    setProductRequests(prev => [newRequest, ...prev]);
    navigateTo('requestProductThankYou');
  };


  const handleNavigateToEditPage = (page: CustomPage) => { setEditingPage(page); setAdminView('editPage'); };
  const handleSavePage = (pageData: CustomPage) => { if (editingPage) { setPages(prev => prev.map(p => p.id === pageData.id ? pageData : p)); } else { const newPage = { ...pageData, id: `page-${Date.now()}` }; setPages(prev => [...prev, newPage]); } setEditingPage(null); setAdminView('pages'); };
  const handleDeletePageClick = (pageId: string) => { setPageToDeleteId(pageId); setIsConfirmDeletePageModalOpen(true); };
  const handleConfirmDeletePage = () => { if (pageToDeleteId) { setPages(prev => prev.filter(p => p.id !== pageToDeleteId)); setPageToDeleteId(null); setIsConfirmDeletePageModalOpen(false); } };
  const handleCloseConfirmDeletePageModal = () => { setPageToDeleteId(null); setIsConfirmDeletePageModalOpen(false); };
  const handleNavigateToEditMobileDataProvider = (provider: MobileDataProvider) => { setEditingMobileDataProvider(provider); setAdminView('editMobileDataProvider'); };

  const handleSaveMobileDataProvider = (providerData: MobileDataProvider) => {
    if (editingMobileDataProvider) {
        setMobileDataProviders(prev => prev.map(p => { if (p.id !== editingMobileDataProvider.id) return p; const updatedPlans = providerData.plans.map((plan, index) => { if (plan.id.startsWith('new-')) { return { ...plan, id: `${p.id}-plan-${Date.now() + index}` }; } return plan; }); return { ...p, ...providerData, id: p.id, plans: updatedPlans }; }));
    } else {
        const newProviderId = `provider_${Date.now()}`; const newPlans: DataPlan[] = providerData.plans.map((plan, index) => ({ ...plan, id: `${newProviderId}-plan-${index + 1}` })); const newProvider: MobileDataProvider = { ...providerData, id: newProviderId, plans: newPlans }; setMobileDataProviders(prev => [newProvider, ...prev]);
    }
    setAdminView('mobileDataProviders');
    setEditingMobileDataProvider(null);
  };

  const handleDeleteMobileDataProviderClick = (providerId: string) => { setMobileDataProviderToDeleteId(providerId); setIsConfirmDeleteMobileDataProviderModalOpen(true); };
  const handleConfirmDeleteMobileDataProvider = () => { if (mobileDataProviderToDeleteId) { setMobileDataProviders(prev => prev.filter(p => p.id !== mobileDataProviderToDeleteId)); setMobileDataProviderToDeleteId(null); setIsConfirmDeleteMobileDataProviderModalOpen(false); } };
  const handleCloseConfirmDeleteMobileDataProviderModal = () => { setMobileDataProviderToDeleteId(null); setIsConfirmDeleteMobileDataProviderModalOpen(false); };
  const handleNavigateToEditGiftCard = (card: GiftCard) => { setEditingGiftCard(card); setAdminView('editGiftCard'); };
  const handleSaveGiftCard = (cardData: GiftCard) => { if (editingGiftCard) { setGiftCards(prev => prev.map(c => c.id === editingGiftCard.id ? { ...cardData, id: c.id } : c)); } else { const newCard: GiftCard = { ...cardData, id: `giftcard_${Date.now()}` }; setGiftCards(prev => [newCard, ...prev]); } setAdminView('giftCards'); setEditingGiftCard(null); };
  const handleDeleteGiftCardClick = (cardId: string) => { setGiftCardToDeleteId(cardId); setIsConfirmDeleteGiftCardModalOpen(true); };
  const handleConfirmDeleteGiftCard = () => { if (giftCardToDeleteId) { setGiftCards(prev => prev.filter(c => c.id !== giftCardToDeleteId)); setGiftCardToDeleteId(null); setIsConfirmDeleteGiftCardModalOpen(false); } };
  const handleCloseConfirmDeleteGiftCardModal = () => { setGiftCardToDeleteId(null); setIsConfirmDeleteGiftCardModalOpen(false); };

  const handleSubscribe = (email: string): boolean => {
    if (subscribers.some(s => s.email === email)) {
      return false;
    }
    const newSubscriber: Subscriber = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString(),
    };
    setSubscribers(prev => [...prev, newSubscriber]);
    setToast({ message: t('footer.subscribe_success'), type: 'success' });
    setTimeout(() => setToast(null), 4000);
    return true;
  };
  const handleDeleteSubscribers = (subscriberIds: string[]) => { setSubscribers(prev => prev.filter(s => !subscriberIds.includes(s.id))); };
  const handleSendCampaign = (campaignData: { subject: string; content: string }) => {
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      subject: campaignData.subject,
      content: campaignData.content,
      sentAt: new Date().toISOString(),
      recipientsCount: subscribers.length,
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    setToast({ message: t('admin.campaign_sent_success'), type: 'success' });
    setTimeout(() => setToast(null), 4000);
    setAdminView('marketing');
  };

  const filteredAdminProducts = products.filter(p => t(p.nameKey).toLowerCase().includes(adminSearchQuery.toLowerCase()) || p.category.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminOrders = orders.filter(o => o.id.toLowerCase().includes(adminSearchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(adminSearchQuery.toLowerCase()) || o.customerEmail.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminPages = pages.filter(p => p.title.en.toLowerCase().includes(adminSearchQuery.toLowerCase()) || p.slug.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminMobileDataProviders = mobileDataProviders.filter(p => p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminGiftCards = giftCards.filter(g => g.name.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminSubscribers = subscribers.filter(s => s.email.toLowerCase().includes(adminSearchQuery.toLowerCase()));

  const renderAdminView = () => {
      switch (adminView) {
          case 'products': return <AdminProductsPage products={filteredAdminProducts} onNavigateToAddProduct={() => setAdminView('addProduct')} onEditProduct={handleNavigateToEditProduct} onDeleteProduct={handleDeleteProductClick} />;
          case 'addProduct': return <AdminAddProductPage onSave={handleAddNewProduct} onCancel={() => setAdminView('products')} categories={settings.categories.filter(c => c.name !== 'ALL')} />;
          case 'editProduct': return editingProduct ? <AdminEditProductPage productToEdit={editingProduct} onSave={handleSaveProduct} onCancel={() => { setAdminView('products'); setEditingProduct(null); }} categories={settings.categories.filter(c => c.name !== 'ALL')} /> : null;
          case 'orders': return <AdminOrdersPage orders={filteredAdminOrders} onUpdateOrder={handleUpdateOrder} onDeleteOrders={handleDeleteOrders} />;
          case 'pages': return <AdminPagesPage pages={filteredAdminPages} onNavigateToAddPage={() => { setEditingPage(null); setAdminView('addPage'); }} onEditPage={handleNavigateToEditPage} onDeletePage={handleDeletePageClick} />;
          case 'addPage': return <AdminEditPage onSave={handleSavePage} onCancel={() => setAdminView('pages')} />;
          case 'editPage': return editingPage ? <AdminEditPage pageToEdit={editingPage} onSave={handleSavePage} onCancel={() => { setAdminView('pages'); setEditingPage(null); }} /> : null;
          case 'mobileDataProviders': return <AdminMobileDataProvidersPage providers={filteredAdminMobileDataProviders} onNavigateToAddProvider={() => { setEditingMobileDataProvider(null); setAdminView('addMobileDataProvider'); }} onEditProvider={handleNavigateToEditMobileDataProvider} onDeleteProvider={handleDeleteMobileDataProviderClick} />;
          case 'addMobileDataProvider': return <AdminEditMobileDataProviderPage onSave={handleSaveMobileDataProvider} onCancel={() => setAdminView('mobileDataProviders')} />;
          case 'editMobileDataProvider': return editingMobileDataProvider ? <AdminEditMobileDataProviderPage providerToEdit={editingMobileDataProvider} onSave={handleSaveMobileDataProvider} onCancel={() => { setAdminView('mobileDataProviders'); setEditingMobileDataProvider(null); }} /> : null;
          case 'giftCards': return <AdminGiftCardsPage cards={filteredAdminGiftCards} onNavigateToAddCard={() => { setEditingGiftCard(null); setAdminView('addGiftCard'); }} onEditCard={handleNavigateToEditGiftCard} onDeleteCard={handleDeleteGiftCardClick} />;
          case 'addGiftCard': return <AdminEditGiftCardPage onSave={handleSaveGiftCard} onCancel={() => setAdminView('giftCards')} />;
          case 'editGiftCard': return editingGiftCard ? <AdminEditGiftCardPage cardToEdit={editingGiftCard} onSave={handleSaveGiftCard} onCancel={() => { setAdminView('giftCards'); setEditingGiftCard(null); }} /> : null;
          case 'marketing': return <AdminMarketingPage campaigns={campaigns} subscribers={filteredAdminSubscribers} onNavigateToCompose={() => setAdminView('composeCampaign')} onDeleteSubscribers={handleDeleteSubscribers} />;
          case 'composeCampaign': return <AdminComposeCampaignPage onSendCampaign={handleSendCampaign} onCancel={() => setAdminView('marketing')} />;
          case 'settings': return <AdminSettingsPage settings={settings} onSettingsChange={setSettings} />;
          case 'dashboard': default: return <AdminDashboard orders={orders} products={products} />;
      }
  };

  const handleAdminNavigate = (view: 'dashboard' | 'products' | 'orders' | 'settings' | 'pages' | 'mobileDataProviders' | 'giftCards' | 'marketing') => {
    setAdminView(view);
    setAdminSearchQuery('');
  }

  const MainContent = () => {
    if (view === 'admin') {
      return (
          <AdminLayout onSwitchToStore={() => navigateTo('store')} activeView={adminView} onNavigate={handleAdminNavigate} searchQuery={adminSearchQuery} onSearchChange={setAdminSearchQuery}>
              {renderAdminView()}
          </AdminLayout>
      );
    }

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <Header 
              onAdminClick={() => navigateTo('admin', false)} 
              onCartClick={() => setIsCartOpen(true)}
              onSearchClick={() => setIsSearchModalOpen(true)}
              cartItemCount={cartItemCount} 
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onLoginClick={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
              onGoHome={handleBackToStore}
              pages={pages}
              onNavigateToPage={handleNavigateToPage}
              onNavigateToServices={handleNavigateToServices}
              onNavigateToUserPanel={() => handleNavigateToUserPanel()}
              onNavigateToSubscriptions={handleNavigateToSubscriptions}
              onNavigateToContact={handleNavigateToContact}
            />
        </header>
        
        {view === 'store' && (
          <>
              <div className="bg-brand-red">
                  <div className="container mx-auto px-6">
                      <div className="text-center pt-12 pb-16 text-brand-text-on-red">
                          <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{settings.homePage.hero.title[language]}</h2>
                          <p className="text-lg opacity-90">{settings.homePage.hero.subtitle[language]}</p>
                      </div>
                  </div>
              </div>
        
              <nav className="bg-white shadow-sm">
                  <div className="container mx-auto px-6">
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

              <div className="flex-grow">
                  <StoreFront products={filteredProducts} onSelectProduct={handleSelectProduct} />
                  {(() => {
                      const componentMap: { [key: string]: React.ReactNode } = {
                          requestProductPromo: <RequestProductPromoBanner key="requestProductPromo" onNavigate={handleNavigateToRequestProduct} />,
                          internationalShopperPromo: <InternationalShopperPromoBanner key="internationalShopperPromo" onLearnMore={handleNavigateToInternationalShopper} />,
                          aliexpressPromo: <AliExpressPromoBanner key="aliexpressPromo" onLearnMore={handleNavigateToAliExpress} />,
                          mobileData: <MobileDataGallery key="mobileData" providers={mobileDataProviders} onSelectProvider={handleSelectMobileDataProvider} />,
                          giftCards: <GiftCardGallery key="giftCards" giftCards={giftCards} onSelectGiftCard={handleSelectGiftCard} />,
                          whyUs: <WhyUs key="whyUs" settings={settings} />,
                      };
                      return settings.homePage.componentsOrder.map(key => componentMap[key]);
                  })()}
              </div>
          </>
        )}

        {view === 'product' && selectedProduct && <ProductPage product={selectedProduct} onAddToCart={handleAddToCart} onBackToStore={handleBackToStore} onBuyNow={handleBuyNow} categories={settings.categories} />}
        {view === 'giftCard' && selectedGiftCard && <GiftCardPage giftCard={selectedGiftCard} onAddToCart={handleGiftCardAddToCart} onBuyNow={handleGiftCardBuyNow} onBackToStore={handleBackToStore} />}
        {view === 'mobileData' && selectedMobileDataProvider && <MobileDataPage provider={selectedMobileDataProvider} onAddToCart={handleMobileDataAddToCart} onBuyNow={handleMobileDataBuyNow} onBackToStore={handleBackToStore} />}
        {view === 'aliexpress' && <AliExpressPage onAddToCart={handleAddItemToCart} onBackToStore={handleBackToStore} />}
        {view === 'internationalShopper' && <InternationalShopperPage onAddToCart={handleAddItemToCart} onBackToStore={handleBackToStore} />}
        {view === 'requestProduct' && <RequestProductPage onSubmit={handleProductRequestSubmit} onBackToStore={handleBackToStore} currentUser={currentUser} settings={settings.services.requestProduct} />}
        {view === 'checkout' && <CheckoutPage cartItems={cartItems} onPlaceOrder={handlePlaceOrder} onBackToStore={handleBackToStore} currentUser={currentUser} />}
        {view === 'thankyou' && lastOrder && <ThankYouPage order={lastOrder} onContinueShopping={handleBackToStore} />}
        {view === 'requestProductThankYou' && <RequestProductThankYouPage onContinueShopping={handleBackToStore} />}
        {view === 'page' && currentPageSlug && <CustomPageViewer page={pages.find(p => p.slug === currentPageSlug && p.isVisible)} onBackToStore={handleBackToStore} />}
        {view === 'userPanel' && currentUser && <UserPanelPage currentUser={currentUser} orders={orders.filter(o => o.customerEmail === currentUser.email)} subscriptions={subscriptions.filter(s => s.userId === currentUser.id)} onUpdateUser={handleUpdateUser} onBackToStore={handleBackToStore} initialTab={initialUserPanelTab} />}
        {view === 'contact' && <ContactUsPage settings={settings} />}

        <Footer settings={settings} pages={pages} onNavigateToPage={handleNavigateToPage} onSubscribe={handleSubscribe} onNavigateToContact={handleNavigateToContact} />
        
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onCheckout={handleCheckout} onIncrement={handleIncrementCartItem} onDecrement={handleDecrementCartItem} onClearCart={handleClearCart} />
        {view !== 'admin' && settings.supportWhatsappNumber && <WhatsappSupportButton phoneNumber={settings.supportWhatsappNumber} />}
        {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} onSignup={handleSignup} settings={settings.accessControl} />}
        <SearchModal isOpen={isSearchModalOpen} onClose={() => { setIsSearchModalOpen(false); setSearchQuery(''); }} query={searchQuery} onQueryChange={setSearchQuery} results={searchResults} onSelectProduct={handleSelectProductFromSearch} categories={settings.categories} />
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={{ settings, formatCurrency }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <MainContent />
      {isConfirmDeleteModalOpen && <ConfirmationModal isOpen={isConfirmDeleteModalOpen} onClose={handleCloseConfirmDeleteModal} onConfirm={handleConfirmDelete} title={t('admin.confirm_delete_title')} message={t('admin.confirm_delete_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
      {isConfirmDeletePageModalOpen && <ConfirmationModal isOpen={isConfirmDeletePageModalOpen} onClose={handleCloseConfirmDeletePageModal} onConfirm={handleConfirmDeletePage} title={t('admin.confirm_delete_page_title')} message={t('admin.confirm_delete_page_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
      {isConfirmDeleteMobileDataProviderModalOpen && <ConfirmationModal isOpen={isConfirmDeleteMobileDataProviderModalOpen} onClose={handleCloseConfirmDeleteMobileDataProviderModal} onConfirm={handleConfirmDeleteMobileDataProvider} title={t('admin.confirm_delete_provider_title')} message={t('admin.confirm_delete_provider_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
      {isConfirmDeleteGiftCardModalOpen && <ConfirmationModal isOpen={isConfirmDeleteGiftCardModalOpen} onClose={handleCloseConfirmDeleteGiftCardModal} onConfirm={handleConfirmDeleteGiftCard} title={t('admin.confirm_delete_gift_card_title')} message={t('admin.confirm_delete_gift_card_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
    </SettingsContext.Provider>
  )
}

export default App;