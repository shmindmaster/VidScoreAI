"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Video, Zap } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">VidScore AI</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === '/' ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              Video Analyzer
            </Link>
            <Link 
              href="/editor" 
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                pathname === '/editor' ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              AI Editor
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}