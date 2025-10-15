import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Category } from '../types';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface AdminAddProductPageProps {
  onSave: (product: Product) => void;
  onCancel: () => void;
  categories: Category[];
}

const defaultProductData: Omit<Product, 'id' | 'socialProof' | 'rating' | 'reviewsCount'> = {
    slug: '',
    nameKey: '',
    logoUrl: '',
    imageUrl: '',
    color: '#F85757',
    category: '',
    status: 'available',
    specialTagKey: '',
    featuresKeys: [],
    variants: [],
    defaultVariantId: '',
};

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');


export const AdminAddProductPage: React.FC<AdminAddProductPageProps> = ({ onSave, onCancel, categories }) => {
    const { settings } = useSettings();
    const [productData, setProductData] = useState<Omit<Product, 'id' | 'socialProof' | 'rating' | 'reviewsCount'>>(defaultProductData);

    useEffect(() => {
        if (categories.length > 0) {
            setProductData(prev => ({...prev, category: categories[0]?.name || ''}));
        }
    }, [categories]);
    

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
            defaultVariantId: prev.defaultVariantId || newVariant.id
        }));
    };
    
    const handleRemoveVariant = (id: string) => {
        const newVariants = productData.variants.filter(v => v.id !== id);
        setProductData(prev => ({
            ...prev,
            variants: newVariants,
            defaultVariantId: prev.defaultVariantId === id ? (newVariants[0]?.id || '') : prev.defaultVariantId,
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullProduct: Product = {
            ...productData,
            id: `prod-${Date.now()}`, // temp id, backend should generate this
            slug: slugify(productData.nameKey), // auto-generate slug
            socialProof: { avatars: [], textKey: '' },
            rating: 0,
            reviewsCount: 0,
        };
        onSave(fullProduct);
    };

    const isFormValid =
        productData.nameKey.trim() !== '' &&
        productData.logoUrl.trim() !== '' &&
        productData.imageUrl.trim() !== '' &&
        productData.category.trim() !== '' &&
        productData.variants.length > 0 &&
        productData.variants.every(v => v.nameKey.trim() !== '' && (!v.isFreeTrial ? (v.price ?? -1) >= 0 : true));

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
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nameKey" className="block text-sm font-medium text-gray-700 mb-1">Product Name Key</label>
                            <input id="nameKey" name="nameKey" value={productData.nameKey} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={productData.category}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red"
                            >
                                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.displayName.en}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                        <input id="logoUrl" name="logoUrl" value={productData.logoUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input id="imageUrl" name="imageUrl" value={productData.imageUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
                            <input id="color" name="color" type="color" value={productData.color} onChange={handleChange} className="w-full h-10 p-1 bg-gray-50 border border-gray-300 rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="specialTagKey" className="block text-sm font-medium text-gray-700 mb-1">Special Tag Key (Optional)</label>
                            <input id="specialTagKey" name="specialTagKey" value={productData.specialTagKey} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="status" name="status" value={productData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red">
                            <option value="available">Available</option>
                            <option value="coming_soon">Coming Soon</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="featuresKeys" className="block text-sm font-medium text-gray-700 mb-1">Features (one key per line)</label>
                        <textarea id="featuresKeys" name="featuresKeys" value={productData.featuresKeys.join('\n')} onChange={handleFeaturesChange} rows={3} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 border-t pt-6">Variants</h4>
                        <div className="space-y-3">
                            {productData.variants.map((variant, index) => (
                                <div key={variant.id} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg border">
                                    <div className="col-span-12 sm:col-span-5">
                                        <label className="text-xs font-medium text-gray-600">Plan Name Key</label>
                                        <input value={variant.nameKey} onChange={e => handleVariantChange(index, 'nameKey', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm p-2" required />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="text-xs font-medium text-gray-600">Price ({settings.currency})</label>
                                        <input type="number" step="0.01" value={variant.price ?? ''} disabled={variant.isFreeTrial} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm p-2 disabled:bg-gray-200" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-2 flex items-end pb-1">
                                        <label className="flex items-center gap-1.5 text-sm text-gray-700">
                                            <input type="checkbox" checked={!!variant.isFreeTrial} onChange={e => handleVariantChange(index, 'isFreeTrial', e.target.checked)} className="rounded text-brand-red focus:ring-brand-red shadow-sm" />
                                            Free Trial
                                        </label>
                                    </div>
                                    <div className="col-span-12 sm:col-span-2 flex items-end justify-end">
                                         <button type="button" onClick={() => handleRemoveVariant(variant.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors">
                                            <Icon name="trash" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button type="button" onClick={handleAddVariant} className="mt-4 text-sm font-semibold text-brand-red hover:text-brand-red-light flex items-center gap-1 transition-colors">
                            <Icon name="plus" className="w-4 h-4" />
                            Add Variant
                        </button>
                    </div>

                     {productData.variants.length > 0 && (
                        <div className="border-t pt-6">
                            <label htmlFor="defaultVariantId" className="block text-sm font-medium text-gray-700 mb-1">Default Plan</label>
                            <select id="defaultVariantId" name="defaultVariantId" value={productData.defaultVariantId} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red">
                                {productData.variants.map(v => <option key={v.id} value={v.id}>{v.nameKey}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};