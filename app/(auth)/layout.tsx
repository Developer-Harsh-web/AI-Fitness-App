import Link from 'next/link';
import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-800/95 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FitAI Companion
              </span>
            </Link>
          </div>
          <Link
            href="/"
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        {children}
      </main>
      <footer className="py-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FitAI Companion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 