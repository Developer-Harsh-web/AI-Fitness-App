"use client";

import { User as UserIcon, LogOut, Settings, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "../lib/hooks/UserContext";

interface UserMenuProps {
  user: User | null;
  signOut: () => void;
}

export default function UserMenu({ user, signOut }: UserMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Use useEffect to handle client-side hydration
  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null;

  // If there's no user yet (still loading), render a placeholder
  if (!user) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <div className="relative" ref={notificationRef}>
        <button
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
        >
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          <Bell className="h-5 w-5" />
        </button>

        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                <p className="text-sm font-medium">Workout Reminder</p>
                <p className="text-xs text-gray-500 mt-1">Time for your scheduled workout!</p>
                <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
              </div>
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                <p className="text-sm font-medium">Goal Achieved!</p>
                <p className="text-xs text-gray-500 mt-1">You've reached your step goal for today.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
              <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium truncate max-w-[100px] hidden sm:inline-block">
            {user?.name?.split(" ")[0] || "User"}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setOpen(false)}
              >
                <UserIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                Settings
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 