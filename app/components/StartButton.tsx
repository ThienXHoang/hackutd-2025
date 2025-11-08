import Link from "next/link";

export default function StartButton() {
  return (
    <Link href="game">
      <button className="p-2 border">Start!</button>
    </Link>
  );
}
