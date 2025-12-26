
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { id: 'home', label: 'בית' },
    { id: 'rights', label: 'זכויות' },
    { id: 'academia', label: 'אקדמיה ומלגות' },
    { id: 'employment', label: 'תעסוקה' },
    { id: 'chat', label: 'יועץ אישי AI' },
    { id: 'contact', label: 'צור קשר' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">כוון לדרוזים</h1>
        </div>

        <nav className="hidden md:flex items-center gap-2 lg:gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm font-black transition-all whitespace-nowrap ${
                currentPage === item.id 
                ? 'text-blue-600 bg-blue-50 px-4 py-2 rounded-xl' 
                : 'text-gray-500 hover:text-blue-500 px-4 py-2'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button 
            onClick={() => onNavigate('admin')}
            className={`p-2 rounded-xl transition-all ${
              currentPage === 'admin' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'
            }`}
            title="ניהול תוכן"
          >
            <ShieldCheck size={20} />
          </button>
        </nav>

        <button 
          className="md:hidden p-2 text-gray-600"
          onClick={() => onNavigate('home')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
