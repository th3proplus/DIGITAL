import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const iconName = type === 'success' ? 'check' : 'close';

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm">
      <div className={`relative flex items-center gap-4 p-4 rounded-lg shadow-2xl text-white ${bgColor} animate-toast-in`}>
        <div className="flex-shrink-0 bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
          <Icon name={iconName} className="w-5 h-5" />
        </div>
        <p className="flex-grow font-semibold">{message}</p>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0">
          <Icon name="close" className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 h-1 bg-white/50 animate-toast-progress rounded-bl-lg rounded-br-lg"></div>
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-toast-in {
          animation: toast-in 0.5s ease-out forwards;
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-toast-progress {
          animation: toast-progress 4s linear forwards;
        }
      `}</style>
    </div>
  );
};
