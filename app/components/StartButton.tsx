import Link from "next/link";

export default function StartButton() {
  return (
    <Link href="/game">
      <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xl font-semibold">
        Start Quiz!
      </button>
    </Link>
  );
}