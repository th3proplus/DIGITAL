import React, { useState } from 'react';
import { Icon } from './Icon';
import { useI18n } from '../hooks/useI18n';
import { Settings, CustomPage } from '../types';

interface FooterProps {
    settings: Settings;
    pages: CustomPage[];
    onNavigateToPage: (slug: string) => void;
    onSubscribe: (email: string) => boolean;
    onNavigateToContact: () => void;
    onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, pages, onNavigateToPage, onSubscribe, onNavigateToContact, onGoHome }) => {
    const { t, language } = useI18n();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState('');

    const { homePage, footer } = settings;

    const customPageLinks = pages
        .filter(p => p.isVisible && p.showInFooter)
        .map(p => ({
            key: p.title[language],
            isCustom: true,
            slug: p.slug,
        }));

    const navLinks = [
        ...footer.staticLinks,
        ...customPageLinks.map(p => ({ key: p.key, slug: p.slug, isCustom: true }))
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) return;
        
        const success = onSubscribe(email);
        if (success) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        } else {
            setError(t('footer.email_exists'));
        }
    };

    return (
        <footer className="bg-brand-primary text-gray-300">
            <div className="container pt-20 pb-12">

                {/* Newsletter CTA */}
                <div className="max-w-3xl mx-auto bg-brand-secondary rounded-2xl p-8 sm:p-10 text-center mb-16 shadow-lg">
                    <h2 className="text-3xl font-bold text-white mb-3">{homePage.footerNewsletter.title[language]}</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">{homePage.footerNewsletter.subtitle[language]}</p>
                    <form 
                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                        onSubmit={handleSubscribe}
                    >
                        <input
                            type="email"
                            placeholder={homePage.footerNewsletter.placeholder[language]}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow w-full bg-brand-primary text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-brand-red focus:border-brand-red focus:outline-none transition-colors"
                            aria-label={homePage.footerNewsletter.placeholder[language]}
                            required
                        />
                        <button
                            type="submit"
                            className={`font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                                subscribed 
                                ? 'bg-green-600 text-white' 
                                : 'bg-brand-red text-white hover:bg-brand-red-light'
                            }`}
                        >
                            {subscribed ? t('footer.subscribed') : homePage.footerNewsletter.buttonText[language]}
                        </button>
                    </form>
                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                </div>

                {/* Main Nav */}
                <nav className="flex justify-center flex-wrap gap-x-8 gap-y-4 mb-10">
                    {navLinks.map(link => (
                        <a 
                            key={link.key} 
                            href={link.slug} 
                            onClick={(e) => {
                                if (link.key === 'nav.home') {
                                    e.preventDefault();
                                    onGoHome();
                                } else if (link.key === 'footer.contact.us') {
                                    e.preventDefault();
                                    onNavigateToContact();
                                } else if ((link as any).isCustom) {
                                    e.preventDefault();
                                    onNavigateToPage(link.slug);
                                }
                            }}
                            className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                        >
                            {(link as any).isCustom ? link.key : t(link.key)}
                        </a>
                    ))}
                </nav>

                {/* Social Icons */}
                <div className="flex justify-center gap-4">
                    {footer.socialLinks.map(icon => (
                        <a
                            key={icon.name}
                            href={icon.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-brand-secondary hover:bg-brand-red rounded-full text-gray-400 hover:text-white transition-all duration-300"
                            aria-label={icon.name}
                        >
                            <Icon name={icon.name} className="w-5 h-5" />
                        </a>
                    ))}
                </div>

            </div>

            {/* Sub-footer */}
            <div className="border-t border-gray-800">
                <div className="container py-6 flex flex-col-reverse sm:flex-row justify-between items-center text-sm text-gray-500">
                    <p className="mt-4 sm:mt-0">{footer.copyrightText[language]}</p>
                    <div className="flex gap-x-6 gap-y-2 flex-wrap justify-center">
                        {footer.subfooterLinks.map(link => (
                           <a key={link.key} href={link.slug} className="hover:text-white transition-colors">{t(link.key)}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
