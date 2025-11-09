'use client';

import Image from 'next/image';
import logo from '../public/logo.png';
import background from '../public/background.png';
import React from 'react';

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
      {/* Background */}
      <Image src={background} alt="Background" fill className="object-cover -z-10" />

      {/* Logo */}
      <div className="relative z-10 mt-10">
        <Image src={logo} alt="Spellbook Logo" width={400} height={150} />
      </div>

      {/* Title */}
      <div className="relative z-10 mt-6 text-center">
        <h1
          style={{
            fontSize: '3rem',
            color: '#FCD34D',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          Spellbook
        </h1>
        <p
          style={{
            fontSize: '2rem',
            color: '#FB923C',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          Savings
        </p>
      </div>

      {/* Subtitle */}
      <p className="relative z-10 mt-6 text-lg md:text-xl text-center max-w-xl px-4">
        Embark on your magical quest to master savings and unlock financial spells.
      </p>

      {/* Button */}
      <button
        className="relative z-10 mt-10 px-10 py-4 text-white rounded-full shadow-lg transform transition-all hover:scale-105"
        style={{ fontFamily: "'Quintessential', cursive", backgroundColor: '#7c3aed', fontSize: '1.5rem', padding: '15px 30px'  }}
      >
        BEGIN YOUR QUEST
      </button>

    </main>
  );
}
