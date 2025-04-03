import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUserContext } from '../../lib/hooks/UserContext';
import { Bell, Menu, X, MessageSquare, User, LogOut, LogIn, UserPlus, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, signOut, isAuthenticated } = useUserContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push('/login');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      
      // Don't close mobile menu when clicking on the toggle button
      const toggleButton = document.getElementById('toggleSidebarMobile');
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) && 
        event.target !== toggleButton &&
        !toggleButton?.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed w-full z-30 shadow-sm dark:bg-gray-800/95 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              id="toggleSidebarMobile"
              aria-expanded={mobileMenuOpen}
              aria-controls="sidebar"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Link href="/dashboard" className="flex items-center">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FitAI Companion
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <button className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  <MessageSquare className="w-6 h-6" />
                </button>
                
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium dark:text-gray-200 mr-1">{user?.name || 'User'}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                        <div className="py-1">
                          <Link 
                            href="/profile" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link 
                      href="/login" 
                      className="flex items-center px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Log in
                    </Link>
                    <Link 
                      href="/register" 
                      className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile auth buttons */}
            <div className="sm:hidden flex items-center">
              {isAuthenticated ? (
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2"
                >
                  <User className="w-6 h-6" />
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Log in
                </Link>
              )}
              
              {/* Mobile user dropdown */}
              {isAuthenticated && dropdownOpen && (
                <div className="absolute right-0 top-16 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 mr-3">
                  <div className="py-1">
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md"
        >
          <div className="px-4 py-3 space-y-3">
            <Link 
              href="/dashboard" 
              className="flex items-center px-3 py-2 text-base font-medium text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              Dashboard
            </Link>
            <Link 
              href="/profile" 
              className="flex items-center px-3 py-2 text-base font-medium text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              Profile
            </Link>
            {!isAuthenticated && (
              <>
                <Link 
                  href="/login" 
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Sign up
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <LogOut className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 