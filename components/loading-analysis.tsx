"use client";

import { useState, useEffect } from 'react';
import { Loader2, Eye, Clock, Target, Layers } from 'lucide-react';

interface LoadingAnalysisProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function LoadingAnalysis({ isVisible, onComplete }: LoadingAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Eye, text: "Analyzing video content and visual elements..." },
    { icon: Clock, text: "Evaluating pacing and timing patterns..." },
    { icon: Target, text: "Checking hook strength and engagement factors..." },
    { icon: Layers, text: "Reviewing overlays and call-to-action elements..." }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    const timeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Analyzing your video...
          </h2>
          <p className="text-gray-400 max-w-md">
            This may take a moment. We're checking hook strength, pacing, overlays, and more.
          </p>
        </div>

        <div className="space-y-4 w-full max-w-md">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 
                  isCompleted ? 'bg-green-500/20 text-green-400' : 
                  'text-gray-500'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium">{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}