"use client";

import React, { useState, useEffect } from 'react';
import { 
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Footprints,
  Heart,
  Zap,
  BarChart4,
  Bed,
  Settings,
  LinkIcon,
  QrCode,
  ChevronRight
} from 'lucide-react';
import Button from '../ui/Button';
import { useUserContext } from '../../lib/hooks/UserContext';
import { useAiPersona } from '../../lib/hooks/useAiPersona';
import Link from 'next/link';

interface AppIntegration {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  connected: boolean;
  lastSynced?: Date;
  features: string[];
}

export default function MobileAppConnect() {
  const { user, setUser } = useUserContext();
  const { currentPersona } = useAiPersona();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppIntegration | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  // Get currently connected apps from user preferences
  const connectedApps = user?.preferences?.trackingApps || [];
  
  // App integrations data
  const availableApps: AppIntegration[] = [
    {
      id: 'strava',
      name: 'Strava',
      icon: Footprints,
      description: 'Track running, cycling, and swimming activities',
      color: 'text-orange-500',
      connected: connectedApps.includes('Strava'),
      lastSynced: user?.preferences?.trackingIntegrations?.strava?.lastSynced 
        ? new Date(user.preferences.trackingIntegrations.strava.lastSynced) 
        : undefined,
      features: ['Activity tracking', 'Route mapping', 'Social sharing', 'Training analytics']
    },
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal',
      icon: Heart,
      description: 'Food diary and nutrition tracking',
      color: 'text-blue-500',
      connected: connectedApps.includes('MyFitnessPal'),
      lastSynced: user?.preferences?.trackingIntegrations?.myFitnessPal?.lastSynced 
        ? new Date(user.preferences.trackingIntegrations.myFitnessPal.lastSynced) 
        : undefined,
      features: ['Nutrition tracking', 'Food database', 'Meal planning', 'Calorie counting']
    },
    {
      id: 'mapmyrun',
      name: 'MapMyRun',
      icon: Footprints,
      description: 'GPS running and workout tracking',
      color: 'text-red-500',
      connected: connectedApps.includes('MapMyRun'),
      lastSynced: user?.preferences?.trackingIntegrations?.otherApps?.find(app => app.name === 'MapMyRun')?.lastSynced 
        ? new Date(user.preferences.trackingIntegrations.otherApps.find(app => app.name === 'MapMyRun')!.lastSynced!) 
        : undefined,
      features: ['GPS tracking', 'Training plans', 'Route discovery', 'Voice coaching']
    },
    {
      id: 'sleeptracker',
      name: 'Sleep Tracker',
      icon: Bed,
      description: 'Analyze sleep patterns and quality',
      color: 'text-indigo-500',
      connected: connectedApps.includes('Sleep Tracker'),
      features: ['Sleep cycles', 'Smart alarm', 'Sleep quality analysis', 'Sleep sounds']
    },
    {
      id: 'nikerun',
      name: 'Nike Run Club',
      icon: Zap,
      description: 'Guided runs and training plans',
      color: 'text-green-600',
      connected: connectedApps.includes('Nike Run Club'),
      features: ['Guided runs', 'Training plans', 'Achievements', 'Challenges']
    }
  ];
  
  // Handle app selection
  const handleSelectApp = (app: AppIntegration) => {
    setSelectedApp(app);
  };
  
  // Connect to app
  const connectApp = async () => {
    if (!selectedApp) return;
    
    setIsConnecting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user preferences with connected app
      if (user && setUser) {
        // Add app to tracking apps if not already there
        const updatedApps = connectedApps.includes(selectedApp.name) 
          ? connectedApps 
          : [...connectedApps, selectedApp.name];
        
        // Create updated tracking integrations
        let updatedIntegrations = { ...user.preferences.trackingIntegrations } || {};
        
        // Update specific app integration
        if (selectedApp.id === 'strava') {
          updatedIntegrations.strava = {
            connected: true,
            lastSynced: new Date().toISOString(),
            accountEmail: user.email
          };
        } else if (selectedApp.id === 'myfitnesspal') {
          updatedIntegrations.myFitnessPal = {
            connected: true,
            lastSynced: new Date().toISOString(),
            accountEmail: user.email
          };
        } else {
          // Handle other apps
          const otherApps = updatedIntegrations.otherApps || [];
          const existingAppIndex = otherApps.findIndex(app => app.name === selectedApp.name);
          
          if (existingAppIndex >= 0) {
            otherApps[existingAppIndex] = {
              ...otherApps[existingAppIndex],
              connected: true,
              lastSynced: new Date().toISOString()
            };
          } else {
            otherApps.push({
              name: selectedApp.name,
              connected: true,
              lastSynced: new Date().toISOString()
            });
          }
          
          updatedIntegrations.otherApps = otherApps;
        }
        
        // Update user object
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            trackingApps: updatedApps,
            trackingIntegrations: updatedIntegrations
          }
        });
        
        // Update selected app state
        setSelectedApp({
          ...selectedApp,
          connected: true,
          lastSynced: new Date()
        });
      }
      
      // Show QR code for final connection step
      setShowQRCode(true);
      
    } catch (error) {
      console.error('Error connecting app:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect app
  const disconnectApp = async () => {
    if (!selectedApp) return;
    
    setIsConnecting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (user && setUser) {
        // Remove app from tracking apps
        const updatedApps = connectedApps.filter(app => app !== selectedApp.name);
        
        // Update integrations
        let updatedIntegrations = { ...user.preferences.trackingIntegrations } || {};
        
        // Update specific app integration
        if (selectedApp.id === 'strava' && updatedIntegrations.strava) {
          updatedIntegrations.strava.connected = false;
        } else if (selectedApp.id === 'myfitnesspal' && updatedIntegrations.myFitnessPal) {
          updatedIntegrations.myFitnessPal.connected = false;
        } else {
          // Handle other apps
          const otherApps = updatedIntegrations.otherApps || [];
          const existingAppIndex = otherApps.findIndex(app => app.name === selectedApp.name);
          
          if (existingAppIndex >= 0) {
            otherApps[existingAppIndex] = {
              ...otherApps[existingAppIndex],
              connected: false
            };
          }
          
          updatedIntegrations.otherApps = otherApps;
        }
        
        // Update user object
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            trackingApps: updatedApps,
            trackingIntegrations: updatedIntegrations
          }
        });
        
        // Update selected app state
        setSelectedApp({
          ...selectedApp,
          connected: false,
          lastSynced: undefined
        });
      }
      
    } catch (error) {
      console.error('Error disconnecting app:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Sync app data
  const syncAppData = async () => {
    if (!selectedApp) return;
    
    setSyncing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (user && setUser) {
        // Update last synced time
        let updatedIntegrations = { ...user.preferences.trackingIntegrations } || {};
        
        if (selectedApp.id === 'strava' && updatedIntegrations.strava) {
          updatedIntegrations.strava.lastSynced = new Date().toISOString();
        } else if (selectedApp.id === 'myfitnesspal' && updatedIntegrations.myFitnessPal) {
          updatedIntegrations.myFitnessPal.lastSynced = new Date().toISOString();
        } else {
          // Handle other apps
          const otherApps = updatedIntegrations.otherApps || [];
          const existingAppIndex = otherApps.findIndex(app => app.name === selectedApp.name);
          
          if (existingAppIndex >= 0) {
            otherApps[existingAppIndex] = {
              ...otherApps[existingAppIndex],
              lastSynced: new Date().toISOString()
            };
          }
          
          updatedIntegrations.otherApps = otherApps;
        }
        
        // Update user object
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            trackingIntegrations: updatedIntegrations
          }
        });
        
        // Update selected app state
        setSelectedApp({
          ...selectedApp,
          lastSynced: new Date()
        });
      }
      
    } catch (error) {
      console.error('Error syncing app data:', error);
    } finally {
      setSyncing(false);
    }
  };
  
  // Finish QR code connection
  const finishConnection = () => {
    setShowQRCode(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Mobile App Connections</h3>
            <p className="text-purple-100 text-sm">Connect your fitness apps to sync data automatically</p>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex">
          {/* App selection sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 pr-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Apps</h4>
            <div className="space-y-2">
              {availableApps.map(app => (
                <div
                  key={app.id}
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    selectedApp?.id === app.id 
                      ? 'bg-purple-50 dark:bg-purple-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                  onClick={() => handleSelectApp(app)}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                    app.connected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <app.icon className={`h-4 w-4 ${app.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{app.name}</span>
                      {app.connected && (
                        <CheckCircle2 className="ml-1 h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {app.connected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* App details */}
          <div className="flex-1 pl-6">
            {selectedApp ? (
              <>
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${selectedApp.color}`}>
                      <selectedApp.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">{selectedApp.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedApp.description}</p>
                    </div>
                  </div>
                  
                  {selectedApp.connected && selectedApp.lastSynced && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last synced: {selectedApp.lastSynced.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedApp.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-2 bg-gray-50 dark:bg-gray-900/10 rounded-md"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Connection status and actions */}
                {selectedApp.connected ? (
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-green-800 dark:text-green-200">Connected to {selectedApp.name}</span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={syncAppData}
                        leftIcon={<RefreshCw className="h-4 w-4" />}
                        isLoading={syncing}
                      >
                        {syncing ? 'Syncing...' : 'Sync Now'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={disconnectApp}
                        isLoading={isConnecting}
                      >
                        Disconnect
                      </Button>
                    </div>
                    
                    {/* AI coach feedback */}
                    <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          {currentPersona.emoji}
                        </div>
                        <div>
                          <p className="text-sm text-indigo-800 dark:text-indigo-200">
                            <span className="font-medium">{currentPersona.name}:</span> Great job connecting {selectedApp.name}! Your recent data will be used to provide more personalized recommendations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Connect to {selectedApp.name} to automatically sync your fitness data and get personalized insights.
                    </p>
                    
                    <Button
                      onClick={connectApp}
                      leftIcon={<LinkIcon className="h-4 w-4" />}
                      isLoading={isConnecting}
                    >
                      Connect to {selectedApp.name}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <Smartphone className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Select an app from the sidebar to connect or manage.
                </p>
              </div>
            )}
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
              I've Completed Connection
            </Button>
          </div>
        </div>
      )}

      {/* View all apps link */}
      <div className="pt-2 pb-4 px-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/apps" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center">
          <Smartphone className="h-4 w-4 mr-1" />
          View all mobile apps
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
} 