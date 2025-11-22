"use client";

import { useState } from 'react';
import { ArrowDown, Zap, BarChart3, Target, Sparkles } from 'lucide-react';
import VideoUploader from '@/components/video-uploader';
import LoadingAnalysis from '@/components/loading-analysis';
import PerformanceReport from '@/components/performance-report';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showUploader, setShowUploader] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setShowUploader(false);
    setShowLoading(true);
  };

  const handleAnalysisComplete = () => {
    setShowLoading(false);
    setShowReport(true);
  };

  const scrollToUploader = () => {
    document.getElementById('uploader-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Stop Guessing.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Start Converting.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            VidScore AI analyzes your video ads and UGC to give you actionable, data-driven insights. 
            Turn good videos into high-performing assets.
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToUploader}
            className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <span className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Analyze Your Video Now</span>
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI-Powered Video Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get deeper insights into what makes your videos perform with our advanced AI analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Performance Scoring",
                description: "Get comprehensive scores for hook strength, pacing, CTAs, and visual elements"
              },
              {
                icon: Target,
                title: "Actionable Insights",
                description: "Receive specific, data-driven recommendations to improve your video performance"
              },
              {
                icon: Sparkles,
                title: "Instant Analysis",
                description: "Upload your video and get detailed feedback in seconds, not hours"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Uploader Section */}
      <section id="uploader-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <VideoUploader 
            onUpload={handleFileUpload}
            isVisible={showUploader}
          />
          
          <LoadingAnalysis 
            isVisible={showLoading}
            onComplete={handleAnalysisComplete}
          />
          
          <PerformanceReport 
            isVisible={showReport}
            videoFile={uploadedFile}
          />
        </div>
      </section>
    </div>
  );
}