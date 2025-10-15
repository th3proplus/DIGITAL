import React, { useState } from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';

interface AdminLoginPageProps {
  onLogin: (username: string, pass: string) => boolean;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onBackToStore }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4" dir="ltr">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left decorative panel */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <div>
            <Logo />
            <h1 className="text-4xl font-bold mt-8">Welcome Back,</h1>
            <p className="text-slate-300 mt-2">Manage your digital empire with ease.</p>
          </div>
          <p className="text-xs text-slate-400">&copy; 2025 NEXUS. All Rights Reserved.</p>
        </div>

        {/* Right login form panel */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Admin Sign In
              </h2>
              <p className="text-slate-500 mt-2">Enter your credentials to access the dashboard.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="user" className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="key" className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-red-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all duration-300 transform hover:scale-105"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="text-center mt-8">
              <button onClick={onBackToStore} className="text-sm font-medium text-slate-500 hover:text-brand-red transition-colors">
                &larr; Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};