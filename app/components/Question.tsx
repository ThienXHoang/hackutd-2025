"use client";

import { QuizState, selectChoice, submitAnswer, goToNextQuestion, formatDifficulty, formatCategory } from "../../data/gameState";
import { Choice } from "../../data/quiz";

interface QuestionProps {
  gameState: QuizState;
  setGameState: React.Dispatch<React.SetStateAction<QuizState>>;
}

export default function Question({ gameState, setGameState }: QuestionProps) {
  const question = gameState.currentQuestion;

  if (!question) {
    return <div className="text-center text-white text-xl">Loading question...</div>;
  }

  const handleSelectChoice = (index: number) => {
    selectChoice(gameState, index);
    setGameState({ ...gameState });
  };

  const handleSubmit = () => {
    const success = submitAnswer(gameState);
    if (success) {
      setGameState({ ...gameState });
    } else if (gameState.selectedChoiceIndex === null) {
      alert("Please select an answer first!");
    }
  };

  const handleNext = () => {
    goToNextQuestion(gameState);
    setGameState({ ...gameState });
  };

  const getChoiceClassName = (index: number) => {
    const baseClass = "w-full p-4 mb-3 text-left rounded-lg border-2 transition-all cursor-pointer";
    
    if (!gameState.isAnswered) {
      return `${baseClass} ${
        gameState.selectedChoiceIndex === index
          ? "border-blue-500 bg-blue-900 text-white"
          : "border-gray-600 bg-gray-800 text-white hover:border-blue-400 hover:bg-gray-700"
      }`;
    }

    const isSelected = gameState.selectedChoiceIndex === index;
    const isCorrect = question.choices[index].isCorrect;

    if (isCorrect) {
      return `${baseClass} border-green-500 bg-green-900 text-white`;
    } else if (isSelected && !isCorrect) {
      return `${baseClass} border-red-500 bg-red-900 text-white`;
    } else {
      return `${baseClass} border-gray-600 bg-gray-800 text-gray-400 opacity-60`;
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-2xl border border-gray-700">
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
          {formatCategory(gameState.currentCategory)}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          gameState.currentDifficulty === 'easy' ? 'bg-green-600 text-white' :
          gameState.currentDifficulty === 'medium' ? 'bg-yellow-600 text-white' :
          'bg-red-600 text-white'
        }`}>
          {formatDifficulty(gameState.currentDifficulty)}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-white">{question.question}</h2>

      <div className="mb-6">
        {question.choices.map((choice: Choice, index: number) => (
          <button
            key={index}
            onClick={() => handleSelectChoice(index)}
            disabled={gameState.isAnswered}
            className={getChoiceClassName(index)}
          >
            <div className="flex items-start">
              <span className="font-semibold mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              <span>{choice.text}</span>
            </div>
          </button>
        ))}
      </div>

      {gameState.isAnswered && (
        <div className={`p-4 mb-4 rounded-lg ${
          gameState.lastAnswerCorrect 
            ? 'bg-green-800 text-green-100' 
            : 'bg-red-800 text-red-100'
        }`}>
          {gameState.lastAnswerCorrect ? (
            <p className="font-semibold">✓ Correct! Great job!</p>
          ) : (
            <p className="font-semibold">✗ Incorrect. Keep learning!</p>
          )}
        </div>
      )}

      <div className="flex justify-center">
        {!gameState.isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={gameState.selectedChoiceIndex === null}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              gameState.selectedChoiceIndex === null
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
}