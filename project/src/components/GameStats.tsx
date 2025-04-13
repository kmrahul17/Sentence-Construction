import React from 'react';
import { Trophy, Coins, Zap } from 'lucide-react';

interface GameStatsProps {
  score: number;
  coins: number;
  streak: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ score, coins, streak }) => {
  return (
    <div className="flex gap-6 bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="font-semibold">{score}</span>
      </div>
      <div className="flex items-center gap-2">
        <Coins className="w-5 h-5 text-yellow-500" />
        <span className="font-semibold">{coins}</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500" />
        <span className="font-semibold">×{streak}</span>
      </div>
    </div>
  );
};