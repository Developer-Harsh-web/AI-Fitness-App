"use client";

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Footer with no SSR to prevent hydration issues
const Footer = dynamic(() => import('../../components/layout/Footer'), { ssr: false });

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  FitCoach
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium dark:text-gray-200 dark:hover:text-blue-400"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
      <Footer />
    </div>
  );
} 