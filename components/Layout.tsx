import React, { useState } from 'react';
import { useAuth } from '../modules/auth/AuthContext';
import { SearchBar } from '../modules/search/SearchBar';
import { Bell, Menu, LogOut, User as UserIcon, Settings, X } from 'lucide-react';
import { UserRole } from '../types';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// --- SVG Icon Components ---
const VisaIcon = () => (
  <svg width="50" height="32" viewBox="0 0 50 32" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-visa">
    <title id="pi-visa">Visa</title>
    <rect width="50" height="32" rx="3" fill="#FFF" stroke="#E0E0E0" strokeWidth="1"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#142688" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold">
      VISA
    </text>
  </svg>
);

const MastercardIcon = () => (
  <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-mastercard">
    <title id="pi-mastercard">Mastercard</title>
    <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
    <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
    <circle fill="#EB001B" cx="15" cy="12" r="7"/>
    <circle fill="#F79E1B" cx="23" cy="12" r="7"/>
    <path fill="#FF5F00" d="M22 12c0-3.9-1.8-7.2-4.5-9.4a7.1 7.1 0 0 1 4.5 9.4z"/>
  </svg>
);

const BinancePayIcon = () => (
  <svg width="50" height="24" viewBox="0 0 50 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-binance-pay">
    <title id="pi-binance-pay">Binance Pay</title>
    <path fill="#F0B90B" d="M12 12L7.5 7.5 12 3l4.5 4.5L12 12zm0 4.5l4.5 4.5 4.5-4.5-4.5-4.5-4.5 4.5zM3 12l4.5-4.5L12 12l-4.5 4.5L3 12zm9 9l-4.5-4.5L12 12l4.5 4.5-4.5 4.5zM16.5 7.5L12 12l4.5 4.5 4.5-4.5-4.5-4.5z"/>
    <path fill="#929292" d="M28.8 4.2h2.3v15.5h-2.3V4.2zm9.2 15.5h-5.7V4.2h5.7v1.8h-3.4v4.9h3.4v1.8h-3.4v5.2h3.4v1.8zm10.2-15.5v15.5h-2.3l-5.7-9.4v9.4h-2.3V4.2h2.3l5.7 9.4V4.2h2.3z"/>
  </svg>
);


interface LayoutProps {
  children: React.ReactNode;
  onNotificationClick: () => void;
  notificationCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNotificationClick, notificationCount }) => {
  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMerchPage = location.pathname === '/';

  const mainContentClass = isMerchPage
    ? "flex-1 w-full px-4"
    : "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8";

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const NavLinks = () => (
    <>
      {isAuthenticated && user ? (
        <>
          <Link
            to="/account"
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </Link>

          {user.role === UserRole.ADMIN && (
            <Link
              to="/admin"
              className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary transition-colors"
              title="Admin Dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="md:hidden text-sm font-medium">Admin Dashboard</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-gray-500 hover:text-red-600 transition-colors w-full text-left"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="md:hidden text-sm font-medium">Logout</span>
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-primary p-2 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
              </button>
              <Link to="/" className="text-2xl font-black text-primary tracking-tighter">Baoba</Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center px-8">
              {!isMerchPage && <SearchBar />}
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              <button 
                onClick={onNotificationClick}
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>

              <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4 h-8">
                <NavLinks />
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white absolute w-full z-50 animate-slide-down shadow-lg">
            <div className="p-4 space-y-4">
              <div className="mb-4">
                {!isMobileMenuOpen && <SearchBar />}
              </div>
              <div className="space-y-2 flex flex-col items-start">
                <NavLinks />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className={mainContentClass}>
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <VisaIcon />
            <MastercardIcon />
            <BinancePayIcon />
          </div>
          <div className="text-gray-500 text-sm space-x-4">
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms & Service</Link>
            <span>&bull;</span>
            <a href="https://service.spreadshirt.com/hc/en-us/?shop_name=baoba&shop_id=1989330&platform=na" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Help
            </a>
          </div>
          <div className="mt-4 text-gray-400 text-xs">&copy; {new Date().getFullYear()} Baoba. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
};
