import React, { useEffect, useRef } from 'react';
import { Product, Category } from '../types';
import { Icon } from './Icon';
import { useI18n } from '../hooks/useI18n';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: Product[];
  onSelectProduct: (product: Product) => void;
  categories: Category[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, query, onQueryChange, results, onSelectProduct, categories }) => {
  const { t, language } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  const suggestedCategories = categories.filter(c => c.name !== 'ALL' && c.name !== 'New').slice(0, 4);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      
      <div
        ref={modalContentRef}
        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out flex flex-col ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-2 border-b border-gray-200">
          <Icon name="search" className="w-6 h-6 text-gray-400 flex-shrink-0 mx-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full h-12 text-lg bg-transparent focus:outline-none text-brand-text-primary placeholder:text-gray-400"
          />
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] no-scrollbar">
          {!query && (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">{t('search.suggestions')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {suggestedCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onQueryChange(cat.displayName[language])}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-start"
                  >
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <Icon name={cat.icon} className="w-5 h-5 text-brand-text-secondary" />
                    </div>
                    <span className="font-medium text-brand-text-primary">{cat.displayName[language]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-center p-12 text-brand-text-secondary">
              <Icon name="file-search" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="font-semibold text-lg text-brand-text-primary">{t('search.no_results_for', { query: `"${query}"` })}</p>
              <p className="text-sm mt-1">{t('search.no_results_tip')}</p>
            </div>
          )}
          
          {results.length > 0 && (
            <ul className="divide-y divide-gray-100 p-2">
              {results.map(product => {
                const category = categories.find(c => c.name === product.category);
                const categoryName = category ? category.displayName[language] : product.category;
                return (
                    <li key={product.id}>
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors group"
                        aria-label={`${t('search.view_product')} ${t(product.nameKey)}`}
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <img src={product.logoUrl} alt={t(product.nameKey)} className="w-full h-full object-contain p-1" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-lg"></div>
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-brand-text-primary group-hover:text-brand-red transition-colors">{t(product.nameKey)}</p>
                          <p className="text-sm text-brand-text-secondary">{categoryName}</p>
                        </div>
                        <Icon name="external" className="w-5 h-5 text-gray-300 group-hover:text-brand-red transition-colors" />
                      </button>
                    </li>
                )
              })}
            </ul>
          )}
        </div>
        
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-end text-xs text-gray-500">
           {t('header.store_name')} {t('admin.search_placeholder')}
        </div>
      </div>
    </div>
  );
};