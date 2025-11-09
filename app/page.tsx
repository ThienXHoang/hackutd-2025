import Image from "next/image";
import background2 from "../public/background2.png";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
      {/* Background */}
      <Image
        src={background2}
        alt="background2"
        fill
        className="object-cover -z-10"
      />


      {/* Button */}
      <Link href="game">
        <button
          className=""rounded-full shadow-lg transform transition-all hover:scale-105 
             font-['Quintessential',_cursive] 
             bg-transparent 
             text-[#7c3aed] 
             border-2 border-[#7c3aed]
             text-2xl 
             py-4 
             px-6 
             hover:bg-[#7c3aed]/10
             hover:text-[#6d28d9]
             text-white"
        >
          BEGIN YOUR QUEST
        </button>
      </Link>
    </main>
  );
}
