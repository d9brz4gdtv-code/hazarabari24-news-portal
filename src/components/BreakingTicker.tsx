import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { subscribeToBreakingNews } from '../services/firestoreNewsService';

interface BreakingTickerProps {
  onSelectHeadline: (headline: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ onSelectHeadline }) => {
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToBreakingNews((items) => {
      const active = items.filter((i) => i.active !== false).map((i) => i.headline);
      setHeadlines(active);
      setCurrentIndex(0);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isPlaying || headlines.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, headlines.length]);

  // If all breaking news items are deleted or disabled, hide the ticker completely
  if (headlines.length === 0) {
    return null;
  }

  const safeIndex = currentIndex < headlines.length ? currentIndex : 0;
  const currentHeadline = headlines[safeIndex];

  const handleNext = () => {
    if (headlines.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % headlines.length);
  };

  const handlePrev = () => {
    if (headlines.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + headlines.length) % headlines.length);
  };

  return (
    <div className="bg-red-50 border-y border-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        {/* Badge */}
        <div className="flex items-center gap-2 shrink-0 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span className="whitespace-nowrap font-serif-bn tracking-wide">জরুরি সংবাদ</span>
        </div>

        {/* Headline Ticker text */}
        <div className="flex-1 overflow-hidden min-w-0">
          <button
            type="button"
            onClick={() => onSelectHeadline(currentHeadline)}
            className="text-left w-full truncate text-sm sm:text-base font-semibold text-slate-900 hover:text-red-600 transition-colors cursor-pointer"
          >
            {currentHeadline}
          </button>
        </div>

        {/* Ticker Controls */}
        <div className="flex items-center gap-1 shrink-0 text-slate-600">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:text-red-600 transition-colors rounded cursor-pointer"
            title={isPlaying ? 'বিরতি দিন' : 'চালু করুন'}
            aria-label={isPlaying ? 'বিরতি' : 'চালু'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 hover:text-red-600 transition-colors rounded cursor-pointer"
            title="পূর্ববর্তী খবর"
            aria-label="পূর্ববর্তী"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 hover:text-red-600 transition-colors rounded cursor-pointer"
            title="পরবর্তী খবর"
            aria-label="পরবর্তী"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
