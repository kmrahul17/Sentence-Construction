export interface Question {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
}

export interface GameState {
  currentQuestionIndex: number;
  answers: Record<string, string[]>;
  score: number;
  timeRemaining: number;
  streak: number;
  coins: number;
  isComplete: boolean;
  statistics: PlayerStatistics;
  hints: number;
  powerUps: string[];
}
export interface PlayerStatistics {
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
  bestStreak: number;
  totalCoinsEarned: number;
  hintsUsed: number;
  lastPlayedDate: string;
}

export interface PowerUp {
  id: string;
  type: 'hint' | 'timeBonus' | 'skipQuestion';
  cost: number;
  isActive: boolean;
  quantity: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
    target: number;
    reward: {
        coins: number;
        powerUps?: PowerUp[];
    };
    dateUnlocked?: string;
}
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: {
      coins: number;
      powerUps?: PowerUp[];
  };
  expiresAt: string;
  isCompleted: boolean;
}

export interface HintSystem {
  available: number;
  cost: number;
  type: 'eliminate' | 'highlight' | 'explanation';
}