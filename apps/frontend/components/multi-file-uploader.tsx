"use client";

import { useState, useRef } from 'react';
import { Upload, X, Play } from 'lucide-react';

interface MultiFileUploaderProps {
  onUpload: (files: File[]) => void;
  isVisible: boolean;
}

export default function MultiFileUploader({ onUpload, isVisible }: MultiFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'video/mp4' || file.type === 'video/mov' || file.type === 'video/quicktime'
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
      onUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      onUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onUpload(newFiles);
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {selectedFiles.length === 0 ? (
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
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full transition-colors ${
              isDragging ? 'bg-blue-400/20' : 'bg-gray-700'
            }`}>
              <Upload className="h-12 w-12 text-blue-400" />
            </div>
            
            <div className="space-y-2">
              <p className="text-xl font-semibold text-white">
                Select multiple video files
              </p>
              <p className="text-gray-400">
                Drag & drop or click to browse (.mp4, .mov files)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <Play className="h-8 w-8 text-gray-400" />
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{file.name}</p>
                <p className="text-gray-400 text-xs">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}