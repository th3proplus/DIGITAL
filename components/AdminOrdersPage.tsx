import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';

interface AdminOrdersPageProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onDeleteOrders: (orderIds: string[]) => void;
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

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ orders, onUpdateOrder, onDeleteOrders }) => {
  const { formatCurrency } = useSettings();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    onDeleteOrders(selectedOrders);
    setSelectedOrders([]);
  }

  const handleUpdateAndCloseModal = (order: Order) => {
    onUpdateOrder(order);
    setViewingOrder(null);
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xl font-semibold text-gray-800">Orders</h3>
        </div>
        
        {/* Bulk Actions Bar */}
        <div className={`transition-all duration-300 ease-in-out ${selectedOrders.length > 0 ? 'h-14 opacity-100' : 'h-0 opacity-0'} overflow-hidden`}>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border my-3">
                <span className="text-sm font-semibold text-gray-700">{selectedOrders.length} selected</span>
                <button 
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-100 p-2 rounded-md transition-colors"
                >
                    <Icon name="trash" className="text-base" />
                    Delete Selected
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input 
                      id="checkbox-all" 
                      type="checkbox" 
                      className="w-4 h-4 text-brand-red bg-gray-100 border-gray-300 rounded focus:ring-brand-red" 
                      onChange={handleSelectAll}
                      checked={selectedOrders.length > 0 && selectedOrders.length === orders.length}
                    />
                    <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">Order ID</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Total</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="bg-white border-b hover