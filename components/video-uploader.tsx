"use client";

import { useState, useRef } from 'react';
import { Upload, Video } from 'lucide-react';

interface VideoUploaderProps {
  onUpload: (file: File) => void;
  isVisible: boolean;
}

export default function VideoUploader({ onUpload, isVisible }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => 
      file.type === 'video/mp4' || file.type === 'video/mov' || file.type === 'video/quicktime'
    );
    
    if (videoFile) {
      onUpload(videoFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Upload Your Video to Get Your Free Performance Score
      </h2>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-blue-400 bg-blue-400/10'
            : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.mov"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${
            isDragging ? 'bg-blue-400/20' : 'bg-gray-700'
          }`}>
            <Video className="h-12 w-12 text-blue-400" />
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-semibold text-white">
              Drag & drop your video file here, or click to browse
            </p>
            <p className="text-gray-400">
              Accept .mp4, .mov files
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Upload className="h-4 w-4" />
            <span>Maximum file size: 100MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}