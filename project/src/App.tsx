import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { Question } from './components/Question';
import { GameStats } from './components/GameStats';
import { GameState, Question as QuestionType } from './types';

import { FileText, Trophy, PlayCircle,RefreshCw,Calendar,User } from 'lucide-react';
import questionsData from './questions.json';
import { CoinEffect } from './components/CoinEffect';
import { Statistics } from './components/Statistics';
import { HelpCircle } from 'lucide-react';
import { HintPopup } from './components/HintPopup';
import { Confetti } from './components/Confetti';
import { ProgressBar } from './components/ProgressBar';
import { FeedbackView } from './components/FeedbackView';
import { DailyChallenge } from './components/DailyChallenge';
import { Achievements } from './components/Achievements';

import { Volume2, Moon, Sun, Star, Coins, Flame,Zap } from 'lucide-react';
const QUESTION_TIME = 30;
const COINS_PER_TEST = 20;
const STREAK_BONUS = 5;
const PERFECT_SCORE_BONUS = 50;
const QUICK_ANSWER_BONUS = 10;
const COINS_PER_CORRECT = 5;
const INITIAL_COINS = 100;
const HINT_COST = 10;
const INITIAL_HINTS = 3;
const ACHIEVEMENTS = {
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Scholar',
    description: 'Get a perfect score in the quiz',
    reward: 100,
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete quiz in under 2 minutes',
    reward: 50,
  },
  STREAK_MASTER: {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Achieve a 5+ answer streak',
    reward: 75,
  },
  NO_HINTS: {
    id: 'no_hints',
    name: 'Self Reliant',
    description: 'Complete without using hints',
    reward: 50,
  },
} as const;

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [showHintPopup, setShowHintPopup] = useState(false);
const [currentHint, setCurrentHint] = useState(''); 
  const [showCoinEffect, setShowCoinEffect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: 'Player',
    level: 1,
    xp: 0,
    xpRequired: 1000,
  });
  const [isDailyChallengeActive, setIsDailyChallengeActive] = useState(false);
  const [coinEffectAmount, setCoinEffectAmount] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    answers: {},
    score: 0,
    timeRemaining: QUESTION_TIME,
    streak: 0,
    coins: INITIAL_COINS,  // Use getInitialCoins here

    isComplete: false,
    statistics: {
      totalGamesPlayed: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      accuracy: 0,
      averageTimePerQuestion: 0,
      bestStreak: 0,
      totalCoinsEarned: 0,
      hintsUsed: 0,
      lastPlayedDate: new Date().toISOString(),
    },
    hints: INITIAL_HINTS,
    powerUps: [],
  });

  const [questions] = useState<QuestionType[]>(questionsData.data.questions);
  const currentQuestion = questions[gameState.currentQuestionIndex];

  // Add this useEffect after your existing useEffect
