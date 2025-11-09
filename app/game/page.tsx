// app/game/page.tsx
"use client";

import { useState, useEffect } from "react";
import Question from "../components/Question";
import ProgressBars from "../components/ProgressBars";
import TopicSelection from "../components/TopicSelection";
import { QuizState, createQuizStateForTopic } from "../../data/gameState";
import { GameTopic } from "../../data/gameTopics";

export default function GamePage() {
  const [gameState, setGameState] = useState<QuizState | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTopicSelect = (topic: GameTopic) => {
    const newState = createQuizStateForTopic(topic);
    setGameState(newState);
  };

  const handleRestart = () => {
    setGameState(null);
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If no topic chosen yet → show topic selection screen
  if (!gameState) {
    return <TopicSelection onSelectTopic={handleTopicSelect} />;
  }

  // If game over → show "Quest Complete" with Restart
  if (gameState.gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
        <h1 className="text-5xl font-bold mb-4 text-white">🎉 Quest Complete! 🎉</h1>
        <p className="text-3xl mb-2 text-yellow-300">
          Final Score: {gameState.points} points
        </p>
        <p className="text-xl mb-8 text-gray-300">
          You've mastered all difficulty levels in this path!
        </p>
        <button
          onClick={handleRestart}
          className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xl font-semibold shadow-lg"
        >
          🔄 Choose Another Path
        </button>
      </div>
    );
  }

  // Normal game UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Financial Spellbook
        </h1>
        <ProgressBars gameState={gameState} />
        <Question gameState={gameState} setGameState={setGameState} />
      </div>
    </div>
  );
}