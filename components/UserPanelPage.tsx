import React, { useState, useEffect } from 'react';
import { User, Order, OrderStatus, Subscription, UserPanelTab } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface UserPanelPageProps {
  currentUser: User;
  orders: Order[];
  subscriptions: Subscription[];
  onUpdateUser: (updatedData: Partial<User>) => void;
  onBackToStore: () => void;
  initialTab: UserPanelTab;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <input
            id={id}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400 disabled:bg-gray-200"
            {...props}
        />
    </div>
);

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusClasses = {
        [OrderStatus.Completed]: 'bg-green-100 text-green-700',
        [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-700',
        [OrderStatus.Failed]: 'bg-red-100 text-red-700',
        [OrderStatus.AwaitingPayment]: 'bg-blue-100 text-blue-700',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${statusClasses[status]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
            {status}
        </span>
    );
};

export const UserPanelPage: React.FC<UserPanelPageProps> = ({ currentUser, orders, subscriptions, onUpdateUser, onBackToStore, initialTab }) => {
  const { t } = useI18n();
  const { formatCurrency } = useSettings();
  const [activeTab, setActiveTab] = useState<UserPanelTab>(initialTab);

  const [profileData, setProfileData] = useState({ name: currentUser.name, email: currentUser.email });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    setProfileData({ name: currentUser.name, email: currentUser.email });
  }, [currentUser]);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name: profileData.name, email: profileData.email });
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd add validation and an API call here.
    // For this demo, we'll just show the success toast.
    console.log('Password update submitted:', passwordData);
    onUpdateUser({ password: passwordData.new }); // This would be hashed server-side
    setPasswordData({ current: '', new: '', confirm: '' });
  };
  
  const navItems = [
    { id: 'dashboard', label: t('user_panel.dashboard'), icon: 'dashboard' },
    { id: 'orders', label: t('user_panel.order_history'), icon: 'orders' },
    { id: 'subscriptions', label: t('user_panel.subscriptions'), icon: 'products' },
    { id: 'settings', label: t('user_panel.profile_settings'), icon: 'settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('user_panel.order_history')}</h2>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Order ID</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Total</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                        <td className="px-4 py-3">{order.date}</td>
                        <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                        <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <Icon name="orders" className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                    <p className="font-semibold text-lg text-gray-700">{t('user_panel.no_orders')}</p>
                </div>
            )}
          </div>
        );
      case 'subscriptions':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('user_panel.subscriptions')}</h2>
            {subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <img src={sub.logoUrl} alt={t(sub.productNameKey)} className="w-12 h-12 object-contain rounded-md flex-shrink-0" />
                    <div className="flex-grow text-center sm:text-left">
                      <p className="font-bold text-gray-800">{t(sub.productNameKey)}</p>
                      <p className="text-sm text-gray-600">{t(sub.variantNameKey)}</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('user_panel.subscription_status')}</p>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                            {sub.status}
                        </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('user_panel.subscription_expires')}</p>
                      <p className="font-semibold text-gray-800">{new Date(sub.endDate).toLocaleDateString()}</p>
                    </div>
                    <button className="text-sm font-semibold text-brand-red hover:underline whitespace-nowrap">
                        {t('user_panel.subscription_manage')}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Icon name="products" className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                <p className="font-semibold text-lg text-gray-700">{t('user_panel.no_subscriptions')}</p>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8">
            <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                 <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
                 <div className="space-y-4">
                    <InputField label={t('user_panel.full_name')} id="name" value={profileData.name} onChange={(e) => setProfileData(p => ({...p, name: e.target.value}))} />
                    <InputField label={t('user_panel.email_address')} id="email" type="email" value={profileData.email} onChange={(e) => setProfileData(p => ({...p, email: e.target.value}))} />
                 </div>
                 <div className="mt-6 text-right">
                    <button type="submit" className="bg-brand-red text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-red-light transition-colors">{t('user_panel.update_profile')}</button>
                 </div>
            </form>
            <form onSubmit={handlePasswordUpdate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                 <h2 className="text-xl font-bold text-gray-800 mb-6">{t('user_panel.change_password')}</h2>
                 <div className="space-y-4">
                    <InputField label={t('user_panel.current_password')} id="currentPassword" type="password" value={passwordData.current} onChange={(e) => setPasswordData(p => ({...p, current: e.target.value}))} />
                    <InputField label={t('user_panel.new_password')} id="newPassword" type="password" value={passwordData.new} onChange={(e) => setPasswordData(p => ({...p, new: e.target.value}))} />
                    <InputField label={t('user_panel.confirm_new_password')} id="confirmPassword" type="password" value={passwordData.confirm} onChange={(e) => setPasswordData(p => ({...p, confirm: e.target.value}))} />
                 </div>
                 <div className="mt-6 text-right">
                    <button type="submit" className="bg-brand-red text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-red-light transition-colors">{t('user_panel.update_password')}</button>
                 </div>
            </form>
          </div>
        );
      case 'dashboard':
      default:
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('user_panel.welcome', { name: currentUser.name })}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">{t('user_panel.total_orders')}</p>
                        <p className="text-4xl font-bold text-gray-800 mt-1">{orders.length}</p>
                    </div>
                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">{t('user_menu.subscriptions')}</p>
                        <p className="text-4xl font-bold text-gray-800 mt-1">{subscriptions.length}</p>
                    </div>
                </div>
            </div>
        );
    }
  };

  return (
    <main className="flex-grow bg-gray-50">
      <div className="container py-12">
        <nav className="text-sm text-brand-text-secondary mb-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={onBackToStore} className="hover:text-brand-red">{t('nav.home')}</button>
            </li>
            <li className="flex items-center mx-2">/</li>
            <li className="flex items-center text-brand-text-primary font-semibold">
              <span>{t('user_panel.title')}</span>
            </li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-4 mb-6 border-b pb-4">
                        <img src={`https://i.pravatar.cc/40?u=${currentUser.id}`} alt={currentUser.name} className="w-16 h-16 rounded-full" />
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{currentUser.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                    </div>
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:block space-y-2">
                         {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as UserPanelTab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                                    activeTab === item.id 
                                    ? 'bg-red-50 text-brand-red' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon name={item.icon} className="w-5 h-5"/>
                                <span>{item.label}</span>
                            </button>
                         ))}
                    </nav>
                </div>
            </aside>

            <div className="lg:col-span-3">
                {/* Mobile Tabs */}
                <div className="lg:hidden border-b border-gray-200 mb-6">
                    <nav className="flex -mb-px space-x-6">
                         {navItems.map(item => (
                             <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as UserPanelTab)}
                                className={`flex items-center gap-2 px-1 py-3 border-b-2 font-semibold transition-colors duration-200 text-sm ${
                                    activeTab === item.id 
                                    ? 'border-brand-red text-brand-red' 
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                <Icon name={item.icon} className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                         ))}
                    </nav>
                </div>
                {renderContent()}
            </div>
        </div>
      </div>
    </main>
  );
};