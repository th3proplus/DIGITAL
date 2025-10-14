import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings } from '../types';

export type Language = 'en' | 'ar' | 'fr';
type Translations = { [key: string]: string };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  translations: { [key in Language]?: Translations };
}

interface SettingsContextType {
    settings: Settings;
    formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);


export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar'); // Default to Arabic
  const [translations, setTranslations] = useState<{ [key in Language]?: Translations }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Use relative paths for robust routing in an SPA
        const [en, ar, fr] = await Promise.all([
          fetch('./i18n/locales/en.json').then(res => res.json()),
          fetch('./i18n/locales/ar.json').then(res => res.json()),
          fetch('./i18n/locales/fr.json').then(res => res.json())
        ]);
        setTranslations({ en, ar, fr });
      } catch (error) {
        console.error("Failed to load translation files", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    if (isLoading || !translations[language]) {
      return key;
    }
    let translation = translations[language]?.[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([replacementKey, value]) => {
        const regex = new RegExp(`{${replacementKey}}`, 'g');
        translation = translation.replace(regex, String(value));
      });
    }

    return translation;
  }, [language, translations, isLoading]);

  if (isLoading) {
    // Display a loading spinner instead of a blank screen. This helps with perceived performance and debugging.
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', gap: '1rem' }}>
        <div style={{
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #F85757',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontFamily: 'sans-serif', color: '#475569' }}>Loading Store...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </I18nContext.Provider>
  );
};