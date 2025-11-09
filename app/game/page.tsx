// app/game/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Question from "../components/Question";
import ProgressBars from "../components/ProgressBars";
import TopicSelection from "../components/TopicSelection";
import { QuizState, createQuizStateForTopic } from "../../data/gameState";
import { GameTopic } from "../../data/gameTopics";
import questionBackground from "../../public/questionBackground.png";

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
    <div className="relative flex items-center justify-center min-h-screen bg-black p-4 overflow-hidden">
      {/* Twinkling stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 3}s infinite`,
              opacity: 0
            }}
          />
        ))}
      </div>

      {/* Larger floating stars on sides */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-400"
            style={{
              left: i % 2 === 0 ? `${Math.random() * 20}%` : `${80 + Math.random() * 20}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
              animation: `float ${Math.random() * 4 + 3}s ease-in-out ${Math.random() * 2}s infinite`,
              opacity: 0.6
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Purple glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full bg-purple-500/20 blur-3xl"
            style={{
              left: i % 2 === 0 ? `${Math.random() * 15}%` : `${85 + Math.random() * 15}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 100}px`,
              height: `${Math.random() * 150 + 100}px`,
              animation: `pulse ${Math.random() * 4 + 4}s ease-in-out ${Math.random() * 2}s infinite`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Main card */}
        <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-center">
            <div className="text-7xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">
              Quest Complete!
            </h1>
          </div>
          
          {/* Stats section */}
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between bg-purple-800/30 rounded-xl p-6 border border-purple-500/40">
              <div>
                <p className="text-yellow-500 text-sm uppercase tracking-wide mb-1">
                  Final Score
                </p>
                <p className="text-5xl font-bold text-yellow-400">
                  {gameState.points}
                </p>
              </div>
              <div className="text-6xl">⭐</div>
            </div>
            
            <div className="bg-purple-700/30 border border-purple-500/40 rounded-xl p-6 text-center">
              <p className="text-yellow-300 text-lg">
                🎉 You've mastered all difficulty levels in this path! 🎉
              </p>
            </div>
            
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-yellow-400 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              🔄 Choose Another Path
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
  // Normal game UI with background image
  return (
    <div className="relative min-h-screen py-8 overflow-hidden">
      {/* Background Image */}
      <Image
        src={questionBackground}
        alt="questionBackground"
        fill
        className="object-cover -z-10"
      />
      
      {/* Optional dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 -z-10"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white text-center mb-6 font-['Quintessential',_cursive] ">
          Financial Spellbook
        </h1>
        <ProgressBars gameState={gameState} />
        <Question gameState={gameState} setGameState={setGameState} />
      </div>
    </div>
  );
}