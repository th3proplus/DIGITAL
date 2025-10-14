import React, { useState, useEffect } from 'react';
import { User, RequestProductFormField, Settings } from '../types';
import { useI18n } from '../hooks/useI18n';
import { Icon } from './Icon';

interface RequestProductPageProps {
  onSubmit: (submission: { formData: Record<string, string>, userName: string, userEmail: string }) => void;
  onBackToStore: () => void;
  currentUser: User | null;
  settings: Settings['services']['requestProduct'];
}

// Moved InputField and TextareaField outside of the main component
// to prevent them from being re-created on every render, which causes focus loss.
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <input
            id={id}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-colors placeholder:text-gray-400 disabled:bg-gray-100"
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

export const RequestProductPage: React.FC<RequestProductPageProps> = ({ onSubmit, onBackToStore, currentUser, settings }) => {
    const { t, language } = useI18n();
    
    // Initialize the form data structure once based on the available fields.
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        const initialData: Record<string, string> = {};
        settings.fields.forEach(field => {
            initialData[field.id] = '';
        });
        return initialData;
    });

    // This effect syncs the current user's data to the form when they log in or out,
    // without interfering with other fields.
    useEffect(() => {
        const userNameFieldId = settings.fields.find(f => f.id === 'userName')?.id;
        const userEmailFieldId = settings.fields.find(f => f.id === 'userEmail')?.id;

        if (currentUser) {
            if (userNameFieldId) {
                setFormData(prev => ({...prev, [userNameFieldId]: currentUser.name}));
            }
            if (userEmailFieldId) {
                setFormData(prev => ({...prev, [userEmailFieldId]: currentUser.email}));
            }
        } else {
            // Clear user-specific fields on logout
            if (userNameFieldId) {
                setFormData(prev => ({...prev, [userNameFieldId]: ''}));
            }
            if (userEmailFieldId) {
                setFormData(prev => ({...prev, [userEmailFieldId]: ''}));
            }
        }
    }, [currentUser, settings.fields]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userNameField = settings.fields.find(f => f.id === 'userName');
        const userEmailField = settings.fields.find(f => f.id === 'userEmail');
        
        const submissionData = {
            formData: formData,
            userName: userNameField && formData[userNameField.id] ? formData[userNameField.id] : (currentUser?.name || ''),
            userEmail: userEmailField && formData[userEmailField.id] ? formData[userEmailField.id] : (currentUser?.email || ''),
        }
        onSubmit(submissionData);
    };
    
    const renderField = (field: RequestProductFormField) => {
        if (!field.enabled) return null;

        const commonProps = {
            id: field.id,
            name: field.id,
            label: field.label[language as keyof typeof field.label],
            placeholder: field.placeholder[language as keyof typeof field.placeholder],
            value: formData[field.id] || '',
            onChange: handleInputChange,
            required: field.required,
            disabled: (field.id === 'userName' || field.id === 'userEmail') && !!currentUser
        };

        if (field.type === 'textarea') {
            return <TextareaField {...commonProps} rows={4} />;
        }
        return <InputField {...commonProps} type={field.type} />;
    };

    return (
        <main className="flex-grow bg-gray-50">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-brand-text-primary tracking-tight">{t('request_product.title')}</h1>
                    <p className="text-brand-text-secondary mt-2 text-lg">{t('request_product.subtitle')}</p>
                </div>

                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-6">{t('request_product.form_title')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {settings.fields.map(field => (
                            <div key={field.id}>
                                {renderField(field)}
                            </div>
                        ))}
                        <div className="!mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                            <button
                                type="button"
                                onClick={onBackToStore}
                                className="text-sm font-semibold text-brand-red hover:underline"
                            >
                                &larr; {t('checkout.back_to_store')}
                            </button>
                            <button 
                                type="submit" 
                                className="w-full sm:w-auto bg-brand-red text-white py-3 px-8 rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2"
                            >
                                <Icon name="rocket" className="w-5 h-5"/>
                                {t('request_product.submit_button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};