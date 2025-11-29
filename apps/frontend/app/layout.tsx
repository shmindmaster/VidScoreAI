import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VidScore AI - Stop Guessing. Start Converting.',
  description: 'AI-powered video analysis and editing platform for high-performing content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 min-h-screen flex flex-col`}>
        <Navigation />
        <main className="pt-16 flex-1">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 py-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-white font-semibold text-sm">VidScore AI</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 text-xs">AI-Powered Video Analysis</span>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Sarosh Hussain, CTO Pendoah.ai • Demonstration Only • All Rights Reserved
          </p>
        </footer>
      </body>
    </html>
  );
}