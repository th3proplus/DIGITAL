import React, { useState, useEffect } from 'react';
import { Settings, Category, RequestProductFormField } from './types';
import { Icon } from './Icon';
import { IntegrationCard } from './IntegrationCard';
import type { Language } from './I18nContext';
import set from 'lodash.set';


interface AdminSettingsPageProps {
    settings: Settings;
    onSettingsChange: (newSettings: Settings) => void;
}

type SettingsTab = 'homePage' | 'general' | 'appearance' | 'categories' | 'account' | 'accessControl' | 'payments' | 'services' | 'marketing' | 'advanced' | 'contactPage';

const availableIcons = ['grid', 'video', 'music', 'ai', 'code', 'book', 'sparkles', 'cart', 'store', 'rocket', 'headset', 'handshake', 'search', 'edit', 'user', 'globe', 'dollar-sign'];
const socialIcons = ['facebook', 'telegram', 'tiktok', 'youtube', 'twitter-x', 'google', 'whatsapp'];

const componentNames: { [key: string]: string } = {
  mobileData: 'Mobile Data Gallery',
  giftCards: 'Gift Card Gallery',
  requestProductPromo: 'Request a Product Banner',
  internationalShopperPromo: 'International Shopper Banner',
  aliexpressPromo: 'AliExpress Promo Banner',
  whyUs: '"Why Us" Section',
};

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start py-8 border-b border-slate-200 last:border-b-0">
        <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="space-y-6">
                {children}
            </div>
        </div>
    </div>
);

const AccordionItem: React.FC<{
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, description, icon, children, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Icon name={icon} className="text-xl text-slate-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{title}</h4>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <Icon name="chevronDown" className={`text-xl text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[9999px]' : 'max-h-0'}`}>
        <div className="p-6 bg-slate-50/70 border-t border-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name?: string; type?: string; placeholder?: string; description?: string; }> = ({ label, id, description, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        <input id={id} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all" {...props} />
        {description && <p className="text-xs text-slate-500 mt-1.5">{description}</p>}
    </div>
);

const TextareaField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string; placeholder?: string; rows?: number; description?: string; }> = ({ label, id, description, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        <textarea id={id} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all font-mono text-sm" {...props} />
        {description && <p className="text-xs text-slate-500 mt-1.5">{description}</p>}
    </div>
);

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; name?: string; children: React.ReactNode; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        <select id={id} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red appearance-none transition-all" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }} {...props} />
    </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-red/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
    </label>
);

const MultilingualInputField: React.FC<{ baseId: string; name: string; values: { en: string; fr: string; ar: string }; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string }> = ({ baseId, name, values, onChange, label }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="EN" id={`${baseId}-en`} name={`${name}.en`} value={values.en} onChange={onChange} />
            <InputField label="FR" id={`${baseId}-fr`} name={`${name}.fr`} value={values.fr} onChange={onChange} />
            <InputField label="AR" id={`${baseId}-ar`} name={`${name}.ar`} value={values.ar} onChange={onChange} />
        </div>
    </div>
);

