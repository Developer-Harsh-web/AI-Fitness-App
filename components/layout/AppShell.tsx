"use client";

import React, { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster, ToasterProvider } from '@/components/ui/Toaster';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { UserContextProvider } from '@/lib/hooks/UserContext';
import { MealTrackingProvider } from '@/lib/hooks/MealTrackingContext';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Apple, 
  BarChart2, 
  Settings, 
  Calendar, 
  UserCircle,
  Bot,
  Target,
  MessageSquare,
  Utensils,
  Link as LinkIcon,
  Smartphone,
  Heart
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: UserCircle 
    },
    { 
      name: 'Fitness', 
      icon: Dumbbell,
      children: [
        { name: 'Workouts', href: '/workouts', icon: Dumbbell },
        { name: 'Meal Tracker', href: '/meal-tracker', icon: Utensils },
        { name: 'Nutrition', href: '/nutrition', icon: Apple },
        { name: 'Progress', href: '/progress', icon: BarChart2 },
        { name: 'Goals', href: '/goals', icon: Target },
      ] 
    },
    { 
      name: 'Health Data', 
      icon: Heart,
      children: [
        { name: 'Health Metrics', href: '/health', icon: Heart },
        { name: 'Integrations', href: '/integrations', icon: LinkIcon },
        { name: 'Devices', href: '/devices', icon: Smartphone },
      ] 
    },
    { 
      name: 'AI Features', 
      icon: Bot,
      children: [
        { name: 'AI Chat', href: '/ai-chat', icon: Bot },
        { name: 'Plans', href: '/plans', icon: Calendar },
      ] 
    },
    { 
      name: 'Community', 
      icon: MessageSquare,
      children: [
        { name: 'Forums', href: '/community', icon: MessageSquare },
      ] 
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings 
    },
  ];

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ToasterProvider>
        <UserContextProvider>
          <MealTrackingProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative bg-gray-900 dark:bg-gray-950 border-r border-gray-800`}>
                  <Sidebar navigationItems={navigationItems} />
                </div>
                
                {/* Main content area */}
                <div className="flex flex-col flex-1 w-0 overflow-hidden">
                  <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                  
                  {/* Main content */}
                  <main className="relative flex-1 overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
                    <div className="py-2 px-4">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
              
              {/* Overlay for sidebar on mobile */}
              {sidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" 
                  onClick={() => setSidebarOpen(false)}
                  aria-hidden="true"
                />
              )}
            </div>
            <Toaster />
          </MealTrackingProvider>
        </UserContextProvider>
      </ToasterProvider>
    </ThemeProvider>
  );
} 