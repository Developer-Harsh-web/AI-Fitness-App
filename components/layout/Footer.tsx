"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="text-blue-600 font-bold text-lg dark:text-blue-400">
              FitCoach
            </Link>
          </div>
          <div className="mt-4 flex justify-center md:mt-0">
            <div className="flex space-x-6">
              <Link
                href="/help"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Help & Support
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between dark:border-gray-800">
          <div className="flex justify-center md:justify-start">
            <p className="text-gray-500 text-sm dark:text-gray-400">
              &copy; {new Date().getFullYear()} FitCoach. All rights reserved. Developed by Harsh
            </p>
          </div>
          <div className="mt-4 flex justify-center md:mt-0">
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Your health companion for a better life.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 