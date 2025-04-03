"use client";

import React from 'react';
import { CheckIcon } from 'lucide-react';

interface Step {
  id: string;
  name: string;
}

interface OnboardingProgressProps {
  steps: Step[];
  currentStep: number;
}

export default function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  return (
    <nav aria-label="Progress">
      <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.id} className="md:flex-1">
            <div className="group flex flex-col border-l-4 border-transparent py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="flex items-center text-sm font-medium">
                <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                  index < currentStep 
                    ? 'bg-blue-600 group-hover:bg-blue-800' 
                    : index === currentStep 
                      ? 'border-2 border-blue-600 bg-white dark:bg-gray-800' 
                      : 'border-2 border-gray-300 dark:border-gray-700'
                }`}>
                  {index < currentStep ? (
                    <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  ) : (
                    <span className={index === currentStep ? "text-blue-600" : "text-gray-500 dark:text-gray-400"}>
                      {index + 1}
                    </span>
                  )}
                </span>
                <span className={`ml-3 ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.name}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
} 