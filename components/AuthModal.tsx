import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Icon } from './Icon';
import { Settings } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => boolean;
  onSignup: (name: string, email: string, password: string) => boolean;
  settings: Settings['accessControl'];
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onSignup, settings }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (!success) {
      setError(t('auth.invalid_credentials'));
    } else {
      setError(null);
      onClose();
    }
  };
  
  const handleSignupSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const success = onSignup(name, email, password);
      if (!success) {
          setError(t('auth.user_exists'));
      } else {
          setError(null);
          onClose();
      }
  };
  
  const switchTab = (tab: 'login' | 'signup') => {
      setActiveTab(tab);
      setError(null);
      setName('');
      setEmail('');
      setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8">
            <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-700 transition-colors">
                <Icon name="close" className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-center text-brand-text-primary mb-2">{t('auth.login_or_signup')}</h2>
            <p className="text-center text-brand-text-secondary mb-8">{t('hero.subtitle')}</p>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => switchTab('login')}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${activeTab === 'login' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    {t('auth.login')}
                </button>
                <button
                    onClick={() => switchTab('signup')}
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${activeTab === 'signup' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    {t('auth.signup')}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-600 mb-1">{t('auth.email')}</label>
                        <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5 text-gray-800 focus:ring-brand-red focus:border-brand-red transition" />
                    </div>
                     <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-600 mb-1">{t('auth.password')}</label>
                        <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5 text-gray-800 focus:ring-brand-red focus:border-brand-red transition" />
                    </div>
                    <button type="submit" className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105">
                        {t('auth.login')}
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        {t('auth.no_account')}{' '}
                        <button onClick={() => switchTab('signup')} type="button" className="font-semibold text-brand-red hover:underline">{t('auth.signup')}</button>
                    </p>
                </form>
            ) : (
                 <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="signup-name" className="block text-sm font-medium text-gray-600 mb-1">{t('auth.name')}</label>
                        <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5 text-gray-800 focus:ring-brand-red focus:border-brand-red transition" />
                    </div>
                    <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-600 mb-1">{t('auth.email')}</label>
                        <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5 text-gray-800 focus:ring-brand-red focus:border-brand-red transition" />
                    </div>
                     <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-600 mb-1">{t('auth.password')}</label>
                        <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5 text-gray-800 focus:ring-brand-red focus:border-brand-red transition" />
                    </div>
                    <button type="submit" className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105">
                        {t('auth.create_account')}
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        {t('auth.have_account')}{' '}
                        <button onClick={() => switchTab('login')} type="button" className="font-semibold text-brand-red hover:underline">{t('auth.login')}</button>
                    </p>
                </form>
            )}

            {(settings?.googleLogin?.enabled || settings?.facebookLogin?.enabled) && (
              <>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">{t('auth.or_continue_with')}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {settings?.googleLogin?.enabled && (
                        <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Icon name="google" className="w-5 h-5" />
                            <span className="font-semibold text-brand-text-secondary">{t('auth.with_google')}</span>
                        </button>
                    )}
                     {settings?.facebookLogin?.enabled && (
                        <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Icon name="facebook" className="w-5 h-5 text-[#1877F2]" />
                            <span className="font-semibold text-brand-text-secondary">{t('auth.with_facebook')}</span>
                        </button>
                    )}
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};