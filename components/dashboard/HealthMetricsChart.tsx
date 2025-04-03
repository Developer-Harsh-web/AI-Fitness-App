"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { mockHealthMetrics } from '../../lib/mock-data';
import { formatDate } from '../../lib/utils/formatting';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type MetricType = 'weight' | 'heartRate' | 'water';

interface HealthMetricsChartProps {
  metricType?: MetricType;
}

export default function HealthMetricsChart({ metricType = 'weight' }: HealthMetricsChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  
  // Use useMemo to cache the filtered metrics and prevent unnecessary recalculations
  const metrics = useMemo(() => {
    return mockHealthMetrics
      .filter(metric => metric.type === metricType)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [metricType]);
  
  // Use useMemo for chart options to avoid recreation on each render
  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(107, 114, 128, 1)',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  }), []);
  
  useEffect(() => {
    if (metrics.length === 0) return;

    // Create chart data
    const data = {
      labels: metrics.map(metric => formatDate(metric.date)),
      datasets: [
        {
          label: metricType === 'weight' ? 'Weight (kg)' : 
                 metricType === 'heartRate' ? 'Heart Rate (bpm)' : 
                 'Water Intake (ml)',
          data: metrics.map(metric => metric.value),
          fill: false,
          borderColor: 
            metricType === 'weight' ? 'rgb(59, 130, 246)' : 
            metricType === 'heartRate' ? 'rgb(239, 68, 68)' : 
            'rgb(6, 182, 212)',
          backgroundColor: 
            metricType === 'weight' ? 'rgba(59, 130, 246, 0.5)' : 
            metricType === 'heartRate' ? 'rgba(239, 68, 68, 0.5)' : 
            'rgba(6, 182, 212, 0.5)',
          tension: 0.1,
        },
      ],
    };

    setChartData(data);
  }, [metricType, metrics]);

  // Get chart title based on metric type - as a regular function
  const getTitle = () => {
    switch(metricType) {
      case 'weight':
        return 'Weight Tracking';
      case 'heartRate':
        return 'Heart Rate Tracking';
      case 'water':
        return 'Water Intake Tracking';
      default:
        return 'Health Metrics';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No {metricType} data available yet. Start tracking to see your progress!
          </p>
        ) : chartData ? (
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-72">
            <p>Loading chart...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 