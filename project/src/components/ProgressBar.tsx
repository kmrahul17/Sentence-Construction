import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  return (
    <div className="flex flex-1 items-center gap-1">
      {[...Array(total)].map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
            index < current
              ? 'bg-blue-500'
              : 'bg-gray-200 border border-dashed border-gray-300'
          }`}
        />
      ))}
    </div>
  );
};