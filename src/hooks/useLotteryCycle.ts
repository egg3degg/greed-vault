"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { soundEngine } from "@/lib/soundEngine";
import confetti from "canvas-confetti";

export interface LotteryWinner {
  id: string;
  roundNumber: number;
  winnerAddress: string;
  amountSol: number;
  txSignature: string;
  timestamp: string;
  ticketCount: number;
  winProbability: number;
}

const INITIAL_PAST_WINNERS: LotteryWinner[] = [
  {
    id: "win_1",
    roundNumber: 84,
    winnerAddress: "8xKr3aB9vK8bN7cV4xZ1pL3qR4n9M9aZ",
    amountSol: 0.25,
    txSignature: "5wK91pL3qRvK8bN7cV4x1pL8aZ1pL3qRvK8bN7c7zTq",
    timestamp: "3m ago",
    ticketCount: 1450000,
    winProbability: 4.2,
  },
  {
    id: "win_2",
    roundNumber: 83,
    winnerAddress: "3vPL9qRxZ1pL3qRvK8bN7c7zTqKr3aB9",
    amountSol: 0.18,
    txSignature: "4jXxZ1pL3qRvK8bN7c7zTq8xKr3aB9vK8bN7cV4xZ1",
    timestamp: "6m ago",
    ticketCount: 820000,
    winProbability: 2.4,
  },
  {
    id: "win_3",
    roundNumber: 82,
    winnerAddress: "Dk9aZ1pL3qRvK8bN7cV4x1pL8Kr3aB9v",
    amountSol: 0.32,
    txSignature: "2mAvK8bN7cV4x1pL8aZ1pL3qRvK8bN7c7zTq8xKr3a",
    timestamp: "9m ago",
    ticketCount: 3100000,
    winProbability: 8.9,
  },
  {
    id: "win_4",
    roundNumber: 81,
    winnerAddress: "7tN2qL3qRvK8bN7cV4x1pL8aZ1pL3qRv",
    amountSol: 0.22,
    txSignature: "3bLvK8bN7cV4x1pL8aZ1pL3qRvK8bN7c7zTq8xKr3a",
    timestamp: "12m ago",
    ticketCount: 1200000,
    winProbability: 3.5,
  },
];

const CYCLE_DURATION_SECONDS = 180; // 3 minutes

export function useLotteryCycle(userWalletAddress: string | null) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(142);
  const [currentRound, setCurrentRound] = useState<number>(85);
  const [vaultSolBalance, setVaultSolBalance] = useState<number>(0.8542);
  const [totalSolDistributed, setTotalSolDistributed] = useState<number>(18.45);
  const [eligibleHoldersCount, setEligibleHoldersCount] = useState<number>(248);
  const [totalTicketWeight, setTotalTicketWeight] = useState<number>(35000000);
  const [pastWinners, setPastWinners] = useState<LotteryWinner[]>(INITIAL_PAST_WINNERS);
  const [lastWinner, setLastWinner] = useState<LotteryWinner>(INITIAL_PAST_WINNERS[0]);
  
  // User specific lottery state
  const [userClaimableSol, setUserClaimableSol] = useState<number>(0);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [hasClaimedCurrentRound, setHasClaimedCurrentRound] = useState<boolean>(false);

  // Computed user tickets based on wallet address
  const userTickets = userWalletAddress ? 2500000 : 0;
  const userWinProbability = userWalletAddress
    ? Number(((userTickets / totalTicketWeight) * 100).toFixed(2))
    : 0;

  const solPriceUsd = 172.5;
  const vaultUsdValue = Number((vaultSolBalance * solPriceUsd).toFixed(2));

  // Trigger round completion draw
  const executeDraw = useCallback(() => {
    soundEngine.playTributeGong();
    
    // Pick random winner from sample pool
    const mockWinnerPool = [
      "8xKr3aB9vK8bN7cV4xZ1pL3qR4n9M9aZ",
      "3vPL9qRxZ1pL3qRvK8bN7c7zTqKr3aB9",
      "Dk9aZ1pL3qRvK8bN7cV4x1pL8Kr3aB9v",
      "4mZ1pL3qRvK8bN7c7zTq8xKr3aB9vK8b",
      "9tQ8bN7cV4x1pL8aZ1pL3qRvK8bN7c7z",
    ];

    // If user is connected, occasionally make user the winner for interactive demo
    const isUserWin = userWalletAddress && Math.random() < 0.35;
    const winnerAddr = isUserWin ? userWalletAddress : mockWinnerPool[Math.floor(Math.random() * mockWinnerPool.length)];
    const prizeWon = Number((vaultSolBalance * 0.85).toFixed(4));

    const newWinner: LotteryWinner = {
      id: "win_" + Date.now(),
      roundNumber: currentRound,
      winnerAddress: winnerAddr,
      amountSol: prizeWon,
      txSignature: "5" + Math.random().toString(36).substring(2, 12) + "solscan" + Date.now().toString(36),
      timestamp: "Just now",
      ticketCount: isUserWin ? userTickets : Math.floor(Math.random() * 2000000 + 500000),
      winProbability: isUserWin ? userWinProbability : Number((Math.random() * 5 + 1).toFixed(2)),
    };

    setPastWinners((prev) => [newWinner, ...prev.slice(0, 9)]);
    setLastWinner(newWinner);
    setTotalSolDistributed((prev) => Number((prev + prizeWon).toFixed(4)));
    setVaultSolBalance(0.125); // reset base accumulation
    setCurrentRound((prev) => prev + 1);

    if (isUserWin) {
      setUserClaimableSol(prizeWon);
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#00F092", "#FFFFFF"],
      });
    }
  }, [vaultSolBalance, currentRound, userWalletAddress, userTickets, userWinProbability]);

  // 1-second interval countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          executeDraw();
          return CYCLE_DURATION_SECONDS;
        }
        // Slowly simulate incremental fee accrual
        if (prev % 15 === 0) {
          setVaultSolBalance((v) => Number((v + 0.0035).toFixed(4)));
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [executeDraw]);

  // Cashout / Claim rewards handler
  const claimPrize = useCallback(async () => {
    if (userClaimableSol <= 0 || isClaiming) return;
    soundEngine.playClick();
    setIsClaiming(true);

    try {
      // Simulate on-chain payout transaction to winner's wallet
      await new Promise((resolve) => setTimeout(resolve, 1500));
      soundEngine.playCashOut();
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.5 },
      });
      setUserClaimableSol(0);
      setHasClaimedCurrentRound(true);
    } catch (err) {
      console.error("Cashout failed:", err);
    } finally {
      setIsClaiming(false);
    }
  }, [userClaimableSol, isClaiming]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return {
    secondsRemaining,
    formattedCountdown: formatTime(secondsRemaining),
    currentRound,
    vaultSolBalance,
    vaultUsdValue,
    totalSolDistributed,
    eligibleHoldersCount,
    totalTicketWeight,
    pastWinners,
    lastWinner,
    userTickets,
    userWinProbability,
    userClaimableSol,
    isClaiming,
    hasClaimedCurrentRound,
    claimPrize,
  };
}
