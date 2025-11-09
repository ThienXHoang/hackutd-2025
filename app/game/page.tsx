"use client";

import { useState } from "react";
import Question from "../components/Question";
import ProgressBars from "../components/ProgressBars";
import { createInitialQuizState, QuizState } from "../../data/gameState";

export default function GamePage() {
  const [gameState, setGameState] = useState<QuizState>(() => createInitialQuizState());

  const handleRestart = () => {
    const newState = createInitialQuizState();
    setGameState(newState);
  };

  if (gameState.gameOver) {
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-green-900 via-emerald-900 to-teal-900">
        <h1 className="text-5xl font-bold mb-4 text-white">🎉 Quest Complete! 🎉</h1>
        <p className="text-3xl mb-2 text-yellow-300">Final Score: {gameState.points} points</p>
        <p className="text-xl mb-8 text-gray-300">You've mastered all difficulty levels!</p>
        <button
          onClick={handleRestart}
          className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xl font-semibold shadow-lg"
        >
          🔄 Start New Quest
        </button>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Financial Spellbook</h1>
        <ProgressBars gameState={gameState} />
        <Question gameState={gameState} setGameState={setGameState} />
      </div>
    </div>
  );
}