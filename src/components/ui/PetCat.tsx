"use client";

import React, { useState, useEffect } from "react";
import { soundEngine } from "@/lib/soundEngine";

interface PetCatProps {
  gameStatus?: "idle" | "flipping" | "won" | "busted";
  multiplier?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  icon: string;
}

const CAT_QUOTES = [
  "HOLD MORE $GREED = HIGHER ODDS TO WIN! 📈",
  "Meow! 1 $GREED = 1 Lucky Ticket! 🎟️",
  "Whales with bigger bags have huge win rates! 🐋",
  "Stacking $GREED gives you more tickets every 3 mins! 🪙",
  "A 2.5M bag has 7.1% odds every single round! ✨",
  "Don't sell your tickets, hooman! HODL for the SOL drops! 😼",
  "Dev fees taste like fresh tuna! 100% to holders! 🐟",
  "Purrrrr... 3-min lottery is drawing soon! 🐾",
];

export function PetCat({
  gameStatus = "idle",
  multiplier = 1,
  className = "",
  size = "md",
}: PetCatProps) {
  const [petCount, setPetCount] = useState<number>(0);
  const [quote, setQuote] = useState<string>("Purrr~ Pet me for good luck! 🐾");
  const [showQuote, setShowQuote] = useState<boolean>(true);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [isPurring, setIsPurring] = useState<boolean>(false);

  // React to game events
  useEffect(() => {
    if (gameStatus === "won") {
      setQuote(`🎉 MEOWWW! ${multiplier}X DOUBLED! LFG!!`);
      setShowQuote(true);
      soundEngine.playPurr();
    } else if (gameStatus === "busted") {
      setQuote("😿 OOF cooked by greed! Pet me to reset luck!");
      setShowQuote(true);
    } else if (gameStatus === "flipping") {
      setQuote("🙀 COIN IN THE AIR! Hold onto your paws!");
      setShowQuote(true);
    }
  }, [gameStatus, multiplier]);

  // Click / Pet handler
  const handlePet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = petCount + 1;
    setPetCount(newCount);
    setIsPurring(true);

    if (newCount % 2 === 0) {
      soundEngine.playMeow();
    } else {
      soundEngine.playPurr();
    }

    // Pick random quote
    const nextQuote = CAT_QUOTES[Math.floor(Math.random() * CAT_QUOTES.length)];
    setQuote(nextQuote);
    setShowQuote(true);

    // Spawn floating particle
    const icons = ["💖", "🐟", "✨", "🪙", "🐾", "⭐"];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const rect = e.currentTarget.getBoundingClientRect();
    const newItem: FloatingItem = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left - 10,
      y: e.clientY - rect.top - 20,
      icon,
    };
    setFloatingItems((prev) => [...prev.slice(-8), newItem]);

    setTimeout(() => {
      setIsPurring(false);
    }, 600);

    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((item) => item.id !== newItem.id));
    }, 1200);
  };

  const scale = size === "sm" ? "w-16 h-16" : size === "lg" ? "w-28 h-28" : "w-20 h-20";

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {showQuote && (
        <div className="absolute -top-12 z-30 pointer-events-none transition-all duration-300">
          <div className="relative bg-vaultPanel/95 border border-goldAccent/40 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xl max-w-[200px] text-center">
            <p className="text-[10px] font-mono font-bold text-amber-200 leading-tight">
              {quote}
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-vaultPanel border-b border-r border-goldAccent/40 rotate-45" />
          </div>
        </div>
      )}

      {/* Floating Particle Emitters */}
      {floatingItems.map((item) => (
        <span
          key={item.id}
          className="absolute z-40 pointer-events-none animate-float-particle font-bold text-sm"
          style={{ left: `${item.x}px`, top: `${item.y}px` }}
        >
          {item.icon}
        </span>
      ))}

      {/* Interactive Animated SVG Lucky Neko Cat */}
      <button
        onClick={handlePet}
        className={`relative ${scale} cursor-pointer group transition-transform active:scale-95 focus:outline-none`}
        title="Click to pet Lucky Neko Cat (+5% Lucky Entropy!)"
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full drop-shadow-[0_4px_12px_rgba(255,215,0,0.35)] transition-all ${
            isPurring ? "scale-105" : "hover:scale-102"
          }`}
        >
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="catBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="60%" stopColor="#F5D061" />
              <stop offset="100%" stopColor="#D4A017" />
            </linearGradient>
            <linearGradient id="catEarInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB5D0" />
              <stop offset="100%" stopColor="#FF7597" />
            </linearGradient>
            <linearGradient id="solCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
          </defs>

          {/* Swishing Tail */}
          <path
            d="M 28 78 C 15 82 8 68 12 55 C 14 47 22 50 20 57 C 18 64 24 72 32 72 Z"
            fill="url(#catBodyGrad)"
            className="animate-tail-wag"
          />

          {/* Cat Body */}
          <ellipse cx="50" cy="68" rx="26" ry="22" fill="url(#catBodyGrad)" stroke="#B38600" strokeWidth="1.5" />

          {/* White Belly Patch */}
          <ellipse cx="50" cy="72" rx="16" ry="14" fill="#FFFFFF" opacity="0.9" />

          {/* Left Ear */}
          <path
            d="M 30 38 L 22 14 L 42 26 Z"
            fill="url(#catBodyGrad)"
            stroke="#B38600"
            strokeWidth="1.2"
            className="animate-ear-twitch"
          />
          <path d="M 30 34 L 26 20 L 39 27 Z" fill="url(#catEarInner)" />

          {/* Right Ear */}
          <path
            d="M 70 38 L 78 14 L 58 26 Z"
            fill="url(#catBodyGrad)"
            stroke="#B38600"
            strokeWidth="1.2"
          />
          <path d="M 70 34 L 74 20 L 61 27 Z" fill="url(#catEarInner)" />

          {/* Cat Head */}
          <circle cx="50" cy="42" r="23" fill="url(#catBodyGrad)" stroke="#B38600" strokeWidth="1.5" />

          {/* Calico Spot on forehead */}
          <path d="M 44 21 Q 50 28 56 22 Q 52 30 46 29 Z" fill="#E67E22" />

          {/* Big Anime Eyes */}
          {gameStatus === "busted" ? (
            /* X_X Dead eyes when cooked */
            <g stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round">
              <line x1="36" y1="36" x2="44" y2="44" />
              <line x1="44" y1="36" x2="36" y2="44" />
              <line x1="56" y1="36" x2="64" y2="44" />
              <line x1="64" y1="36" x2="56" y2="44" />
            </g>
          ) : gameStatus === "won" ? (
            /* Happy curved closed eyes ^_^ */
            <g fill="none" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 36 42 Q 40 36 44 42" />
              <path d="M 56 42 Q 60 36 64 42" />
            </g>
          ) : (
            /* Normal wide sparkly eyes */
            <g>
              <ellipse cx="40" cy="40" rx="4.5" ry="5.5" fill="#2C1810" />
              <ellipse cx="60" cy="40" rx="4.5" ry="5.5" fill="#2C1810" />
              {/* Eye sparkle shines */}
              <circle cx="38.5" cy="38.5" r="1.8" fill="#FFFFFF" />
              <circle cx="41.5" cy="42" r="0.8" fill="#FFFFFF" />
              <circle cx="58.5" cy="38.5" r="1.8" fill="#FFFFFF" />
              <circle cx="61.5" cy="42" r="0.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute Pink Nose */}
          <polygon points="48,46 52,46 50,49" fill="#FF7597" />

          {/* Cat Mouth (w shape) */}
          <path
            d="M 46 49 Q 50 52 50 49 Q 50 52 54 49"
            fill="none"
            stroke="#2C1810"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Whiskers */}
          <g stroke="#8A6B00" strokeWidth="1" strokeLinecap="round" opacity="0.8">
            <line x1="26" y1="43" x2="16" y2="40" />
            <line x1="26" y1="46" x2="15" y2="47" />
            <line x1="74" y1="43" x2="84" y2="40" />
            <line x1="74" y1="46" x2="85" y2="47" />
          </g>

          {/* Rosy Cheeks */}
          <circle cx="33" cy="46" r="3" fill="#FF9EAA" opacity="0.6" />
          <circle cx="67" cy="46" r="3" fill="#FF9EAA" opacity="0.6" />

          {/* Golden Collar with Bell */}
          <path d="M 34 57 Q 50 63 66 57" fill="none" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="62" r="3.5" fill="#FFD700" stroke="#B38600" strokeWidth="0.8" />
          <circle cx="50" cy="62" r="1" fill="#4A3B00" />

          {/* Left Lucky Waving Paw (Holding Gold Coin) */}
          <g className="animate-paw-wave">
            <ellipse cx="26" cy="66" rx="6" ry="7" fill="url(#catBodyGrad)" stroke="#B38600" strokeWidth="1.2" />
            {/* Mini Solana Coin in paw */}
            <circle cx="23" cy="63" r="5" fill="url(#solCoinGrad)" stroke="#FFD700" strokeWidth="0.8" />
            <text x="23" y="65.5" fontSize="5" fontWeight="black" fill="#000" textAnchor="middle">S</text>
          </g>

          {/* Right Paw Resting on Pot */}
          <ellipse cx="68" cy="72" rx="6" ry="6" fill="url(#catBodyGrad)" stroke="#B38600" strokeWidth="1.2" />
        </svg>

        {/* Pet me tag badge */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/80 border border-goldAccent/50 text-goldAccent font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap group-hover:bg-goldAccent group-hover:text-black transition-colors shadow-sm">
          {petCount > 0 ? `🐾 ${petCount} pets` : "CLICK TO PET"}
        </span>
      </button>
    </div>
  );
}
