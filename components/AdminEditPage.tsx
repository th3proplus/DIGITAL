import React, { useState, useEffect } from 'react';
import { CustomPage } from '../types';
import { Icon } from './Icon';

interface AdminEditPageProps {
  pageToEdit?: CustomPage | null;
  onSave: (page: CustomPage) => void;
  onCancel: () => void;
}

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const defaultPageData: Omit<CustomPage, 'id'> = {
    slug: '',
    title: { en: '', fr: '', ar: '' },
    content: { en: '', fr: '', ar: '' },
    isVisible: true,
    showInHeader: false,
    showInFooter: false,
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string; }> = ({ label, id, description, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" {...props} />
        {description && <p className="text-xs text-gray-500 mt-1.5">{description}</p>}
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={id} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red font-mono text-sm" {...props} />
    </div>
);

export const AdminEditPage: React.FC<AdminEditPageProps> = ({ pageToEdit, onSave, onCancel }) => {
    const [pageData, setPageData] = useState<Omit<CustomPage, 'id'> & { id?: string }>(defaultPageData);

    useEffect(() => {
        if (pageToEdit) {
            setPageData(pageToEdit);
        } else {
            setPageData(defaultPageData);
        }
    }, [pageToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPageData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultilingualChange = (field: 'title' | 'content', lang: 'en' | 'fr' | 'ar', value: string) => {
        setPageData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    const handleTitleChange = (lang: 'en' | 'fr' | 'ar', value: string) => {
        handleMultilingualChange('title', lang, value);
        // Auto-generate slug from English title if creating a new page
        if (!pageToEdit && lang === 'en') {
            setPageData(prev => ({ ...prev, slug: slugify(value) }));
        }
    };
    
    const handleToggle = (name: 'isVisible' | 'showInHeader' | 'showInFooter') => {
        setPageData(prev => ({...prev, [name]: !prev[name]}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure slug is not empty
        const finalPageData = { ...pageData, slug: pageData.slug || slugify(pageData.title.en) };
        onSave(finalPageData as CustomPage);
    };

    const isFormValid = pageData.title.en.trim() !== '' && pageData.slug.trim() !== '';

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-end items-center mb-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5 px-5 rounded-lg border border-gray-300 transition-colors duration-200 mr-3"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm disabled:bg-gray-400"
                >
                    <Icon name="check" className="w-5 h-5" />
                    Save
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField label="English" id="title-en" value={pageData.title.en} onChange={e => handleTitleChange('en', e.target.value)} required />
                            <InputField label="Français" id="title-fr" value={pageData.title.fr} onChange={e => handleMultilingualChange('title', 'fr', e.target.value)} />
                            <InputField label="العربية" id="title-ar" value={pageData.title.ar} onChange={e => handleMultilingualChange('title', 'ar', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                         <div className="space-y-4">
                            <TextareaField label="English" id="content-en" rows={10} value={pageData.content.en} onChange={e => handleMultilingualChange('content', 'en', e.target.value)} />
                            <TextareaField label="Français" id="content-fr" rows={10} value={pageData.content.fr} onChange={e => handleMultilingualChange('content', 'fr', e.target.value)} />
                            <TextareaField label="العربية" id="content-ar" rows={10} value={pageData.content.ar} onChange={e => handleMultilingualChange('content', 'ar', e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                     <InputField label="URL Slug" id="slug" name="slug" value={pageData.slug} onChange={handleChange} required description="Unique URL-friendly identifier. E.g., 'about-us'." />
                     <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Visibility</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'isVisible', label: "Visible (Published)", description: "Make this page accessible to visitors." },
                                { name: 'showInHeader', label: "Show in Header Menu", description: "Add a link to this page in the main navigation." },
                                { name: 'showInFooter', label: "Show in Footer Menu", description: "Add a link to this page in the footer navigation." },
                            ].map(item => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-800">{item.label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={pageData[item.name as keyof typeof pageData] as boolean} onChange={() => handleToggle(item.name as any)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        </form>
    );
};
