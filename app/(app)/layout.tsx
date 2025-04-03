"use client";

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { useUserContext } from '../../lib/hooks/UserContext';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Apple, 
  Target, 
  UserCircle,
  ArrowRight 
} from 'lucide-react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user } = useUserContext();
  
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Workouts", href: "/workouts", icon: Dumbbell },
    { name: "Nutrition", href: "/nutrition", icon: Apple },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Profile", href: "/profile", icon: UserCircle },
    ...(!user?.stats.bodyFatPercentage ? [{ name: "Complete Setup", href: "/onboarding", icon: ArrowRight }] : []),
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar navigationItems={navigationItems} />
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 