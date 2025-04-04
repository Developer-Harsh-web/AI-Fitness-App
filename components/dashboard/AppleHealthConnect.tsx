"use client";

import React, { useState } from 'react';
import { 
  Apple, 
  Heart, 
  CheckCircle2, 
  Watch, 
  BarChart4, 
  Bed, 
  Timer, 
  AlarmClockCheck,
  Settings,
  Footprints,
  Activity,
  ListPlus
} from 'lucide-react';
import Button from '../ui/Button';
import { useUserContext } from '../../lib/hooks/UserContext';
import { useAiPersona } from '../../lib/hooks/useAiPersona';

interface HealthPermission {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

export default function AppleHealthConnect() {
  const { user, setUser } = useUserContext();
  const { currentPersona } = useAiPersona();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(
    !!user?.preferences?.trackingIntegrations?.appleHealth?.connected
  );
  const [showPermissions, setShowPermissions] = useState(false);
  
  // Get the current permissions from user data or use defaults
  const initialPermissions = user?.preferences?.trackingIntegrations?.appleHealth?.permissions || {
    steps: true,
    heartRate: true,
    workout: true,
    sleep: true,
    nutrition: false,
  };
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>(initialPermissions);
  
  // Available health data types to sync
  const availablePermissions: HealthPermission[] = [
    {
      id: 'steps',
      name: 'Steps',
      description: 'Track your daily step count',
      icon: Footprints,
      enabled: permissions.steps
    },
    {
      id: 'heartRate',
      name: 'Heart Rate',
      description: 'Monitor your resting and active heart rate',
      icon: Heart,
      enabled: permissions.heartRate
    },
    {
      id: 'workout',
      name: 'Workouts',
      description: 'Import your workout sessions automatically',
      icon: Activity,
      enabled: permissions.workout
    },
    {
      id: 'sleep',
      name: 'Sleep',
      description: 'Track your sleep duration and quality',
      icon: Bed,
      enabled: permissions.sleep
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      description: 'Import your nutrition and water intake data',
      icon: ListPlus,
      enabled: permissions.nutrition
    },
  ];
  
  // Simulate connecting to Apple Health
  const connectToAppleHealth = async () => {
    setIsConnecting(true);
    
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the user's preferences
      if (user && setUser) {
        // Add Apple Watch to tracking devices if not already there
        const updatedDevices = user.preferences.trackingDevices.includes('Apple Watch') 
          ? user.preferences.trackingDevices 
          : [...user.preferences.trackingDevices, 'Apple Watch'];
        
        // Update tracking integrations
        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            trackingDevices: updatedDevices,
            trackingIntegrations: {
              ...user.preferences.trackingIntegrations,
              appleHealth: {
                connected: true,
                lastSynced: new Date().toISOString(),
                permissions: permissions,
              }
            }
          }
        };
        
        setUser(updatedUser);
      }
      
      setIsConnected(true);
      
    } catch (error) {
      console.error('Error connecting to Apple Health:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Toggle permission for a specific health data type
  const togglePermission = (permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };
  
  // Disconnect from Apple Health
  const disconnectAppleHealth = async () => {
    setIsConnecting(true);
    
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user's preferences
      if (user && setUser) {
        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            trackingIntegrations: {
              ...user.preferences.trackingIntegrations,
              appleHealth: {
                connected: false,
                permissions: permissions
              }
            }
          }
        };
        
        setUser(updatedUser);
      }
      
      setIsConnected(false);
      
    } catch (error) {
      console.error('Error disconnecting from Apple Health:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-3">
            <Apple className="h-6 w-6 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Apple Health</h3>
            <p className="text-gray-300 text-sm">Sync your Apple Watch data automatically</p>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {isConnected ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Connected to Apple Health</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPermissions(!showPermissions)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </Button>
            </div>
            
            {/* Device info */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="mr-3">
                <Watch className="h-8 w-8 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Apple Watch</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last synced: {user?.preferences?.trackingIntegrations?.appleHealth?.lastSynced 
                    ? new Date(user.preferences.trackingIntegrations.appleHealth.lastSynced).toLocaleString() 
                    : 'Never'}
                </p>
              </div>
            </div>
            
            {/* Health data */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Health Data Being Synced
              </h4>
              
              {showPermissions ? (
                <div className="space-y-3">
                  {availablePermissions.map((perm) => (
                    <div 
                      key={perm.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                          <perm.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">{perm.name}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{perm.description}</p>
                        </div>
                      </div>
                      
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={permissions[perm.id]} 
                          onChange={() => togglePermission(perm.id)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                  
                  <div className="flex space-x-3 mt-4">
                    <Button
                      onClick={connectToAppleHealth}
                      isLoading={isConnecting}
                    >
                      Save Permissions
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowPermissions(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions
                    .filter(perm => permissions[perm.id])
                    .map((perm) => (
                      <div 
                        key={perm.id}
                        className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900/10"
                      >
                        <perm.icon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">{perm.name}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            
            {/* AI coach tip */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  {currentPersona.emoji}
                </div>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">{currentPersona.name} says:</span> Great choice connecting your Apple Watch! I'll be able to provide more personalized recommendations based on your activity data.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Disconnect button */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnectAppleHealth}
                isLoading={isConnecting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Disconnect from Apple Health
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 border-2 border-gray-200 dark:border-gray-700">
              <Watch className="h-10 w-10 text-gray-500 dark:text-gray-400" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connect Your Apple Watch</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
              Sync your Apple Watch data to get personalized insights and track your fitness progress automatically.
            </p>
            
            <Button
              onClick={() => setShowPermissions(true)}
              leftIcon={<Apple className="h-4 w-4" />}
              className="mb-4"
            >
              Connect Apple Health
            </Button>
            
            {showPermissions && (
              <div className="w-full max-w-md mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Select data to sync:
                </h4>
                
                <div className="space-y-3">
                  {availablePermissions.map((perm) => (
                    <div 
                      key={perm.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                          <perm.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">{perm.name}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{perm.description}</p>
                        </div>
                      </div>
                      
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={permissions[perm.id]} 
                          onChange={() => togglePermission(perm.id)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                  
                  <Button
                    onClick={connectToAppleHealth}
                    isLoading={isConnecting}
                    className="w-full mt-4"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect and Continue'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 