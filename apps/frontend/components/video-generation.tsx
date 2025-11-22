"use client";

import { useState, useEffect } from 'react';
import { Loader2, Play, Download, RefreshCw } from 'lucide-react';

interface VideoGenerationProps {
  isVisible: boolean;
  selectedStyle: string;
  onStartNew: () => void;
}

const loadingMessages = [
  "Analyzing footage for the best moments...",
  "Structuring your story...",
  "Applying your selected style...",
  "Adding music and captions...",
  "Finalizing your video..."
];

const styleVideoUrls: Record<string, string> = {
  'high-impact': 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
  'organic-story': 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_25fps.mp4',
  'cinematic-recap': 'https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4',
  'product-demo': 'https://videos.pexels.com/video-files/3195760/3195760-uhd_2560_1440_25fps.mp4'
};

export default function VideoGeneration({ isVisible, selectedStyle, onStartNew }: VideoGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    setIsGenerating(true);
    setVideoReady(false);
    setCurrentMessage(0);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    const completeTimeout = setTimeout(() => {
      setIsGenerating(false);
      setVideoReady(true);
    }, 10000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, [isVisible, selectedStyle]);

  const handleDownload = () => {
    // In a real app, this would download the generated video
    const link = document.createElement('a');
    link.href = styleVideoUrls[selectedStyle];
    link.download = `generated-video-${selectedStyle}.mp4`;
    link.click();
  };

  if (!isVisible) return null;

  if (isGenerating) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl font-bold text-white">
              Generating Your Video
            </h2>
            <p className="text-lg text-purple-400 font-medium min-h-[1.5rem]">
              {loadingMessages[currentMessage]}
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentMessage + 1) / loadingMessages.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (videoReady) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Your Video is Ready!
          </h2>
          <p className="text-gray-400">
            Here's your generated video with the "{selectedStyle.replace('-', ' ')}" style
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              autoPlay
              muted
              className="w-full h-auto"
              poster="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            >
              <source src={styleVideoUrls[selectedStyle]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download Video</span>
          </button>
          
          <button
            onClick={onStartNew}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Start a New Project</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}