
import React from 'react';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p className="font-bold text-gray-700">SIGAP MBG - Dibuat oleh KODEKLIK</p>
        <p className="text-sm mt-1">©2026 - Hak cipta dilindungi undang-undang</p>
      </div>
    </footer>
  );
};

export const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
    {children}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export const Button: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  type?: 'button' | 'submit';
}> = ({ onClick, children, variant = 'primary', className = "", type = 'button' }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
    secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-red-200',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200',
  };
  
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
