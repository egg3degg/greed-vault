"use client";

import { useState, useCallback, useRef } from "react";
import { soundEngine } from "@/lib/soundEngine";
import confetti from "canvas-confetti";

export type GameMode = "ARCADE" | "REAL_SOL";
export type GameStatus = "IDLE" | "FLIPPING" | "ROUND_WON" | "BUSTED" | "CASHED_OUT";

export interface RunSummary {
  id: string;
  mode: GameMode;
  initialStake: number;
  finalPayout: number;
  multiplierAchieved: number;
  flipsSurvived: number;
  outcome: "CASHED_OUT" | "BUSTED";
  timestamp: string;
  greedRank: string;
  greedScore: number;
}

export const MULTIPLIERS = [1, 2, 4, 8, 16, 32, 64];

export function useGreedGame() {
  const [gameMode, setGameMode] = useState<GameMode>("REAL_SOL");
  const [gameStatus, setGameStatus] = useState<GameStatus>("IDLE");
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [stakeAmount, setStakeAmount] = useState<number>(0.1);
  const [arcadeBalance, setArcadeBalance] = useState<number>(5.0); // 5.0 pSOL default
  const [lastOutcome, setLastOutcome] = useState<"DOUBLE" | "BUST" | null>(null);
  const [activeRunSummary, setActiveRunSummary] = useState<RunSummary | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Highest multiplier achieved in the active run
  const peakMultiplierRef = useRef<number>(1);
  const flipsCountRef = useRef<number>(0);

  const currentMultiplier = MULTIPLIERS[currentLevel] || 1;
  const currentPot = Number((stakeAmount * currentMultiplier).toFixed(4));
  const nextMultiplier = MULTIPLIERS[currentLevel + 1] || currentMultiplier * 2;
  const nextPot = Number((stakeAmount * nextMultiplier).toFixed(4));

  /**
   * Evaluate psychological Greed Index based on level achieved and choice
   */
  const computeGreedIndex = useCallback((level: number, outcome: "CASHED_OUT" | "BUSTED") => {
    if (outcome === "BUSTED") {
      if (level <= 1) {
        return {
          rank: "UNLUCKY ROOKIE",
          score: 45,
          verdict: "Liquidated on the first flip. Variance is a cruel mistress.",
        };
      }
      if (level <= 3) {
        return {
          rank: "AMBITIOUS CASUAL",
          score: 72,
          verdict: "Had decent profit in hand, but the allure of doubling proved irresistible.",
        };
      }
      return {
        rank: "TERMINAL GREED",
        score: 99,
        verdict: "Held a massive bag, stared glory in the face, and flipped until the wheels fell off. Respect.",
      };
    } else {
      // CASHED OUT
      if (level === 1) {
        return {
          rank: "PAPER HANDS",
          score: 18,
          verdict: "Secured quick lunch money. The 32x God Candle left the station without you.",
        };
      }
      if (level <= 3) {
        return {
          rank: "CALCULATED DEGEN",
          score: 65,
          verdict: "Smart composure. Doubled multiple times and walked out before the house caught on.",
        };
      }
      return {
        rank: "APEX PREDATOR",
        score: 94,
        verdict: "Legendary discipline. Extracted massive multipliers and left the vault in the black.",
      };
    }
  }, []);

  /**
   * Start or continue a flip (Double Down)
   */
  const doubleDown = useCallback(async () => {
    if (gameStatus === "FLIPPING") return;

    // Check balance if starting new run
    if (gameStatus === "IDLE") {
      if (gameMode === "ARCADE") {
        if (arcadeBalance < stakeAmount) {
          alert("Insufficient pSOL balance! Reset your Dojo chips in the header.");
          return;
        }
        setArcadeBalance((prev) => Number((prev - stakeAmount).toFixed(4)));
      }
      peakMultiplierRef.current = 1;
      flipsCountRef.current = 0;
    }

    setGameStatus("FLIPPING");
    setLastOutcome(null);
    soundEngine.playSpin(1.5);

    // 50/50 Provably Fair Odds
    const isWin = Math.random() < 0.5;

    // Await flip animation duration (1500ms)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    soundEngine.playImpact();
    flipsCountRef.current += 1;

    if (isWin) {
      const nextLvl = currentLevel + 1;
      setCurrentLevel(nextLvl);
      const newMultiplier = MULTIPLIERS[nextLvl] || nextMultiplier;
      peakMultiplierRef.current = Math.max(peakMultiplierRef.current, newMultiplier);
      setLastOutcome("DOUBLE");
      setGameStatus("ROUND_WON");
      soundEngine.playWin(newMultiplier);

      // Micro confetti on big multipliers (8x+)
      if (newMultiplier >= 8) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#00F092", "#FFFFFF"],
        });
      }

      // If max level 64x reached, auto cash out
      if (nextLvl >= MULTIPLIERS.length - 1) {
        const finalPot = Number((stakeAmount * newMultiplier).toFixed(4));
        if (gameMode === "ARCADE") {
          setArcadeBalance((prev) => Number((prev + finalPot).toFixed(4)));
        }
        const { rank, score } = computeGreedIndex(nextLvl, "CASHED_OUT");
        const summary: RunSummary = {
          id: `run_${Date.now()}`,
          mode: gameMode,
          initialStake: stakeAmount,
          finalPayout: finalPot,
          multiplierAchieved: newMultiplier,
          flipsSurvived: flipsCountRef.current,
          outcome: "CASHED_OUT",
          timestamp: new Date().toLocaleTimeString(),
          greedRank: rank,
          greedScore: score,
        };
        setActiveRunSummary(summary);
        setShowCertificate(true);
        setGameStatus("CASHED_OUT");
      }
    } else {
      // BUST
      setLastOutcome("BUST");
      setGameStatus("BUSTED");
      soundEngine.playBust();

      const { rank, score } = computeGreedIndex(currentLevel, "BUSTED");
      const summary: RunSummary = {
        id: `run_${Date.now()}`,
        mode: gameMode,
        initialStake: stakeAmount,
        finalPayout: 0,
        multiplierAchieved: peakMultiplierRef.current,
        flipsSurvived: flipsCountRef.current - 1,
        outcome: "BUSTED",
        timestamp: new Date().toLocaleTimeString(),
        greedRank: rank,
        greedScore: score,
      };
      setActiveRunSummary(summary);
      setTimeout(() => {
        setShowCertificate(true);
      }, 1000);
    }
  }, [
    gameStatus,
    gameMode,
    arcadeBalance,
    stakeAmount,
    currentLevel,
    nextMultiplier,
    computeGreedIndex,
  ]);

  /**
   * Cash out and walk away with current pot
   */
  const cashOut = useCallback(() => {
    if (gameStatus !== "ROUND_WON" && currentLevel === 0) return;

    soundEngine.playCashOut();
    const finalPot = currentPot;

    if (gameMode === "ARCADE") {
      setArcadeBalance((prev) => Number((prev + finalPot).toFixed(4)));
    }

    const { rank, score } = computeGreedIndex(currentLevel, "CASHED_OUT");
    const summary: RunSummary = {
      id: `run_${Date.now()}`,
      mode: gameMode,
      initialStake: stakeAmount,
      finalPayout: finalPot,
      multiplierAchieved: currentMultiplier,
      flipsSurvived: flipsCountRef.current,
      outcome: "CASHED_OUT",
      timestamp: new Date().toLocaleTimeString(),
      greedRank: rank,
      greedScore: score,
    };

    setActiveRunSummary(summary);
    setShowCertificate(true);
    setGameStatus("CASHED_OUT");

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#00F092", "#FFD700", "#38BDF8"],
    });
  }, [gameStatus, currentLevel, currentPot, gameMode, stakeAmount, currentMultiplier, computeGreedIndex]);

  /**
   * Reset run to start fresh
   */
  const resetRun = useCallback(() => {
    setCurrentLevel(0);
    setGameStatus("IDLE");
    setLastOutcome(null);
    setShowCertificate(false);
  }, []);

  /**
   * Reset Dojo arcade balance to 5.0 pSOL
   */
  const resetArcadeBalance = useCallback(() => {
    setArcadeBalance(5.0);
    soundEngine.playClick();
  }, []);

  return {
    gameMode,
    setGameMode,
    gameStatus,
    currentLevel,
    stakeAmount,
    setStakeAmount,
    arcadeBalance,
    resetArcadeBalance,
    currentMultiplier,
    currentPot,
    nextMultiplier,
    nextPot,
    lastOutcome,
    activeRunSummary,
    showCertificate,
    setShowCertificate,
    doubleDown,
    cashOut,
    resetRun,
  };
}
