import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';

interface AdminLayoutProps {
  onSwitchToStore: () => void;
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: 'dashboard' | 'products' | 'orders' | 'settings' | 'pages' | 'mobile-data-providers' | 'gift-cards' | 'marketing') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  iconName: string;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ iconName, label, isActive, isCollapsed, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full h-11 px-3.5 rounded-lg text-sm transition-colors duration-200 group ${
      isActive
        ? 'bg-brand-red text-white font-semibold shadow-md'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`}
  >
    <Icon name={iconName} className="text-xl" />
    <span className={`ml-3 transition-opacity duration-200 ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
      {label}
    </span>
  </button>
);

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onSwitchToStore, children, activeView, onNavigate, searchQuery, onSearchChange, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pageTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    settings: 'Settings',
    addProduct: 'Add New Product',
    editProduct: 'Edit Product',
    pages: 'Pages',
    addPage: 'Add New Page',
    editPage: 'Edit Page',
    mobileDataProviders: 'Mobile Data',
    addMobileDataProvider: 'Add Data Provider',
    editMobileDataProvider: 'Edit Data Provider',
    giftCards: 'Gift Cards',
    addGiftCard: 'Add Gift Card',
    editGiftCard: 'Edit Gift Card',
    marketing: 'Marketing',
    composeCampaign: 'Compose Campaign',
    viewCampaign: 'View Campaign',
  };
  
  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'orders', icon: 'orders', label: 'Orders' },
    { id: 'products', icon: 'products', label: 'Products' },
    { id: 'marketing', icon: 'rocket', label: 'Marketing' },
    { id: 'pages', icon: 'file-search', label: 'Pages' },
    { id: 'mobile-data-providers', icon: 'wallet', label: 'Mobile Data' },
    { id: 'gift-cards', icon: 'credit-card', label: 'Gift Cards' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  const kebabToCamel = (s: string) => s.replace(/-./g, x => x.toUpperCase()[1]);

  const isViewActive = (viewId: string) => {
    const camelViewId = kebabToCamel(viewId);
    if (camelViewId === 'marketing' && (activeView === 'marketing' || activeView === 'composeCampaign' || activeView === 'viewCampaign')) return true;

    if (activeView.startsWith('add') || activeView.startsWith('edit')) {
      if (camelViewId === 'products' && (activeView === 'addProduct' || activeView === 'editProduct')) return true;
      if (camelViewId === 'pages' && (activeView === 'addPage' || activeView === 'editPage')) return true;
      if (camelViewId === 'mobileDataProviders' && (activeView === 'addMobileDataProvider' || activeView === 'editMobileDataProvider')) return true;
      if (camelViewId === 'giftCards' && (activeView === 'addGiftCard' || activeView === 'editGiftCard')) return true;
    }
    return activeView === camelViewId;
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const actionsSection = (
    <div className="flex items-center gap-4">
      {/* Desktop-only icons */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="relative w-40 sm:w-64">
          <Icon name="search" className="text-xl text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full bg-slate-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/50" />
        </div>
        
        <button className="p-2.5 hover:bg-slate-100 rounded-full text-slate-500 relative">
          <Icon name="bell" className="text-2xl" />
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-brand-red ring-2 ring-white"></span>
        </button>
        
        <div className="relative">
          <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2">
              <img src="https://i.pravatar.cc/40?img=10" alt="Admin" className="w-10 h-10 rounded-full" />
          </button>
          {isUserMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-slate-100">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold text-sm text-slate-800">Alex Turner</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                      <Icon name="user" className="text-base" /> My Profile
                  </a>
              </div>
          )}
        </div>
      </div>

      {/* Mobile-only menu button */}
      <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden text-slate-500">
          <Icon name="menu" className="text-2xl" />
      </button>
    </div>
  );

  return (
    <div className="bg-slate-50 text-slate-800" dir="ltr">
      {/* Overlay for mobile sidebar */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-800 text-white flex-shrink-0 flex flex-col p-4 z-40 transition-all duration-300 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-8 px-2 pt-2 h-10`}>
          <div className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
            <Logo />
          </div>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden lg:block text-slate-400 hover:text-white">
            <Icon name={isSidebarCollapsed ? 'chevrons-right' : 'chevrons-left'} className="text-2xl" />
          </button>
        </div>
        
        <nav className="flex-grow space-y-2">
          {navItems.map(item => (
            <NavItem 
              key={item.id}
              iconName={item.icon} 
              label={item.label}
              isCollapsed={isSidebarCollapsed}
              isActive={isViewActive(item.id)}
              onClick={() => onNavigate(item.id as any)} 
            />
          ))}
        </nav>

        <div className="mt-auto">
          <NavItem iconName="external" label="Back to Store" isCollapsed={isSidebarCollapsed} isActive={false} onClick={onSwitchToStore} />
          <NavItem iconName="logout" label="Logout" isCollapsed={isSidebarCollapsed} isActive={false} onClick={onLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
            <h2 className="text-2xl font-bold text-slate-800 truncate">{pageTitles[activeView] || activeView}</h2>
            {actionsSection}
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};