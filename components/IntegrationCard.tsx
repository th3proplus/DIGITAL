import React from 'react';
import { Icon } from './Icon';

interface IntegrationCardProps {
  icon: string;
  name: string;
  description: string;
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  children: React.ReactNode;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-red/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
    </label>
);


export const IntegrationCard: React.FC<IntegrationCardProps> = ({ icon, name, description, isActive, onToggle, children }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon name={icon} className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-800">{name}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                    <ToggleSwitch checked={isActive} onChange={onToggle} />
                </div>
            </div>
            {isActive && (
                <div className="p-6 border-t border-slate-200 bg-slate-50/70 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};