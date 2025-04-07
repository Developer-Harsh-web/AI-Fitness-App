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
import { DeviceConnect } from '../../../components/devices/DeviceConnect';

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
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Connect Your Devices</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your fitness trackers and wearables to sync your health and activity data. 
            This allows us to provide more personalized recommendations.
          </p>
          
          <DeviceConnect />
        </div>
      </div>
    </div>
  );
} 