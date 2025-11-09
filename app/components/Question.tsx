"use client";

import { QuizState, selectAnswer, submitAnswer, goToNextQuestion, formatDifficulty } from "../../data/gameState";
import { Choice, QuestionType, DropdownQuestion } from "../../data/quiz";
import { formatGameTopic } from "../../data/gameTopics";

interface QuestionProps {
  gameState: QuizState;
  setGameState: React.Dispatch<React.SetStateAction<QuizState | null>>;
}

export default function Question({ gameState, setGameState }: QuestionProps) {
  const question = gameState.currentQuestion;

  if (!question) {
    return <div className="text-center text-white text-xl">Loading question...</div>;
  }

  const handleSelectChoice = (index: number) => {
    selectAnswer(gameState, index);
    setGameState({ ...gameState });
  };

  const handleTextInput = (text: string) => {
    selectAnswer(gameState, text);
    setGameState({ ...gameState });
  };

  const handleTrueFalse = (value: boolean) => {
    selectAnswer(gameState, value ? 1 : 0);
    setGameState({ ...gameState });
  };

  const handleDropdownChange = (blankIndex: number, value: string) => {
    const currentAnswers = Array.isArray(gameState.selectedAnswer) 
      ? [...gameState.selectedAnswer] 
      : [];
    
    currentAnswers[blankIndex] = value;
    selectAnswer(gameState, currentAnswers);
    setGameState({ ...gameState });
  };

  const handleSubmit = () => {
    const success = submitAnswer(gameState);
    if (success) {
      setGameState({ ...gameState });
    } else if (gameState.selectedAnswer === null) {
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
        gameState.selectedAnswer === index
          ? "border-blue-500 bg-blue-900 text-white"
          : "border-gray-600 bg-gray-800 text-white hover:border-blue-400 hover:bg-gray-700"
      }`;
    }

    if (question.type !== QuestionType.MultipleChoice) return baseClass;

    const isSelected = gameState.selectedAnswer === index;
    const isCorrect = question.choices[index].isCorrect;

    if (isCorrect) {
      return `${baseClass} border-green-500 bg-green-900 text-white`;
    } else if (isSelected && !isCorrect) {
      return `${baseClass} border-red-500 bg-red-900 text-white`;
    } else {
      return `${baseClass} border-gray-600 bg-gray-800 text-gray-400 opacity-60`;
    }
  };

  const getDropdownClassName = (blankIndex: number) => {
    const baseClass = "px-4 py-2 rounded-lg border-2 transition-all mx-1";
    
    if (!gameState.isAnswered) {
      const userAnswers = gameState.selectedAnswer as string[] || [];
      const hasSelection = userAnswers[blankIndex];
      
      return `${baseClass} ${
        hasSelection
          ? "border-blue-500 bg-blue-900 text-white"
          : "border-gray-600 bg-gray-800 text-white"
      }`;
    }

    // After answer submitted
    if (question.type === QuestionType.Dropdown) {
      const userAnswers = gameState.selectedAnswer as string[];
      const correctAnswer = question.blanks[blankIndex].correctAnswer;
      const userAnswer = userAnswers[blankIndex];
      
      const isCorrect = userAnswer?.toLowerCase() === correctAnswer.toLowerCase();
      
      if (isCorrect) {
        return `${baseClass} border-green-500 bg-green-900 text-white`;
      } else {
        return `${baseClass} border-red-500 bg-red-900 text-white`;
      }
    }

    return baseClass;
  };

  const renderQuestionWithDropdowns = () => {
    if (question.type !== QuestionType.Dropdown) return null;

    const parts = question.question.split('_');
    const userAnswers = (gameState.selectedAnswer as string[]) || [];

    return (
      <div className="text-xl mb-6 text-white leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < question.blanks.length && (
              <select
                value={userAnswers[index] || ''}
                onChange={(e) => handleDropdownChange(index, e.target.value)}
                disabled={gameState.isAnswered}
                className={getDropdownClassName(index)}
              >
                <option value="">Select...</option>
                {question.blanks[index].options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </span>
        ))}
      </div>
    );
  };

  const isSubmitDisabled = () => {
    if (gameState.selectedAnswer === null) return true;
    
    if (question.type === QuestionType.Dropdown) {
      const userAnswers = gameState.selectedAnswer as string[];
      const dropdownQuestion = question as DropdownQuestion;
      return userAnswers.length !== dropdownQuestion.blanks.length || 
             userAnswers.some(answer => !answer);
    }
    
    return false;
  };

  return (
    <div className="mt-8 p-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-2xl border border-gray-700">
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
          {formatGameTopic(gameState.selectedTopic)}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          gameState.currentDifficulty === 'easy' ? 'bg-green-600 text-white' :
          gameState.currentDifficulty === 'medium' ? 'bg-yellow-600 text-white' :
          'bg-red-600 text-white'
        }`}>
          {formatDifficulty(gameState.currentDifficulty)}
        </span>
      </div>

      {question.type === QuestionType.Dropdown ? (
        renderQuestionWithDropdowns()
      ) : (
        <h2 className="text-2xl font-bold mb-6 text-white">
          {question.type === QuestionType.TrueFalse ? question.statement : question.question}
        </h2>
      )}

      <div className="mb-6">
        {question.type === QuestionType.MultipleChoice && (
          <div>
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
        )}
        
        {question.type === QuestionType.FillInTheBlank && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Type your answer here..."
              onChange={(e) => handleTextInput(e.target.value)}
              value={gameState.selectedAnswer as string || ''}
              disabled={gameState.isAnswered}
              className="w-full p-4 bg-gray-800 text-white rounded-lg border-2 border-gray-600 focus:border-blue-500 outline-none"
            />
          </div>
        )}
        
        {question.type === QuestionType.TrueFalse && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleTrueFalse(true)}
              disabled={gameState.isAnswered}
              className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                !gameState.isAnswered
                  ? gameState.selectedAnswer === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                  : question.isTrue
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              True
            </button>
            <button
              onClick={() => handleTrueFalse(false)}
              disabled={gameState.isAnswered}
              className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                !gameState.isAnswered
                  ? gameState.selectedAnswer === 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                  : !question.isTrue
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              False
            </button>
          </div>
        )}
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
            <div>
              <p className="font-semibold">✗ Incorrect. Keep learning!</p>
              {question.type === QuestionType.Dropdown && (
                <p className="mt-2 text-sm">
                  Correct answers: {question.blanks.map(b => b.correctAnswer).join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center">
        {!gameState.isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              isSubmitDisabled()
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