import React from 'react';
import { CustomPage } from '../types';
import { useI18n } from '../hooks/useI18n';
import { Icon } from './Icon';

interface CustomPageViewerProps {
  page?: CustomPage;
  onBackToStore: () => void;
}

export const CustomPageViewer: React.FC<CustomPageViewerProps> = ({ page, onBackToStore }) => {
  const { t, language } = useI18n();

  if (!page) {
    return (
      <main className="flex-grow bg-white flex items-center justify-center py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <Icon name="file-search" className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight mb-3">
            {t('page.not_found_title')}
          </h1>
          <p className="text-brand-text-secondary text-lg mb-8">
            {t('page.not_found_message')}
          </p>
          <button
            onClick={onBackToStore}
            className="w-full max-w-xs bg-brand-red text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300"
          >
            {t('checkout.back_to_store')}
          </button>
        </div>
      </main>
    );
  }

  const title = page.title[language];
  const content = page.content[language];

  return (
    <main className="flex-grow bg-white py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text-primary tracking-tight mb-8">
            {title}
          </h1>
          <div
            className="prose prose-lg max-w-none text-brand-text-secondary"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </main>
  );
};