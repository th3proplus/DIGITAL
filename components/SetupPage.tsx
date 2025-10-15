import React, { useState } from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';

interface SetupPageProps {
  onSetupComplete: () => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon: string }> = ({ label, id, icon, ...props }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name={icon} className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
          {...props}
        />
      </div>
    </div>
);

export const SetupPage: React.FC<SetupPageProps> = ({ onSetupComplete }) => {
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'nexus_store'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testError, setTestError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDbConfig({ ...dbConfig, [e.target.name]: e.target.value });
    setTestSuccess(false);
    setTestError('');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestError('');
    setTestSuccess(false);
    // Simulate an API call to the backend to test the connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real scenario, you'd check the response from your server.
    // Here, we'll just simulate a success.
    setIsTesting(false);
    setTestSuccess(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testSuccess) {
      // In a real app, you would send these credentials to your backend
      // to be saved (e.g., in a .env file).
      console.log('Saving configuration:', dbConfig);
      onSetupComplete();
    } else {
      setTestError('Please test the connection successfully before continuing.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4" dir="ltr">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <div>
            <Logo />
            <h1 className="text-4xl font-bold mt-8">Store Setup</h1>
            <p className="text-slate-300 mt-2">Connect to your database to get started.</p>
            <div className="mt-10 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
              <h3 className="font-semibold flex items-center gap-2"><Icon name="database" className="w-5 h-5 text-brand-red"/> MySQL Database</h3>
              <p className="text-sm text-slate-400 mt-2">
                Provide the connection details for your local MySQL database. Your backend server will use these credentials to store and manage products, orders, and user data. This information is not stored in the browser.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">&copy; 2025 NEXUS. All Rights Reserved.</p>
        </div>
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Database Connection
              </h2>
              <p className="text-slate-500 mt-2">Enter your MySQL credentials.</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <InputField label="Host" id="host" name="host" icon="globe" value={dbConfig.host} onChange={handleChange} required />
              <InputField label="Port" id="port" name="port" icon="list" value={dbConfig.port} onChange={handleChange} required />
              <InputField label="Database Name" id="database" name="database" icon="database" value={dbConfig.database} onChange={handleChange} required />
              <InputField label="Username" id="user" name="user" icon="user" value={dbConfig.user} onChange={handleChange} required />
              <InputField label="Password" id="password" name="password" icon="key" type="password" value={dbConfig.password} onChange={handleChange} />
              
              {testError && <p className="text-sm text-red-600">{testError}</p>}
              {testSuccess && <p className="text-sm text-green-600 font-semibold flex items-center gap-2"><Icon name="check" className="w-5 h-5"/> Connection successful!</p>}

              <div className="flex flex-col sm:flex-row gap-3 !mt-8">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </>
                  ) : 'Test Connection'}
                </button>
                <button
                  type="submit"
                  disabled={!testSuccess}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-red-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};