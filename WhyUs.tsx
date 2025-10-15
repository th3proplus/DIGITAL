import React from 'react';
import { useI18n } from './useI18n';
import { Settings } from './types';
import { Icon } from './Icon';

interface WhyUsProps {
  settings: Settings;
}

const FeatureItem: React.FC<{ iconName: string; title: string; description: string; link?: string; }> = ({ iconName, title, description, link }) => (
    <div className="flex items-start gap-5">
        <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(248,87,87,0.1)]">
                <Icon name={iconName} className="text-4xl text-brand-red" />
            </div>
        </div>
        <div className="text-left rtl:text-right">
            <h4 className="text-xl font-bold text-slate-800 mb-1">{title}</h4>
            <p className="text-base text-slate-500 leading-relaxed">{description}</p>
            {link && (
                <a href="#" className="text-base text-brand-red font-semibold mt-2 inline-block hover:underline">
                    {link}
                </a>
            )}
        </div>
    </div>
);


export const WhyUs: React.FC<WhyUsProps> = ({ settings }) => {
  const { language } = useI18n();
  const { whyUs } = settings.homePage;

  return (
    <section className="bg-gray-50/50 py-24">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
            {whyUs.titlePart1[language]}{' '}
            <span className="text-brand-red">{whyUs.titleHighlight[language]}</span>{' '}
            {whyUs.titlePart2[language]}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto gap-x-20 gap-y-12">
            {whyUs.features.map((feature, index) => (
                <FeatureItem 
                    key={index}
                    iconName={feature.icon}
                    title={feature.title[language]}
                    description={feature.description[language]}
                    link={feature.link ? feature.link[language] : undefined}
                />
            ))}
        </div>
      </div>
    </section>
  );
};
