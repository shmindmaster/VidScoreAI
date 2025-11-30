"use client";

interface LoadingAnalysisProps {
  isVisible: boolean;
  // onComplete prop removed as it's handled by the polling logic in page.tsx
}

export default function LoadingAnalysis({ isVisible }: LoadingAnalysisProps) {
  if (!isVisible) return null;
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-300 font-medium">AI is analyzing visuals, pacing, and hooks...</p>
      <p className="text-gray-500 text-sm mt-2">This usually takes 10-15 seconds.</p>
    </div>
  );
}
