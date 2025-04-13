import React from 'react';
import { Trophy, Star, Clock, Zap, Lock,Coins } from 'lucide-react';

const achievements = [
  {
    id: 'perfect_score',
    name: 'Perfect Scholar',
    description: 'Get a perfect score',
    icon: Trophy,
    reward: 100,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete quiz in under 2 minutes',
    icon: Clock,
    reward: 50,
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Get a 5+ answer streak',
    icon: Zap,
    reward: 75,
  },
  {
    id: 'no_hints',
    name: 'Self Reliant',
    description: 'Complete without using hints',
    icon: Star,
    reward: 50,
  },
];

export const Achievements: React.FC<{
  unlockedAchievements: string[];
}> = ({ unlockedAchievements }) => {
  return (
    <div className="space-y-3">
      {achievements.map((achievement) => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        return (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border transition-all group hover:shadow-sm ${
              isUnlocked
                ? 'bg-blue-50/80 border-blue-200 hover:bg-blue-50'
                : 'bg-gray-50/80 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isUnlocked ? 'bg-blue-100/80 group-hover:bg-blue-100' : 'bg-gray-100'
              }`}>
                <achievement.icon
                  className={`w-5 h-5 ${
                    isUnlocked ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2 text-gray-800">
                  {achievement.name}
                  {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {achievement.description}
                </p>
                <div className="text-xs font-medium text-yellow-600 mt-2 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  +{achievement.reward} coins
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};