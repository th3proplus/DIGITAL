import React from 'react';
import { GiftCard } from '../types';
import { Icon } from './Icon';

interface AdminGiftCardsPageProps {
  cards: GiftCard[];
  onNavigateToAddCard: () => void;
  onEditCard: (card: GiftCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export const AdminGiftCardsPage: React.FC<AdminGiftCardsPageProps> = ({ cards, onNavigateToAddCard, onEditCard, onDeleteCard }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Gift Cards</h3>
        <button
          onClick={onNavigateToAddCard}
          className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <Icon name="plus" className="w-5 h-5" />
          Add Gift Card
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Card Name</th>
              <th scope="col" className="px-6 py-3">Denominations</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <img src={card.logoUrl} alt={card.name} className="w-10 h-10 rounded-md object-contain" />
                    <span>{card.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{card.denominations.length}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEditCard(card)} className="text-gray-500 hover:text-brand-red p-2 rounded-md transition-colors">
                        <Icon name="edit" className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDeleteCard(card.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors">
                          <Icon name="trash" className="w-5 h-5" />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
