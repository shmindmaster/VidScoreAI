"use client";

import { useState } from 'react';
import { Sparkles, Rocket, MessageCircle, Clapperboard, ShoppingCart } from 'lucide-react';
import MultiFileUploader from '@/components/multi-file-uploader';
import StyleSelector from '@/components/style-selector';
import VideoGeneration from '@/components/video-generation';

export default function EditorPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showUploader, setShowUploader] = useState(true);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showVideoGeneration, setShowVideoGeneration] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('');

  const handleFilesUpload = (files: File[]) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      setShowUploader(false);
      setShowStyleSelector(true);
    } else {
      setShowUploader(true);
      setShowStyleSelector(false);
    }
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
    setShowVideoGeneration(true);
  };

  const handleStartNew = () => {
    setUploadedFiles([]);
    setSelectedStyle('');
    setShowUploader(true);
    setShowStyleSelector(false);
    setShowVideoGeneration(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <span className="text-purple-400 font-semibold">AI VIDEO EDITOR</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The Next-Gen{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-600 bg-clip-text text-transparent">
              Video Creation Engine
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Upload your raw footage, choose your style, and let our AI create a masterpiece for you.
          </p>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* File Uploader */}
          {showUploader && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
              <MultiFileUploader 
                onUpload={handleFilesUpload}
                isVisible={showUploader}
              />
            </div>
          )}

          {/* Style Selector */}
          {showStyleSelector && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
              <StyleSelector 
                isVisible={showStyleSelector}
                onStyleSelect={handleStyleSelect}
              />
            </div>
          )}

          {/* Video Generation */}
          <VideoGeneration 
            isVisible={showVideoGeneration}
            selectedStyle={selectedStyle}
            onStartNew={handleStartNew}
          />
        </div>
      </section>

      {/* Features Section */}
      {showUploader && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Four Powerful Styles
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Each style is optimized for different content types and platforms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Rocket,
                  title: "High-Impact Ad",
                  description: "Perfect for TikTok, Reels & Shorts with fast-paced cuts and strong CTAs"
                },
                {
                  icon: MessageCircle,
                  title: "Organic Story",
                  description: "Authentic and engaging for testimonials, vlogs, and community building"
                },
                {
                  icon: Clapperboard,
                  title: "Cinematic Recap",
                  description: "Beautiful transitions and color grading for travel and events"
                },
                {
                  icon: ShoppingCart,
                  title: "Product Demo",
                  description: "Clear and focused presentations designed to showcase products"
                }
              ].map((style, index) => {
                const Icon = style.icon;
                return (
                  <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{style.title}</h3>
                    <p className="text-gray-400 text-sm">{style.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}