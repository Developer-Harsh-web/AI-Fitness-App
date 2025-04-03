"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUserContext } from '../../../lib/hooks/UserContext';
import { UserPreferences } from '../../../types';

export default function ProfilePage() {
  const { user, updateUser, updatePreferences } = useUserContext();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Personal info form handling
  const handlePersonalInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    try {
      const success = await updateUser({ name, email });
      
      if (success) {
        setMessage({ text: 'Personal information updated successfully', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update personal information', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Physical info form handling
  const handlePhysicalInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const height = Number(formData.get('height') as string);
    const weight = Number(formData.get('weight') as string);
    
    try {
      const success = await updateUser({ height, weight });
      
      if (success) {
        setMessage({ text: 'Physical information updated successfully', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update physical information', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Preferences form handling
  const handlePreferencesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const preferencesUpdate: Partial<UserPreferences> = {
      measurementSystem: formData.get('measurementSystem') as 'metric' | 'imperial',
      theme: formData.get('theme') as 'light' | 'dark' | 'system',
      notificationsEnabled: formData.get('enableNotifications') === 'on',
      motivationFrequency: formData.get('motivationFrequency') as 'daily' | 'weekly' | 'monthly',
    };
    
    try {
      const success = await updatePreferences(preferencesUpdate);
      
      if (success) {
        setMessage({ text: 'Preferences updated successfully', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update preferences', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and update your personal information and preferences
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePersonalInfoSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={user.name}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to keep your current password
                </p>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Update Personal Information'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Physical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePhysicalInfoSubmit}>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  defaultValue={user.height}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  defaultValue={user.weight}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Update Physical Information'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePreferencesSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Measurement System
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="measurementSystem"
                      value="metric"
                      defaultChecked={user.preferences?.measurementSystem === 'metric'}
                      className="text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Metric (kg, cm)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="measurementSystem"
                      value="imperial"
                      defaultChecked={user.preferences?.measurementSystem === 'imperial'}
                      className="text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Imperial (lb, ft)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      defaultChecked={user.preferences?.theme === 'light'}
                      className="text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Light</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      defaultChecked={user.preferences?.theme === 'dark'}
                      className="text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Dark</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      defaultChecked={user.preferences?.theme === 'system'}
                      className="text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">System</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableNotifications"
                      defaultChecked={user.preferences?.notificationsEnabled}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Enable notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivation Frequency
                </label>
                <select
                  name="motivationFrequency"
                  defaultValue={user.preferences?.motivationFrequency}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Update Preferences'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 