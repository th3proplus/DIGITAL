import React, { useState, useEffect } from 'react';
import { CartItem, GiftCard } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface GiftCardSectionProps {
  onAddToCart: (item: CartItem) => void;
  giftCards: GiftCard[];
  initialGiftCardId: string | null;
}

export const GiftCardSection: React.FC<GiftCardSectionProps> = ({ onAddToCart, giftCards, initialGiftCardId }) => {
    const { t } = useI18n();
    const { formatCurrency, settings } = useSettings();
    const [selectedCard, setSelectedCard] = useState<GiftCard>(giftCards[0]);
    const [selectedAmount, setSelectedAmount] = useState<number>(giftCards[0].denominations[0]);

    useEffect(() => {
        if (initialGiftCardId) {
            const cardToSelect = giftCards.find(c => c.id === initialGiftCardId);
            if (cardToSelect) {
                setSelectedCard(cardToSelect);
                setSelectedAmount(cardToSelect.denominations[0]);
            }
        }
    }, [initialGiftCardId, giftCards]);
    
    const handleSelectCard = (card: GiftCard) => {
        setSelectedCard(card);
        setSelectedAmount(card.denominations[0]);
    };

    const handleAddToCart = () => {
        const cartItem: CartItem = {
            productId: `giftcard-${selectedCard.id}`,
            variantId: `amount-${selectedAmount}`,
            quantity: 1,
            productNameKey: selectedCard.name,
            variantNameKey: formatCurrency(selectedAmount, { currency: settings.currency }),
            logoUrl: selectedCard.logoUrl,
            price: selectedAmount, // Assuming price is the same as denomination in store's primary currency for simplicity
            isFreeTrial: false,
            metadata: {
                isCustomOrder: true,
                customOrderType: 'giftCard',
                giftCardBrand: selectedCard.name,
                denomination: selectedAmount,
            },
        };
        onAddToCart(cartItem);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">{t('services.gift_cards_title')}</h2>
            <p className="text-brand-text-secondary mb-6">{t('services.gift_cards_subtitle')}</p>
            
            <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-2">{t('services.select_brand')}</p>
                <div className="flex flex-wrap gap-3">
                    {giftCards.map(card => (
                        <button
                            key={card.id}
                            onClick={() => handleSelectCard(card)}
                            className={`p-2 border-2 rounded-lg transition-all duration-200 ${selectedCard.id === card.id ? 'border-brand-red shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <img src={card.logoUrl} alt={card.name} className="w-20 h-12 object-contain" />
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mb-6">
                 <p className="text-sm font-semibold text-gray-600 mb-2">{t('services.select_amount')}</p>
                 <div className="flex flex-wrap gap-3">
                     {selectedCard.denominations.map(amount => (
                         <button
                             key={amount}
                             onClick={() => setSelectedAmount(amount)}
                             className={`px-5 py-2.5 rounded-lg font-semibold border-2 transition-colors ${selectedAmount === amount ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-gray-200 text-brand-text-primary hover:border-brand-red'}`}
                         >
                             {formatCurrency(amount, { currency: settings.currency })}
                         </button>
                     ))}
                 </div>
            </div>
            
            <button
                onClick={handleAddToCart}
                className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2"
            >
                <Icon name="cart" className="w-5 h-5" />
                {t('product.add_to_cart')}
            </button>
        </div>
    );
};