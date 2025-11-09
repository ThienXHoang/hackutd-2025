import Image from "next/image";
import logo2 from "../public/logo2.png";
import background from "../public/background.png";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
      {/* Background */}
      <Image
        src={background}
        alt="Background"
        fill
        className="object-cover -z-10"
      />

      {/* Logo */}
      <div>
        <Image src={logo2} alt="Spellbook Logo" width={500} height={382} />
      </div>

      {/* Subtitle */}
      <p className="mt-2 text-center px-4 font-['Charm',_cursive] text-4xl text-white">
        Embark on your magical quest to master savings and unlock financial
        spells.
      </p>

      {/* Button */}
      <Link href="game">
        <button
          className="mt-10 rounded-full shadow-lg transform transition-all hover:scale-105 
                   font-['Quintessential',_cursive] 
                   bg-[#7c3aed] 
                   text-2xl 
                   py-4 
                   px-6 
                   text-white"
        >
          BEGIN YOUR QUEST
        </button>
      </Link>
    </main>
  );
}