useEffect(() => {
  let timer: number;
  
  if (isStarted && !gameState.isComplete) {
    timer = window.setInterval(() => {
      setGameState((prev) => {
        if (prev.timeRemaining <= 0) {
          // Time's up - move to next question
          handleNextQuestion();
          return prev;
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);
  }

  // Cleanup on component unmount or when quiz completes
  return () => {
    if (timer) {
      clearInterval(timer);
    }
  };
}, [isStarted, gameState.isComplete]); // Dependencies // Add dependencies
const useHint = () => {
  if (gameState.hints > 0 || gameState.coins >= HINT_COST) {
    setGameState(prev => ({
      ...prev,
      hints: prev.hints > 0 ? prev.hints - 1 : prev.hints,
      coins: prev.hints > 0 ? prev.coins : prev.coins - HINT_COST,
      statistics: {
        ...prev.statistics,
        hintsUsed: prev.statistics.hintsUsed + 1,
      }
    }));
    
    const correctAnswer = currentQuestion.correctAnswer[currentBlankIndex];
    setCurrentHint(`The correct answer is "${correctAnswer}"`);
    setShowHintPopup(true);
  }
};
const checkAchievements = (stats: typeof gameState.statistics, score: number) => {
  const newAchievements: string[] = [];
  const totalTime = QUESTION_TIME * questions.length - gameState.timeRemaining;

  // Check perfect score
  if (score === questions.length) {
    newAchievements.push(ACHIEVEMENTS.PERFECT_SCORE.id);
  }

  // Check speed completion
  if (totalTime < 120 && score >= questions.length * 0.8) {
    newAchievements.push(ACHIEVEMENTS.SPEED_DEMON.id);
  }

  // Check streak
  if (stats.bestStreak >= 5) {
    newAchievements.push(ACHIEVEMENTS.STREAK_MASTER.id);
  }

  // Check no hints used
  if (stats.hintsUsed === 0 && score === questions.length) {
    newAchievements.push(ACHIEVEMENTS.NO_HINTS.id);
  }

  // Add new achievements and award coins
  if (newAchievements.length > 0) {
    setUnlockedAchievements(prev => {
      const uniqueNew = newAchievements.filter(id => !prev.includes(id));
      const rewardCoins = uniqueNew.reduce((sum, id) => {
        const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === id);
        return sum + (achievement?.reward || 0);
      }, 0);

      // Award coins for new achievements
      if (rewardCoins > 0) {
        setGameState(prev => ({
          ...prev,
          coins: prev.coins + rewardCoins
        }));
        setCoinEffectAmount(prev => prev + rewardCoins);
        setShowCoinEffect(true);
      }

      return [...new Set([...prev, ...newAchievements])];
    });
  }
};
  const startQuiz = () => {
    if (gameState.coins < COINS_PER_TEST) {
      alert("Not enough coins to start the quiz!");
      return;
    }
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - COINS_PER_TEST
    }));
    setIsStarted(true);
  };

  const handleAnswerSelect = (word: string) => {
    setGameState((prev) => {
      const currentAnswers = prev.answers[currentQuestion.questionId] || Array(4).fill(null);
      const newAnswers = [...currentAnswers];
      newAnswers[currentBlankIndex] = word;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.questionId]: newAnswers,
        },
      };
    });
    
    // Move to next blank automatically
    if (currentBlankIndex < 3) {
      setCurrentBlankIndex(currentBlankIndex + 1);
    }
  };

  const handleBlankClick = (index: number) => {
    const currentAnswers = gameState.answers[currentQuestion.questionId] || [];
    if (currentAnswers[index]) {
      setGameState((prev) => {
        const newAnswers = [...currentAnswers];
        // Cast null as string to match the array type
        newAnswers[index] = null as unknown as string;
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [currentQuestion.questionId]: newAnswers,
          },
        };
      });
      setCurrentBlankIndex(index);
    }
  };;

  const handleNextQuestion = () => {
    const currentAnswers = gameState.answers[currentQuestion.questionId] || [];
    const isCorrect = currentAnswers.every(
      (answer, index) => answer === currentQuestion.correctAnswer[index]
    );
  
    setGameState((prev) => {
      const newScore = prev.score + (isCorrect ? 1 : 0);
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const isLastQuestion = prev.currentQuestionIndex === questions.length - 1;
      
      // Calculate bonuses
      const streakBonus = isLastQuestion && newStreak >= 3 ? STREAK_BONUS : 0;
      const quickAnswerBonus = isLastQuestion && prev.timeRemaining > 20 ? QUICK_ANSWER_BONUS : 0;
      const perfectScoreBonus = isLastQuestion && newScore === questions.length ? PERFECT_SCORE_BONUS : 0;
      const correctAnswerCoins = isLastQuestion ? (newScore * COINS_PER_CORRECT) : 0;
      const finalCoins = correctAnswerCoins + streakBonus + quickAnswerBonus + perfectScoreBonus;
      if (isLastQuestion) {
        checkAchievements(prev.statistics, newScore);
      }
      const totalQuestions = prev.statistics.totalQuestionsAnswered + 1;
      const correctAnswers = prev.statistics.correctAnswers + (isCorrect ? 1 : 0);
      
      if (isLastQuestion && finalCoins > 0) {
        setCoinEffectAmount(finalCoins);
        setShowCoinEffect(true);
      }
      if (isLastQuestion && newScore === questions.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
  
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        score: newScore,
        streak: newStreak,
        timeRemaining: QUESTION_TIME,
        isComplete: isLastQuestion,
        coins: prev.coins + (isLastQuestion ? finalCoins : 0),
        statistics: {
          ...prev.statistics,
          totalQuestionsAnswered: totalQuestions,
          correctAnswers,
          accuracy: Math.round((correctAnswers / totalQuestions) * 100),
          averageTimePerQuestion: Math.round(
            (prev.statistics.averageTimePerQuestion * (totalQuestions - 1) + 
            (QUESTION_TIME - prev.timeRemaining)) / totalQuestions
          ),
          bestStreak: Math.max(prev.statistics.bestStreak, newStreak),
          totalCoinsEarned: prev.statistics.totalCoinsEarned + (isLastQuestion ? finalCoins : 0),
        }
      };
    });
  
    setCurrentBlankIndex(0);
  };

  const getAvailableOptions = () => {
    const selectedAnswers = gameState.answers[currentQuestion.questionId] || [];
    return currentQuestion.options.filter((option) => !selectedAnswers.includes(option));
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100/80 hover:bg-blue-100 transition-colors rounded-full flex items-center justify-center group">
                <User className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">{userProfile.username}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Level {userProfile.level}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-blue-500" />
                    {unlockedAchievements.length} Achievements
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-yellow-50/90 hover:bg-yellow-50 transition-colors px-4 py-2 rounded-lg">
                <div className="text-xs text-yellow-600">Balance</div>
                <div className="font-bold text-yellow-700 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {gameState.coins} coins
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${
                    soundEnabled ? 'bg-blue-100/80 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setDarkMode(prev => !prev)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${
                    darkMode ? 'bg-blue-100/80 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
  
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
            {/* Left Column - Quiz Info */}
            <div className="space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
  <div className="flex justify-center mb-6">
    <div className="bg-blue-50/80 p-4 rounded-full">
      <FileText className="w-12 h-12 text-blue-500" />
    </div>
  </div>
    <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
      Sentence Construction Quiz
    </h1>
    <p className="text-gray-600 text-sm mb-6">
      Test your language skills by completing sentences with the correct words.
    </p>
    
                <button
                  onClick={startQuiz}
                  disabled={gameState.coins < COINS_PER_TEST}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold
                    transition-all duration-300 hover:scale-102 ${
                      gameState.coins >= COINS_PER_TEST 
                        ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/80 text-white hover:from-blue-600/90 hover:to-blue-700/80' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Quiz ({COINS_PER_TEST} coins)
                </button>
              </div>
  
              {/* Enhanced Rewards Grid */}
              <div className="grid grid-cols-3 gap-3">
  {/* Streak Bonus Card */}
  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-blue-100/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Flame className="w-4 h-4 text-blue-500" />
      </div>
      <div className="text-sm text-blue-600">Streak Bonus</div>
    </div>
    <div className="font-medium text-lg text-gray-800">+{STREAK_BONUS} coins</div>
  </div>

  {/* Quick Answer Card */}
  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-blue-100/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Zap className="w-4 h-4 text-blue-500" />
      </div>
      <div className="text-sm text-blue-600">Quick Answer</div>
    </div>
    <div className="font-medium text-lg text-gray-800">+{QUICK_ANSWER_BONUS} coins</div>
  </div>

  {/* Perfect Score Card */}
  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-blue-100/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Trophy className="w-4 h-4 text-blue-500" />
      </div>
      <div className="text-sm text-blue-600">Perfect Score</div>
    </div>
    <div className="font-medium text-lg text-gray-800">+{PERFECT_SCORE_BONUS} coins</div>
  </div>
</div>
</div>
  
            {/* Right Column */}
<div className="space-y-4">
  {/* Daily Challenge Card */}
  <div className="bg-gradient-to-r from-indigo-500/90 to-purple-500/90 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
    <DailyChallenge
      onAccept={() => {
        setIsDailyChallengeActive(true);
        startQuiz();
      }}
      coins={gameState.coins}
    />
  </div>
  
              {/* Recent Achievements */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 hover:shadow-md transition-all">
  <h3 className="font-bold mb-3 flex items-center justify-between">
    <span className="flex items-center gap-2">
      <Trophy className="w-5 h-5 text-blue-500" />
      Recent Achievements
    </span>
    <span className="text-sm font-normal text-blue-500">
  {unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS).length}
</span>
  </h3>
  
  <div className="h-[300px] overflow-y-auto pr-2">
    <Achievements unlockedAchievements={unlockedAchievements} />
    {unlockedAchievements.length === 0 && (
      <div className="text-center py-6 px-4 bg-gray-50/80 rounded-lg">
        <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Complete challenges to earn achievements!</p>
        <p className="text-xs text-gray-400 mt-1">
  Rewards up to {Math.max(...Object.values(ACHIEVEMENTS).map(a => a.reward))} coins
</p>      </div>
    )}
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (gameState.isComplete) {
    const feedbackQuestions = questions.map(q => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: gameState.answers[q.questionId] || []
    }));
    return (
      <div className="min-h-screen bg-gray-100 p-8">
      {showConfetti && <Confetti />}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Complete!</h1>
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold">Final Score: {gameState.score}/10</p>
          <p className="text-lg text-gray-600 mt-2">Coins Balance: {gameState.coins}</p>
          
          {/* Updated Play Again button */}
          <button
            onClick={() => {
              setGameState(prev => ({
                currentQuestionIndex: 0,
                answers: {},
                score: 0,
                timeRemaining: QUESTION_TIME,
                streak: 0,
                coins: prev.coins,
                isComplete: false,
                statistics: {
                  ...prev.statistics,
                  totalGamesPlayed: prev.statistics.totalGamesPlayed + 1,
                  lastPlayedDate: new Date().toISOString(),
                },
                hints: INITIAL_HINTS,
                powerUps: [],
              }));
              setIsStarted(false);
              setCurrentBlankIndex(0);
              setShowCoinEffect(false);
              setCoinEffectAmount(0);
            }}
            className="inline-flex items-center gap-2 px-6 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Play Again
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
          <Statistics stats={gameState.statistics} />
        </div>

        <div className="p-8">
          <FeedbackView 
            questions={feedbackQuestions}
            statistics={gameState.statistics}
          />
        </div>

        {showCoinEffect && (
          <CoinEffect
            amount={coinEffectAmount}
            onComplete={() => setShowCoinEffect(false)}
          />
        )}
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Sentence Construction</h1>
          </div>
          <GameStats
            score={gameState.score}
            coins={gameState.coins}
            streak={gameState.streak}
          />
        </div>

        <div className="p-8">
  <div className="flex items-center justify-between mb-6">
    <div className="flex-1 mr-4">
    <ProgressBar 
      current={gameState.currentQuestionIndex + 1} 
      total={questions.length} 
    />
    </div>
    <div className="flex items-center gap-4">
      
    <Timer timeRemaining={gameState.timeRemaining} totalTime={QUESTION_TIME} />
    </div>
  </div>

  <div className="flex justify-between items-center mb-4">
    <button
      onClick={useHint}
      disabled={gameState.hints === 0 && gameState.coins < HINT_COST}
      className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
    >
      <HelpCircle className="w-5 h-5" />
      {gameState.hints > 0 ? `Hints: ${gameState.hints}` : `Buy Hint (${HINT_COST} coins)`}
    </button>
  </div>
         

        <Question
          question={currentQuestion}
          selectedAnswers={gameState.answers[currentQuestion.questionId] || []}
          onAnswerSelect={handleAnswerSelect}
          onBlankClick={handleBlankClick}
          availableOptions={getAvailableOptions()}
          currentBlankIndex={currentBlankIndex}
        />

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={
                !gameState.answers[currentQuestion.questionId]?.every(Boolean)
              }
              className={`px-6 py-3 rounded-lg ${
                gameState.answers[currentQuestion.questionId]?.every(Boolean)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next Question
            </button>
          </div>
          {showHintPopup && (
          <HintPopup
            hint={currentHint}
            onClose={() => setShowHintPopup(false)}
          />
        )}
        </div>
      </div>
    </div>
  );
}

export default App;