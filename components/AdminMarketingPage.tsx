import React, { useState } from 'react';
import { Campaign, Subscriber } from '../types';
import { Icon } from './Icon';

interface AdminMarketingPageProps {
  campaigns: Campaign[];
  subscribers: Subscriber[];
  onNavigateToCompose: () => void;
  onDeleteSubscribers: (subscriberIds: string[]) => void;
}

type MarketingTab = 'campaigns' | 'subscribers';

export const AdminMarketingPage: React.FC<AdminMarketingPageProps> = ({ campaigns, subscribers, onNavigateToCompose, onDeleteSubscribers }) => {
  const [activeTab, setActiveTab] = useState<MarketingTab>('campaigns');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(id) ? prev.filter(subId => subId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    onDeleteSubscribers(selectedSubscribers);
    setSelectedSubscribers([]);
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200">
        <nav className="flex -mb-px space-x-6">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-semibold transition-colors duration-200 ${
                activeTab === 'campaigns'
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon name="rocket" className="w-5 h-5" />
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-semibold transition-colors duration-200 ${
                activeTab === 'subscribers'
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon name="user" className="w-5 h-5" />
            Subscribers
          </button>
        </nav>
      </div>

      {activeTab === 'campaigns' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800">Campaigns</h3>
            <button
              onClick={onNavigateToCompose}
              className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <Icon name="plus" className="w-5 h-5" />
              Create Campaign
            </button>
          </div>
          {campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Subject</th>
                    <th scope="col" className="px-6 py-3">Sent At</th>
                    <th scope="col" className="px-6 py-3">Recipients</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{c.subject}</td>
                      <td className="px-6 py-4">{new Date(c.sentAt).toLocaleString()}</td>
                      <td className="px-6 py-4">{c.recipientsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-12">
                <Icon name="rocket" className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-lg font-semibold text-slate-800">No campaigns sent yet.</h3>
                <p className="mt-1 text-sm text-slate-500">Create your first email campaign to engage your subscribers.</p>
             </div>
          )}
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <h3 className="text-xl font-semibold text-slate-800">Subscribers</h3>
            <div className="relative w-full sm:w-64">
              <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </div>
          {selectedSubscribers.length > 0 && (
             <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border my-3">
                <span className="text-sm font-semibold text-slate-700">{selectedSubscribers.length} selected</span>
                <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-100 p-2 rounded-md transition-colors"
                >
                    <Icon name="trash" className="w-4 h-4" />
                    Delete Selected
                </button>
            </div>
          )}
           {filteredSubscribers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th scope="col" className="p-4">
                      <input type="checkbox" onChange={handleSelectAll} className="w-4 h-4 text-brand-red bg-slate-100 border-slate-300 rounded focus:ring-brand-red" />
                    </th>
                    <th scope="col" className="px-6 py-3">Email Address</th>
                    <th scope="col" className="px-6 py-3">Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map(s => (
                    <tr key={s.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="p-4">
                        <input type="checkbox" checked={selectedSubscribers.includes(s.id)} onChange={() => handleSelectOne(s.id)} className="w-4 h-4 text-brand-red bg-slate-100 border-slate-300 rounded focus:ring-brand-red" />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{s.email}</td>
                      <td className="px-6 py-4">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-12">
                <Icon name="user" className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-lg font-semibold text-slate-800">You don't have any subscribers yet.</h3>
                <p className="mt-1 text-sm text-slate-500">Emails collected from your newsletter form will appear here.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
