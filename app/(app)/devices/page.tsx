"use client";

import React, { useState } from 'react';
import { 
  Watch, 
  RefreshCw, 
  Footprints, 
  Heart, 
  Smartphone, 
  Zap, 
  Settings, 
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  LinkIcon,
  Bluetooth,
  Calendar,
  X
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useUserContext } from '../../../lib/hooks/UserContext';
import Link from 'next/link';

// Define device categories
const DEVICE_CATEGORIES = [
  { id: 'smartwatches', name: 'Smartwatches', icon: Watch },
  { id: 'fitness-trackers', name: 'Fitness Trackers', icon: Zap },
  { id: 'heart-monitors', name: 'Heart Rate Monitors', icon: Heart },
  { id: 'smart-scales', name: 'Smart Scales', icon: Footprints },
];

type DeviceStatus = 'connected' | 'disconnected' | 'pairing' | 'error';

interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  icon: React.ElementType;
  status: DeviceStatus;
  lastSynced?: Date;
  batteryLevel?: number;
  metrics: string[];
}

export default function DevicesPage() {
  const { user, setUser } = useUserContext();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<ConnectedDevice | null>(null);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  
  const connectedDevices: ConnectedDevice[] = [
    {
      id: 'apple-watch-1',
      name: 'Apple Watch',
      type: 'smartwatch',
      brand: 'Apple',
      model: 'Series 7',
      icon: Watch,
      status: 'connected',
      lastSynced: new Date(Date.now() - 3600000), // 1 hour ago
      batteryLevel: 72,
      metrics: ['steps', 'heart-rate', 'sleep', 'workouts', 'calories']
    },
    {
      id: 'fitbit-1',
      name: 'Fitbit',
      type: 'fitness-tracker',
      brand: 'Fitbit',
      model: 'Charge 5',
      icon: Zap,
      status: 'connected',
      lastSynced: new Date(Date.now() - 7200000), // 2 hours ago
      batteryLevel: 45,
      metrics: ['steps', 'heart-rate', 'sleep', 'workouts']
    },
    {
      id: 'garmin-1',
      name: 'Garmin Watch',
      type: 'smartwatch',
      brand: 'Garmin',
      model: 'Forerunner 245',
      icon: Watch,
      status: 'connected',
      lastSynced: new Date(Date.now() - 14400000), // 4 hours ago
      batteryLevel: 83,
      metrics: ['steps', 'heart-rate', 'workouts', 'gps']
    },
    {
      id: 'bluetooth-scale',
      name: 'Smart Scale',
      type: 'smart-scale',
      brand: 'Withings',
      model: 'Body+',
      icon: Footprints,
      status: 'disconnected',
      metrics: ['weight', 'body-fat', 'bmi']
    }
  ];
  
  // Filter devices by category
  const filteredDevices = activeCategory === 'all'
    ? connectedDevices
    : connectedDevices.filter(device => device.type === activeCategory.replace('-', ''));
  
  // Handle device sync
  const handleSyncDevice = (deviceId: string) => {
    setIsSyncing(deviceId);
    
    // Simulate syncing
    setTimeout(() => {
      const updatedDevices = connectedDevices.map(device => 
        device.id === deviceId
          ? { ...device, lastSynced: new Date(), status: 'connected' as DeviceStatus }
          : device
      );
      
      // In a real app, you would update the user's devices here
      setIsSyncing(null);
    }, 2000);
  };
  
  // Handle device disconnection
  const handleDisconnectDevice = (device: ConnectedDevice) => {
    // This would update the user's connected devices in a real app
    if (confirm(`Are you sure you want to disconnect your ${device.name}?`)) {
      // Simulating updating user's preferences by removing the device
      if (setUser && user) {
        const updatedDevices = user.preferences.trackingDevices.filter(d => d !== device.name);
        
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            trackingDevices: updatedDevices
          }
        });
      }
      
      alert(`${device.name} has been disconnected.`);
    }
  };
  
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Device Management
          </h1>
          <p className="text-blue-100 text-md max-w-2xl">
            Connect your fitness devices to automatically sync your workout data
          </p>
          <div className="flex gap-3 mt-2">
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => setIsAddingDevice(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect New Device
            </Button>
            <Link href="/integrations">
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                App Integrations
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Device connection component */}
      {isAddingDevice && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bluetooth className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Connect New Device</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingDevice(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
          
          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Bluetooth className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Connect a Device</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This feature is being built. Soon you'll be able to connect your fitness trackers, smartwatches, and more.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <Watch className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Apple Watch</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Apple · Series 7</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      alert("Device connecting feature will be available soon!");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Fitbit Inspire 2</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Fitbit · Inspire 2</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      alert("Device connecting feature will be available soon!");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                </div>
                
                <Button
                  onClick={() => setIsAddingDevice(false)}
                  className="w-full mt-4"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Category navigation */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === 'all'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          All Devices
        </button>
        
        {DEVICE_CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === category.id
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon className="h-4 w-4 mr-2" />
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Connected devices */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Bluetooth className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Connected Devices</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your fitness tracking devices</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAddingDevice(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add New Device
          </Button>
        </div>
        
        {filteredDevices.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDevices.map(device => (
              <div key={device.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  device.status === 'connected'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <device.icon className={`h-6 w-6 ${
                    device.status === 'connected'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{device.name}</h3>
                    {device.status === 'connected' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {device.brand} {device.model}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {device.metrics.map(metric => (
                      <span key={metric} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {metric.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                  
                  {device.status === 'connected' && device.lastSynced && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last synced: {device.lastSynced.toLocaleString()}
                      {device.batteryLevel !== undefined && (
                        <span className="ml-3">Battery: {device.batteryLevel}%</span>
                      )}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {device.status === 'connected' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncDevice(device.id)}
                        disabled={isSyncing === device.id}
                      >
                        {isSyncing === device.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnectDevice(device)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setIsAddingDevice(true)}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="bg-gray-100 dark:bg-gray-900 h-16 w-16 mx-auto rounded-full flex items-center justify-center">
              <Bluetooth className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-4 text-md font-medium text-gray-900 dark:text-white">No devices found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
              You haven't connected any fitness tracking devices yet. Add a device to start syncing your activity data.
            </p>
            <Button
              className="mt-4"
              onClick={() => setIsAddingDevice(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Device
            </Button>
          </div>
        )}
      </div>
      
      {/* Data management card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Device Data History</h3>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Manage your fitness tracking data, including historical activity, workouts, and health metrics.
        </p>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Button variant="outline" size="sm">Export All Data</Button>
          <Button variant="outline" size="sm">View Sync History</Button>
          <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
} 