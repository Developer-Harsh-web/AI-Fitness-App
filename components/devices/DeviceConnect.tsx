"use client";

import { useState } from 'react';
import { useDevices } from '../../lib/hooks/useDevices';
import { ConnectedDevice } from '../../types';
import Button from '../ui/Button';
import { RefreshCw, Loader2, Smartphone, CheckCircle, XCircle, Link as LinkIcon, Unlink, ExternalLink } from 'lucide-react';

export function DeviceConnect() {
  const { 
    connectedDevices, 
    deviceData,
    isLoading, 
    error, 
    connectDevice, 
    disconnectDevice, 
    syncDeviceData,
    getLatestData
  } = useDevices();
  
  const [activeTab, setActiveTab] = useState<'oura' | 'whoop' | 'other'>('oura');
  const [showData, setShowData] = useState(false);

  // Get device by type
  const getDevice = (type: string): ConnectedDevice | undefined => 
    connectedDevices.find(device => device.type === type);

  // Check if a device is connected
  const isConnected = (type: string): boolean => 
    connectedDevices.some(device => device.type === type);
  
  const ouraDevice = getDevice('oura');
  const whoopDevice = getDevice('whoop');

  // Get readiness data
  const readinessData = getLatestData('readiness');
  
  // Handle connect button click
  const handleConnect = async (type: 'oura' | 'whoop') => {
    await connectDevice(type);
  };

  // Handle disconnect button click
  const handleDisconnect = async (deviceId: string) => {
    await disconnectDevice(deviceId);
  };

  // Handle sync data button click
  const handleSync = async (deviceId: string) => {
    await syncDeviceData(deviceId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Connect Devices</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('oura')}
              className={`inline-flex items-center px-4 py-2 rounded-t-lg ${
                activeTab === 'oura'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500'
                  : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="font-medium">Oura Ring</span>
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('whoop')}
              className={`inline-flex items-center px-4 py-2 rounded-t-lg ${
                activeTab === 'whoop'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500'
                  : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="font-medium">Whoop</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('other')}
              className={`inline-flex items-center px-4 py-2 rounded-t-lg ${
                activeTab === 'other'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500'
                  : 'border-b-2 border-transparent hover:border-gray-300 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="font-medium">Other Devices</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div className="mt-6">
        {activeTab === 'oura' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img 
                      src="/images/oura-logo.png" 
                      alt="Oura Ring" 
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/40x40/668CFF/FFFFFF?text=OR";
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Oura Ring</h3>
                  <p className="text-gray-500 dark:text-gray-400">Track sleep, readiness, and activity</p>
                  <div className="mt-1">
                    {isConnected('oura') ? (
                      <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <XCircle className="w-4 h-4 mr-1" /> Not connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected('oura') ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={isLoading}
                      onClick={() => ouraDevice && handleSync(ouraDevice.id)}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Sync Data
                    </Button>
                    <Button
                      variant="danger"
                      className="flex items-center gap-2"
                      disabled={isLoading}
                      onClick={() => ouraDevice && handleDisconnect(ouraDevice.id)}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    className="flex items-center gap-2"
                    disabled={isLoading}
                    onClick={() => handleConnect('oura')}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                    Connect
                  </Button>
                )}
              </div>
            </div>
            
            {isConnected('oura') && ouraDevice && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="mb-4"
                  onClick={() => setShowData(!showData)}
                >
                  {showData ? 'Hide Data' : 'Show Data'}
                </Button>
                
                {showData && readinessData && readinessData.source === 'oura' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Readiness</h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {readinessData.data.score}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Your readiness score</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Resting Heart Rate</h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {readinessData.data.restingHr}<span className="text-xl font-normal ml-1">bpm</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Your resting heart rate</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">HRV Balance</h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {readinessData.data.hrvBalance}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Your HRV balance score</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>Last synced: {ouraDevice.lastSynced ? new Date(ouraDevice.lastSynced).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                <a 
                  href="https://ouraring.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 inline-flex items-center"
                >
                  Learn more about Oura Ring <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'whoop' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img 
                      src="/images/whoop-logo.png" 
                      alt="Whoop" 
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/40x40/2EC27E/FFFFFF?text=W";
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Whoop</h3>
                  <p className="text-gray-500 dark:text-gray-400">Track recovery, strain, and sleep</p>
                  <div className="mt-1">
                    {isConnected('whoop') ? (
                      <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <XCircle className="w-4 h-4 mr-1" /> Not connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected('whoop') ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={isLoading}
                      onClick={() => whoopDevice && handleSync(whoopDevice.id)}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Sync Data
                    </Button>
                    <Button
                      variant="danger"
                      className="flex items-center gap-2"
                      disabled={isLoading}
                      onClick={() => whoopDevice && handleDisconnect(whoopDevice.id)}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    className="flex items-center gap-2"
                    disabled={isLoading}
                    onClick={() => handleConnect('whoop')}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                    Connect
                  </Button>
                )}
              </div>
            </div>
            
            {isConnected('whoop') && whoopDevice && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="mb-4"
                  onClick={() => setShowData(!showData)}
                >
                  {showData ? 'Hide Data' : 'Show Data'}
                </Button>
                
                {showData && readinessData && readinessData.source === 'whoop' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Recovery</h3>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {readinessData.data.recovery}%
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Your recovery percentage</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Strain</h3>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {readinessData.data.strain}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Your daily strain score</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Heart Rate Variability</h3>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {readinessData.data.hrv}<span className="text-xl font-normal ml-1">ms</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Your heart rate variability</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>Last synced: {whoopDevice.lastSynced ? new Date(whoopDevice.lastSynced).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>
                <a 
                  href="https://www.whoop.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 inline-flex items-center"
                >
                  Learn more about Whoop <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'other' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fitbit</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Connect your Fitbit device for activity tracking</p>
                <Button variant="outline" className="w-full">
                  <span className="flex items-center justify-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Connect Fitbit
                  </span>
                </Button>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Garmin</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Connect your Garmin device for workout data</p>
                <Button variant="outline" className="w-full">
                  <span className="flex items-center justify-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Connect Garmin
                  </span>
                </Button>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Apple Health</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Connect Apple Health for comprehensive health data</p>
                <Button variant="outline" className="w-full">
                  <span className="flex items-center justify-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Connect Apple Health
                  </span>
                </Button>
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Google Fit</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Connect Google Fit for activity and health tracking</p>
                <Button variant="outline" className="w-full">
                  <span className="flex items-center justify-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Connect Google Fit
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 