"use client";

import React, { useState } from "react";
import { soundEngine } from "@/lib/soundEngine";

interface SmallAnimalProps {
  gameStatus?: "idle" | "flipping" | "won" | "busted";
  multiplier?: number;
}

export function ShibaCompanion({ gameStatus = "idle", multiplier = 1 }: SmallAnimalProps) {
  const [shibaSpeech, setShibaSpeech] = useState<string | null>(null);

  const handleShibaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playBark();
    const quotes = [
      "Much dev fees, very Solana, wow! 🐕",
      "Such double, very 64X! 🚀",
      "Bark! Feed the dev! 🥩",
      "HODL the bag, fren! 🐾",
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    setShibaSpeech(q);
    setTimeout(() => setShibaSpeech(null), 2500);
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {shibaSpeech && (
        <div className="absolute -top-10 left-0 z-30 pointer-events-none bg-vaultPanel/95 border border-amber-400/50 text-amber-200 text-[9px] font-mono font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn">
          {shibaSpeech}
        </div>
      )}
      <button
        onClick={handleShibaClick}
        className="w-10 h-10 hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-none"
        title="Shiba Vault Doge (Click to Bark!)"
      >
        <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-md">
          {/* Shiba Face */}
          <ellipse cx="24" cy="26" rx="16" ry="14" fill="#E59866" stroke="#BA4A00" strokeWidth="1.2" />
          {/* Ears */}
          <polygon points="12,18 8,6 18,14" fill="#E59866" stroke="#BA4A00" strokeWidth="1.2" />
          <polygon points="12,16 9,8 16,14" fill="#FADBD8" />
          <polygon points="36,18 40,6 30,14" fill="#E59866" stroke="#BA4A00" strokeWidth="1.2" />
          <polygon points="36,16 39,8 32,14" fill="#FADBD8" />
          {/* White Snout & Cheeks */}
          <ellipse cx="24" cy="29" rx="9" ry="8" fill="#FFFFFF" />
          <circle cx="15" cy="27" r="4" fill="#FFFFFF" />
          <circle cx="33" cy="27" r="4" fill="#FFFFFF" />
          {/* Eyes */}
          <ellipse cx="18" cy="22" rx="2" ry="2.5" fill="#2C1810" />
          <circle cx="17.5" cy="21" r="0.8" fill="#FFFFFF" />
          <ellipse cx="30" cy="22" rx="2" ry="2.5" fill="#2C1810" />
          <circle cx="29.5" cy="21" r="0.8" fill="#FFFFFF" />
          {/* Cute Nose & Mouth */}
          <ellipse cx="24" cy="27" rx="2.5" ry="1.8" fill="#2C1810" />
          <path d="M 22 30 Q 24 33 26 30" fill="none" stroke="#2C1810" strokeWidth="1" strokeLinecap="round" />
          {/* Tongue peeking out */}
          <path d="M 23 31 Q 24 34 25 31 Z" fill="#FF7675" />
        </svg>
      </button>
    </div>
  );
}

export function PepeCompanion({ gameStatus = "idle", multiplier = 1 }: SmallAnimalProps) {
  const [frogSpeech, setFrogSpeech] = useState<string | null>(null);

  const handlePepeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playRibbit();
    const quotes = [
      "Ribbit! 64X or bust! 🐸",
      "Feels good man! 👑",
      "Dev fee is safe with me! 🍀",
      "Don't sell before the lottery! 🚀",
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    setFrogSpeech(q);
    setTimeout(() => setFrogSpeech(null), 2500);
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {frogSpeech && (
        <div className="absolute -top-10 right-0 z-30 pointer-events-none bg-vaultPanel/95 border border-emerald-400/50 text-emerald-200 text-[9px] font-mono font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap animate-fadeIn">
          {frogSpeech}
        </div>
      )}
      <button
        onClick={handlePepeClick}
        className="w-10 h-10 hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-none"
        title="Degen Pepe Frog (Click to Ribbit!)"
      >
        <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-md">
          {/* Little Crown on top */}
          <polygon points="19,10 24,6 29,10 27,13 21,13" fill="#FFD700" stroke="#B38600" strokeWidth="0.8" />
          <circle cx="24" cy="5" r="1" fill="#E74C3C" />
          {/* Frog Head */}
          <ellipse cx="24" cy="26" rx="16" ry="13" fill="#58D68D" stroke="#1E8449" strokeWidth="1.2" />
          {/* Big Frog Eyes */}
          <circle cx="16" cy="17" r="7" fill="#58D68D" stroke="#1E8449" strokeWidth="1.2" />
          <circle cx="16" cy="17" r="5" fill="#FFFFFF" />
          <circle cx="17" cy="17" r="3" fill="#1C2833" />
          <circle cx="16" cy="16" r="1" fill="#FFFFFF" />

          <circle cx="32" cy="17" r="7" fill="#58D68D" stroke="#1E8449" strokeWidth="1.2" />
          <circle cx="32" cy="17" r="5" fill="#FFFFFF" />
          <circle cx="31" cy="17" r="3" fill="#1C2833" />
          <circle cx="30" cy="16" r="1" fill="#FFFFFF" />

          {/* Wide Degen Smile */}
          <path d="M 14 27 Q 24 36 34 27" fill="#27AE60" stroke="#196F3D" strokeWidth="1.2" />
          <ellipse cx="24" cy="30" rx="4" ry="1.5" fill="#E74C3C" opacity="0.8" />
        </svg>
      </button>
    </div>
  );
}
