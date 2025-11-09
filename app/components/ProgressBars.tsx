// app/components/ProgressBars.tsx
import { QuizState } from "../../data/gameState";

interface ProgressBarsProps {
  gameState: QuizState;
}

export default function ProgressBars({ gameState }: ProgressBarsProps) {
  // Calculate progress for each difficulty based on correct answers
  const getProgress = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (difficulty === 'easy' && gameState.easyCompleted) return 100;
    if (difficulty === 'medium' && gameState.mediumCompleted) return 100;
    if (difficulty === 'hard' && gameState.hardCompleted) return 100;
    
    if (gameState.currentDifficulty === difficulty) {
      return (gameState.correctInCurrentDifficulty / 5) * 100;
    }
    
    return 0;
  };

  const easyProgress = getProgress('easy');
  const mediumProgress = getProgress('medium');
  const hardProgress = getProgress('hard');

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white font-['Charm',_cursive]">
          Experience: {gameState.points} mana
        </h2>
        <div className="text-lg text-yellow-300 ">
          🔥 Streak: {gameState.streak}
        </div>
      </div>

      <div className="space-y-3">
        {/* Easy Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-green-300">
              ⭐ Easy
            </span>
            <span className="text-sm text-green-300">
              {gameState.easyCompleted 
                ? "✓ Complete" 
                : gameState.currentDifficulty === 'easy'
                ? `${gameState.correctInCurrentDifficulty}/5`
                : "Locked"}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${easyProgress}%` }}
            />
          </div>
        </div>

        {/* Medium Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-yellow-300">
              ⭐⭐ Medium
            </span>
            <span className="text-sm text-yellow-300">
              {gameState.mediumCompleted 
                ? "✓ Complete" 
                : gameState.currentDifficulty === 'medium'
                ? `${gameState.correctInCurrentDifficulty}/5`
                : gameState.easyCompleted 
                ? "Ready"
                : "Locked"}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${mediumProgress}%` }}
            />
          </div>
        </div>

        {/* Hard Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-red-300">
              ⭐⭐⭐ Hard
            </span>
            <span className="text-sm text-red-300">
              {gameState.hardCompleted 
                ? "✓ Complete" 
                : gameState.currentDifficulty === 'hard'
                ? `${gameState.correctInCurrentDifficulty}/5`
                : gameState.mediumCompleted 
                ? "Ready"
                : "Locked"}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-400 to-red-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${hardProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-300">
          Current tome: <span className="font-bold text-white uppercase">{gameState.currentDifficulty}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Get 5 correct answers to advance to the unlock the next tome!
        </p>
      </div>
    </div>
  );
}