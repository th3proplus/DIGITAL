import React, { useState, useEffect } from 'react';
import { MobileDataProvider, DataPlan } from '../types';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface AdminEditMobileDataProviderPageProps {
  providerToEdit?: MobileDataProvider | null;
  onSave: (provider: MobileDataProvider) => void;
  onCancel: () => void;
}

const defaultProviderData: Omit<MobileDataProvider, 'id'> = {
    name: '',
    logoUrl: '',
    galleryImageUrl: '',
    pageImageUrl: '',
    showLogoOnGallery: true,
    plans: [],
};

export const AdminEditMobileDataProviderPage: React.FC<AdminEditMobileDataProviderPageProps> = ({ providerToEdit, onSave, onCancel }) => {
    const { settings } = useSettings();
    const [providerData, setProviderData] = useState<Omit<MobileDataProvider, 'id'> & { id?: string }>(defaultProviderData);

    useEffect(() => {
        if (providerToEdit) {
            setProviderData(providerToEdit);
        } else {
            setProviderData(defaultProviderData);
        }
    }, [providerToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProviderData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (name: 'showLogoOnGallery') => {
        setProviderData(prev => ({...prev, [name]: !prev[name]}));
    };

    const handlePlanChange = (index: number, field: keyof DataPlan, value: any) => {
        const newPlans = [...providerData.plans];
        if (field === 'price') {
            const parsedPrice = parseFloat(value);
            (newPlans[index] as any)[field] = isNaN(parsedPrice) ? 0 : parsedPrice;
        } else {
            (newPlans[index] as any)[field] = value;
        }
        setProviderData(prev => ({ ...prev, plans: newPlans }));
    };
    
    const handleAddPlan = () => {
        const newPlan: DataPlan = {
            id: `new-${Date.now()}`,
            name: '', // This is a translation key
            dataAmount: '',
            price: 0,
            status: 'available',
        };
        setProviderData(prev => ({ ...prev, plans: [...prev.plans, newPlan] }));
    };
    
    const handleRemovePlan = (id: string) => {
        setProviderData(prev => ({ ...prev, plans: providerData.plans.filter(p => p.id !== id) }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(providerData as MobileDataProvider);
    };

    const isFormValid = providerData.name.trim() !== '' && providerData.logoUrl.trim() !== '' && providerData.galleryImageUrl.trim() !== '' && providerData.pageImageUrl.trim() !== '' && providerData.plans.length > 0 && providerData.plans.every(p => p.name.trim() !== '' && p.dataAmount.trim() !== '' && p.price >= 0);

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-end items-center mb-8">
                <button type="button" onClick={onCancel} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5 px-5 rounded-lg border border-gray-300 transition-colors duration-200 mr-3">
                    Cancel
                </button>
                <button type="submit" disabled={!isFormValid} className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm disabled:bg-gray-400">
                    <Icon name="check" className="w-5 h-5" />
                    Save
                </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                    <input id="name" name="name" value={providerData.name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>
                <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input id="logoUrl" name="logoUrl" value={providerData.logoUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>
                <div>
                    <label htmlFor="galleryImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Gallery Image URL</label>
                    <input id="galleryImageUrl" name="galleryImageUrl" value={providerData.galleryImageUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>
                <div>
                    <label htmlFor="pageImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Product Page Image URL</label>
                    <input id="pageImageUrl" name="pageImageUrl" value={providerData.pageImageUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>
                
                <div className="border-t pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-medium text-gray-800">Show Logo on Home Page</span>
                            <p className="text-xs text-gray-500 mt-1">Display the provider's logo on the home page gallery card.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={providerData.showLogoOnGallery} onChange={() => handleToggle('showLogoOnGallery')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-t pt-6">Data Plans</h4>
                    <div className="space-y-3">
                        {providerData.plans.map((plan, index) => (
                            <div key={plan.id} className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg border">
                                <div className="col-span-12 sm:col-span-3">
                                    <label className="text-xs font-medium text-gray-600">Plan Name Key (e.g., plan.2gb)</label>
                                    <input value={plan.name} onChange={e => handlePlanChange(index, 'name', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm p-2" />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="text-xs font-medium text-gray-600">Data Amount (e.g., 2 GB)</label>
                                    <input value={plan.dataAmount} onChange={e => handlePlanChange(index, 'dataAmount', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm p-2" />
                                </div>
                                <div className="col-span-6 sm:col-span-2">
                                    <label className="text-xs font-medium text-gray-600">Price ({settings.currency})</label>
                                    <input type="number" step="0.01" value={plan.price} onChange={e => handlePlanChange(index, 'price', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm p-2" />
                                </div>
                                <div className="col-span-12 sm:col-span-2">
                                    <label className="text-xs font-medium text-gray-600">Status</label>
                                    <select value={plan.status} onChange={e => handlePlanChange(index, 'status', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm p-2">
                                        <option value="available">Available</option>
                                        <option value="coming_soon">Coming Soon</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>
                                </div>
                                <div className="col-span-12 sm:col-span-2 flex items-end justify-end">
                                     <button type="button" onClick={() => handleRemovePlan(plan.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors">
                                        <Icon name="trash" className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={handleAddPlan} className="mt-4 text-sm font-semibold text-brand-red hover:text-brand-red-light flex items-center gap-1 transition-colors">
                        <Icon name="plus" className="w-4 h-4" />
                        Add Plan
                    </button>
                </div>
            </div>
        </form>
    );
};
