// app/components/TopicSelection.tsx
"use client";

import { GameTopic, formatGameTopic } from "../../data/gameTopics";
import optionsBackground from "../../public/optionsBackground.png";
import blankspace from "../../public/blankspace.png";
import Image from "next/image";

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

  const leftTopics = topics.slice(0, 3);
  const rightTopics = topics.slice(3, 6);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={optionsBackground}
        alt="optionsBackground"
        fill
        className="object-cover -z-10"
      />
      


      {/* Content Container - Push everything down */}
      <div className="relative z-10 w-full" style={{ marginTop: '400px' }}>
        {/* Buttons Container */}
        <div className="flex items-center justify-between w-full px-20">
          {/* Left side - 3 Buttons */}
          <div className="flex flex-col gap-4">
            {leftTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => onSelectTopic(topic)}
                className="group relative w-[260px] h-[72px] rounded-xl overflow-hidden border-4 border-amber-500/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
              >
                {/* Topic Image */}
                <Image
                  src={blankspace}
                  alt={formatGameTopic(topic)}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay with topic name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center">
                  <span className="text-white font-bold text-lg text-center px-2 font-['Quintessential',_cursive]">
                    {formatGameTopic(topic)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right side - 3 Buttons */}
          <div className="flex flex-col gap-4">
            {rightTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => onSelectTopic(topic)}
                className="group relative w-[260px] h-[72px] rounded-xl overflow-hidden border-4 border-amber-500/50 hover:border-amber-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
              >
                {/* Topic Image */}
                <Image
                  src={blankspace}
                  alt={formatGameTopic(topic)}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay with topic name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center">
                  <span className="text-white font-bold text-lg text-center px-2 font-['Quintessential',_cursive]">
                    {formatGameTopic(topic)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}