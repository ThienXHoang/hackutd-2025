import { Difficulty, getRandomQuestion, getRandomCategory } from "@/data/quiz";

export default function Question() {
  let question = getRandomQuestion(getRandomCategory(), Difficulty.Easy);

  return (
    <div>
      <p>{question?.question}</p>
      <select>
        <option key="blank" value="">Choose an answer:</option>
        {question?.choices.map((choice) => (
          <option key={choice.text} value={choice.text}>{choice.text}</option>
        ))}
      </select>
    </div>
  );
}
