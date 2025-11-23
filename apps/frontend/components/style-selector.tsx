'use client';

import {
  Clapperboard,
  MessageCircle,
  Rocket,
  ShoppingCart,
} from 'lucide-react';
import { useState } from 'react';

interface StyleSelectorProps {
  isVisible: boolean;
  onStyleSelect: (style: string) => void;
}

const styles = [
  {
    id: 'high-impact',
    name: 'High-Impact Ad',
    icon: Rocket,
    description:
      'Fast-paced cuts, punchy text, and a strong call-to-action. Perfect for TikTok, Reels & Shorts.',
  },
  {
    id: 'organic-story',
    name: 'Organic Story',
    icon: MessageCircle,
    description:
      'Authentic and engaging. Ideal for testimonials, vlogs, and building community.',
  },
  {
    id: 'cinematic-recap',
    name: 'Cinematic Recap',
    icon: Clapperboard,
    description:
      'Beautiful transitions, color grading, and emotional music. For travel, events, and family memories.',
  },
  {
    id: 'product-demo',
    name: 'Product Demo',
    icon: ShoppingCart,
    description:
      'Clear, concise, and focused on features. Designed to showcase your product in the best light.',
  },
];

export default function StyleSelector({
  isVisible,
  onStyleSelect,
}: StyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleStyleClick = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleGenerate = () => {
    if (selectedStyle) {
      onStyleSelect(selectedStyle);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white text-center">
        Choose Your Video&apos;s Style
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;

          return (
            <div
              key={style.id}
              onClick={() => handleStyleClick(style.id)}
              className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-600/20 border-2 border-blue-500 shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {style.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedStyle && (
        <div className="text-center">
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Generate My Video
          </button>
        </div>
      )}
    </div>
  );
}
