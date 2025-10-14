import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { useI18n, useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface AdminOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onUpdateOrder: (order: Order) => void;
}

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusClasses = {
        [OrderStatus.Completed]: 'bg-green-100 text-green-700',
        [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-700',
        [OrderStatus.Failed]: 'bg-red-100 text-red-700',
        [OrderStatus.AwaitingPayment]: 'bg-blue-100 text-blue-700',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${statusClasses[status]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
            {status}
        </span>
    );
};

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({ isOpen, onClose, order, onUpdateOrder }) => {
  const { translations } = useI18n();
  const { formatCurrency, settings } = useSettings();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);

  const t = (key: string): string => {
    if (!translations.en) return key;
    return translations.en[key] || key;
  };

  useEffect(() => {
    setCurrentStatus(order.status);
  }, [order]);

  const handleSave = () => {
    onUpdateOrder({ ...order, status: currentStatus });
  };
  
  const handlePrint = () => {
    window.print();
  }

  if (!isOpen) return null;

  const taxes = order.total * 0.08; // Example tax calculation
  const subtotal = order.total - taxes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 print:hidden" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div id="invoice-content">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">Order Details</h3>
                <p className="text-sm text-gray-500">{order.id} - {order.date}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full">
                <Icon name="close" className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {/* Customer Info */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Customer Information</h4>
                    <div className="text-sm space-y-1">
                        <p className="text-gray-800 font-medium">{order.customerName}</p>
                        <p className="text-gray-500">{order.customerEmail}</p>
                    </div>
                </div>
                {/* Payment Method */}
                 <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Payments</h4>
                    <div className="text-sm">
                        <p className="text-gray-800 font-medium capitalize">
                          {order.paymentMethod === 'bankTransfer' ? settings.payments.bankTransfer.name.value : order.paymentMethod}
                        </p>
                    </div>
                </div>
                {/* Order Status */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Status</h4>
                     <select 
                        value={currentStatus} 
                        onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
                        className="w-full max-w-xs bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-brand-red focus:border-brand-red text-sm"
                     >
                        {Object.values(OrderStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Items Ordered */}
            <div>
                <h4 className="font-semibold text-gray-700 mb-3">Items Ordered</h4>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-3 font-medium text-gray-600">Product</th>
                                <th className="p-3 font-medium text-gray-600">Variant</th>
                                <th className="p-3 font-medium text-gray-600 text-center">Quantity</th>
                                <th className="p-3 font-medium text-gray-600 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {order.items.map(item => (
                                <tr key={`${item.productId}-${item.variantId}`}>
                                    <td className="p-3">
                                      <div className="flex items-center gap-3">
                                        <img src={item.logoUrl} alt={item.metadata?.isCustomOrder ? item.productNameKey : t(item.productNameKey)} className="w-10 h-10 object-contain rounded-md border p-1 bg-white" />
                                        <div className="flex-grow">
                                            <span className="font-medium text-gray-800">{item.metadata?.isCustomOrder ? item.productNameKey : t(item.productNameKey)}</span>
                                            {item.metadata?.isCustomOrder && (
                                                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                                    {item.metadata.customOrderType === 'aliexpress' && (
                                                        <>
                                                            <p><a href={item.metadata.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-brand-red">AliExpress Link <Icon name="external" className="w-3 h-3"/></a></p>
                                                            <p>Original Price: <strong>{item.metadata.originalPrice} {item.metadata.originalCurrency}</strong></p>
                                                            {item.metadata.originalShippingPrice != null && <p>Original Shipping: <strong>{item.metadata.originalShippingPrice} {item.metadata.originalCurrency}</strong></p>}
                                                        </>
                                                    )}
                                                    {item.metadata.customOrderType === 'giftCard' && (
                                                        <p>Brand: <strong>{item.metadata.giftCardBrand}</strong> | Value: <strong>{formatCurrency(item.metadata.denomination || 0)}</strong></p>
                                                    )}
                                                    {item.metadata.customOrderType === 'mobileData' && (
                                                         <p>Provider: <strong>{item.metadata.provider}</strong> | Number: <strong>{item.metadata.phoneNumber}</strong></p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3 text-gray-600">{item.metadata?.customOrderType === 'giftCard' ? item.variantNameKey : t(item.variantNameKey)}</td>
                                    <td className="p-3 text-gray-600 text-center">{item.quantity}</td>
                                    <td className="p-3 text-gray-800 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-6">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                     <div className="flex justify-between text-sm text-gray-600">
                        <span>Taxes (8%)</span>
                        <span>{formatCurrency(taxes)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                    </div>
                </div>
            </div>

          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Icon name="edit" className="w-4 h-4" />
              Print Invoice
            </button>
            <div className="flex gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancel
                </button>
                <button 
                    type="button" 
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-red border border-transparent rounded-md hover:bg-brand-red-light"
                >
                    Update Status
                </button>
            </div>
        </div>
        </div>
        <style>{`
          @media print {
              body * {
                  visibility: hidden;
              }
              #invoice-content, #invoice-content * {
                  visibility: visible;
              }
              #invoice-content {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
              }
          }
        `}</style>
      </div>
    </div>
  );
};
