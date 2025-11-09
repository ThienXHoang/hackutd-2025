// app/components/TopicSelection.tsx
"use client";

import { GameTopic, formatGameTopic } from "../../data/gameTopics";

interface TopicSelectionProps {
  onSelectTopic: (topic: GameTopic) => void;
}

export default function TopicSelection({ onSelectTopic }: TopicSelectionProps) {
  const topics = [
    GameTopic.Income,
    GameTopic.Budgeting,
    GameTopic.Saving,
    GameTopic.Investing,
    GameTopic.DebtManagement,
    GameTopic.RiskManagement,
  ];

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900">
      <h1 className="text-4xl font-bold text-white mb-6">
        Choose Your Financial Path
      </h1>
      <p className="text-gray-300 mb-8 text-center px-4">
        Pick a topic to focus your spell training. Questions will stay in this path.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full px-4">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className="px-6 py-4 bg-gray-900 bg-opacity-80 rounded-lg text-white font-semibold border border-gray-700 hover:border-yellow-400 hover:bg-gray-800 transition-all"
          >
            {formatGameTopic(topic)}
          </button>
        ))}
      </div>
    </div>
  );
}