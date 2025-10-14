import React from 'react';
import { CustomPage } from '../types';
import { Icon } from './Icon';

interface AdminPagesPageProps {
  pages: CustomPage[];
  onNavigateToAddPage: () => void;
  onEditPage: (page: CustomPage) => void;
  onDeletePage: (pageId: string) => void;
}

export const AdminPagesPage: React.FC<AdminPagesPageProps> = ({ pages, onNavigateToAddPage, onEditPage, onDeletePage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Pages</h3>
        <button
          onClick={onNavigateToAddPage}
          className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <Icon name="plus" className="w-5 h-5" />
          Add New Page
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Slug</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{page.title.en}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${page.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {page.isVisible ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEditPage(page)} className="text-gray-500 hover:text-brand-red p-2 rounded-md transition-colors">
                      <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDeletePage(page.id)} className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors">
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
