"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <h1 className="text-5xl font-bold mb-8 text-white">Financial Literacy Quest</h1>
      <p className="text-xl mb-8 text-gray-300">Master the spells of finance!</p>
      <Link href="/game">
        <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xl font-semibold shadow-lg transform hover:scale-105 transition-all">
          🎮 Start Quest
        </button>
      </Link>
    </div>
  );
}