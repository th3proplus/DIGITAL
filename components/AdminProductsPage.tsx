import React from 'react';
import { Product } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface AdminProductsPageProps {
  products: Product[];
  onNavigateToAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ products, onNavigateToAddProduct, onEditProduct, onDeleteProduct }) => {
  const { translations } = useI18n();
  const { formatCurrency } = useSettings();

  const t = (key: string): string => {
    if (!translations.en) return key;
    return translations.en[key] || key;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Products</h3>
        <button
          onClick={onNavigateToAddProduct}
          className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <Icon name="plus" className="text-xl" />
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Product Name</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const defaultVariant = product.variants.find(v => v.id === product.defaultVariantId) || product.variants[0];
              return (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <img src={product.logoUrl} alt={t(product.nameKey)} className="w-10 h-10 rounded-md object-contain" />
                      <span>{t(product.nameKey)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    {defaultVariant ? (
                      defaultVariant.isFreeTrial 
                        ? 'Free Trial' 
                        : formatCurrency(defaultVariant.price || 0)
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onEditProduct(product)} className="text-gray-500 hover:text-brand-red p-2 rounded-md transition-colors">
                          <Icon name="edit" className="text-xl" />
                        </button>
                        <button onClick={() => onDeleteProduct(product.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors">
                            <Icon name="trash" className="text-xl" />
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};