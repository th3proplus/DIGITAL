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
import { MaintenancePage } from './components/MaintenancePage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { ExplorePage } from './components/ExplorePage';
import { SetupGuide } from './components/SetupGuide';
import { useI18n } from './hooks/useI18n';
import type { Language } from './contexts/I18nContext';
import { Logo } from './components/Logo';
import { useSettings } from './hooks/useI18n';
import { AliExpressPromoBanner } from './components/AliExpressPromoBanner';
import { Header } from './components/Header';

type AdminView = 'dashboard' | 'products' | 'orders' | 'settings' | 'addProduct' | 'editProduct' | 'pages' | 'addPage' | 'editPage' | 'mobileDataProviders' | 'addMobileDataProvider' | 'editMobileDataProvider' | 'giftCards' | 'addGiftCard' | 'editGiftCard' | 'marketing' | 'composeCampaign' | 'contactPage';
type AppState = 'loading' | 'needs_setup' | 'ready' | 'backend_error';

const kebabToCamel = (s: string) => s.replace(/-./g, x => x.toUpperCase()[1]);
const kebabToPascalSingular = (kebab: string) => {
    const pascal = kebab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    return pascal.endsWith('s') ? pascal.slice(0, -1) : pascal;
}

const WhatsappSupportButton: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
  const { language } = useI18n();
  const isRtl = language === 'ar';
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  if (!cleanPhoneNumber) return null;
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;
  const positionClass = isRtl ? 'left-6' : 'right-6';
  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`fixed bottom-6 ${positionClass} z-30 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#1EBE57] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-subtle-pulse`} aria-label="Contact us on WhatsApp">
      <Icon name="whatsapp" className="text-4xl" />
    </a>
  );
};

