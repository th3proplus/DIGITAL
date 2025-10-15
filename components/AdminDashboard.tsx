import React from 'react';
import { Order, Product, OrderStatus } from '../types';
// FIX: Corrected import path for useSettings hook.
import { useSettings } from '../hooks/useI18n';
import { Icon } from './Icon';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
}

const StatCard: React.FC<{ icon: string; title: string; value: string; trend: string; trendDirection: 'up' | 'down'; color: string; }> = ({ icon, title, value, trend, trendDirection, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <div className="flex items-center text-xs mt-2">
                    <Icon name={trendDirection === 'up' ? 'arrow-up' : 'arrow-down'} className={`text-base mr-1 ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'} font-semibold`}>{trend}</span>
                    <span className="text-gray-500 ml-1">vs last week</span>
                </div>
            </div>
            {/* FIX: Moved inline style for color to the parent div as Icon component does not accept a style prop. */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center`} style={{backgroundColor: color + '1A', color: color}}>
              <Icon name={icon} className="text-2xl" />
            </div>
        </div>
    );
};

const SalesChart: React.FC = () => {
    const salesData = [
        { day: 'Mon', sales: 4000 },
        { day: 'Tue', sales: 3000 },
        { day: 'Wed', sales: 5000 },
        { day: 'Thu', sales: 4500 },
        { day: 'Fri', sales: 6000 },
        { day: 'Sat', sales: 7500 },
        { day: 'Sun', sales: 8000 },
    ];
    const maxSales = Math.max(...salesData.map(d => d.sales));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
            <div className="flex items-end justify-between h-64">
                {salesData.map(data => (
                    <div key={data.day} className="flex flex-col items-center flex-1">
                        <div className="w-10 bg-red-100 rounded-t-md group" style={{ height: `${(data.sales / maxSales) * 100}%` }}>
                            <div className="h-full w-full bg-brand-red rounded-t-md transition-all duration-300 transform group-hover:scale-y-110 origin-bottom" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mt-2">{data.day}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusClasses = {
        [OrderStatus.Completed]: 'bg-green-100 text-green-700',
        [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-700',
        [OrderStatus.Failed]: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};


const RecentOrders: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const { formatCurrency } = useSettings();
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                <button className="text-sm font-semibold text-brand-red hover:underline">View all orders</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Order ID</th>
                            <th scope="col" className="px-4 py-3">Customer</th>
                            <th scope="col" className="px-4 py-3">Total</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 5).map(order => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                                <td className="px-4 py-3">{order.customerName}</td>
                                <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                                <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                                <td className="px-4 py-3">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products }) => {
    const { formatCurrency } = useSettings();
    const totalRevenue = orders.filter(o => o.status === OrderStatus.Completed).reduce((sum, order) => sum + order.total, 0);
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon="dollar-sign" title="Total Revenue" value={formatCurrency(totalRevenue, { notation: 'compact' })} trend="+12.5%" trendDirection="up" color="#28A745" />
                <StatCard icon="orders" title="New Orders" value={orders.length.toString()} trend="+5.2%" trendDirection="up" color="#F85757" />
                <StatCard icon="products" title="Total Products" value={products.length.toString()} trend="-1.8%" trendDirection="down" color="#1A202C" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart />
                </div>
                <div className="lg:col-span-1">
                    <RecentOrders orders={orders} />
                </div>
            </div>
        </div>
    );
};