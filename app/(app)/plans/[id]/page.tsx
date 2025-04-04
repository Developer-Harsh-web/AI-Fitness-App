"use client";

import React, { useEffect, useState } from 'react';
import { useAiPersona } from '../../../../lib/hooks/useAiPersona';
import { ArrowLeft, Calendar, Dumbbell, Utensils, Heart, BarChart2, Clipboard, Activity } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the correct type for the page props
type PageProps = {
  params: {
    id: string;
  };
};

export default function PlanDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { userPlans } = useAiPersona();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the plan with the matching ID
    const foundPlan = userPlans.find(p => p.id === params.id);
    if (foundPlan) {
      setPlan(foundPlan);
    }
    setLoading(false);
  }, [params.id, userPlans]);

  // Helper to get the appropriate icon for plan type
  const getPlanTypeIcon = (type: 'workout' | 'diet' | 'recovery') => {
    switch (type) {
      case 'workout':
        return <Dumbbell className="h-5 w-5" />;
      case 'diet':
        return <Utensils className="h-5 w-5" />;
      case 'recovery':
        return <Heart className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Plan Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The requested plan could not be found or has been deleted.</p>
          <Link href="/plans" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/plans')}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>
      </div>

      {/* Plan details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Plan header */}
        <div className={`p-6 ${
          plan.type === 'workout' 
            ? 'bg-blue-50 dark:bg-blue-900/20' 
            : plan.type === 'diet'
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-purple-50 dark:bg-purple-900/20'
        }`}>
          <div className="flex items-center">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
              plan.type === 'workout' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : plan.type === 'diet'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              {getPlanTypeIcon(plan.type)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plan.duration} • Created {new Date(plan.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {plan.description}
          </p>
        </div>

        {/* Plan content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Plan Details
          </h2>

          {plan.steps.map((step: any, index: number) => (
            <div key={index} className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Day {step.day}
              </h3>
              <div className="space-y-4">
                {step.activities.map((activity: any, actIndex: number) => (
                  <div 
                    key={actIndex}
                    className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">
                        {activity.name}
                      </h4>
                      <div className="flex gap-2">
                        {activity.duration && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            {activity.duration}
                          </span>
                        )}
                        {activity.calories && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                            {activity.calories} calories
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {activity.description}
                    </p>
                    {(activity.sets && activity.reps) && (
                      <div className="mt-3 inline-block px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                        {activity.sets} sets × {activity.reps} reps
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 mt-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center">
          <BarChart2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expected Progress</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <Activity className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consistency</h4>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">80%</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Target adherence</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <BarChart2 className="h-6 w-6 mx-auto text-green-500 mb-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Results</h4>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {plan.type === 'workout' ? '+15%' : plan.type === 'diet' ? '-5 lbs' : '+20%'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {plan.type === 'workout' ? 'Strength gain' : plan.type === 'diet' ? 'Weight loss' : 'Recovery rate'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <Calendar className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timeline</h4>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {plan.type === 'workout' ? '4 wks' : plan.type === 'diet' ? '6 wks' : '2 wks'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">To see results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
        <Button variant="outline">
          <Clipboard className="h-4 w-4 mr-2" />
          Export Plan
        </Button>
      </div>
    </div>
  );
} 