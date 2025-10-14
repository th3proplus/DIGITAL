import React, { useState } from 'react';
import { Settings } from '../types';
import { useI18n } from '../hooks/useI18n';
import { Icon } from './Icon';

interface ContactUsPageProps {
  settings: Settings;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <input
            id={id}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400"
            {...props}
        />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <textarea
            id={id}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400"
            {...props}
        />
    </div>
);

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ settings }) => {
    const { language, t } = useI18n();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { contactPage } = settings;
    const whatsappUrl = `https://wa.me/${settings.supportWhatsappNumber.replace(/\D/g, '')}`;
    const telegramUrl = `https://t.me/${settings.supportTelegramUsername}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            console.log('Simulating API call to send email...');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting contact form:", error);
            // In a real app, you might show an error message here.
        } finally {
            setLoading(false);
        }
    };

    const handleSendAnother = () => {
        setIsSubmitted(false);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <main className="flex-grow bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text-primary tracking-tight">{contactPage.title[language]}</h1>
                    <p className="text-lg text-brand-text-secondary mt-4">{contactPage.subtitle[language]}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Column */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* WhatsApp Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg text-brand-text-primary mb-4 flex items-center gap-3">
                                <Icon name="whatsapp" className="text-2xl text-green-500" />
                                {contactPage.whatsappTitle[language]}
                            </h3>
                            <p className="text-sm text-brand-text-secondary mb-4">
                                {contactPage.whatsappSubtitle[language]}
                            </p>
                            <a 
                                href={whatsappUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-green-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                            >
                                {contactPage.whatsappCta[language]}
                                <Icon name="external" className="w-4 h-4" />
                            </a>
                        </div>
                        {/* Telegram Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg text-brand-text-primary mb-4 flex items-center gap-3">
                                <Icon name="telegram" className="text-2xl text-blue-500" />
                                {contactPage.telegramTitle[language]}
                            </h3>
                            <p className="text-sm text-brand-text-secondary mb-4">
                                {contactPage.telegramSubtitle[language]}
                            </p>
                            <a
                                href={telegramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                            >
                                {contactPage.telegramCta[language]}
                                <Icon name="external" className="w-4 h-4" />
                            </a>
                        </div>
                        {/* Social Media Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                             <h3 className="font-bold text-lg text-brand-text-primary mb-4 flex items-center gap-3">
                                <Icon name="handshake" className="text-2xl text-brand-red" />
                                {contactPage.socialTitle[language]}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {settings.contactPage.socialLinks.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-brand-red rounded-full text-gray-500 hover:text-white transition-all duration-300"
                                        aria-label={link.name}
                                    >
                                        <Icon name={link.name} className="w-6 h-6" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Column */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-center min-h-[500px]">
                        {isSubmitted ? (
                            <div className="text-center py-12 flex flex-col items-center justify-center">
                                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                                    <Icon name="check" className="w-12 h-12 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
                                    {contactPage.formSuccessMessage[language]}
                                </h2>
                                <button 
                                    onClick={handleSendAnother}
                                    className="mt-6 bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-red-light transition-all"
                                >
                                    {t('contact.send_another')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-6">{contactPage.formTitle[language]}</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <InputField label={contactPage.formLabels.name[language]} id="name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                                    <InputField label={contactPage.formLabels.email[language]} id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
                                    <TextareaField label={contactPage.formLabels.message[language]} id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} placeholder="Let us know how we can help..." />
                                    <div className="text-right !mt-6">
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="bg-brand-red text-white py-3 px-8 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30 disabled:bg-gray-400 disabled:cursor-wait"
                                        >
                                            {loading ? 'Sending...' : contactPage.formLabels.sendButtonText[language]}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};