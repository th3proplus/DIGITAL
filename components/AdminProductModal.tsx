import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Category } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
  categories: Category[];
}

const defaultProductData: Product = {
    id: '', // Will be overwritten or generated
    nameKey: '',
    logoUrl: '',
    imageUrl: '',
    color: '#F85757',
    category: '',
    // FIX: Added missing status property
    status: 'available',
    specialTagKey: '',
    featuresKeys: [],
    pageIndicator: '',
    rating: 0,
    reviewsCount: 0,
    socialProof: { avatars: [], textKey: ''},
    variants: [],
    defaultVariantId: '',
};

export const AdminProductModal: React.FC<AdminProductModalProps> = ({ isOpen, onClose, onSave, productToEdit, categories }) => {
    const { t, language } = useI18n();
    const { settings } = useSettings();
    const [productData, setProductData] = useState<Product>(defaultProductData);

    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setProductData({
                    ...defaultProductData,
                    ...productToEdit,
                    featuresKeys: productToEdit.featuresKeys || [],
                });
            } else {
                setProductData({ ...defaultProductData, category: categories[0]?.name || '' });
            }
        }
    }, [isOpen, productToEdit, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProductData(prev => ({ ...prev, featuresKeys: e.target.value.split('\n') }));
    };

    const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
        const newVariants = [...productData.variants];
        if (field === 'price') {
            const parsedPrice = parseFloat(value);
            // Store undefined for invalid/empty numbers to prevent NaN errors.
            (newVariants[index] as any)[field] = isNaN(parsedPrice) ? undefined : parsedPrice;
        } else if (field === 'isFreeTrial') {
            (newVariants[index] as any)[field] = value;
            if (value) {
                (newVariants[index] as any)['price'] = undefined;
            }
        } else {
            (newVariants[index] as any)[field] = value;
        }
        setProductData(prev => ({ ...prev, variants: newVariants }));
    };
    
    const handleAddVariant = () => {
        const newVariant: ProductVariant = {
            id: `new-${Date.now()}`,
            nameKey: '',
            price: 0,
            isFreeTrial: false
        };
        const newVariants = [...productData.variants, newVariant];
        setProductData(prev => ({ 
            ...prev, 
            variants: newVariants,
            // If it's the first variant, make it the default
            defaultVariantId: prev.defaultVariantId || newVariant.id
        }));
    };
    
    const handleRemoveVariant = (id: string) => {
        const newVariants = productData.variants.filter(v => v.id !== id);
        setProductData(prev => ({
            ...prev,
            variants: newVariants,
            // If the deleted variant was the default, reset it
            defaultVariantId: prev.defaultVariantId === id ? (newVariants[0]?.id || '') : prev.defaultVariantId,
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(productData);
    };

    if (!isOpen) return null;

    const isFormValid =
        productData.nameKey.trim() !== '' &&
        productData.logoUrl.trim() !== '' &&
        productData.imageUrl.trim() !== '' &&
        productData.category.trim() !== '' &&
        productData.variants.length > 0 &&
        productData.variants.every(v => v.nameKey.trim() !== '');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {productToEdit ? t('admin.modal_edit_product_title') : t('admin.modal_add_product_title')}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nameKey" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_name_key')}</label>
                                <input id="nameKey" name="nameKey" value={productData.nameKey} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_category')}</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red"
                                >
                                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.displayName[language]}</option>)}
                                </select>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_logo_url')}</label>
                            <input id="logoUrl" name="logoUrl" value={productData.logoUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                        </div>
                         <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_image_url')}</label>
                            <input id="imageUrl" name="imageUrl" value={productData.imageUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="color" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_color')}</label>
                                <input id="color" name="color" type="color" value={productData.color} onChange={handleChange} className="w-full h-10 p-1 bg-gray-50 border border-gray-300 rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="specialTagKey" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_special_tag_key')}</label>
                                <input id="specialTagKey" name="specialTagKey" value={productData.specialTagKey || ''} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="featuresKeys" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_features')}</label>
                            <textarea id="featuresKeys" name="featuresKeys" value={productData.featuresKeys.join('\n')} onChange={handleFeaturesChange} rows={3} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        
                        {/* Variants */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-700 mb-2">{t('admin.form_variants')}</h4>
                            <div className="space-y-3">
                                {productData.variants.map((variant, index) => (
                                    <div key={variant.id} className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg border">
                                        <div className="col-span-12 sm:col-span-5">
                                            <label className="text-xs text-gray-500">{t('admin.form_variant_name_key')}</label>
                                            <input value={variant.nameKey} onChange={e => handleVariantChange(index, 'nameKey', e.target.value)} required className="w-full border-gray-300 rounded-md text-sm p-1.5" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-xs text-gray-500">{t('admin.form_variant_price', { currency: settings.currency })}</label>
                                            <input type="number" step="0.01" value={variant.price ?? ''} disabled={variant.isFreeTrial} onChange={e => handleVariantChange(index, 'price', e.target.value)} required={!variant.isFreeTrial} className="w-full border-gray-300 rounded-md text-sm p-1.5 disabled:bg-gray-200" />
                                        </div>
                                        <div className="col-span-6 sm:col-span-2 flex items-end">
                                            <label className="flex items-center gap-1.5 text-sm">
                                                <input type="checkbox" checked={!!variant.isFreeTrial} onChange={e => handleVariantChange(index, 'isFreeTrial', e.target.checked)} className="rounded text-brand-red focus:ring-brand-red" />
                                                {t('admin.form_variant_free')}
                                            </label>
                                        </div>
                                        <div className="col-span-12 sm:col-span-2 flex items-end justify-end">
                                             <button type="button" onClick={() => handleRemoveVariant(variant.id)} className="text-gray-400 hover:text-red-600">
                                                <Icon name="trash" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <button type="button" onClick={handleAddVariant} className="mt-3 text-sm font-semibold text-brand-red hover:underline flex items-center gap-1">
                                <Icon name="plus" className="w-4 h-4" />
                                {t('admin.form_add_variant')}
                            </button>
                        </div>

                         {productData.variants.length > 0 && (
                            <div>
                                <label htmlFor="defaultVariantId" className="block text-sm font-medium text-gray-600 mb-1">{t('admin.form_default_variant')}</label>
                                <select id="defaultVariantId" name="defaultVariantId" value={productData.defaultVariantId} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red">
                                    {productData.variants.map(v => <option key={v.id} value={v.id}>{t(v.nameKey) || v.nameKey}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            {t('admin.modal_cancel')}
                        </button>
                        <button 
                            type="submit" 
                            disabled={!isFormValid}
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-red border border-transparent rounded-md hover:bg-brand-red-light disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {t('admin.modal_save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};