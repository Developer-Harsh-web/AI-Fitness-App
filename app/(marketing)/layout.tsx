"use client";

import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import Footer with no SSR to prevent hydration issues
const Footer = dynamic(() => import('../../components/layout/Footer'), { ssr: false });

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
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

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/features"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium dark:text-gray-200 dark:hover:text-blue-400"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium dark:text-gray-200 dark:hover:text-blue-400"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium dark:text-gray-200 dark:hover:text-blue-400"
              >
                About
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium dark:text-gray-200 dark:hover:text-blue-400"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button - in a real app this would have a mobile menu implementation */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
} 