function App() {
  const { t, language } = useI18n();
  const { settings, setSettings, formatCurrency } = useSettings();

  const [appState, setAppState] = useState<AppState>('loading');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState(window.location.pathname);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [mobileDataProviders, setMobileDataProviders] = useState<MobileDataProvider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
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
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const isAuthenticated = !!currentUser;
  const [initialUserPanelTab, setInitialUserPanelTab] = useState<UserPanelTab>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText} (${response.status})`);
        const data = await response.json();
        
        setProducts(data.products || []);
        setGiftCards(data.giftCards || []);
        setMobileDataProviders(data.mobileDataProviders || []);
        setOrders(data.orders || []);
        setSubscriptions(data.subscriptions || []);
        setPages(data.pages || []);
        setSubscribers(data.subscribers || []);
        setCampaigns(data.campaigns || []);
        setProductRequests(data.productRequests || []);
        setUsers(data.users || []);
        if (data.settings) setSettings(data.settings);

      } catch (err: any) {
        setError(err.message || 'An unknown error occurred while fetching data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
  // Initial app status check
  useEffect(() => {
    const checkAppStatus = async () => {
        try {
            const response = await fetch('/api/status');
            if (!response.ok) throw new Error('Backend not reachable');
            const status = await response.json();

            if (status.dbConnection === 'connected' && status.dbInitialized) {
                setAppState('ready');
            } else {
                setAppState('needs_setup');
            }
        } catch (err) {
            setAppState('backend_error');
        }
    };
    checkAppStatus();
  }, []);

  // Fetch main data only when app state is 'ready'
  useEffect(() => {
    if (appState === 'ready') {
      fetchData();
    }
  }, [appState]);

  useEffect(() => {
    const handlePopState = () => setLocation(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, scrollToTop = true) => {
    if (window.location.pathname === path && window.location.hash === '') return;
    window.history.pushState({}, '', path);
    setLocation(path);
    if (scrollToTop) window.scrollTo(0, 0);
  };

  const handleAdminLogin = (username: string, pass: string): boolean => {
    if (username === settings.adminUsername && pass === (settings.adminPassword || 'password123')) {
      setIsAdminAuthenticated(true);
      navigate('/jarya/admin/dashboard');
      return true;
    }
    return false;
  };
  const handleAdminLogout = () => { setIsAdminAuthenticated(false); navigate('/'); };
  useEffect(() => { if (settings.categories && !settings.categories.some(c => c.name === activeCategory)) { setActiveCategory(settings.categories[0]?.name || 'ALL'); } }, [settings.categories, activeCategory]);

  const filteredProducts = activeCategory === 'ALL' ? products : products.filter(p => p.category === activeCategory);
  const searchResults = searchQuery ? products.filter(p => t(p.nameKey).toLowerCase().includes(searchQuery.toLowerCase())) : [];
    
  const handleSelectProductFromSearch = (product: Product) => { setIsSearchModalOpen(false); setSearchQuery(''); handleSelectProduct(product); };
  const handleLogin = (email: string, password: string):boolean => { const user = users.find(u => u.email === email && u.password === password); if (user) { setCurrentUser(user); setIsAuthModalOpen(false); return true; } return false; };
  const handleSignup = (name: string, email: string, password: string):boolean => { if (users.some(u => u.email === email)) return false; const newUser: User = { id: String(users.length + 1), name, email, password }; setUsers(prev => [...prev, newUser]); setCurrentUser(newUser); setIsAuthModalOpen(false); return true; };
  const handleLogout = () => { setCurrentUser(null); };
  const handleUpdateUser = (updatedData: Partial<User>) => { if (!currentUser) return; const updatedUser = { ...currentUser, ...updatedData }; setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u)); setCurrentUser(updatedUser); setToast({ message: t('user_panel.profile_updated_success'), type: 'success' }); };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    const mockEmail = `${provider}_user@example.com`;
    let user = users.find(u => u.email === mockEmail);
    if (!user) { const mockName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`; const newUser: User = { id: String(users.length + 1), name: mockName, email: mockEmail }; setUsers(prev => [...prev, newUser]); user = newUser; }
    setCurrentUser(user); setIsAuthModalOpen(false); setToast({ message: `Logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`, type: 'success' });
  };
  const proceedToCheckout = () => { if (settings.accessControl.requireLoginToCheckout && !isAuthenticated) setIsAuthModalOpen(true); else navigate('/checkout'); };
  const handleAddItemToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
        if (newItem.metadata?.isCustomOrder) return [...prevItems, newItem];
        const existingItem = prevItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId);
        if (existingItem) return prevItems.map(item => item.productId === newItem.productId && item.variantId === newItem.variantId ? { ...item, quantity: item.quantity + newItem.quantity } : item);
        return [...prevItems, newItem];
    });
    setIsCartOpen(true);
  };
  const handleAddToCart = (product: Product, variant: ProductVariant) => { const newItem: CartItem = { productId: product.id, variantId: variant.id, quantity: 1, productNameKey: product.nameKey, variantNameKey: variant.nameKey, logoUrl: product.logoUrl, price: variant.price || 0, isFreeTrial: variant.isFreeTrial || false }; handleAddItemToCart(newItem); };
  const handleBuyNow = (product: Product, variant: ProductVariant) => { const newItem: CartItem = { productId: product.id, variantId: variant.id, quantity: 1, productNameKey: product.nameKey, variantNameKey: variant.nameKey, logoUrl: product.logoUrl, price: variant.price || 0, isFreeTrial: variant.isFreeTrial || false }; setCartItems(prevItems => { const existingItem = prevItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId); if (existingItem) return prevItems; return [...prevItems, newItem]; }); proceedToCheckout(); };
  const handleGiftCardAddToCart = (card: GiftCard, amount: number) => { const newItem: CartItem = { productId: `giftcard-${card.id}`, variantId: `amount-${amount}`, quantity: 1, productNameKey: card.name, variantNameKey: formatCurrency(amount), logoUrl: card.logoUrl, price: amount, isFreeTrial: false, metadata: { isCustomOrder: true, customOrderType: 'giftCard', giftCardBrand: card.name, denomination: amount } }; handleAddItemToCart(newItem); };
  const handleGiftCardBuyNow = (card: GiftCard, amount: number) => { const newItem: CartItem = { productId: `giftcard-${card.id}`, variantId: `amount-${amount}`, quantity: 1, productNameKey: card.name, variantNameKey: formatCurrency(amount), logoUrl: card.logoUrl, price: amount, isFreeTrial: false, metadata: { isCustomOrder: true, customOrderType: 'giftCard', giftCardBrand: card.name, denomination: amount } }; setCartItems(prevItems => { const existingItem = prevItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId); if (existingItem) return prevItems; return [...prevItems, newItem]; }); proceedToCheckout(); };
  const handleMobileDataAddToCart = (newItem: CartItem) => { handleAddItemToCart(newItem); };
  const handleMobileDataBuyNow = (newItem: CartItem) => { setCartItems(prevItems => { const existingItem = prevItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId && item.metadata?.phoneNumber === newItem.metadata?.phoneNumber); if (existingItem) return prevItems; return [...prevItems, newItem]; }); proceedToCheckout(); };
  const handleSelectProduct = (product: Product) => navigate(`/product/${product.slug}`);
  const handleSelectGiftCard = (card: GiftCard) => navigate(`/gift-card/${card.id}`);
  const handleSelectMobileDataProvider = (provider: MobileDataProvider) => navigate(`/mobile-data/${provider.id}`);
  const handleBackToStore = () => navigate('/');
  const handleIncrementCartItem = (productId: string, variantId: string) => setCartItems(prevItems => prevItems.map(item => item.productId === productId && item.variantId === variantId ? { ...item, quantity: item.quantity + 1 } : item));
  const handleDecrementCartItem = (productId: string, variantId: string) => setCartItems(prevItems => prevItems.map(item => item.productId === productId && item.variantId === variantId ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  const handleRemoveFromCart = (productId: string, variantId: string) => setCartItems(prevItems => prevItems.filter(item => !(item.productId === productId && item.variantId === variantId)));
  const handleClearCart = () => setCartItems([]);
  const handleCheckout = () => { if (cartItems.length === 0) return; setIsCartOpen(false); proceedToCheckout(); };
  
  const handlePlaceOrder = async (details: PlaceOrderDetails, paymentMethod: string) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: details.name, customerEmail: details.email, items: [...cartItems], total,
      date: new Date().toISOString().split('T')[0],
      status: paymentMethod === 'bankTransfer' ? OrderStatus.AwaitingPayment : OrderStatus.Completed,
      paymentMethod, shippingDetails: details.shipping,
    };
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder),
        });
        if (!response.ok) throw new Error('Failed to save order');
        const savedOrder = await response.json();
        setOrders(prev => [savedOrder, ...prev]);
        setCartItems([]);
        setLastOrder(savedOrder);
        navigate('/thankyou');
    } catch (err) {
        console.error(err);
        setToast({ message: 'Failed to place order. Please try again.', type: 'error' });
    }
  };

  const handleSaveSettings = async (newSettings: Settings) => {
    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings),
        });
        if (!response.ok) throw new Error('Failed to save settings');
        const savedSettings = await response.json();
        setSettings(savedSettings);
        setToast({ message: t('settings.changes_saved'), type: 'success' });
    } catch (err) {
        console.error(err);
        setToast({ message: 'Failed to save settings.', type: 'error' });
    }
  };
  
  const handleNavigateToEditProduct = (product: Product) => navigate(`/jarya/admin/products/edit/${product.id}`);
  const handleSaveProduct = (productDataFromForm: Product) => { onSaveData('products', productDataFromForm, productDataFromForm.id); navigate('/jarya/admin/products'); };
  const handleUpdateOrder = (updatedOrder: Order) => onSaveData('orders', updatedOrder, updatedOrder.id);
  const handleDeleteOrders = (orderIds: string[]) => onDeleteData('orders', orderIds);
  const handleDeleteProductClick = (productId: string) => { setProductToDeleteId(productId); setIsConfirmDeleteModalOpen(true); };
  const handleConfirmDelete = () => { if (productToDeleteId) { onDeleteData('products', [productToDeleteId]); setProductToDeleteId(null); setIsConfirmDeleteModalOpen(false); } };
  const handleCloseConfirmDeleteModal = () => { setProductToDeleteId(null); setIsConfirmDeleteModalOpen(false); };
  const handleNavigateToPage = (slug: string) => navigate(`/page/${slug}`);
  const handleNavigateToAliExpress = () => navigate('/service/aliexpress-shopper');
  const handleNavigateToInternationalShopper = () => navigate('/service/international-shopper');
  const handleNavigateToRequestProduct = () => navigate('/service/request-product');
  const handleNavigateToUserPanel = (tab: UserPanelTab = 'dashboard') => { setInitialUserPanelTab(tab); navigate('/account'); };
  const handleNavigateToSubscriptions = () => { setInitialUserPanelTab('subscriptions'); navigate('/account'); };
  const handleNavigateToContact = () => navigate('/contact');
  const handleSelectCategory = (categoryName: string) => { setActiveCategory(categoryName); navigate('/'); };
  const handleProductRequestSubmit = (submission: { formData: Record<string, string>, userName: string, userEmail: string }) => { const newRequest: ProductRequest = { id: `req-${Date.now()}`, requestedAt: new Date().toISOString(), status: 'Pending', ...submission }; onSaveData('productRequests', newRequest); navigate('/service/request-product/thankyou'); };
  const handleNavigateToEditPage = (page: CustomPage) => navigate(`/jarya/admin/pages/edit/${page.id}`);
  const handleSavePage = (pageData: CustomPage) => { onSaveData('pages', pageData, pageData.id); navigate('/jarya/admin/pages'); };
  const handleDeletePageClick = (pageId: string) => { setPageToDeleteId(pageId); setIsConfirmDeletePageModalOpen(true); };
  const handleConfirmDeletePage = () => { if (pageToDeleteId) { onDeleteData('pages', [pageToDeleteId]); setPageToDeleteId(null); setIsConfirmDeletePageModalOpen(false); } };
  const handleCloseConfirmDeletePageModal = () => { setPageToDeleteId(null); setIsConfirmDeletePageModalOpen(false); };
  const handleNavigateToEditMobileDataProvider = (provider: MobileDataProvider) => navigate(`/jarya/admin/mobile-data-providers/edit/${provider.id}`);
  const handleSaveMobileDataProvider = (providerData: MobileDataProvider) => { onSaveData('mobileDataProviders', providerData, providerData.id); navigate('/jarya/admin/mobile-data-providers'); };
  const handleDeleteMobileDataProviderClick = (providerId: string) => { setMobileDataProviderToDeleteId(providerId); setIsConfirmDeleteMobileDataProviderModalOpen(true); };
  const handleConfirmDeleteMobileDataProvider = () => { if (mobileDataProviderToDeleteId) { onDeleteData('mobileDataProviders', [mobileDataProviderToDeleteId]); setMobileDataProviderToDeleteId(null); setIsConfirmDeleteMobileDataProviderModalOpen(false); } };
  const handleCloseConfirmDeleteMobileDataProviderModal = () => { setMobileDataProviderToDeleteId(null); setIsConfirmDeleteMobileDataProviderModalOpen(false); };
  const handleNavigateToEditGiftCard = (card: GiftCard) => navigate(`/jarya/admin/gift-cards/edit/${card.id}`);
  const handleSaveGiftCard = (cardData: GiftCard) => { onSaveData('giftCards', cardData, cardData.id); navigate('/jarya/admin/gift-cards'); };
  const handleDeleteGiftCardClick = (cardId: string) => { setGiftCardToDeleteId(cardId); setIsConfirmDeleteGiftCardModalOpen(true); };
  const handleConfirmDeleteGiftCard = () => { if (giftCardToDeleteId) { onDeleteData('giftCards', [giftCardToDeleteId]); setGiftCardToDeleteId(null); setIsConfirmDeleteGiftCardModalOpen(false); } };
  const handleCloseConfirmDeleteGiftCardModal = () => { setGiftCardToDeleteId(null); setIsConfirmDeleteGiftCardModalOpen(false); };
  const handleSubscribe = (email: string): boolean => { if (subscribers.some(s => s.email === email)) return false; const newSubscriber: Subscriber = { id: `sub-${Date.now()}`, email, subscribedAt: new Date().toISOString() }; onSaveData('subscribers', newSubscriber); setToast({ message: t('footer.subscribe_success'), type: 'success' }); return true; };
  const handleDeleteSubscribers = (subscriberIds: string[]) => onDeleteData('subscribers', subscriberIds);
  const handleSendCampaign = (campaignData: { subject: string; content: string }) => { const newCampaign: Campaign = { id: `camp-${Date.now()}`, ...campaignData, sentAt: new Date().toISOString(), recipientsCount: subscribers.length }; onSaveData('campaigns', newCampaign); setToast({ message: t('admin.campaign_sent_success'), type: 'success' }); navigate('/jarya/admin/marketing'); };
  
  const onSaveData = (dataType: string, data: any, id?: string) => console.log(`Saving ${dataType}:`, data);
  const onDeleteData = (dataType: string, ids: string[]) => console.log(`Deleting ${dataType} with IDs:`, ids);

  const filteredAdminProducts = products.filter(p => t(p.nameKey).toLowerCase().includes(adminSearchQuery.toLowerCase()) || p.category.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminOrders = orders.filter(o => o.id.toLowerCase().includes(adminSearchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(adminSearchQuery.toLowerCase()) || o.customerEmail.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminPages = pages.filter(p => p.title.en.toLowerCase().includes(adminSearchQuery.toLowerCase()) || p.slug.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminMobileDataProviders = mobileDataProviders.filter(p => p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminGiftCards = giftCards.filter(g => g.name.toLowerCase().includes(adminSearchQuery.toLowerCase()));
  const filteredAdminSubscribers = subscribers.filter(s => s.email.toLowerCase().includes(adminSearchQuery.toLowerCase()));

  // App state rendering
  if (appState === 'loading') {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-red"></div></div>;
  }
  
  if (appState === 'needs_setup') {
    return <SetupGuide />;
  }

  if (appState === 'backend_error') {
    return <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700 p-4 text-center"><Icon name="close" className="w-16 h-16 mb-4"/><h2 className="text-2xl font-bold">Failed to Connect to Backend</h2><p className="mt-2 max-w-xl">The application could not communicate with the backend server. Please ensure the backend server is running (`npm run start:backend` or `npm run dev`) and try again.</p></div>;
  }

  const MainContent = () => {
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-red"></div></div>;
    }
    if (error) {
        return <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700 p-4 text-center"><Icon name="close" className="w-16 h-16 mb-4"/><h2 className="text-2xl font-bold">Failed to Load Store Data</h2><p className="mt-2 max-w-xl">{error}</p></div>;
    }

    if (location === '/jarya/admin/login') return <AdminLoginPage onLogin={handleAdminLogin} onBackToStore={handleBackToStore} />;
    const adminMatch = location.match(/^\/jarya\/admin(\/.*)?$/);
    if (adminMatch) {
      if (!isAdminAuthenticated) { navigate('/jarya/admin/login'); return null; }
        const adminPath = adminMatch[1] || '/dashboard';
        const pathParts = adminPath.split('/').filter(Boolean);
        let adminPageView: AdminView = 'dashboard';
        let editingId: string | undefined = undefined;
        const mainSectionKebab = pathParts[0];
        if (mainSectionKebab) {
            if (pathParts[1] === 'add') adminPageView = `add${kebabToPascalSingular(mainSectionKebab)}` as AdminView;
            else if (pathParts[1] === 'edit' && pathParts[2]) { adminPageView = `edit${kebabToPascalSingular(mainSectionKebab)}` as AdminView; editingId = pathParts[2]; }
            else adminPageView = kebabToCamel(mainSectionKebab) as AdminView;
        }

        const renderAdminView = () => {
            switch(adminPageView) {
                case 'products': return <AdminProductsPage products={filteredAdminProducts} onNavigateToAddProduct={() => navigate('/jarya/admin/products/add')} onEditProduct={handleNavigateToEditProduct} onDeleteProduct={handleDeleteProductClick} />;
                case 'addProduct': return <AdminAddProductPage onSave={handleSaveProduct} onCancel={() => navigate('/jarya/admin/products')} categories={settings.categories.filter(c => c.name !== 'ALL')} />;
                case 'editProduct': { const productToEdit = products.find(p => p.id === editingId); return productToEdit ? <AdminEditProductPage productToEdit={productToEdit} onSave={handleSaveProduct} onCancel={() => navigate('/jarya/admin/products')} categories={settings.categories.filter(c => c.name !== 'ALL')} /> : null; }
                case 'orders': return <AdminOrdersPage orders={filteredAdminOrders} onUpdateOrder={handleUpdateOrder} onDeleteOrders={handleDeleteOrders} />;
                case 'pages': return <AdminPagesPage pages={filteredAdminPages} onNavigateToAddPage={() => navigate('/jarya/admin/pages/add')} onEditPage={handleNavigateToEditPage} onDeletePage={handleDeletePageClick} />;
                case 'addPage': return <AdminEditPage onSave={handleSavePage} onCancel={() => navigate('/jarya/admin/pages')} />;
                case 'editPage': { const pageToEdit = pages.find(p => p.id === editingId); return pageToEdit ? <AdminEditPage pageToEdit={pageToEdit} onSave={handleSavePage} onCancel={() => navigate('/jarya/admin/pages')} /> : null; }
                case 'mobileDataProviders': return <AdminMobileDataProvidersPage providers={filteredAdminMobileDataProviders} onNavigateToAddProvider={() => navigate('/jarya/admin/mobile-data-providers/add')} onEditProvider={handleNavigateToEditMobileDataProvider} onDeleteProvider={handleDeleteMobileDataProviderClick} />;
                case 'addMobileDataProvider': return <AdminEditMobileDataProviderPage onSave={handleSaveMobileDataProvider} onCancel={() => navigate('/jarya/admin/mobile-data-providers')} />;
                case 'editMobileDataProvider': { const providerToEdit = mobileDataProviders.find(p => p.id === editingId); return providerToEdit ? <AdminEditMobileDataProviderPage providerToEdit={providerToEdit} onSave={handleSaveMobileDataProvider} onCancel={() => navigate('/jarya/admin/mobile-data-providers')} /> : null; }
                case 'giftCards': return <AdminGiftCardsPage cards={filteredAdminGiftCards} onNavigateToAddCard={() => navigate('/jarya/admin/gift-cards/add')} onEditCard={handleNavigateToEditGiftCard} onDeleteCard={handleDeleteGiftCardClick} />;
                case 'addGiftCard': return <AdminEditGiftCardPage onSave={handleSaveGiftCard} onCancel={() => navigate('/jarya/admin/gift-cards')} />;
                case 'editGiftCard': { const cardToEdit = giftCards.find(c => c.id === editingId); return cardToEdit ? <AdminEditGiftCardPage cardToEdit={cardToEdit} onSave={handleSaveGiftCard} onCancel={() => navigate('/jarya/admin/gift-cards')} /> : null; }
                case 'marketing': return <AdminMarketingPage campaigns={campaigns} subscribers={filteredAdminSubscribers} onNavigateToCompose={() => navigate('/jarya/admin/marketing/compose')} onDeleteSubscribers={handleDeleteSubscribers} />;
                case 'composeCampaign': return <AdminComposeCampaignPage onSendCampaign={handleSendCampaign} onCancel={() => navigate('/jarya/admin/marketing')} />;
                case 'settings': return <AdminSettingsPage settings={settings} onSettingsChange={handleSaveSettings} />;
                case 'dashboard': default: return <AdminDashboard orders={orders} products={products} />;
            }
        };
        return <AdminLayout onSwitchToStore={() => navigate('/')} onLogout={handleAdminLogout} activeView={adminPageView} onNavigate={(view) => navigate(`/jarya/admin/${view}`)} searchQuery={adminSearchQuery} onSearchChange={setAdminSearchQuery}>{renderAdminView()}</AdminLayout>;
    }
    
    if (location.startsWith('/admin')) { navigate(location.replace('/admin', '/jarya/admin')); return null; }
    if (settings.advanced.maintenanceMode) return <MaintenancePage />;
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const renderStoreView = () => {
        const productMatch = location.match(/^\/product\/(.+)/);
        if (productMatch) { const product = products.find(p => p.slug === productMatch[1]); return product ? <ProductPage product={product} onAddToCart={handleAddToCart} onBackToStore={handleBackToStore} onBuyNow={handleBuyNow} categories={settings.categories} /> : <div>Not Found</div>; }
        const giftCardMatch = location.match(/^\/gift-card\/(.+)/);
        if (giftCardMatch) { const card = giftCards.find(c => c.id === giftCardMatch[1]); return card ? <GiftCardPage giftCard={card} onAddToCart={handleGiftCardAddToCart} onBuyNow={handleGiftCardBuyNow} onBackToStore={handleBackToStore} /> : <div>Not Found</div>; }
        const mobileDataMatch = location.match(/^\/mobile-data\/(.+)/);
        if (mobileDataMatch) { const provider = mobileDataProviders.find(p => p.id === mobileDataMatch[1]); return provider ? <MobileDataPage provider={provider} onAddToCart={handleMobileDataAddToCart} onBuyNow={handleMobileDataBuyNow} onBackToStore={handleBackToStore} /> : <div>Not Found</div>; }
        const pageMatch = location.match(/^\/page\/(.+)/);
        if (pageMatch) { const page = pages.find(p => p.slug === pageMatch[1] && p.isVisible); return <CustomPageViewer page={page} onBackToStore={handleBackToStore} />; }

        switch (location) {
            case '/checkout': return <CheckoutPage cartItems={cartItems} onPlaceOrder={handlePlaceOrder} onBackToStore={handleBackToStore} currentUser={currentUser} />;
            case '/thankyou': return lastOrder ? <ThankYouPage order={lastOrder} onContinueShopping={handleBackToStore} /> : <div/>;
            case '/service/aliexpress-shopper': return <AliExpressPage onAddToCart={handleAddItemToCart} onBackToStore={handleBackToStore} />;
            case '/service/international-shopper': return <InternationalShopperPage onAddToCart={handleAddItemToCart} onBackToStore={handleBackToStore} />;
            case '/service/request-product': return <RequestProductPage onSubmit={handleProductRequestSubmit} onBackToStore={handleBackToStore} currentUser={currentUser} settings={settings.services.requestProduct} />;
            case '/service/request-product/thankyou': return <RequestProductThankYouPage onContinueShopping={handleBackToStore} />;
            case '/account': return currentUser ? <UserPanelPage currentUser={currentUser} orders={orders.filter(o => o.customerEmail === currentUser.email)} subscriptions={subscriptions.filter(s => s.userId === currentUser.id)} onUpdateUser={handleUpdateUser} onBackToStore={handleBackToStore} initialTab={initialUserPanelTab} /> : <div/>;
            case '/contact': return <ContactUsPage settings={settings} />;
            case '/explore': return <ExplorePage products={products} giftCards={giftCards} mobileDataProviders={mobileDataProviders} pages={pages} categories={settings.categories} onSelectProduct={handleSelectProduct} onSelectGiftCard={handleSelectGiftCard} onSelectMobileDataProvider={handleSelectMobileDataProvider} onNavigateToPage={handleNavigateToPage} onNavigateToAliExpress={handleNavigateToAliExpress} onNavigateToInternationalShopper={handleNavigateToInternationalShopper} onNavigateToRequestProduct={handleNavigateToRequestProduct} />;
            case '/': default:
                return (
                    <>
                        <div className="bg-brand-red"><div className="container"><div className="text-center pt-12 pb-16 text-brand-text-on-red"><h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{settings.homePage.hero.title[language]}</h2><p className="text-lg opacity-90">{settings.homePage.hero.subtitle[language]}</p></div></div></div>
                        <nav className="bg-white shadow-sm"><div className="container"><div className="flex items-center gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">{settings.categories.map((category) => (<button key={category.id} onClick={() => setActiveCategory(category.name)} className={`flex flex-col items-center gap-2 pt-4 pb-3 px-2 text-sm font-medium transition-colors duration-200 shrink-0 border-b-2 whitespace-nowrap ${activeCategory === category.name ? 'text-brand-red border-brand-red' : 'text-brand-text-secondary border-transparent hover:text-brand-red'}`}><Icon name={category.icon} className="text-2xl" /><span>{category.displayName[language]}</span></button>))}</div></div></nav>
                        <div className="flex-grow">
                            <main className="container py-10"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{filteredProducts.map(product => (<ProductCard key={product.id} product={product} onSelectProduct={handleSelectProduct} />))}</div></main>
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
                );
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-20"><Header onCartClick={() => setIsCartOpen(true)} onSearchClick={() => setIsSearchModalOpen(true)} cartItemCount={cartItemCount} isAuthenticated={isAuthenticated} currentUser={currentUser} onLoginClick={() => setIsAuthModalOpen(true)} onLogout={handleLogout} onGoHome={handleBackToStore} pages={pages} onNavigateToPage={handleNavigateToPage} onNavigateToExplore={() => navigate('/explore')} onNavigateToUserPanel={() => navigate('/account')} onNavigateToSubscriptions={handleNavigateToSubscriptions} onNavigateToContact={handleNavigateToContact} /></header>
            {renderStoreView()}
            <Footer settings={settings} pages={pages} onNavigateToPage={handleNavigateToPage} onSubscribe={handleSubscribe} onNavigateToContact={handleNavigateToContact} onGoHome={handleBackToStore} />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onCheckout={handleCheckout} onIncrement={handleIncrementCartItem} onDecrement={handleDecrementCartItem} onClearCart={handleClearCart} />
            {settings.supportWhatsappNumber && <WhatsappSupportButton phoneNumber={settings.supportWhatsappNumber} />}
            {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} onSignup={handleSignup} onSocialLogin={handleSocialLogin} settings={settings.accessControl} />}
            <SearchModal isOpen={isSearchModalOpen} onClose={() => { setIsSearchModalOpen(false); setSearchQuery(''); }} query={searchQuery} onQueryChange={setSearchQuery} results={searchResults} onSelectProduct={handleSelectProductFromSearch} categories={settings.categories} />
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <MainContent />
      {isConfirmDeleteModalOpen && <ConfirmationModal isOpen={isConfirmDeleteModalOpen} onClose={handleCloseConfirmDeleteModal} onConfirm={handleConfirmDelete} title={t('admin.confirm_delete_title')} message={t('admin.confirm_delete_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
      {isConfirmDeletePageModalOpen && <ConfirmationModal isOpen={isConfirmDeletePageModalOpen} onClose={handleCloseConfirmDeletePageModal} onConfirm={handleConfirmDeletePage} title={t('admin.confirm_delete_page_title')} message={t('admin.confirm_delete_page_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
      {isConfirmDeleteMobileDataProviderModalOpen && <ConfirmationModal isOpen={isConfirmDeleteMobileDataProviderModalOpen} onClose={handleCloseConfirmDeleteMobileDataProviderModal} onConfirm={handleConfirmDeleteMobileDataProvider} title={t('admin.confirm_delete_provider_title')} message={t('admin.confirm_delete_provider_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
      {isConfirmDeleteGiftCardModalOpen && <ConfirmationModal isOpen={isConfirmDeleteGiftCardModalOpen} onClose={handleCloseConfirmDeleteGiftCardModal} onConfirm={handleConfirmDeleteGiftCard} title={t('admin.confirm_delete_gift_card_title')} message={t('admin.confirm_delete_gift_card_message')} confirmButtonText={t('admin.confirm_delete_button')} cancelButtonText={t('admin.modal_cancel')} confirmButtonVariant="danger" />}
    </>
  )
}

export default App;
