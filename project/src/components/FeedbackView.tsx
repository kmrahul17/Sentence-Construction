import React from 'react';
import { Check, X } from 'lucide-react';

interface FeedbackViewProps {
  questions: Array<{
    question: string;
    correctAnswer: string[];
    userAnswer: string[];
  }>;
  statistics: {
    accuracy: number;
    averageTimePerQuestion: number;
    bestStreak: number;
  };
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ questions, statistics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Accuracy</div>
          <div className="text-2xl font-bold">{statistics.accuracy}%</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Avg. Time</div>
          <div className="text-2xl font-bold">{statistics.averageTimePerQuestion}s</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600">Best Streak</div>
          <div className="text-2xl font-bold">{statistics.bestStreak}</div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Question {idx + 1}</div>
            <div className="mb-4">{q.question}</div>
            <div className="space-y-2">
              {q.correctAnswer.map((ans, ansIdx) => (
                <div key={ansIdx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium">Blank {ansIdx + 1}: </span>
                    <span className={q.userAnswer[ansIdx] === ans ? 'text-green-600' : 'text-red-600'}>
                      {q.userAnswer[ansIdx] || '(no answer)'}
                    </span>
                    {q.userAnswer[ansIdx] !== ans && (
                      <span className="text-gray-500 ml-2">
                        (Correct: {ans})
                      </span>
                    )}
                  </div>
                  {q.userAnswer[ansIdx] === ans ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};