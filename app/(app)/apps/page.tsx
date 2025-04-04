"use client";

import React, { useState } from 'react';
import { 
  Smartphone, 
  RefreshCw, 
  Footprints, 
  Heart, 
  Activity, 
  Zap, 
  Settings,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  LinkIcon,
  QrCode
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useUserContext } from '../../../lib/hooks/UserContext';
import MobileAppConnect from '../../../components/dashboard/MobileAppConnect';
import Link from 'next/link';

// Define app categories
const APP_CATEGORIES = [
  { id: 'tracking', name: 'Activity Tracking', icon: Activity },
  { id: 'nutrition', name: 'Nutrition & Diet', icon: Heart },
  { id: 'running', name: 'Running & Cardio', icon: Footprints },
  { id: 'workout', name: 'Workout & Training', icon: Zap },
];

type AppStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface ConnectedApp {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  color: string;
  status: AppStatus;
  lastSynced?: Date;
  logoUrl?: string;
  description: string;
  features: string[];
}

export default function AppsPage() {
  const { /* user, setUser - Removed unused vars */ } = useUserContext();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<ConnectedApp | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const connectedApps: ConnectedApp[] = [
    {
      id: 'strava',
      name: 'Strava',
      type: 'running',
      icon: Footprints,
      color: 'text-orange-500',
      status: 'connected',
      lastSynced: new Date(Date.now() - 5400000), // 1.5 hours ago
      description: 'Track running, cycling, and swimming activities',
      features: ['GPS tracking', 'Activity analysis', 'Social sharing', 'Training plans', 'Performance stats']
    },
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal',
      type: 'nutrition',
      icon: Heart,
      color: 'text-blue-500',
      status: 'connected',
      lastSynced: new Date(Date.now() - 9000000), // 2.5 hours ago
      description: 'Food diary and nutrition tracking',
      features: ['Calorie tracking', 'Meal planning', 'Food database', 'Macronutrient tracking', 'Recipe calculator']
    },
    {
      id: 'mapmyrun',
      name: 'MapMyRun',
      type: 'running',
      icon: Footprints,
      color: 'text-red-500',
      status: 'connected',
      lastSynced: new Date(Date.now() - 19200000), // 5.3 hours ago
      description: 'GPS running and workout tracking',
      features: ['GPS mapping', 'Route discovery', 'Training plans', 'Voice coaching', 'Progress tracking']
    },
    {
      id: 'nike-run-club',
      name: 'Nike Run Club',
      type: 'running',
      icon: Zap,
      color: 'text-green-600',
      status: 'disconnected',
      description: 'Guided runs and training plans',
      features: ['Guided runs', 'Training plans', 'Achievement badges', 'Community challenges', 'Personalized coaching']
    },
    {
      id: 'sleeptracker',
      name: 'Sleep Tracker',
      type: 'tracking',
      icon: Activity,
      color: 'text-indigo-500',
      status: 'disconnected',
      description: 'Analyze sleep patterns and quality',
      features: ['Sleep stages', 'Sleep quality rating', 'Smart wake-up', 'Sleep sounds', 'Sleep insights']
    }
  ];
  
  // Filter apps by category
  const filteredApps = activeCategory === 'all'
    ? connectedApps
    : connectedApps.filter(app => app.type === activeCategory);
  
  // Handle app sync
  const handleSyncApp = (appId: string) => {
    setIsSyncing(appId);
    
    // Simulate syncing
    setTimeout(() => {
      // In a real app, you would update the user's connected apps here
      setIsSyncing(null);
    }, 2000);
  };
  
  // Handle app disconnection
  const handleDisconnectApp = (app: ConnectedApp) => {
    // This would update the user's connected apps in a real app
    if (confirm(`Are you sure you want to disconnect ${app.name}?`)) {
      alert(`${app.name} has been disconnected.`);
    }
  };
  
  // Handle app connection
  const handleConnectApp = (app: ConnectedApp) => {
    setSelectedApp(app);
    setShowQRCode(true);
  };
  
  // Finish connection
  const finishConnection = () => {
    setShowQRCode(false);
    if (selectedApp) {
      // In a real app, you would properly connect to the service here
      alert(`${selectedApp.name} has been connected successfully!`);
    }
  };
  
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Mobile Fitness Apps
          </h1>
          <p className="text-purple-100 text-lg">
            Connect your favorite fitness apps to sync data and get a complete picture of your health
          </p>
        </div>
      </div>
      
      {/* Category navigation */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === 'all'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          All Apps
        </button>
        
        {APP_CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === category.id
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon className="h-4 w-4 mr-2" />
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Connected apps */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connected Apps</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your fitness mobile applications</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {}}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add New App
          </Button>
        </div>
        
        {filteredApps.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredApps.map(app => (
              <div key={app.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  app.status === 'connected'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <app.icon className={`h-6 w-6 ${app.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{app.name}</h3>
                    {app.status === 'connected' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {app.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {app.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {feature}
                      </span>
                    ))}
                    {app.features.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        +{app.features.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {app.status === 'connected' && app.lastSynced && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last synced: {app.lastSynced.toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {app.status === 'connected' ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSyncApp(app.id)}
                        leftIcon={<RefreshCw className={`h-4 w-4 ${isSyncing === app.id ? 'animate-spin' : ''}`} />}
                        isLoading={isSyncing === app.id}
                      >
                        {isSyncing === app.id ? 'Syncing...' : 'Sync Now'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnectApp(app)}
                        leftIcon={<Trash2 className="h-4 w-4" />}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConnectApp(app)}
                      leftIcon={<LinkIcon className="h-4 w-4" />}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="flex flex-col items-center">
              <Smartphone className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No apps found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                You don&apos;t have any {activeCategory !== 'all' ? APP_CATEGORIES.find(c => c.id === activeCategory)?.name.toLowerCase() : 'apps'} connected yet.
              </p>
              <Button
                variant="primary"
                onClick={() => {}}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add New App
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Connect new app section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add a New App</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect a new fitness application</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <MobileAppConnect />
        </div>
      </div>
      
      {/* Tips and Help section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tips & Troubleshooting</h2>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data not syncing?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Make sure you&apos;ve granted all necessary permissions in the app and that your accounts are linked correctly.
            </p>
            <Link href="/help/app-sync" className="text-purple-600 dark:text-purple-400 text-sm font-medium inline-flex items-center">
              View sync guide
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Which app should I use?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Different apps are better for different activities. We recommend connecting multiple apps for a complete fitness profile.
            </p>
            <Link href="/help/app-guide" className="text-purple-600 dark:text-purple-400 text-sm font-medium inline-flex items-center">
              View app recommendations
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* QR code modal for connecting */}
      {showQRCode && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Connect {selectedApp.name}</h3>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-4 rounded-lg mb-4">
                <QrCode className="h-44 w-44 text-gray-800" />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                Scan this QR code with your phone to connect {selectedApp.name} to your fitness profile. Or open the {selectedApp.name} app and enter the code:
              </p>
              
              <div className="font-mono text-lg bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-md mb-4">
                FITAPP-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={finishConnection}
            >
              I&apos;ve Completed Connection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 