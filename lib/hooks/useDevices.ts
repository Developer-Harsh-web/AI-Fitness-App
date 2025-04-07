import { useState, useEffect, useCallback } from 'react';
import { useUserContext } from './UserContext';
import { ConnectedDevice, DeviceData } from '../../types';

// Sample device tokens - in a real app, these would be securely stored
const MOCK_DEVICE_TOKENS = {
  oura: {
    accessToken: 'mock-oura-access-token',
    refreshToken: 'mock-oura-refresh-token',
    expiresIn: 3600
  },
  whoop: {
    accessToken: 'mock-whoop-access-token',
    refreshToken: 'mock-whoop-refresh-token',
    expiresIn: 3600
  }
};

export const useDevices = () => {
  const { user } = useUserContext();
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load connected devices
  useEffect(() => {
    if (!user?.id) return;

    const loadDevices = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo, check localStorage
        if (typeof window !== 'undefined') {
          const savedDevices = localStorage.getItem(`devices-${user.id}`);
          if (savedDevices) {
            setConnectedDevices(JSON.parse(savedDevices));
          } else {
            // Initialize with empty devices array
            setConnectedDevices([]);
            localStorage.setItem(`devices-${user.id}`, JSON.stringify([]));
          }
        }
      } catch (error) {
        console.error('Error loading devices:', error);
        setError('Failed to load connected devices');
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, [user?.id]);

  // Save devices to localStorage
  const saveDevicesToStorage = useCallback((devices: ConnectedDevice[]) => {
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`devices-${user.id}`, JSON.stringify(devices));
    }
  }, [user?.id]);

  // Connect to a device - this would initiate OAuth flow in a real app
  const connectDevice = useCallback(async (deviceType: 'oura' | 'whoop' | 'fitbit' | 'garmin' | 'apple_health' | 'google_fit' | 'samsung_health') => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if device is already connected
      const existing = connectedDevices.find(d => d.type === deviceType);
      if (existing) {
        setError(`${deviceType} is already connected`);
        setIsLoading(false);
        return existing;
      }

      // Create a new device entry
      const newDevice: ConnectedDevice = {
        id: `${deviceType}-${Date.now()}`,
        userId: user?.id || 'unknown',
        type: deviceType,
        name: deviceType === 'oura' ? 'Oura Ring' : deviceType === 'whoop' ? 'Whoop Band' : `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}`,
        connected: true,
        lastSynced: new Date(),
        accessToken: MOCK_DEVICE_TOKENS[deviceType as 'oura' | 'whoop']?.accessToken,
        refreshToken: MOCK_DEVICE_TOKENS[deviceType as 'oura' | 'whoop']?.refreshToken,
        tokenExpiry: new Date(Date.now() + (MOCK_DEVICE_TOKENS[deviceType as 'oura' | 'whoop']?.expiresIn || 3600) * 1000)
      };

      // Update state
      const updatedDevices = [...connectedDevices, newDevice];
      setConnectedDevices(updatedDevices);
      saveDevicesToStorage(updatedDevices);

      // Generate some mock data for the newly connected device
      await syncDeviceData(newDevice.id);

      return newDevice;
    } catch (error) {
      console.error(`Error connecting to ${deviceType}:`, error);
      setError(`Failed to connect to ${deviceType}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [connectedDevices, user?.id, saveDevicesToStorage]);

  // Disconnect a device
  const disconnectDevice = useCallback(async (deviceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find the device
      const device = connectedDevices.find(d => d.id === deviceId);
      if (!device) {
        setError('Device not found');
        setIsLoading(false);
        return false;
      }

      // Update the device
      const updatedDevices = connectedDevices.filter(d => d.id !== deviceId);
      setConnectedDevices(updatedDevices);
      saveDevicesToStorage(updatedDevices);

      // Remove device data
      const updatedData = deviceData.filter(d => d.deviceId !== deviceId);
      setDeviceData(updatedData);
      
      // In a real app, we would also revoke OAuth tokens

      return true;
    } catch (error) {
      console.error(`Error disconnecting device:`, error);
      setError('Failed to disconnect device');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [connectedDevices, deviceData, saveDevicesToStorage]);

  // Sync data from a specific device
  const syncDeviceData = useCallback(async (deviceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the device
      const device = connectedDevices.find(d => d.id === deviceId);
      if (!device) {
        setError('Device not found');
        setIsLoading(false);
        return false;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Generate mock data based on device type
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let newData: DeviceData[] = [];

      if (device.type === 'oura') {
        // Generate Oura-specific data
        newData = [
          {
            id: `sleep-${Date.now()}`,
            userId: user?.id || 'unknown',
            deviceId: device.id,
            date: yesterday,
            type: 'sleep',
            data: {
              score: Math.floor(Math.random() * 30) + 70, // 70-100
              duration: (6 + Math.random() * 3) * 3600, // 6-9 hours in seconds
              deep: Math.floor(Math.random() * 20) + 10, // 10-30% deep sleep
              rem: Math.floor(Math.random() * 25) + 15, // 15-40% REM
              light: Math.floor(Math.random() * 40) + 30, // 30-70% light sleep
              awake: Math.floor(Math.random() * 10), // 0-10% awake time
            },
            source: 'oura'
          },
          {
            id: `readiness-${Date.now()}`,
            userId: user?.id || 'unknown',
            deviceId: device.id,
            date: today,
            type: 'readiness',
            data: {
              score: Math.floor(Math.random() * 30) + 65, // 65-95
              recoveryIndex: Math.floor(Math.random() * 30) + 60, // 60-90
              hrvBalance: Math.floor(Math.random() * 30) + 65, // 65-95
              restingHr: Math.floor(Math.random() * 15) + 55, // 55-70 bpm
              bodyTemperature: (36.5 + (Math.random() * 1 - 0.5)).toFixed(1), // 36.0-37.0°C
            },
            source: 'oura'
          }
        ];
      } else if (device.type === 'whoop') {
        // Generate Whoop-specific data
        newData = [
          {
            id: `recovery-${Date.now()}`,
            userId: user?.id || 'unknown',
            deviceId: device.id,
            date: today,
            type: 'readiness',
            data: {
              recovery: Math.floor(Math.random() * 30) + 65, // 65-95%
              strain: Math.floor(Math.random() * 15) + 5, // 5-20 strain score
              restingHr: Math.floor(Math.random() * 15) + 55, // 55-70 bpm
              hrv: Math.floor(Math.random() * 40) + 40, // 40-80ms
            },
            source: 'whoop'
          },
          {
            id: `sleep-${Date.now() + 1}`,
            userId: user?.id || 'unknown',
            deviceId: device.id,
            date: yesterday,
            type: 'sleep',
            data: {
              score: Math.floor(Math.random() * 30) + 70, // 70-100%
              needToSleep: Math.floor((7 + Math.random() * 3) * 60), // 7-10 hours in minutes
              actualSleep: Math.floor((5 + Math.random() * 5) * 60), // 5-10 hours in minutes
              sleepEfficiency: Math.floor(Math.random() * 20) + 80, // 80-100%
              cycles: Math.floor(Math.random() * 3) + 3, // 3-6 cycles
              disturbances: Math.floor(Math.random() * 8), // 0-8 disturbances
            },
            source: 'whoop'
          }
        ];
      }

      // Update device last synced time
      const updatedDevices = connectedDevices.map(d => 
        d.id === deviceId ? { ...d, lastSynced: new Date() } : d
      );
      setConnectedDevices(updatedDevices);
      saveDevicesToStorage(updatedDevices);

      // Merge new data with existing
      setDeviceData(prevData => {
        // Remove old data for this device to avoid duplicates
        const filteredData = prevData.filter(d => d.deviceId !== deviceId);
        return [...filteredData, ...newData];
      });

      return true;
    } catch (error) {
      console.error(`Error syncing device data:`, error);
      setError('Failed to sync device data');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [connectedDevices, user?.id, saveDevicesToStorage]);

  // Get data for a specific device
  const getDeviceData = useCallback((deviceId: string) => {
    return deviceData.filter(d => d.deviceId === deviceId);
  }, [deviceData]);

  // Get the most recent data of a specific type
  const getLatestData = useCallback((type: 'sleep' | 'activity' | 'readiness' | 'heart_rate') => {
    const filteredData = deviceData.filter(d => d.type === type);
    if (filteredData.length === 0) return null;
    
    // Sort by date descending and return the latest entry
    return filteredData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }, [deviceData]);

  return {
    connectedDevices,
    deviceData,
    isLoading,
    error,
    connectDevice,
    disconnectDevice,
    syncDeviceData,
    getDeviceData,
    getLatestData
  };
}; 