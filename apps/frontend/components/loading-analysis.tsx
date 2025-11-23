interface LoadingAnalysisProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function LoadingAnalysis({ isVisible, onComplete }: LoadingAnalysisProps) {
  if (!isVisible) return null;
  
  // Simulate analysis completion after 3 seconds
  setTimeout(() => {
    onComplete();
  }, 3000);
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-300">Analyzing video...</p>
    </div>
  );
}
