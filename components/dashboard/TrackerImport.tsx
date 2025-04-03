"use client";

import React, { useState, useRef } from 'react';
import { Upload, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useUserContext } from '../../lib/hooks/UserContext';

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

export default function TrackerImport() {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<TrackerData | null>(null);
  const [trackerType, setTrackerType] = useState<string>('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useUserContext();
  
  // Get available tracker types from user preferences
  const availableTrackers = user?.preferences?.trackingDevices || [];
  
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
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
        <h3 className="text-lg font-semibold text-white">Fitness Tracker Import</h3>
        <p className="text-green-100 text-sm">Import data from your tracking device with a screenshot</p>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {availableTrackers.length === 0 ? (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  No fitness trackers added. Please update your profile to add your tracking devices.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select your tracker
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableTrackers.map((tracker) => (
                    <div 
                      key={tracker}
                      className={`flex items-center justify-center p-3 border ${
                        trackerType === tracker 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-300 dark:border-gray-700'
                      } rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800`}
                      onClick={() => handleTrackerChange(tracker)}
                    >
                      <span className="text-sm">{tracker}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {trackerType && (
                <>
                  {!screenshot ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center">
                      <Smartphone className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                        Take a screenshot of your {trackerType} dashboard and upload it
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={handleTakeScreenshot}
                      >
                        <Upload className="h-4 w-4 mr-2" />
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
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                          <span className="ml-3 text-gray-600 dark:text-gray-400">Processing...</span>
                        </div>
                      )}
                      
                      {importStatus === 'success' && extractedData && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <h4 className="font-medium">Extracted Data</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Steps</p>
                              <p className="font-semibold">{extractedData.steps.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Calories Burned</p>
                              <p className="font-semibold">{extractedData.caloriesBurned.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Active Minutes</p>
                              <p className="font-semibold">{extractedData.activeMinutes}</p>
                            </div>
                            {extractedData.heartRate && (
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Resting Heart Rate</p>
                                <p className="font-semibold">{extractedData.heartRate} bpm</p>
                              </div>
                            )}
                            {extractedData.sleep && (
                              <div className="col-span-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Sleep</p>
                                <p className="font-semibold">
                                  {extractedData.sleep.total} hrs (Deep: {extractedData.sleep.deep} hrs, 
                                  REM: {extractedData.sleep.rem} hrs, Light: {extractedData.sleep.light} hrs)
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <Button
                              type="button"
                              onClick={handleSaveData}
                            >
                              Save Data
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {importStatus === 'error' && (
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleTakeScreenshot}
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 