"use client";

import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  Zap, 
  Footprints,
  Heart,
  X,
  Calendar,
  Apple,
  Database,
  RefreshCw
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useUserContext } from '../../../lib/hooks/UserContext';
import Link from 'next/link';

interface AppIntegration {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  connected: boolean;
  category: 'fitness' | 'nutrition' | 'health' | 'sleep';
  color: string;
  lastSynced?: Date;
}

export default function IntegrationsPage() {
  const { user, setUser } = useUserContext();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // App integrations data
  const appIntegrations: AppIntegration[] = [
    {
      id: 'apple-health',
      name: 'Apple Health',
      icon: Apple,
      description: 'Sync workouts, activity, and health data from your Apple devices',
      connected: true,
      category: 'health',
      color: 'bg-gray-100 text-gray-800',
      lastSynced: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: 'strava',
      name: 'Strava',
      icon: Footprints,
      description: 'Import runs, rides, and other activities from Strava',
      connected: true,
      category: 'fitness',
      color: 'bg-orange-100 text-orange-800',
      lastSynced: new Date(Date.now() - 7200000) // 2 hours ago
    },
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal',
      icon: Heart,
      description: 'Sync nutrition and calorie data from MyFitnessPal',
      connected: true,
      category: 'nutrition',
      color: 'bg-blue-100 text-blue-800',
      lastSynced: new Date(Date.now() - 14400000) // 4 hours ago
    },
    {
      id: 'garmin-connect',
      name: 'Garmin Connect',
      icon: Zap,
      description: 'Connect your Garmin account to sync activities and health data',
      connected: false,
      category: 'fitness',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: Heart,
      description: 'Sync sleep, activity, and heart rate data from Fitbit',
      connected: false,
      category: 'fitness',
      color: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'sleep-cycle',
      name: 'Sleep Cycle',
      icon: Calendar,
      description: 'Import your sleep data and analysis from Sleep Cycle',
      connected: false,
      category: 'sleep',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: Footprints,
      description: 'Sync your fitness and activity data from Google Fit',
      connected: false,
      category: 'fitness',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'withings',
      name: 'Withings Health Mate',
      icon: Database,
      description: 'Connect your Withings account to import weight, body composition, and vital signs',
      connected: false,
      category: 'health',
      color: 'bg-purple-100 text-purple-800'
    }
  ];
  
  // Filter integrations by category
  const filteredIntegrations = activeCategory === 'all'
    ? appIntegrations
    : appIntegrations.filter(app => app.category === activeCategory);
  
  // Handle connecting to service
  const handleConnect = (integrationId: string) => {
    setConnecting(integrationId);
    
    // Simulate connection process
    setTimeout(() => {
      // In a real app, you would update the user's connected apps
      if (setUser && user) {
        const updatedApps = [...(user.preferences.trackingApps || [])];
        const integration = appIntegrations.find(app => app.id === integrationId);
        
        if (integration && !updatedApps.includes(integration.name)) {
          updatedApps.push(integration.name);
          
          setUser({
            ...user,
            preferences: {
              ...user.preferences,
              trackingApps: updatedApps
            }
          });
        }
      }
      
      setConnecting(null);
    }, 2000);
  };
  
  // Handle disconnecting from service
  const handleDisconnect = (integrationId: string) => {
    const integration = appIntegrations.find(app => app.id === integrationId);
    
    if (!integration) return;
    
    if (confirm(`Are you sure you want to disconnect from ${integration.name}?`)) {
      // In a real app, you would update the user's connected apps
      if (setUser && user && user.preferences.trackingApps) {
        const updatedApps = user.preferences.trackingApps.filter(
          app => app !== integration.name
        );
        
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            trackingApps: updatedApps
          }
        });
      }
    }
  };
  
  // Handle syncing data
  const handleSync = (integrationId: string) => {
    setSyncing(integrationId);
    
    // Simulate syncing process
    setTimeout(() => {
      setSyncing(null);
    }, 2000);
  };
  
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            App Integrations
          </h1>
          <p className="text-purple-100 text-md max-w-2xl">
            Connect your favorite fitness, nutrition, and health apps to import your data automatically.
          </p>
          <div className="flex gap-3 mt-2">
            <Link href="/devices">
              <Button 
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                Manage Devices
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === 'all'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          All Integrations
        </button>
        
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === 'fitness'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveCategory('fitness')}
        >
          Fitness
        </button>
        
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === 'nutrition'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveCategory('nutrition')}
        >
          Nutrition
        </button>
        
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === 'health'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveCategory('health')}
        >
          Health
        </button>
        
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === 'sleep'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveCategory('sleep')}
        >
          Sleep
        </button>
      </div>
      
      {/* App integrations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map(integration => (
          <div 
            key={integration.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-4 flex items-start gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                integration.connected
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <integration.icon className={`h-6 w-6 ${
                  integration.connected
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {integration.name}
                  </h3>
                  {integration.connected && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {integration.description}
                </p>
                
                {integration.connected ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(integration.id)}
                      disabled={syncing === integration.id}
                    >
                      {syncing === integration.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                    
                    {integration.lastSynced && (
                      <div className="hidden sm:block ml-auto text-xs text-gray-500 dark:text-gray-400 self-center">
                        Last synced: {integration.lastSynced.toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                    disabled={connecting === integration.id}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {connecting === integration.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
                
                {integration.connected && integration.lastSynced && (
                  <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Last synced: {integration.lastSynced.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Data privacy notice */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mt-2">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Data Privacy</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We take your privacy seriously. When you connect apps, we only access the fitness and health data needed to provide our services.
          You can disconnect any app at any time, and we'll stop receiving new data.
        </p>
        <Link href="/privacy" className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block">
          Learn more about our data practices
        </Link>
      </div>
    </div>
  );
} 