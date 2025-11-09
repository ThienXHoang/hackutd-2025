// data/gameState.ts
import {
  Question,
  QuestionType,
  getRandomQuestionForTopic,
  DropdownQuestion,
  FillInTheBlankQuestion,
} from "./quiz";
import { GameTopic } from "./gameTopics";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizState {
  selectedTopic: GameTopic;
  currentDifficulty: Difficulty;
  currentQuestion: Question | null;

  selectedAnswer: string | number | string[] | null;
  isAnswered: boolean;
  lastAnswerCorrect: boolean;

  points: number;
  streak: number;

  questionsAnswered: number;
  questionsCorrect: number;

  // Track correct answers in current difficulty level
  correctInCurrentDifficulty: number;

  easyCompleted: boolean;
  mediumCompleted: boolean;
  hardCompleted: boolean;
  gameOver: boolean;
}

export function createQuizStateForTopic(topic: GameTopic): QuizState {
  const initialDifficulty: Difficulty = "easy";
  const firstQuestion = getRandomQuestionForTopic(topic, initialDifficulty);

  return {
    selectedTopic: topic,
    currentDifficulty: initialDifficulty,
    currentQuestion: firstQuestion,
    selectedAnswer: null,
    isAnswered: false,
    lastAnswerCorrect: false,
    points: 0,
    streak: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    correctInCurrentDifficulty: 0,
    easyCompleted: false,
    mediumCompleted: false,
    hardCompleted: false,
    gameOver: false,
  };
}

export function submitAnswer(state: QuizState): boolean {
  if (state.isAnswered || !state.currentQuestion) return false;

  let isCorrect = false;
  const q = state.currentQuestion;

  if (q.type === QuestionType.MultipleChoice) {
    // Multiple choice: selectedAnswer is an index (number)
    const choiceIndex = state.selectedAnswer as number;
    if (choiceIndex !== null && choiceIndex !== undefined) {
      isCorrect = q.choices[choiceIndex]?.isCorrect ?? false;
    }
  } else if (q.type === QuestionType.TrueFalse) {
    // True/False: make this robust (boolean, number, or string)
    const raw = state.selectedAnswer;

    let userBool: boolean | null = null;

    if (typeof raw === "boolean") {
      userBool = raw;
    } else if (typeof raw === "number") {
      if (raw === 1) userBool = true;
      else if (raw === 0) userBool = false;
    } else if (typeof raw === "string") {
      const lowered = raw.trim().toLowerCase();
      if (lowered === "true") userBool = true;
      else if (lowered === "false") userBool = false;
    }

    if (userBool !== null) {
      isCorrect = userBool === q.isTrue;
    } else {
      isCorrect = false;
    }
  } else if (q.type === QuestionType.FillInTheBlank) {
    // FRQ: case-insensitive, trimmed
    const userAnswer = ((state.selectedAnswer as string) || "").trim().toLowerCase();
    const correctAnswer = q.correctAnswer.trim().toLowerCase();
    isCorrect = userAnswer === correctAnswer;
  } else if (q.type === QuestionType.Dropdown) {
    // Dropdown: array of answers, compare case-insensitive + trimmed
    const userAnswers = state.selectedAnswer as string[];
    if (Array.isArray(userAnswers) && userAnswers.length === q.blanks.length) {
      isCorrect = userAnswers.every((ans, i) => {
        const user = (ans ?? "").trim().toLowerCase();
        const correct = (q.blanks[i].correctAnswer ?? "").trim().toLowerCase();
        return user === correct;
      });
    }
  }

  state.isAnswered = true;
  state.lastAnswerCorrect = isCorrect;
  state.questionsAnswered++;

  if (isCorrect) {
    state.questionsCorrect++;
    state.correctInCurrentDifficulty++;
    state.streak++;

    const difficultyMultiplier =
      state.currentDifficulty === "easy"
        ? 1
        : state.currentDifficulty === "medium"
        ? 2
        : 3;

    const basePoints = 10 * difficultyMultiplier;
    const streakBonus = Math.min(state.streak - 1, 5) * 5;
    state.points += basePoints + streakBonus;
  } else {
    state.streak = 0;
  }

  return true;
}

export function goToNextQuestion(state: QuizState): void {
  if (!state.isAnswered) return;

  // Remember the previous question so we can avoid immediate repeats
  const previousQuestion = state.currentQuestion;

  // Use correct answers in current difficulty to determine progress
  const correctInDifficulty = state.correctInCurrentDifficulty;

  // Need 5 correct answers to complete a difficulty level
  if (correctInDifficulty >= 5) {
    if (state.currentDifficulty === "easy") {
      state.easyCompleted = true;
    } else if (state.currentDifficulty === "medium") {
      state.mediumCompleted = true;
    } else if (state.currentDifficulty === "hard") {
      state.hardCompleted = true;
      state.gameOver = true;
      return;
    }

    const nextDiff = getNextDifficulty(state.currentDifficulty);
    if (nextDiff) {
      state.currentDifficulty = nextDiff;
      state.correctInCurrentDifficulty = 0;
    }
  }

  // Pull a new question, but try not to repeat the exact same one
  let nextQuestion = getRandomQuestionForTopic(
    state.selectedTopic,
    state.currentDifficulty
  );

  if (previousQuestion && nextQuestion === previousQuestion) {
    const MAX_ATTEMPTS = 5;
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS && nextQuestion === previousQuestion) {
      nextQuestion = getRandomQuestionForTopic(
        state.selectedTopic,
        state.currentDifficulty
      );
      attempts++;
    }
  }

  state.currentQuestion = nextQuestion;
  state.selectedAnswer = null;
  state.isAnswered = false;
  state.lastAnswerCorrect = false;
}

export function getNextDifficulty(current: Difficulty): Difficulty | null {
  if (current === "easy") return "medium";
  if (current === "medium") return "hard";
  return null;
}

// Helper to update selectedAnswer from the UI
export function selectAnswer(
  state: QuizState,
  answer: string | number | string[]
): void {
  if (state.isAnswered) return;
  state.selectedAnswer = answer;
}

// Pretty-print difficulty for the UI
export function formatDifficulty(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
      return "Hard";
    default:
      return difficulty;
  }
}
