"use client";

import { useState } from 'react';
import { Download, Play, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface PerformanceReportProps {
  isVisible: boolean;
  videoFile: File | null;
}

interface ScoreSection {
  title: string;
  score: number;
  suggestions: string[];
}

export default function PerformanceReport({ isVisible, videoFile }: PerformanceReportProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const overallScore = 82;
  const sections: ScoreSection[] = [
    {
      title: "Hook Strength",
      score: 95,
      suggestions: [
        "Excellent opening. The first 3 seconds effectively capture attention with a strong visual and a question."
      ]
    },
    {
      title: "Pacing & Flow",
      score: 75,
      suggestions: [
        "Pacing is strong but dips around the 15s mark.",
        "Consider adding a dynamic transition or B-roll to maintain momentum."
      ]
    },
    {
      title: "Call-to-Action (CTA)",
      score: 60,
      suggestions: [
        "The CTA is present but could be stronger.",
        "Try making the on-screen text larger and have the voice-over explicitly state the offer."
      ]
    },
    {
      title: "Visual & Text Overlays",
      score: 88,
      suggestions: [
        "Great use of text overlays to reinforce key points.",
        "Ensure they remain on screen long enough to be read easily on mobile devices."
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e'; // green
    if (score >= 50) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return CheckCircle;
    if (score >= 50) return AlertCircle;
    return XCircle;
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('performance-report');
      const opt = {
        margin: 1,
        filename: 'VidScore-AI-Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      <div id="performance-report" className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">
            VidScore AI: Performance Report
          </h2>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            <Download className={`h-4 w-4 ${isDownloading ? 'animate-spin' : ''}`} />
            <span>{isDownloading ? 'Generating...' : 'Download Report (PDF)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overall Score and Video */}
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Overall Score</h3>
              <div className="w-32 h-32 mx-auto mb-4">
                <CircularProgressbar
                  value={overallScore}
                  text={`${overallScore}/100`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: getScoreColor(overallScore),
                    textColor: '#ffffff',
                    trailColor: '#374151',
                    backgroundColor: '#1f2937',
                  })}
                />
              </div>
              <p className="text-gray-400 text-sm">
                {overallScore >= 75 ? 'Excellent performance!' : 
                 overallScore >= 50 ? 'Good with room for improvement' : 
                 'Needs significant improvement'}
              </p>
            </div>

            {/* Video Thumbnail */}
            {videoFile && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Analyzed Video</h3>
                <div className="relative bg-gray-700 rounded-lg overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {videoFile.name}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Columns - Detailed Breakdown */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => {
              const Icon = getScoreIcon(section.score);
              
              return (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${
                        section.score >= 75 ? 'text-green-400' :
                        section.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`} />
                      <span className={`font-bold ${
                        section.score >= 75 ? 'text-green-400' :
                        section.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {section.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {section.suggestions.map((suggestion, suggestionIndex) => (
                      <div key={suggestionIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}