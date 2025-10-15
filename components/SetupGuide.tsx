import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';

interface StatusResponse {
    server: 'ok';
    dbConnection: 'connected' | 'disconnected';
    dbInitialized: boolean;
    error?: string;
}

const Step: React.FC<{ number: number; title: string; status: 'active' | 'complete' | 'pending'; children?: React.ReactNode; isLast?: boolean }> = ({ number, title, status, children, isLast }) => {
    const colorClasses = {
        active: 'border-brand-red text-brand-red',
        complete: 'border-green-500 bg-green-500 text-white',
        pending: 'border-slate-300 text-slate-400',
    };
    const statusIcon = {
        active: <span className="font-bold">{number}</span>,
        complete: <Icon name="check" className="w-5 h-5" />,
        pending: <span>{number}</span>,
    };
    return (
        <div className="flex">
            <div className="flex flex-col items-center mr-6">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${colorClasses[status]}`}>
                    {statusIcon[status]}
                </div>
                {!isLast && <div className={`w-px h-full ${status === 'complete' ? 'bg-green-500' : 'bg-slate-300'}`} />}
            </div>
            <div className="pb-10">
                <h3 className={`font-bold text-lg ${status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{title}</h3>
                {status === 'active' && <div className="mt-3">{children}</div>}
            </div>
        </div>
    );
};

export const SetupGuide: React.FC = () => {
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitializing, setIsInitializing] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);
    const [initSuccess, setInitSuccess] = useState(false);

    const checkStatus = async () => {
        setIsLoading(true);
        setInitError(null);
        try {
            const response = await fetch('/api/status');
            const data: StatusResponse = await response.json();
            setStatus(data);
        } catch (e) {
            setStatus({ server: 'ok', dbConnection: 'disconnected', dbInitialized: false, error: 'Could not connect to the backend server. Is it running?' });
        } finally {
            setIsLoading(false);
        }
    };

    const initializeDatabase = async () => {
        setIsInitializing(true);
        setInitError(null);
        try {
            const response = await fetch('/api/initialize-database', { method: 'POST' });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'An unknown error occurred during initialization.');
            }
            setInitSuccess(true);
        } catch (e: any) {
            setInitError(e.message);
        } finally {
            setIsInitializing(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);
    
    const dbConnected = status?.dbConnection === 'connected';
    const dbInitialized = status?.dbInitialized === true;
    const setupComplete = dbConnected && dbInitialized;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <header className="p-6 bg-slate-800 text-white flex items-center gap-4">
                    <Logo />
                    <span className="text-xl font-light text-slate-300">| Store Setup</span>
                </header>
                <main className="p-8">
                    {isLoading && (
                         <div className="flex items-center justify-center flex-col text-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
                            <p className="mt-4 text-slate-500 font-medium">Checking application status...</p>
                        </div>
                    )}
                    {!isLoading && !initSuccess && (
                        <>
                            <Step number={1} title="Connect to Database" status={dbConnected ? 'complete' : 'active'}>
                                <p className="text-slate-600 mb-4">The application needs to connect to your MySQL database. Please create a <strong>.env</strong> file inside the <strong>/backend</strong> directory with your database credentials.</p>
                                <div className="bg-slate-800 text-slate-200 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                                    <pre>
                                        DB_HOST=127.0.0.1<br/>
                                        DB_PORT=3306<br/>
                                        DB_USER=root<br/>
                                        DB_PASSWORD=your_password<br/>
                                        DB_NAME=jaryaDB
                                    </pre>
                                </div>
                                {status?.error && (
                                    <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                                        <p className="font-bold">Connection Failed</p>
                                        <p className="text-sm">{status.error}</p>
                                    </div>
                                )}
                                <button onClick={checkStatus} className="mt-6 bg-brand-red text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-red-light transition-colors flex items-center gap-2">
                                    <Icon name="check" className="w-5 h-5"/>
                                    I've updated my .env, Re-check Connection
                                </button>
                            </Step>
                            <Step number={2} title="Initialize Database" status={dbConnected ? (dbInitialized ? 'complete' : 'active') : 'pending'}>
                               <p className="text-slate-600 mb-4">Great! The backend is connected to the database. Now, let's create the necessary tables and add the default store data.</p>
                               {initError && (
                                    <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                                        <p className="font-bold">Initialization Failed</p>
                                        <p className="text-sm">{initError}</p>
                                    </div>
                                )}
                               <button onClick={initializeDatabase} disabled={isInitializing} className="bg-brand-red text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-red-light transition-colors flex items-center gap-2 disabled:bg-slate-400">
                                    {isInitializing ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <Icon name="settings" className="w-5 h-5"/>
                                    )}
                                    Initialize Database
                                </button>
                            </Step>
                        </>
                    )}

                    {(initSuccess || setupComplete) && (
                        <div>
                             <Step number={1} title="Connect to Database" status="complete" />
                             <Step number={2} title="Initialize Database" status="complete" />
                             <Step number={3} title="Setup Complete" status="active" isLast>
                                <div className="text-center bg-green-50 p-6 rounded-lg border border-green-200">
                                    <Icon name="check" className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                                    <h3 className="text-2xl font-bold text-slate-800">Success!</h3>
                                    <p className="text-slate-600 mt-2">Your store has been configured successfully. You can now launch the application.</p>
                                    <button onClick={() => window.location.reload()} className="mt-6 bg-green-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">
                                        Launch Store
                                    </button>
                                </div>
                             </Step>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
