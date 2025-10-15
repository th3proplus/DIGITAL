import React, { useState } from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';

interface SetupPageProps {
  onSetupComplete: () => void;
}

export const SetupPage: React.FC<SetupPageProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Connecting, 3: Success
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    name: '',
    user: '',
    pass: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDbConfig({ ...dbConfig, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep(2); // Show connecting state

    // Simulate connection and installation
    setTimeout(() => {
      // Simulate a potential error
      if (dbConfig.pass === 'fail') {
        setError('Could not connect to the database. Please check your credentials.');
        setStep(1);
        return;
      }

      setStep(3); // Show success state
      setTimeout(() => {
        onSetupComplete();
      }, 2000); // Wait 2 seconds on success screen before redirecting
    }, 2500); // Simulate 2.5 second connection time
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4" dir="ltr">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="inline-block">
              <Logo />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-4">
              Welcome to Setup
            </h1>
            <p className="text-slate-500 mt-2">Let's get your digital store up and running.</p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 flex items-center gap-2">
                <Icon name="database" className="text-xl" />
                MySQL Database Connection
              </h2>
              <div>
                <label htmlFor="host" className="block text-sm font-medium text-slate-700 mb-1">Database Host</label>
                <input id="host" name="host" type="text" value={dbConfig.host} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Database Name</label>
                <input id="name" name="name" type="text" value={dbConfig.name} onChange={handleChange} required placeholder="e.g., nexus_store" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              <div>
                <label htmlFor="user" className="block text-sm font-medium text-slate-700 mb-1">Database User</label>
                <input id="user" name="user" type="text" value={dbConfig.user} onChange={handleChange} required placeholder="e.g., nexus_user" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              <div>
                <label htmlFor="pass" className="block text-sm font-medium text-slate-700 mb-1">Database Password</label>
                <input id="pass" name="pass" type="password" value={dbConfig.pass} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red" />
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-red-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red">
                  Connect & Install
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto"></div>
              <p className="mt-6 text-slate-600 font-semibold">Connecting to database...</p>
              <p className="text-sm text-slate-500 mt-1">This may take a moment.</p>
            </div>
          )}
          
          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="check" className="w-10 h-10 text-green-600" />
              </div>
              <p className="mt-4 text-slate-600 font-semibold text-lg">Installation Complete!</p>
              <p className="text-slate-500 text-sm">Redirecting you to your store...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
