import React from 'react';
import { PlayerStatistics } from '../types';
import { Trophy, Clock, Target, Coins } from 'lucide-react';

interface StatisticsProps {
  stats: PlayerStatistics;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Accuracy: {stats.accuracy}%</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span>Avg Time: {stats.averageTimePerQuestion}s</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          <span>Best Streak: {stats.bestStreak}</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span>Total Earned: {stats.totalCoinsEarned}</span>
        </div>
      </div>
    </div>
  );
};