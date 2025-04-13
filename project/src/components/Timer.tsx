import React from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({ timeRemaining, totalTime }) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const isLow = timeRemaining <= 10;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={isLow ? '#EF4444' : '#3B82F6'}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold
          ${isLow ? 'text-red-500' : 'text-blue-500'}`}>
          {timeRemaining}
        </span>
      </div>
      <span className="text-gray-500 font-medium">seconds left</span>
    </div>
  );
};