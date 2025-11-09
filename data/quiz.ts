import mcQuestions from "./questions.json";
import fbQuestions from "./questionsFB.json";
import tfQuestions from "./questionsTF.json";

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export enum Category {
  Budgeting = "budgeting",
  Saving = "saving",
  Banking = "banking",
  Credit = "credit",
  Debt = "debt",
  Investing = "investing",
  Retirement = "retirement",
  Taxes = "taxes",
  Insurance = "insurance",
  Fraud = "fraud",
}

export interface Choice {
  text: string;
  isCorrect: boolean;
}

export enum QuestionType {
  MultipleChoice = "mc",
  FillInTheBlank = "fb",
  TrueFalse = "tf"
}

export interface BaseQuestion {
  category: Category;
  difficulty: Difficulty;
  id: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MultipleChoice;
  question: string;
  choices: Choice[];
}

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: QuestionType.FillInTheBlank;
  question: string;
  answer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: QuestionType.TrueFalse;
  statement: string;
  isTrue: boolean;
}

export type Question = MultipleChoiceQuestion | FillInTheBlankQuestion | TrueFalseQuestion;

export type QuestionDict = Map<
  Category,
  Map<Difficulty, Map<string, Question>>
>;

function addQuestionToDict(dict: QuestionDict, question: Question): void {
  const category = question.category;
  const difficulty = question.difficulty;
  const id = question.id;

  if (!dict.has(category)) {
    dict.set(category, new Map([[difficulty, new Map([[id, question]])]]));
  } else {
    const categoryMap = dict.get(category);
    if (!categoryMap?.has(difficulty)) {
      categoryMap?.set(difficulty, new Map([[id, question]]));
    } else {
      categoryMap.get(difficulty)?.set(id, question);
    }
  }
}

export const quiz: QuestionDict = (() => {
  let dict: QuestionDict = new Map();

  // Add Multiple Choice Questions
  mcQuestions.forEach((q: any) => {
    const question: MultipleChoiceQuestion = {
      ...q,
      type: QuestionType.MultipleChoice
    };
    addQuestionToDict(dict, question);
  });

  // Add Fill in the Blank Questions
  fbQuestions.forEach((q: any) => {
    const question: FillInTheBlankQuestion = {
      ...q,
      type: QuestionType.FillInTheBlank
    };
    addQuestionToDict(dict, question);
  });

  // Add True/False Questions
  tfQuestions.forEach((q: any) => {
    const question: TrueFalseQuestion = {
      ...q,
      type: QuestionType.TrueFalse
    };
    addQuestionToDict(dict, question);
  });

  return dict;
})();

export function getRandomCategory(): Category {
  const categories = Object.values(Category);
  const randIndex = Math.floor(Math.random() * categories.length);
  return categories[randIndex];
}

export function getRandomQuestion(category: Category, difficulty: Difficulty): Question | null {
  let questionMap = quiz.get(category)?.get(difficulty);
  if (!questionMap) return null;
  let questions = Array.from(questionMap.values());
  let rand = Math.floor(Math.random() * questions.length);
  return questions[rand];
}