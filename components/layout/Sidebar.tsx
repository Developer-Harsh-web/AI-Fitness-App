import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  current?: boolean;
  children?: NavigationItem[];
};

interface SidebarProps {
  navigationItems: NavigationItem[];
}

export default function Sidebar({ navigationItems }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white z-20">
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-gray-800">
        <Link 
          href="/dashboard" 
          className="flex items-center space-x-2"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="font-semibold text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            FitAI
          </span>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <div key={item.name} className="mb-4">
              {!item.children ? (
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.href || item.current
                      ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-sm'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      pathname === item.href || item.current
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white'
                    }`} 
                    aria-hidden="true" 
                  />
                  {item.name}
                </Link>
              ) : (
                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.name}
                  </h3>
                  <div className="ml-2 space-y-1 border-l border-gray-800 pl-2">
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pathname === subItem.href
                            ? 'bg-gradient-to-r from-blue-600/70 to-indigo-600/70 text-white shadow-sm'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <subItem.icon 
                          className={`mr-3 h-4 w-4 flex-shrink-0 ${
                            pathname === subItem.href
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-white'
                          }`} 
                          aria-hidden="true" 
                        />
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Pro upgrade */}
      <div className="p-3 m-2 mt-auto rounded-lg bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-800/30">
        <div className="flex items-center">
          <div className="mr-3 bg-blue-500/20 rounded-full p-1">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Upgrade to Pro</p>
            <p className="text-xs text-gray-400">Get personalized plans</p>
          </div>
        </div>
        <button className="w-full mt-2 px-2 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
          Upgrade
        </button>
      </div>
    </div>
  );
} 