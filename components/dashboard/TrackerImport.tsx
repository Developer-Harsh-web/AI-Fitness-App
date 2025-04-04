"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Apple, 
  Watch, 
  Link as LinkIcon, 
  RefreshCw, 
  Zap, 
  BatteryCharging,
  Bluetooth,
  Footprints,
  Heart,
  Bed,
  Eye,
  ChevronRight
} from 'lucide-react';
import Button from '../ui/Button';
import { useUserContext } from '../../lib/hooks/UserContext';
import { useAiPersona } from '../../lib/hooks/useAiPersona';
import Link from 'next/link';

interface TrackerData {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  heartRate?: number;
  sleep?: {
    total: number;
    deep: number;
    rem: number;
    light: number;
  };
}

interface TrackerDevice {
  id: string;
  name: string;
  icon: React.ElementType;
  connected: boolean;
  lastSynced?: Date;
  color: string;
  apiSupport: 'native' | 'healthkit' | 'googlefit' | 'api' | 'screenshot' | 'phoneapp';
  deviceType: 'tracker' | 'phoneapp';
  description?: string;
}

export default function TrackerImport() {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [extractedData, setExtractedData] = useState<TrackerData | null>(null);
  const [trackerType, setTrackerType] = useState<string>('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<TrackerDevice | null>(null);
  const [activeTab, setActiveTab] = useState<'trackers' | 'phoneapps'>('trackers');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, setUser } = useUserContext();
  const { currentPersona } = useAiPersona();
  
  // Get available tracker types from user preferences
  const availableTrackers = user?.preferences?.trackingDevices || [];
  const availablePhoneApps = user?.preferences?.trackingApps || [];

  // Define supported trackers with connection methods
  const supportedTrackers: TrackerDevice[] = [
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      icon: Watch,
      connected: availableTrackers.includes('Apple Watch'),
      lastSynced: availableTrackers.includes('Apple Watch') ? new Date(Date.now() - 3600000) : undefined, // 1 hour ago
      color: 'text-gray-800 dark:text-gray-200',
      apiSupport: 'healthkit',
      deviceType: 'tracker',
      description: 'Connect your Apple Watch to sync activity, workouts, and health data'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: Footprints,
      connected: availableTrackers.includes('Fitbit'),
      lastSynced: availableTrackers.includes('Fitbit') ? new Date(Date.now() - 7200000) : undefined, // 2 hours ago
      color: 'text-blue-500',
      apiSupport: 'api',
      deviceType: 'tracker',
      description: 'Connect your Fitbit device to track activity, sleep, and heart rate'
    },
    {
      id: 'garmin',
      name: 'Garmin',
      icon: Heart,
      connected: availableTrackers.includes('Garmin'),
      lastSynced: availableTrackers.includes('Garmin') ? new Date(Date.now() - 14400000) : undefined, // 4 hours ago
      color: 'text-green-500',
      apiSupport: 'api',
      deviceType: 'tracker',
      description: 'Sync your Garmin watch data for comprehensive fitness tracking'
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      icon: BatteryCharging,
      connected: availableTrackers.includes('Samsung Health'),
      color: 'text-purple-500',
      apiSupport: 'api',
      deviceType: 'tracker',
      description: 'Import your Samsung Health data from Galaxy Watch or phone'
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: Zap,
      connected: availableTrackers.includes('Google Fit'),
      color: 'text-yellow-500',
      apiSupport: 'googlefit',
      deviceType: 'tracker',
      description: 'Integrate with Google Fit to sync data from various devices'
    },
    {
      id: 'other',
      name: 'Other Device',
      icon: Smartphone,
      connected: false,
      color: 'text-gray-500',
      apiSupport: 'screenshot',
      deviceType: 'tracker',
      description: 'Import data from other fitness trackers using screenshots'
    }
  ];
  
  // Define supported phone apps
  const supportedPhoneApps: TrackerDevice[] = [
    {
      id: 'strava',
      name: 'Strava',
      icon: Footprints,
      connected: availablePhoneApps?.includes('Strava') || false,
      lastSynced: availablePhoneApps?.includes('Strava') ? new Date(Date.now() - 5400000) : undefined, // 1.5 hours ago
      color: 'text-orange-500',
      apiSupport: 'api',
      deviceType: 'phoneapp',
      description: 'Connect to Strava to track runs, rides, and other activities'
    },
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal',
      icon: Heart,
      connected: availablePhoneApps?.includes('MyFitnessPal') || false,
      lastSynced: availablePhoneApps?.includes('MyFitnessPal') ? new Date(Date.now() - 9000000) : undefined, // 2.5 hours ago
      color: 'text-blue-500',
      apiSupport: 'api',
      deviceType: 'phoneapp',
      description: 'Sync nutrition data and meal plans from MyFitnessPal'
    },
    {
      id: 'map-my-run',
      name: 'MapMyRun',
      icon: Footprints,
      connected: availablePhoneApps?.includes('MapMyRun') || false,
      lastSynced: availablePhoneApps?.includes('MapMyRun') ? new Date(Date.now() - 19200000) : undefined,
      color: 'text-red-500',
      apiSupport: 'api',
      deviceType: 'phoneapp',
      description: 'Import your run data and routes from MapMyRun'
    },
    {
      id: 'sleeptracker',
      name: 'Sleep Tracker',
      icon: Bed,
      connected: availablePhoneApps?.includes('Sleep Tracker') || false,
      color: 'text-indigo-500',
      apiSupport: 'api',
      deviceType: 'phoneapp',
      description: 'Connect to track your sleep patterns and cycles'
    },
    {
      id: 'nike-run-club',
      name: 'Nike Run Club',
      icon: Zap,
      connected: availablePhoneApps?.includes('Nike Run Club') || false,
      color: 'text-green-600',
      apiSupport: 'api',
      deviceType: 'phoneapp',
      description: 'Import run data and achievements from Nike Run Club'
    },
    {
      id: 'other-app',
      name: 'Other App',
      icon: Smartphone,
      connected: false,
      color: 'text-gray-500',
      apiSupport: 'screenshot',
      deviceType: 'phoneapp',
      description: 'Import data from other fitness apps using screenshots'
    }
  ];
  
  // Simulate extracting data from screenshot
  const extractDataFromScreenshot = async (imageSrc: string, tracker: string) => {
    setIsLoading(true);
    setImportStatus('idle');
    setErrorMessage('');
    
    // In a real app, this would send the image to an AI service
    // to extract data from the specific tracker type
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Mock extracted data based on tracker type
      let mockData: TrackerData;
      
      switch (tracker.toLowerCase()) {
        case 'fitbit':
          mockData = {
            steps: 8942,
            caloriesBurned: 2347,
            activeMinutes: 43,
            heartRate: 64,
            sleep: {
              total: 7.5,
              deep: 1.2,
              rem: 1.8,
              light: 4.5,
            },
          };
          break;
          
        case 'apple watch':
          mockData = {
            steps: 10256,
            caloriesBurned: 2684,
            activeMinutes: 58,
            heartRate: 62,
          };
          break;
          
        case 'garmin':
          mockData = {
            steps: 12453,
            caloriesBurned: 3105,
            activeMinutes: 76,
            heartRate: 58,
            sleep: {
              total: 8.2,
              deep: 1.5,
              rem: 2.1,
              light: 4.6,
            },
          };
          break;
          
        default:
          mockData = {
            steps: 9500,
            caloriesBurned: 2450,
            activeMinutes: 55,
          };
      }
      
      setExtractedData(mockData);
      setImportStatus('success');
    } catch (error) {
      console.error('Error extracting data:', error);
      setImportStatus('error');
      setErrorMessage('Could not extract data from screenshot. Please try again with a clearer image.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate direct sync with tracker APIs
  const syncWithTracker = async (tracker: TrackerDevice) => {
    setIsSyncing(true);
    setSelectedTracker(tracker);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock data based on tracker type
      let mockData: TrackerData;
      
      switch (tracker.name.toLowerCase()) {
        case 'apple watch':
          mockData = {
            steps: 10256,
            caloriesBurned: 2684,
            activeMinutes: 58,
            heartRate: 62,
          };
          break;
          
        case 'fitbit':
          mockData = {
            steps: 8942,
            caloriesBurned: 2347,
            activeMinutes: 43,
            heartRate: 64,
            sleep: {
              total: 7.5,
              deep: 1.2,
              rem: 1.8,
              light: 4.5,
            },
          };
          break;
        
        case 'strava':
          mockData = {
            steps: 11250,
            caloriesBurned: 2895,
            activeMinutes: 92,
            heartRate: 68,
          };
          break;
        
        case 'myfitnesspal':
          mockData = {
            steps: 8500,
            caloriesBurned: 2100,
            activeMinutes: 35,
          };
          break;
          
        default:
          mockData = {
            steps: 9500,
            caloriesBurned: 2450,
            activeMinutes: 55,
          };
      }
      
      setExtractedData(mockData);
      setImportStatus('success');
      
      // Update tracker's last synced time
      const updatedTracker = {
        ...tracker,
        lastSynced: new Date(),
        connected: true
      };
      
      // Update user's connected devices based on device type
      if (!tracker.connected) {
        if (tracker.deviceType === 'tracker') {
          const updatedDevices = [...availableTrackers, tracker.name];
          
          if (user && setUser) {
            setUser({
              ...user,
              preferences: {
                ...user.preferences,
                trackingDevices: updatedDevices
              }
            });
          }
        } else if (tracker.deviceType === 'phoneapp') {
          const updatedApps = availablePhoneApps ? [...availablePhoneApps, tracker.name] : [tracker.name];
          
          if (user && setUser) {
            setUser({
              ...user,
              preferences: {
                ...user.preferences,
                trackingApps: updatedApps
              }
            });
          }
        }
      }
      
      setSelectedTracker(updatedTracker);
      
    } catch (error) {
      console.error('Error syncing with tracker:', error);
      setImportStatus('error');
      setErrorMessage(`Could not sync with ${tracker.name}. Please try again.`);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setScreenshot(result);
        
        if (trackerType) {
          extractDataFromScreenshot(result, trackerType);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleTakeScreenshot = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleTrackerChange = (tracker: string) => {
    setTrackerType(tracker);
    
    if (screenshot) {
      extractDataFromScreenshot(screenshot, tracker);
    }
  };
  
  const handleSaveData = () => {
    // In a real app, this would save the extracted data to the user's profile
    alert('Fitness tracker data imported successfully!');
    
    // Reset form
    setScreenshot(null);
    setExtractedData(null);
    setImportStatus('idle');
    setErrorMessage('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConnectDevice = (tracker: TrackerDevice) => {
    setSelectedTracker(tracker);
    
    if (tracker.apiSupport === 'screenshot') {
      // For devices that only support screenshot import
      setTrackerType(tracker.name);
      setShowConnectionModal(false);
    } else {
      // For devices with API support
      setShowConnectionModal(true);
    }
  };

  const connectWithAPI = () => {
    if (selectedTracker) {
      syncWithTracker(selectedTracker);
      setShowConnectionModal(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Fitness Trackers & Apps</h3>
            <p className="text-blue-100 text-sm">Connect your devices and apps for seamless tracking</p>
          </div>
          {selectedTracker?.connected && selectedTracker?.lastSynced && (
            <div className="text-xs text-white/80">
              Last synced: {selectedTracker.lastSynced.toLocaleTimeString()} {selectedTracker.lastSynced.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {/* Tabs for trackers vs phone apps */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button 
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'trackers' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('trackers')}
          >
            Fitness Trackers
          </button>
          <button 
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'phoneapps' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('phoneapps')}
          >
            Phone Apps
          </button>
              </div>
        
        {/* Connected devices section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {activeTab === 'trackers' ? 'Your Devices' : 'Your Apps'}
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(activeTab === 'trackers' ? supportedTrackers : supportedPhoneApps).map((tracker) => {
              const Icon = tracker.icon;
              return (
                <div 
                  key={tracker.id}
                  className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    tracker.connected 
                      ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleConnectDevice(tracker)}
                >
                  {tracker.connected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                  
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${tracker.connected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon className={`h-6 w-6 ${tracker.color}`} />
                  </div>
                  
                  <span className="text-sm font-medium text-center text-gray-800 dark:text-gray-200">
                    {tracker.name}
                  </span>
                  
                  <span className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
                    {tracker.connected 
                      ? 'Connected'
                      : 'Connect'}
                  </span>
                </div>
              );
            })}
                </div>
              </div>
              
        {/* Screenshot upload section if we've selected a device that needs it */}
        {trackerType === 'Other Device' && (
          <div className="mt-4">
                  {!screenshot ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center">
                      <Smartphone className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  Take a screenshot of your fitness app dashboard and upload it
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                  variant="outline"
                  leftIcon={<Upload className="h-4 w-4" />}
                        onClick={handleTakeScreenshot}
                      >
                        Upload Screenshot
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={screenshot}
                            alt="Tracker screenshot"
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{trackerType} Screenshot</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {isLoading 
                              ? 'Analyzing screenshot...' 
                              : importStatus === 'success' 
                                ? 'Data extracted successfully!' 
                                : importStatus === 'error'
                                  ? errorMessage
                                  : 'Ready to extract data'}
                          </p>
                        </div>
                      </div>
                      
                      {isLoading && (
                        <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          <span className="ml-3 text-gray-600 dark:text-gray-400">Processing...</span>
                        </div>
                      )}
              </>
            )}
          </div>
        )}
        
        {/* Extracted data display */}
        {extractedData && importStatus === 'success' && (
          <div className="mt-5 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">
              Extracted Fitness Data
            </h4>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4">
              <div>
                <span className="block text-gray-500 dark:text-gray-400 text-xs">Steps</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{extractedData.steps.toLocaleString()}</span>
                          </div>
                          
                            <div>
                <span className="block text-gray-500 dark:text-gray-400 text-xs">Calories Burned</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{extractedData.caloriesBurned.toLocaleString()} kcal</span>
                            </div>
              
                            <div>
                <span className="block text-gray-500 dark:text-gray-400 text-xs">Active Minutes</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{extractedData.activeMinutes} min</span>
                            </div>
              
                            {extractedData.heartRate && (
                              <div>
                  <span className="block text-gray-500 dark:text-gray-400 text-xs">Avg. Heart Rate</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{extractedData.heartRate} bpm</span>
                              </div>
                            )}
              
                            {extractedData.sleep && (
                              <div className="col-span-2">
                  <span className="block text-gray-500 dark:text-gray-400 text-xs">Sleep Duration</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {extractedData.sleep.total} hrs (Deep: {extractedData.sleep.deep} hrs, REM: {extractedData.sleep.rem} hrs)
                  </span>
                              </div>
                            )}
                          </div>
                          
            <div className="flex flex-col xs:flex-row gap-3">
                            <Button
                variant="primary"
                              onClick={handleSaveData}
                            >
                              Save Data
                            </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setExtractedData(null);
                  setScreenshot(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Discard
              </Button>
            </div>
          </div>
        )}
        
        {/* AI Coach Feedback */}
        {extractedData && importStatus === 'success' && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                {currentPersona.emoji}
              </div>
              <div>
                <p className="text-sm text-indigo-800 dark:text-indigo-200">
                  <span className="font-medium">{currentPersona.name}:</span> Great job with your activity! I notice you've achieved {extractedData.steps.toLocaleString()} steps today. Keep up the momentum!
                </p>
              </div>
                          </div>
                        </div>
                      )}
                      
        {/* Sync all devices button */}
        {availableTrackers.length > 0 && (
          <div className="mt-6 flex justify-center">
                          <Button
                            variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => {
                const connectedDevice = supportedTrackers.find(t => t.connected);
                if (connectedDevice) {
                  syncWithTracker(connectedDevice);
                }
              }}
              isLoading={isSyncing}
            >
              Sync All Connected Devices
                          </Button>
                        </div>
                      )}
      </div>
      
      {/* Connection modal */}
      {showConnectionModal && selectedTracker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Connect {selectedTracker.name}</h3>
              <button 
                onClick={() => setShowConnectionModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6 flex flex-col items-center">
              <div className={`h-16 w-16 rounded-full ${selectedTracker.color} bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4`}>
                <selectedTracker.icon className="h-8 w-8" />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                {selectedTracker.description || 
                  (selectedTracker.apiSupport === 'healthkit' 
                    ? "Connect to Apple Health to import your Apple Watch data automatically."
                    : selectedTracker.apiSupport === 'googlefit'
                      ? "Connect to Google Fit to automatically sync your fitness data."
                      : `Connect to your ${selectedTracker.name} account to automatically sync your fitness data.`
                  )
                }
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <Button
                  variant="primary"
                  onClick={connectWithAPI}
                  leftIcon={<LinkIcon className="h-4 w-4" />}
                  isLoading={isSyncing}
                >
                  {isSyncing ? `Connecting to ${selectedTracker.name}...` : `Connect to ${selectedTracker.name}`}
                </Button>
                
                {selectedTracker.apiSupport === 'healthkit' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    You'll need to grant permission in Apple Health
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  onClick={() => setShowConnectionModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View all devices link */}
      <div className="pt-2 pb-4 px-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/devices" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-center">
          <Eye className="h-4 w-4 mr-1" />
          View all fitness devices
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
} 