const MultilingualTextareaField: React.FC<{ baseId: string; name: string; values: { en: string; fr: string; ar: string }; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ baseId, name, values, onChange, rows = 3 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextareaField label="Description (EN)" id={`${baseId}-en`} name={`${name}.en`} value={values.en} onChange={onChange} rows={rows} />
        <TextareaField label="Description (FR)" id={`${baseId}-fr`} name={`${name}.fr`} value={values.fr} onChange={onChange} rows={rows} />
        <TextareaField label="Description (AR)" id={`${baseId}-ar`} name={`${name}.ar`} value={values.ar} onChange={onChange} rows={rows} />
    </div>
);

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ settings, onSettingsChange }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('homePage');
    const [localSettings, setLocalSettings] = useState<Settings>(settings);
    const [showSuccess, setShowSuccess] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>('hero');
    const [expandedRequestField, setExpandedRequestField] = useState<string | null>(null);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    const bankTransferFields: (keyof Omit<Settings['payments']['bankTransfer'], 'enabled' | 'name'>)[] = ['accountName', 'accountNumber', 'bankName', 'whatsappNumber'];
    const bankFieldLabels: { [key: string]: string } = {
        accountName: 'Account Name',
        accountNumber: 'Account Number / IBAN',
        bankName: 'Bank Name',
        whatsappNumber: 'WhatsApp Number for Proof',
    };


    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            set(newSettings, name, value);
            return newSettings;
        });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        
        const reorderedComponents = [...localSettings.homePage.componentsOrder];
        const [draggedItem] = reorderedComponents.splice(draggedItemIndex, 1);
        reorderedComponents.splice(index, 0, draggedItem);
        
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            newSettings.homePage.componentsOrder = reorderedComponents;
            return newSettings;
        });
        
        setDraggedItemIndex(index);
    };
    
    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };


    const handleRequestFieldChange = (index: number, fieldName: string, value: any) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            set(newSettings, `services.requestProduct.fields[${index}].${fieldName}`, value);
            return newSettings;
        });
    };
    
    const handleAddNewRequestField = () => {
        const newFieldId = `custom_${Date.now()}`;
        const newField: RequestProductFormField = {
            id: newFieldId,
            type: 'text',
            label: { en: 'New Field', fr: 'Nouveau champ', ar: 'حقل جديد' },
            placeholder: { en: '', fr: '', ar: '' },
            enabled: true,
            required: false,
            isDefault: false,
        };
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            newSettings.services.requestProduct.fields.push(newField);
            return newSettings;
        });
        setExpandedRequestField(newFieldId);
    };

    const handleRemoveRequestField = (index: number) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            newSettings.services.requestProduct.fields.splice(index, 1);
            return newSettings;
        });
    };


     const handlePaymentToggleChange = (paymentMethod: keyof Settings['payments'], enabled: boolean) => {
        setLocalSettings(prev => ({
            ...prev,
            payments: {
                ...prev.payments,
                [paymentMethod]: {
                    ...prev.payments[paymentMethod],
                    enabled,
                },
            },
        }));
    };

    const handleAccessControlToggleChange = (fieldName: keyof Settings['accessControl'], checked: boolean) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            if (!newSettings.accessControl) {
                newSettings.accessControl = { 
                    requireLoginToCheckout: false,
                    googleLogin: { enabled: false, clientId: '' },
                    facebookLogin: { enabled: false, appId: '' }
                };
            }
            if (fieldName === 'requireLoginToCheckout') {
                newSettings.accessControl[fieldName] = checked;
            }
            return newSettings;
        });
    };

    const handleSocialLoginToggleChange = (provider: 'googleLogin' | 'facebookLogin', enabled: boolean) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            if (!newSettings.accessControl) {
                newSettings.accessControl = {
                    requireLoginToCheckout: false,
                    googleLogin: { enabled: false, clientId: '' },
                    facebookLogin: { enabled: false, appId: '' },
                };
            }
            if (!newSettings.accessControl[provider]) {
                newSettings.accessControl[provider] = { enabled: false, clientId: '', appId: '' };
            }
            newSettings.accessControl[provider].enabled = enabled;
            return newSettings;
        });
    };

    const handleMarketingToggleChange = (service: 'mailchimp' | 'sendgrid', enabled: boolean) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            newSettings.marketing[service].enabled = enabled;
            return newSettings;
        });
    };
    
    const handleBankTransferFieldToggle = (field: keyof Omit<Settings['payments']['bankTransfer'], 'enabled'>, checked: boolean) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            newSettings.payments.bankTransfer[field].enabled = checked;
            return newSettings;
        });
    };

    const handleAdvancedToggleChange = (fieldName: keyof Settings['advanced'], enabled: boolean) => {
        setLocalSettings(prev => ({
            ...prev,
            advanced: {
                ...prev.advanced,
                [fieldName]: enabled
            }
        }));
    };
    
    const handleCategoryChange = (index: number, field: keyof Omit<Category, 'id' | 'displayName'> | 'displayName', value: string, lang?: Language) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            if (field === 'displayName' && lang) {
                newSettings.categories[index].displayName[lang] = value;
            } else if (field !== 'displayName') {
                (newSettings.categories[index] as any)[field] = value;
            }
            return newSettings;
        });
    };

    const handleRemoveCategory = (id: string) => {
        setLocalSettings(prev => ({
            ...prev,
            categories: prev.categories.filter(cat => cat.id !== id),
        }));
    };

    const handleAddCategory = () => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: 'NewCategory',
            displayName: { en: 'New Category', fr: 'Nouvelle Catégorie', ar: 'فئة جديدة' },
            icon: 'grid'
        };
        setLocalSettings(prev => ({
            ...prev,
            categories: [...prev.categories, newCategory],
        }));
    };

    const handleSocialLinkChange = (index: number, field: 'name' | 'href', value: string) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            newSettings.contactPage.socialLinks[index][field] = value;
            return newSettings;
        });
    };

    const handleAddSocialLink = () => {
        const newLink = { name: 'facebook', href: '#' };
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            if (!newSettings.contactPage.socialLinks) {
                newSettings.contactPage.socialLinks = [];
            }
            newSettings.contactPage.socialLinks.push(newLink);
            return newSettings;
        });
    };

    const handleRemoveSocialLink = (index: number) => {
        setLocalSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            newSettings.contactPage.socialLinks.splice(index, 1);
            return newSettings;
        });
    };

    const handleSaveChanges = () => {
        onSettingsChange(localSettings);
        setShowSuccess(true);
        window.scrollTo(0, 0);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    
    const tabs: { id: SettingsTab; icon: string; label: string; description: string; }[] = [
        { id: 'homePage', icon: 'dashboard', label: 'Home Page', description: "Customize the content of your store's main page." },
        { id: 'contactPage', icon: 'mail', label: 'Contact Page', description: "Customize the content of the 'Contact Us' page." },
        { id: 'general', icon: 'store', label: 'General', description: "Manage your store's core information and localization." },
        { id: 'appearance', icon: 'palette', label: 'Appearance', description: "Customize your store's look and feel with your logo and brand colors." },
        { id: 'categories', icon: 'grid', label: 'Categories', description: "Organize your products by creating and managing categories." },
        { id: 'account', icon: 'user', label: 'Account', description: "Manage your admin account details and password." },
        { id: 'accessControl', icon: 'shield', label: 'Access Control', description: "Manage user access and permissions for your store." },
        { id: 'payments', icon: 'credit-card', label: 'Payments', description: "Configure and manage payment gateways for your customers." },
        { id: 'services', icon: 'package', label: 'Services', description: "Manage settings for additional services like AliExpress Shopper." },
        { id: 'marketing', icon: 'rocket', label: 'Marketing', description: "Integrate with marketing tools like Facebook Pixel and Google Analytics." },
        { id: 'advanced', icon: 'code', label: 'Advanced', description: "Access developer-focused settings for advanced customization." },
    ];
    
    const activeTabInfo = tabs.find(t => t.id === activeTab);

    return (
        <div className="space-y-8">
             {showSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded-lg relative flex items-center gap-3" role="alert">
                    <Icon name="check" className="text-xl" />
                    <span className="block sm:inline font-semibold">Changes saved successfully!</span>
                </div>
            )}
             {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your store settings and preferences.</p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center sm:justify-start gap-2 shadow-sm shadow-brand-red/20"
                >
                    <Icon name="check" className="text-xl" />
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex -mb-px space-x-6 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'border-brand-red text-brand-red' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                            }`}
                        >
                             <Icon name={tab.icon} className="text-xl" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Content */}
            <div className="pt-2">
                 {activeTabInfo && (
                    <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">{activeTabInfo.label}</h2>
                        <p className="text-slate-500 mt-1">{activeTabInfo.description}</p>
                    </div>
                 )}
                
                {activeTab === 'homePage' && (
                    <div className="space-y-4">
                        <AccordionItem
                            title="Home Page Layout"
                            description="Drag and drop to reorder the sections on your home page."
                            icon="list"
                            isOpen={openAccordion === 'layout'}
                            onToggle={() => setOpenAccordion(openAccordion === 'layout' ? null : 'layout')}
                        >
                            <div className="space-y-2">
                                <p className="text-sm text-slate-500 mb-4">Drag the handle to change the order. The top item will appear first after the product grid.</p>
                                {localSettings.homePage.componentsOrder.map((key, index) => (
                                    <div
                                        key={key}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center gap-4 bg-white p-3 rounded-lg border transition-shadow cursor-move ${draggedItemIndex === index ? 'shadow-lg opacity-50' : 'shadow-sm'}`}
                                    >
                                        <Icon name="menu" className="text-xl text-slate-400 cursor-grab" />
                                        <span className="font-medium text-slate-700">{componentNames[key] || key}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title="Hero Section"
                            description="Edit the main title and subtitle at the top of your home page."
                            icon="rocket"
                            isOpen={openAccordion === 'hero'}
                            onToggle={() => setOpenAccordion(openAccordion === 'hero' ? null : 'hero')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="hero-title" label="Title" name="homePage.hero.title" values={localSettings.homePage.hero.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="hero-subtitle" label="Subtitle" name="homePage.hero.subtitle" values={localSettings.homePage.hero.subtitle} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>
                        
                        <AccordionItem
                            title="Why Us Section"
                            description="Manage the title and features in the 'Why Us' section."
                            icon="sparkles"
                            isOpen={openAccordion === 'whyus'}
                            onToggle={() => setOpenAccordion(openAccordion === 'whyus' ? null : 'whyus')}
                        >
                            <div className="space-y-4 mb-8">
                                <MultilingualInputField baseId="whyus-title1" label="Title (Part 1)" name="homePage.whyUs.titlePart1" values={localSettings.homePage.whyUs.titlePart1} onChange={handleInputChange} />
                                <MultilingualInputField baseId="whyus-titleHighlight" label="Title (Highlight)" name="homePage.whyUs.titleHighlight" values={localSettings.homePage.whyUs.titleHighlight} onChange={handleInputChange} />
                                <MultilingualInputField baseId="whyus-title2" label="Title (Part 2)" name="homePage.whyUs.titlePart2" values={localSettings.homePage.whyUs.titlePart2} onChange={handleInputChange} />
                            </div>
                            
                            {localSettings.homePage.whyUs.features.map((feature, index) => (
                                <div key={index} className="space-y-4 border-t pt-6 mt-6">
                                    <h5 className="font-semibold text-slate-700">Feature {index + 1}</h5>
                                    <MultilingualInputField baseId={`whyus-feature-${index}-title`} label="Title" name={`homePage.whyUs.features[${index}].title`} values={feature.title} onChange={handleInputChange} />
                                    <MultilingualTextareaField baseId={`whyus-feature-${index}-desc`} name={`homePage.whyUs.features[${index}].description`} values={feature.description} onChange={handleInputChange} />
                                    <MultilingualInputField baseId={`whyus-feature-${index}-link`} label="Link Text" name={`homePage.whyUs.features[${index}].link`} values={feature.link || { en: '', fr: '', ar: '' }} onChange={handleInputChange} />
                                </div>
                            ))}
                        </AccordionItem>

                        <AccordionItem
                            title="AliExpress Promo Banner"
                            description="Customize the AliExpress promo banner on the home page."
                            icon="cart"
                            isOpen={openAccordion === 'aliexpress'}
                            onToggle={() => setOpenAccordion(openAccordion === 'aliexpress' ? null : 'aliexpress')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="aliexpress-title" label="Title" name="homePage.aliexpressPromo.title" values={localSettings.homePage.aliexpressPromo.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="aliexpress-subtitle" label="Subtitle" name="homePage.aliexpressPromo.subtitle" values={localSettings.homePage.aliexpressPromo.subtitle} onChange={handleInputChange} />
                                <MultilingualInputField baseId="aliexpress-cta" label="CTA Button Text" name="homePage.aliexpressPromo.cta" values={localSettings.homePage.aliexpressPromo.cta} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="International Shopper Promo"
                            description="Customize the International Shopper promo banner."
                            icon="store"
                            isOpen={openAccordion === 'internationalShopper'}
                            onToggle={() => setOpenAccordion(openAccordion === 'internationalShopper' ? null : 'internationalShopper')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="international-title" label="Title" name="homePage.internationalShopperPromo.title" values={localSettings.homePage.internationalShopperPromo.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="international-subtitle" label="Subtitle" name="homePage.internationalShopperPromo.subtitle" values={localSettings.homePage.internationalShopperPromo.subtitle} onChange={handleInputChange} />
                                <MultilingualInputField baseId="international-cta" label="CTA Button Text" name="homePage.internationalShopperPromo.cta" values={localSettings.homePage.internationalShopperPromo.cta} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="Request a Product Promo"
                            description="Customize the 'Request a Product' promo banner."
                            icon="package"
                            isOpen={openAccordion === 'requestProduct'}
                            onToggle={() => setOpenAccordion(openAccordion === 'requestProduct' ? null : 'requestProduct')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="request-product-title" label="Title" name="homePage.requestProductPromo.title" values={localSettings.homePage.requestProductPromo.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="request-product-subtitle" label="Subtitle" name="homePage.requestProductPromo.subtitle" values={localSettings.homePage.requestProductPromo.subtitle} onChange={handleInputChange} />
                                <MultilingualInputField baseId="request-product-cta" label="CTA Button Text" name="homePage.requestProductPromo.cta" values={localSettings.homePage.requestProductPromo.cta} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="Mobile Data Promo"
                            description="Customize the Mobile Data section on the home page."
                            icon="wallet"
                            isOpen={openAccordion === 'mobileData'}
                            onToggle={() => setOpenAccordion(openAccordion === 'mobileData' ? null : 'mobileData')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="mobile-data-title" label="Title" name="homePage.mobileDataPromo.title" values={localSettings.homePage.mobileDataPromo.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="mobile-data-subtitle" label="Subtitle" name="homePage.mobileDataPromo.subtitle" values={localSettings.homePage.mobileDataPromo.subtitle} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="Gift Card Promo"
                            description="Customize the Gift Card section on the home page."
                            icon="credit-card"
                            isOpen={openAccordion === 'giftCard'}
                            onToggle={() => setOpenAccordion(openAccordion === 'giftCard' ? null : 'giftCard')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="gift-card-title" label="Title" name="homePage.giftCardPromo.title" values={localSettings.homePage.giftCardPromo.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="gift-card-subtitle" label="Subtitle" name="homePage.giftCardPromo.subtitle" values={localSettings.homePage.giftCardPromo.subtitle} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="Footer Newsletter"
                            description="Change the call-to-action text in the footer's newsletter signup form."
                            icon="mail"
                            isOpen={openAccordion === 'newsletter'}
                            onToggle={() => setOpenAccordion(openAccordion === 'newsletter' ? null : 'newsletter')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="newsletter-title" label="Title" name="homePage.footerNewsletter.title" values={localSettings.homePage.footerNewsletter.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="newsletter-subtitle" label="Subtitle" name="homePage.footerNewsletter.subtitle" values={localSettings.homePage.footerNewsletter.subtitle} onChange={handleInputChange} />
                                <MultilingualInputField baseId="newsletter-placeholder" label="Placeholder Text" name="homePage.footerNewsletter.placeholder" values={localSettings.homePage.footerNewsletter.placeholder} onChange={handleInputChange} />
                                <MultilingualInputField baseId="newsletter-button" label="Button Text" name="homePage.footerNewsletter.buttonText" values={localSettings.homePage.footerNewsletter.buttonText} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>
                    </div>
                )}

                {activeTab === 'contactPage' && (
                    <div className="space-y-4">
                        <AccordionItem
                            title="Page Header"
                            description="Set the main title and subtitle for the contact page."
                            icon="file-search"
                            isOpen={openAccordion === 'contactHeader'}
                            onToggle={() => setOpenAccordion(openAccordion === 'contactHeader' ? null : 'contactHeader')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="contact-title" label="Title" name="contactPage.title" values={localSettings.contactPage.title} onChange={handleInputChange} />
                                <MultilingualInputField baseId="contact-subtitle" label="Subtitle" name="contactPage.subtitle" values={localSettings.contactPage.subtitle} onChange={handleInputChange} />
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title="Contact Form"
                            description="Customize the labels, button text, and success message for the email form."
                            icon="mail"
                            isOpen={openAccordion === 'contactForm'}
                            onToggle={() => setOpenAccordion(openAccordion === 'contactForm' ? null : 'contactForm')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="contact-form-title" label="Form Title" name="contactPage.formTitle" values={localSettings.contactPage.formTitle} onChange={handleInputChange} />
                                <div className="border-t pt-4 mt-4 space-y-4">
                                    <MultilingualInputField baseId="contact-form-name" label="Name Field Label" name="contactPage.formLabels.name" values={localSettings.contactPage.formLabels.name} onChange={handleInputChange} />
                                    <MultilingualInputField baseId="contact-form-email" label="Email Field Label" name="contactPage.formLabels.email" values={localSettings.contactPage.formLabels.email} onChange={handleInputChange} />
                                    <MultilingualInputField baseId="contact-form-message" label="Message Field Label" name="contactPage.formLabels.message" values={localSettings.contactPage.formLabels.message} onChange={handleInputChange} />
                                    <MultilingualInputField baseId="contact-form-button" label="Send Button Text" name="contactPage.formLabels.sendButtonText" values={localSettings.contactPage.formLabels.sendButtonText} onChange={handleInputChange} />
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <MultilingualInputField baseId="contact-form-success" label="Form Success Message" name="contactPage.formSuccessMessage" values={localSettings.contactPage.formSuccessMessage} onChange={handleInputChange} />
                                    <p className="text-xs text-slate-500 mt-1.5">This confirmation message is shown to the user after they successfully submit the contact form.</p>
                                </div>
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title="Side Panels"
                            description="Customize the WhatsApp and Social Media panels."
                            icon="chat"
                            isOpen={openAccordion === 'contactSide'}
                            onToggle={() => setOpenAccordion(openAccordion === 'contactSide' ? null : 'contactSide')}
                        >
                            <div className="space-y-4">
                                <MultilingualInputField baseId="contact-whatsapp-title" label="WhatsApp Panel Title" name="contactPage.whatsappTitle" values={localSettings.contactPage.whatsappTitle} onChange={handleInputChange} />
                                <MultilingualInputField baseId="contact-whatsapp-subtitle" label="WhatsApp Panel Subtitle" name="contactPage.whatsappSubtitle" values={localSettings.contactPage.whatsappSubtitle} onChange={handleInputChange} />
                                <MultilingualInputField baseId="contact-whatsapp-cta" label="WhatsApp Button Text" name="contactPage.whatsappCta" values={localSettings.contactPage.whatsappCta} onChange={handleInputChange} />
                                
                                <div className="border-t pt-4 mt-4">
                                    <h5 className="font-semibold text-slate-700 mb-4">Telegram Panel</h5>
                                    <div className="space-y-4">
                                        <MultilingualInputField baseId="contact-telegram-title" label="Telegram Panel Title" name="contactPage.telegramTitle" values={localSettings.contactPage.telegramTitle} onChange={handleInputChange} />
                                        <MultilingualInputField baseId="contact-telegram-subtitle" label="Telegram Panel Subtitle" name="contactPage.telegramSubtitle" values={localSettings.contactPage.telegramSubtitle} onChange={handleInputChange} />
                                        <MultilingualInputField baseId="contact-telegram-cta" label="Telegram Button Text" name="contactPage.telegramCta" values={localSettings.contactPage.telegramCta} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <MultilingualInputField baseId="contact-social-title" label="Social Media Panel Title" name="contactPage.socialTitle" values={localSettings.contactPage.socialTitle} onChange={handleInputChange} />
                                    <div className="mt-6">
                                        <h5 className="font-semibold text-slate-700 mb-2">Social Media Links</h5>
                                        <div className="space-y-3">
                                            {localSettings.contactPage.socialLinks?.map((link, index) => (
                                                <div key={index} className="flex items-end gap-3 p-3 bg-slate-100 rounded-lg">
                                                    <div className="flex-1">
                                                        <SelectField label="Platform" id={`social-name-${index}`} value={link.name} onChange={e => handleSocialLinkChange(index, 'name', e.target.value)}>
                                                            {socialIcons.map(icon => <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1).replace('-x', ' (X)')}</option>)}
                                                        </SelectField>
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputField label="URL" id={`social-href-${index}`} value={link.href} onChange={e => handleSocialLinkChange(index, 'href', e.target.value)} />
                                                    </div>
                                                    <button type="button" onClick={() => handleRemoveSocialLink(index)} className="p-2 text-slate-400 hover:text-red-600 rounded-md transition-colors">
                                                        <Icon name="trash" className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={handleAddSocialLink} className="mt-3 flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline">
                                            <Icon name="plus" className="text-base" /> Add Social Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                    </div>
                )}
                
                {activeTab === 'general' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                        <InputField label="Store Name" id="storeName" name="storeName" value={localSettings.storeName} onChange={handleInputChange} />
                        <TextareaField label="Store Description" id="storeDescription" name="storeDescription" value={localSettings.storeDescription} onChange={handleInputChange} rows={3} />
                        <InputField label="Contact Email" id="contactEmail" name="contactEmail" type="email" value={localSettings.contactEmail} onChange={handleInputChange} description="This email is shown to customers and receives submissions from the contact form." />
                        <InputField label="Support WhatsApp Number" id="supportWhatsappNumber" name="supportWhatsappNumber" value={localSettings.supportWhatsappNumber} onChange={handleInputChange} placeholder="+1234567890" />
                        <InputField label="Support Telegram Username" id="supportTelegramUsername" name="supportTelegramUsername" value={localSettings.supportTelegramUsername} onChange={handleInputChange} placeholder="your_telegram_username" description="Enter username without the '@'." />
                        <SelectField label="Currency" id="currency" name="currency" value={localSettings.currency} onChange={handleInputChange}>
                            <option value="TND">TND - Tunisian Dinar</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                        </SelectField>
                    </div>
                )}
                
                {activeTab === 'appearance' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                         <InputField label="Store Logo" id="logoUrl" name="logoUrl" value={localSettings.logoUrl} onChange={handleInputChange} description="Enter the URL for your store's logo." />
                         <div>
                            <label htmlFor="themeColor" className="block text-sm font-medium text-slate-600 mb-1.5">Theme Color</label>
                            <div className="relative">
                                <input id="themeColor" name="themeColor" value={localSettings.themeColor} onChange={handleInputChange} className="w-full h-12 p-1 bg-slate-50 border border-slate-200 rounded-lg" />
                                <input type="color" value={localSettings.themeColor} onChange={handleInputChange} name="themeColor" className="absolute top-1 right-1 w-10 h-10 p-0 border-none rounded-md" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Manage Product Categories</h3>
                        {localSettings.categories.map((cat, index) => (
                            <div key={cat.id}>
                                <button onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Icon name={cat.icon} className="text-xl text-slate-500" />
                                        <span className="font-semibold text-slate-700">{cat.displayName.en}</span>
                                    </div>
                                    <Icon name="chevronDown" className={`text-xl text-slate-400 transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedCategory === cat.id && (
                                    <div className="p-4 mt-2 bg-slate-50 border rounded-lg space-y-4">
                                        <InputField label="Internal Name (e.g., SVOD)" id={`cat-name-${index}`} value={cat.name} onChange={(e) => handleCategoryChange(index, 'name', e.target.value)} name={`categories[${index}].name`} />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <InputField label="Name (EN)" id={`cat-en-${index}`} value={cat.displayName.en} onChange={(e) => handleCategoryChange(index, 'displayName', e.target.value, 'en')} name={`categories[${index}].displayName.en`} />
                                            <InputField label="Name (FR)" id={`cat-fr-${index}`} value={cat.displayName.fr} onChange={(e) => handleCategoryChange(index, 'displayName', e.target.value, 'fr')} name={`categories[${index}].displayName.fr`} />
                                            <InputField label="Name (AR)" id={`cat-ar-${index}`} value={cat.displayName.ar} onChange={(e) => handleCategoryChange(index, 'displayName', e.target.value, 'ar')} name={`categories[${index}].displayName.ar`} />
                                        </div>
                                        <SelectField label="Icon" id={`cat-icon-${index}`} value={cat.icon} onChange={(e) => handleCategoryChange(index, 'icon', e.target.value)} name={`categories[${index}].icon`}>
                                            {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                        </SelectField>
                                        <div className="text-right">
                                             <button onClick={() => handleRemoveCategory(cat.id)} className="text-sm font-semibold text-red-600 hover:text-red-800">Remove</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button onClick={handleAddCategory} className="flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline mt-4">
                            <Icon name="plus" className="text-base" /> Add Category
                        </button>
                    </div>
                )}

                {activeTab === 'account' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                         <InputField label="Admin Username" id="adminUsername" name="adminUsername" value={localSettings.adminUsername} onChange={handleInputChange} />
                         <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
                            <div className="space-y-4">
                                <InputField label="Current Password" id="currentPassword" type="password" value="" onChange={() => {}} />
                                <InputField label="New Password" id="newPassword" type="password" value="" onChange={() => {}} />
                                <InputField label="Confirm New Password" id="confirmNewPassword" type="password" value="" onChange={() => {}} />
                            </div>
                         </div>
                    </div>
                )}

                {activeTab === 'accessControl' && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-semibold text-slate-800">Require Sign In to Checkout</label>
                                <p className="text-sm text-slate-500 mt-1">If enabled, users must have an account and be logged in to place an order.</p>
                            </div>
                            <ToggleSwitch
                                checked={localSettings.accessControl?.requireLoginToCheckout ?? false}
                                onChange={(checked) => handleAccessControlToggleChange('requireLoginToCheckout', checked)}
                            />
                        </div>
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Social Logins</h3>
                            <p className="text-sm text-slate-500 mb-6">Allow users to sign up and log in with their social media accounts.</p>
                            <div className="space-y-6">
                                <IntegrationCard
                                    icon="google"
                                    name="Google Login"
                                    description="Allow users to log in with their Google account."
                                    isActive={localSettings.accessControl?.googleLogin?.enabled ?? false}
                                    onToggle={(checked) => handleSocialLoginToggleChange('googleLogin', checked)}
                                >
                                    <InputField
                                        label="Google Client ID"
                                        id="googleClientId"
                                        name="accessControl.googleLogin.clientId"
                                        value={localSettings.accessControl?.googleLogin?.clientId ?? ''}
                                        onChange={handleInputChange}
                                    />
                                </IntegrationCard>
                                <IntegrationCard
                                    icon="facebook"
                                    name="Facebook Login"
                                    description="Allow users to log in with their Facebook account."
                                    isActive={localSettings.accessControl?.facebookLogin?.enabled ?? false}
                                    onToggle={(checked) => handleSocialLoginToggleChange('facebookLogin', checked)}
                                >
                                    <InputField
                                        label="Facebook App ID"
                                        id="facebookAppId"
                                        name="accessControl.facebookLogin.appId"
                                        value={localSettings.accessControl?.facebookLogin?.appId ?? ''}
                                        onChange={handleInputChange}
                                    />
                                </IntegrationCard>
                            </div>
                        </div>
                    </div>
                )}

                 {activeTab === 'payments' && (
                    <div className="space-y-6">
                        <IntegrationCard
                            icon="stripe"
                            name="Stripe"
                            description="Accept credit card payments directly on your store."
                            isActive={localSettings.payments.stripe.enabled}
                            onToggle={(checked) => handlePaymentToggleChange('stripe', checked)}
                        >
                            <InputField
                                label="Stripe API Key"
                                id="stripeApiKey"
                                name="payments.stripe.apiKey"
                                value={localSettings.payments.stripe.apiKey}
                                onChange={handleInputChange}
                                type="password"
                            />
                        </IntegrationCard>
                        <IntegrationCard
                            icon="paypal"
                            name="PayPal"
                            description="Allow customers to pay with their PayPal account."
                            isActive={localSettings.payments.paypal.enabled}
                            onToggle={(checked) => handlePaymentToggleChange('paypal', checked)}
                        >
                            <InputField
                                label="PayPal Client ID"
                                id="paypalClientId"
                                name="payments.paypal.clientId"
                                value={localSettings.payments.paypal.clientId}
                                onChange={handleInputChange}
                            />
                        </IntegrationCard>
                        <IntegrationCard
                            icon="binance"
                            name="Binance Pay"
                            description="Accept cryptocurrency payments via Binance Pay."
                            isActive={localSettings.payments.binance.enabled}
                            onToggle={(checked) => handlePaymentToggleChange('binance', checked)}
                        >
                            <InputField
                                label="Binance API Key"
                                id="binanceApiKey"
                                name="payments.binance.apiKey"
                                value={localSettings.payments.binance.apiKey}
                                onChange={handleInputChange}
                            />
                            <InputField
                                label="Binance Secret Key"
                                id="binanceSecretKey"
                                name="payments.binance.secretKey"
                                value={localSettings.payments.binance.secretKey}
                                onChange={handleInputChange}
                                type="password"
                            />
                        </IntegrationCard>
                         <IntegrationCard
                            icon="dollar-sign"
                            name="Bank Transfer"
                            description="Allow customers to pay via manual bank transfer. Provide your account details below."
                            isActive={localSettings.payments.bankTransfer.enabled}
                            onToggle={(checked) => handlePaymentToggleChange('bankTransfer', checked)}
                        >
                            <InputField
                                label="Display Name"
                                id="bankTransferName"
                                name="payments.bankTransfer.name.value"
                                value={localSettings.payments.bankTransfer.name.value}
                                onChange={handleInputChange}
                            />
                            {bankTransferFields.map(field => (
                                <div key={field} className="border-t pt-4 mt-4">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor={`bank-transfer-${field}`} className="text-sm font-medium text-slate-600">{bankFieldLabels[field]}</label>
                                        <ToggleSwitch 
                                            checked={localSettings.payments.bankTransfer[field].enabled} 
                                            onChange={(checked) => handleBankTransferFieldToggle(field as any, checked)}
                                        />
                                    </div>
                                    {localSettings.payments.bankTransfer[field].enabled && (
                                         <input 
                                            id={`bank-transfer-${field}`}
                                            name={`payments.bankTransfer.${field}.value`}
                                            value={localSettings.payments.bankTransfer[field].value}
                                            onChange={handleInputChange}
                                            className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800"
                                         />
                                    )}
                                </div>
                            ))}
                        </IntegrationCard>
                    </div>
                )}
                
                 {activeTab === 'services' && (
                    <div className="space-y-4">
                        <AccordionItem
                            title="AliExpress Shopper Service"
                            description="Customize the text and behavior of the AliExpress Shopper checkout and thank you pages."
                            icon="cart"
                            isOpen={openAccordion === 'aliexpress'}
                            onToggle={() => setOpenAccordion(openAccordion === 'aliexpress' ? null : 'aliexpress')}
                        >
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-3">Checkout Page</h4>
                                    <MultilingualInputField label="Checkout Title" baseId="ali-checkout-title" name="services.aliexpress.checkoutTitle" values={localSettings.services.aliexpress.checkoutTitle} onChange={handleInputChange} />
                                    <div className="mt-4">
                                      <MultilingualInputField label="Checkout Subtitle" baseId="ali-checkout-subtitle" name="services.aliexpress.checkoutSubtitle" values={localSettings.services.aliexpress.checkoutSubtitle} onChange={handleInputChange} />
                                    </div>
                                     <div className="mt-4">
                                      <MultilingualInputField label='"Next Steps" Information' baseId="ali-checkout-nextsteps" name="services.aliexpress.checkoutNextSteps" values={localSettings.services.aliexpress.checkoutNextSteps} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-slate-700 mb-3">Thank You Page</h4>
                                    <MultilingualInputField label="Thank You Page Title" baseId="ali-ty-title" name="services.aliexpress.thankYouTitle" values={localSettings.services.aliexpress.thankYouTitle} onChange={handleInputChange} />
                                     <div className="mt-4">
                                      <MultilingualInputField label="Thank You Page Subtitle" baseId="ali-ty-subtitle" name="services.aliexpress.thankYouSubtitle" values={localSettings.services.aliexpress.thankYouSubtitle} onChange={handleInputChange} />
                                      <p className="text-xs text-slate-500 mt-1.5" dangerouslySetInnerHTML={{ __html: "Use placeholders: <code>{{orderId}}</code>, <code>{{contactInfo}}</code>" }} />
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="International Shopper Service"
                            description="Customize text for the service that buys physical products from any international store."
                            icon="store"
                            isOpen={openAccordion === 'international'}
                            onToggle={() => setOpenAccordion(openAccordion === 'international' ? null : 'international')}
                        >
                            <div className="space-y-6">
                                 <div>
                                    <h4 className="font-semibold text-slate-700 mb-3">Note Displayed on Page</h4>
                                    <MultilingualInputField label="Note Title" baseId="intl-note-title" name="services.internationalShopper.noteTitle" values={localSettings.services.internationalShopper.noteTitle} onChange={handleInputChange} />
                                    <div className="mt-4">
                                        <MultilingualInputField label="Note Body" baseId="intl-note-body" name="services.internationalShopper.noteBody" values={localSettings.services.internationalShopper.noteBody} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-slate-700 mb-3">Checkout Page</h4>
                                    <MultilingualInputField label="Checkout Title" baseId="intl-checkout-title" name="services.internationalShopper.checkoutTitle" values={localSettings.services.internationalShopper.checkoutTitle} onChange={handleInputChange} />
                                    <div className="mt-4">
                                      <MultilingualInputField label="Checkout Subtitle" baseId="intl-checkout-subtitle" name="services.internationalShopper.checkoutSubtitle" values={localSettings.services.internationalShopper.checkoutSubtitle} onChange={handleInputChange} />
                                    </div>
                                     <div className="mt-4">
                                      <MultilingualInputField label='"Next Steps" Information' baseId="intl-checkout-nextsteps" name="services.internationalShopper.checkoutNextSteps" values={localSettings.services.internationalShopper.checkoutNextSteps} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-slate-700 mb-3">Thank You Page</h4>
                                    <MultilingualInputField label="Thank You Page Title" baseId="intl-ty-title" name="services.internationalShopper.thankYouTitle" values={localSettings.services.internationalShopper.thankYouTitle} onChange={handleInputChange} />
                                     <div className="mt-4">
                                      <MultilingualInputField label="Thank You Page Subtitle" baseId="intl-ty-subtitle" name="services.internationalShopper.thankYouSubtitle" values={localSettings.services.internationalShopper.thankYouSubtitle} onChange={handleInputChange} />
                                      <p className="text-xs text-slate-500 mt-1.5" dangerouslySetInnerHTML={{ __html: "Use placeholders: <code>{{orderId}}</code>, <code>{{contactInfo}}</code>" }} />
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                        
                        <AccordionItem
                            title="Request a Product Service"
                            description="Customize the form fields for the product request page."
                            icon="package"
                            isOpen={openAccordion === 'requestProduct'}
                            onToggle={() => setOpenAccordion(openAccordion === 'requestProduct' ? null : 'requestProduct')}
                        >
                            <h4 className="font-semibold text-slate-700 mb-4">Form Fields Customization</h4>
                            <div className="space-y-3">
                                {localSettings.services.requestProduct.fields.map((field, index) => (
                                    <div key={field.id}>
                                        <button onClick={() => setExpandedRequestField(expandedRequestField === field.id ? null : field.id)} className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 rounded-lg border">
                                            <span className="font-medium text-slate-700">{field.label.en || `(Field ${index + 1})`}</span>
                                            <Icon name="chevronDown" className={`text-xl text-slate-400 transition-transform ${expandedRequestField === field.id ? 'rotate-180' : ''}`} />
                                        </button>
                                        {expandedRequestField === field.id && (
                                            <div className="p-4 mt-1 bg-white border rounded-lg space-y-4">
                                                <MultilingualInputField label="Field Label" baseId={`field-label-${index}`} name={`services.requestProduct.fields[${index}].label`} values={field.label} onChange={handleInputChange} />
                                                <MultilingualInputField label="Field Placeholder" baseId={`field-placeholder-${index}`} name={`services.requestProduct.fields[${index}].placeholder`} values={field.placeholder} onChange={handleInputChange} />
                                                <SelectField label="Field Type" id={`field-type-${index}`} value={field.type} onChange={(e) => handleRequestFieldChange(index, 'type', e.target.value)}>
                                                    <option value="text">Text (Single Line)</option>
                                                    <option value="textarea">Text (Multi-line)</option>
                                                    <option value="email">Email Address</option>
                                                    <option value="url">URL</option>
                                                </SelectField>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-600">Show Field</label>
                                                    <ToggleSwitch checked={field.enabled} onChange={(checked) => handleRequestFieldChange(index, 'enabled', checked)} />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-600">Make Field Required</label>
                                                    <ToggleSwitch checked={field.required} onChange={(checked) => handleRequestFieldChange(index, 'required', checked)} />
                                                </div>
                                                {!field.isDefault ? (
                                                    <div className="text-right border-t pt-3">
                                                        <button type="button" onClick={() => handleRemoveRequestField(index)} className="text-sm font-semibold text-red-600 hover:text-red-800">Remove Field</button>
                                                    </div>
                                                ) : <p className="text-xs text-slate-400 text-center pt-2 border-t">This is a default field and cannot be deleted.</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddNewRequestField} className="flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline mt-4">
                                    <Icon name="plus" className="text-base" /> Add New Field
                                </button>
                            </div>
                        </AccordionItem>
                    </div>
                )}
                
                 {activeTab === 'marketing' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
                            <InputField
                                label="Facebook Pixel ID"
                                id="facebookPixelId"
                                name="marketing.facebookPixelId"
                                value={localSettings.marketing.facebookPixelId}
                                onChange={handleInputChange}
                            />
                            <InputField
                                label="Google Analytics ID"
                                id="googleAnalyticsId"
                                name="marketing.googleAnalyticsId"
                                value={localSettings.marketing.googleAnalyticsId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <IntegrationCard
                            icon="mail"
                            name="Mailchimp"
                            description="Sync your subscribers with Mailchimp and manage campaigns."
                            isActive={localSettings.marketing.mailchimp.enabled}
                            onToggle={(checked) => handleMarketingToggleChange('mailchimp', checked)}
                        >
                            <InputField
                                label="Mailchimp API Key"
                                id="mailchimpApiKey"
                                name="marketing.mailchimp.apiKey"
                                value={localSettings.marketing.mailchimp.apiKey}
                                onChange={handleInputChange}
                                type="password"
                            />
                            <InputField
                                label="Mailchimp Audience ID"
                                id="mailchimpListId"
                                name="marketing.mailchimp.listId"
                                value={localSettings.marketing.mailchimp.listId}
                                onChange={handleInputChange}
                            />
                        </IntegrationCard>
                         <IntegrationCard
                            icon="mail"
                            name="SendGrid"
                            description="Send transactional emails and campaigns via SendGrid for high deliverability."
                            isActive={localSettings.marketing.sendgrid.enabled}
                            onToggle={(checked) => handleMarketingToggleChange('sendgrid', checked)}
                        >
                            <InputField
                                label="SendGrid API Key"
                                id="sendgridApiKey"
                                name="marketing.sendgrid.apiKey"
                                value={localSettings.marketing.sendgrid.apiKey}
                                onChange={handleInputChange}
                                type="password"
                            />
                        </IntegrationCard>
                    </div>
                 )}

                 {activeTab === 'advanced' && (
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                            <div>
                                <label htmlFor="developerMode" className="font-semibold text-slate-800">Developer Mode</label>
                                <p className="text-sm text-slate-500">Enable developer-oriented features and logging.</p>
                            </div>
                            <ToggleSwitch checked={localSettings.advanced.developerMode} onChange={(checked) => handleAdvancedToggleChange('developerMode', checked)} />
                        </div>
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold text-slate-800 mb-4">Maintenance Mode</h3>
                          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div>
                                  <label className="font-semibold text-yellow-800">Enable Maintenance Mode</label>
                                  <p className="text-sm text-yellow-600 mt-1">Take your store offline for visitors. The admin panel will remain accessible.</p>
                              </div>
                              <ToggleSwitch checked={localSettings.advanced.maintenanceMode} onChange={(checked) => handleAdvancedToggleChange('maintenanceMode', checked)} />
                          </div>
                          <div className="mt-6 space-y-4">
                              <MultilingualInputField baseId="maintenance-title" label="Maintenance Page Title" name="maintenancePage.title" values={localSettings.maintenancePage.title} onChange={handleInputChange} />
                              <MultilingualInputField baseId="maintenance-subtitle" label="Maintenance Page Message" name="maintenancePage.subtitle" values={localSettings.maintenancePage.subtitle} onChange={handleInputChange} />
                          </div>
                        </div>
                        <TextareaField
                            label="Custom CSS"
                            id="customCss"
                            name="advanced.customCss"
                            value={localSettings.advanced.customCss}
                            onChange={handleInputChange}
                            rows={10}
                            description="Add custom CSS styles to your storefront. Use with caution."
                        />
                        <TextareaField
                            label="Custom JavaScript"
                            id="customJs"
                            name="advanced.customJs"
                            value={localSettings.advanced.customJs}
                            onChange={handleInputChange}
                            rows={10}
                            description="Add custom JavaScript snippets. Use with extreme caution."
                        />
                     </div>
                 )}

            </div>
        </div>
    );
};
