import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Apple, 
  BarChart2, 
  Settings, 
  Calendar, 
  UserCircle,
  Dumbbell,
  MessageSquare
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current?: boolean;
}

interface SidebarProps {
  navigationItems?: NavigationItem[];
}

const defaultNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Nutrition', href: '/nutrition', icon: Apple },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Progress', href: '/progress', icon: BarChart2 },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Community', href: '/community', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ navigationItems = defaultNavigationItems }) => {
  const pathname = usePathname();
  
  return (
    <aside id="sidebar" className="fixed hidden z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75" aria-label="Sidebar">
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white/80 backdrop-blur-sm pt-0 dark:bg-gray-800/80 dark:border-gray-700">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">FIT</span>
            </div>
          </div>
          <div className="flex-1 px-3 bg-white/70 dark:bg-gray-800/70 divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`text-base font-normal rounded-lg flex items-center p-2 group transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`mr-3 flex-shrink-0 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded text-white shadow-md' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={`${isActive ? 'font-medium' : ''}`}>{item.name}</span>
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Pro Tip</div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Complete your workout goals this week to unlock new achievements!</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 