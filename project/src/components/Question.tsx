import React from 'react';
import { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  selectedAnswers: string[];
  onAnswerSelect: (word: string) => void;
  onBlankClick: (index: number) => void;
  availableOptions: string[];
  currentBlankIndex: number;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  onBlankClick,
  availableOptions,
  currentBlankIndex,
}) => {
  const parts = question.question.split('_____________');

  return (
    <div className="transform transition-all duration-300 hover:scale-102">
      <div className="text-lg leading-relaxed flex flex-wrap items-center gap-2">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="inline-block">{part}</span>
            {index < parts.length - 1 && (
              <button
                onClick={() => onBlankClick(index)}
                className={`inline-flex items-center justify-center h-10 min-w-[120px] px-4 
                  rounded-lg shadow-sm transition-all duration-300 
                  ${
                    selectedAnswers[index]
                      ? 'bg-blue-100 border-2 border-blue-500 hover:bg-blue-200'
                      : index === currentBlankIndex
                      ? 'border-2 border-blue-500 bg-blue-50 animate-pulse'
                      : 'border-2 border-dashed border-gray-300 hover:border-blue-300'
                  }`}
              >
                <span className="truncate">
                  {selectedAnswers[index] || '______'}
                </span>
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
        {availableOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(option)}
            disabled={selectedAnswers.includes(option)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 
              ${
                selectedAnswers.includes(option)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};