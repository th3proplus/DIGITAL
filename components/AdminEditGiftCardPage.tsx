import React, { useState, useEffect } from 'react';
import { GiftCard } from '../types';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface AdminEditGiftCardPageProps {
  cardToEdit?: GiftCard | null;
  onSave: (card: GiftCard) => void;
  onCancel: () => void;
}

const defaultCardData: Omit<GiftCard, 'id'> = {
    name: '',
    logoUrl: '',
    galleryImageUrl: '',
    pageImageUrl: '',
    denominations: [],
    showLogoOnGallery: true,
    status: 'available',
};

export const AdminEditGiftCardPage: React.FC<AdminEditGiftCardPageProps> = ({ cardToEdit, onSave, onCancel }) => {
    const { settings } = useSettings();
    const [cardData, setCardData] = useState<Omit<GiftCard, 'id'> & { id?: string }>(defaultCardData);

    useEffect(() => {
        if (cardToEdit) {
            setCardData(cardToEdit);
        } else {
            setCardData(defaultCardData);
        }
    }, [cardToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (name: 'showLogoOnGallery') => {
        setCardData(prev => ({...prev, [name]: !prev[name]}));
    };

    const handleDenominationChange = (index: number, value: string) => {
        const newDenominations = [...cardData.denominations];
        const parsedValue = parseInt(value, 10);
        newDenominations[index] = isNaN(parsedValue) ? 0 : parsedValue;
        setCardData(prev => ({ ...prev, denominations: newDenominations }));
    };
    
    const handleAddDenomination = () => {
        setCardData(prev => ({ ...prev, denominations: [...prev.denominations, 0] }));
    };
    
    const handleRemoveDenomination = (index: number) => {
        setCardData(prev => ({ ...prev, denominations: prev.denominations.filter((_, i) => i !== index) }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(cardData as GiftCard);
    };

    const isFormValid = cardData.name.trim() !== '' && cardData.logoUrl.trim() !== '' && cardData.galleryImageUrl.trim() !== '' && cardData.pageImageUrl.trim() !== '' && cardData.denominations.length > 0 && cardData.denominations.every(d => d > 0);

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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
                    <input id="name" name="name" value={cardData.name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>
                <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input id="logoUrl" name="logoUrl" value={cardData.logoUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>
                <div>
                    <label htmlFor="galleryImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Gallery Image URL</label>
                    <input id="galleryImageUrl" name="galleryImageUrl" value={cardData.galleryImageUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>
                <div>
                    <label htmlFor="pageImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Product Page Image URL</label>
                    <input id="pageImageUrl" name="pageImageUrl" value={cardData.pageImageUrl} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red" />
                </div>

                <div className="border-t pt-6">
                     <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status" name="status" value={cardData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-red focus:border-brand-red">
                        <option value="available">Available</option>
                        <option value="coming_soon">Coming Soon</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>
                
                <div className="border-t pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-medium text-gray-800">Show Logo on Home Page</span>
                            <p className="text-xs text-gray-500 mt-1">Display the gift card's logo on the home page gallery.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={cardData.showLogoOnGallery} onChange={() => handleToggle('showLogoOnGallery')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-t pt-6">Denominations</h4>
                    <div className="space-y-3">
                        {cardData.denominations.map((denomination, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    value={denomination} 
                                    onChange={e => handleDenominationChange(index, e.target.value)} 
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2"
                                    placeholder={`Amount in ${settings.currency}`}
                                />
                                <button type="button" onClick={() => handleRemoveDenomination(index)} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors">
                                    <Icon name="trash" className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={handleAddDenomination} className="mt-4 text-sm font-semibold text-brand-red hover:text-brand-red-light flex items-center gap-1 transition-colors">
                        <Icon name="plus" className="w-4 h-4" />
                        Add Denomination
                    </button>
                </div>
            </div>
        </form>
    );
};
