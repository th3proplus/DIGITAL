import React, { useState, useEffect } from 'react';
import { User, CustomPage } from '../types';
import { Icon } from './Icon';
import { useI18n, useSettings } from '../hooks/useI18n';
import type { Language } from '../contexts/I18nContext';
import { Logo } from './Logo';

export const Header: React.FC<{ 
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
    onNavigateToExplore: () => void;
    onNavigateToUserPanel: () => void;
    onNavigateToSubscriptions: () => void;
    onNavigateToContact: () => void;
}> = ({ onCartClick, onSearchClick, cartItemCount, isAuthenticated, currentUser, onLoginClick, onLogout, onGoHome, pages, onNavigateToPage, onNavigateToExplore, onNavigateToUserPanel, onNavigateToSubscriptions, onNavigateToContact }) => {
    const { t, language, setLanguage } = useI18n();
    const { settings } = useSettings();
    const isRtl = language === 'ar';
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const staticNavItems = [
      { key: 'nav.home', label: t('nav.home'), isCustom: false, slug: '#' },
      { key: 'nav.explore', label: t('nav.explore'), isCustom: false, slug: '#explore' },
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
      } else if (item.key === 'nav.explore') {
          e.preventDefault();
          onNavigateToExplore();
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
        <div className={`flex items-center gap-1 md:gap-2`}>
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
            <div className="container">
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


                {/* --- Desktop Header (3-Column Flex Layout) --- */}
                <div className="hidden lg:flex items-center justify-between h-20">
                    {/* Left/Start Side: Logo */}
                    <div className="flex-1 flex justify-start">
                        <button onClick={onGoHome} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red/50 rounded-lg" aria-label="Go to homepage">
                            <LogoComponent />
                        </button>
                    </div>

                    {/* Center: Nav Menu */}
                    <div className="flex-shrink-0">
                        {NavMenu}
                    </div>

                    {/* Right/End Side: Actions */}
                    <div className="flex-1 flex justify-end">
                        {ActionIcons}
                    </div>
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
