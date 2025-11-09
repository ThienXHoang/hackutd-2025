"use client";

import { QuizState, getPointsBarPercent, getCurrentMasteryPercent, getCurrentMasteryInfo, formatDifficulty } from "../../data/gameState";

interface ProgressBarsProps {
  gameState: QuizState;
}

export default function ProgressBars({ gameState }: ProgressBarsProps) {
  const pointsPercent = getPointsBarPercent(gameState);
  const masteryPercent = getCurrentMasteryPercent(gameState);
  const masteryInfo = getCurrentMasteryInfo(gameState);

  return (
    <div className="mb-6 space-y-4 bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-2xl border border-gray-700">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">⭐ Points</span>
          <span className="text-sm font-bold text-blue-400">{gameState.points}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-linear-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${pointsPercent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            🎯 {formatDifficulty(masteryInfo.difficulty)} Mastery
          </span>
          <span className="text-sm font-bold text-purple-400">
            {masteryInfo.current} / {masteryInfo.needed === 9999 ? '∞' : masteryInfo.needed}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-linear-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
