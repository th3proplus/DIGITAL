import React from 'react';
import { MobileDataProvider } from '../types';
import { Icon } from './Icon';

interface AdminMobileDataProvidersPageProps {
  providers: MobileDataProvider[];
  onNavigateToAddProvider: () => void;
  onEditProvider: (provider: MobileDataProvider) => void;
  onDeleteProvider: (providerId: string) => void;
}

export const AdminMobileDataProvidersPage: React.FC<AdminMobileDataProvidersPageProps> = ({ providers, onNavigateToAddProvider, onEditProvider, onDeleteProvider }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Mobile Data</h3>
        <button
          onClick={onNavigateToAddProvider}
          className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <Icon name="plus" className="w-5 h-5" />
          Add Data Provider
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Provider Name</th>
              <th scope="col" className="px-6 py-3">Number of Plans</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <img src={provider.logoUrl} alt={provider.name} className="w-10 h-10 rounded-md object-contain" />
                    <span>{provider.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{provider.plans.length}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEditProvider(provider)} className="text-gray-500 hover:text-brand-red p-2 rounded-md transition-colors">
                        <Icon name="edit" className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDeleteProvider(provider.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors">
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
