// data/gameTopics.ts

export enum GameTopic {
  Income = "Income",
  Budgeting = "Budgeting",
  Saving = "Saving",
  Investing = "Investing",
  DebtManagement = "Debt Management",
  RiskManagement = "Risk Management",
}

export function formatGameTopic(topic: GameTopic): string {
  return topic;
}

// Map GameTopic to category strings used in questions
export function topicToCategory(topic: GameTopic): string {
  return topic;
}