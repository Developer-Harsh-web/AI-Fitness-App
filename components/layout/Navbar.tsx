import React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, MessageSquare, Moon, Sun, MenuIcon, Home, BarChart3, Utensils, Dumbbell, User, Settings, LogOut, LayoutDashboard, Heart, Smartphone, BookOpen, Link as LinkIcon } from 'lucide-react';
import UserMenu from '../UserMenu';
import { ThemeToggle } from '../ThemeToggle';
import { useUserContext } from '../../lib/hooks/UserContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const NAV_ITEMS = [
  { 
    label: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    label: "Workouts", 
    href: "/workouts", 
    icon: Dumbbell
  },
  { 
    label: "Meal Tracker", 
    href: "/meal-tracker", 
    icon: Utensils
  },
  { 
    label: "Progress", 
    href: "/progress", 
    icon: BarChart3 
  },
  { 
    label: "Health", 
    href: "/health", 
    icon: Heart 
  },
  { 
    label: "Learning", 
    href: "/learning", 
    icon: BookOpen 
  },
  { 
    label: "Settings", 
    href: "/settings", 
    icon: Settings 
  },
  { 
    label: "Integrations", 
    href: "/integrations", 
    icon: LinkIcon 
  },
  { 
    label: "Devices", 
    href: "/devices", 
    icon: Smartphone 
  }
];

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, signOut } = useUserContext();
  
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={toggleSidebar}
        type="button"
        className="lg:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
      >
        <Menu className="w-5 h-5" />
        <span className="sr-only">Toggle sidebar</span>
      </button>
      
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="hidden lg:flex">
            <span className="text-xl font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">FitAI</span>
          </Link>
          
          {/* Search */}
          <div className="ml-10 max-w-md flex-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input 
                type="text" 
                id="search" 
                className="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Search..." 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notification button */}
          <button className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          
          {/* Messages button */}
          <button className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600">
            <MessageSquare className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
          
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* User menu */}
          {user ? (
            <UserMenu user={user} signOut={signOut} />
          ) : (
            <div className="flex space-x-2">
              <Link 
                href="/login" 
                className="px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}