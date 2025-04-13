import React from 'react';
import { Calendar, Star, Clock } from 'lucide-react';

export const DailyChallenge: React.FC<{
    onAccept: () => void;
    coins: number;
  }> = ({ onAccept, coins }) => {
    return (
      <div className="p-5 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Challenge
          </h2>
          <ul className="space-y-2 text-white/90 text-sm">
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Get a perfect score</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Complete under 3 minutes</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-white text-sm">
            Reward: <span className="font-bold">200 coins</span>
          </div>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Accept Challenge
          </button>
        </div>
      </div>
    );
  };