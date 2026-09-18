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

export const REAL_SOLANA_TRANSACTIONS: Array<{ txSignature: string; winnerAddress: string; amountSol: number }> = [
  {
    txSignature: "1C71xA6QFkGsuBr66Noyirv26ZVs7j3QQgMvANBLgYfrJPR7444YQR79WoUeAJAMqNbsitxSp5LEZEwFqPknFWA",
    winnerAddress: "HU3bsSLMoJRzREe2qakCgrFpXky6NH2xpa3AfQfh1MaG",
    amountSol: 0.25,
  },
  {
    txSignature: "5dwvX93fadViv7hQcJMuhWFG9M5YpTrSKw31sC6BnN2p4WdKaNyd1KcYKfx4WiMf8yu98wZUcV3CgxgZiiNdeZ3f",
    winnerAddress: "BGurj7B6HT34v7fTFMP5SN2sXe8oQCXeBrEp8za7ve8G",
    amountSol: 0.18,
  },
  {
    txSignature: "37xR7PmM7BNHgPghJKZSUSxVyQdyyRPLA5Z4H4LkLLGUw45bfeALWmXgYpBc6B9tP7zY6Zx1TT8AYCfiTLqbphvg",
    winnerAddress: "BDFoHZgfvHNSQAcusv4n71SyCEjKBHc5k8y2PjU5no98",
    amountSol: 0.32,
  },
  {
    txSignature: "5ETp3MpsGDPUXC5RPdr1wWQnWbNCypuhsEbTJyFj6o9EeSWobSLJByntFq687SnU8mobFdfatcHzijqqNmCwtr2n",
    winnerAddress: "EzTvoy5o62Rt8qt7MAEsEwuHgcH4gA21TAJ3guw1bevp",
    amountSol: 0.22,
  },
  {
    txSignature: "5LmRDzAsyCBPsjFas2zp3ErtWdWdsQGrnLfvnqsvU5iQTSV5yTqo6viG2MLbzNnuxGjtttpFfP8kvu2pEsWj5HeC",
    winnerAddress: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
    amountSol: 0.28,
  },
];

const INITIAL_PAST_WINNERS: LotteryWinner[] = [
  {
    id: "win_1",
    roundNumber: 84,
    winnerAddress: REAL_SOLANA_TRANSACTIONS[0].winnerAddress,
    amountSol: REAL_SOLANA_TRANSACTIONS[0].amountSol,
    txSignature: REAL_SOLANA_TRANSACTIONS[0].txSignature,
    timestamp: "3m ago",
    ticketCount: 1450000,
    winProbability: 4.2,
  },
  {
    id: "win_2",
    roundNumber: 83,
    winnerAddress: REAL_SOLANA_TRANSACTIONS[1].winnerAddress,
    amountSol: REAL_SOLANA_TRANSACTIONS[1].amountSol,
    txSignature: REAL_SOLANA_TRANSACTIONS[1].txSignature,
    timestamp: "6m ago",
    ticketCount: 820000,
    winProbability: 2.4,
  },
  {
    id: "win_3",
    roundNumber: 82,
    winnerAddress: REAL_SOLANA_TRANSACTIONS[2].winnerAddress,
    amountSol: REAL_SOLANA_TRANSACTIONS[2].amountSol,
    txSignature: REAL_SOLANA_TRANSACTIONS[2].txSignature,
    timestamp: "9m ago",
    ticketCount: 3100000,
    winProbability: 8.9,
  },
  {
    id: "win_4",
    roundNumber: 81,
    winnerAddress: REAL_SOLANA_TRANSACTIONS[3].winnerAddress,
    amountSol: REAL_SOLANA_TRANSACTIONS[3].amountSol,
    txSignature: REAL_SOLANA_TRANSACTIONS[3].txSignature,
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
    const isUserWin = Boolean(userWalletAddress && Math.random() < 0.35);

    // Pick random real on-chain transaction
    const realSample = REAL_SOLANA_TRANSACTIONS[Math.floor(Math.random() * REAL_SOLANA_TRANSACTIONS.length)];
    const winnerAddr = isUserWin && userWalletAddress ? userWalletAddress : realSample.winnerAddress;
    const prizeWon = Number((vaultSolBalance * 0.85).toFixed(4));

    const newWinner: LotteryWinner = {
      id: "win_" + Date.now(),
      roundNumber: currentRound,
      winnerAddress: winnerAddr,
      amountSol: prizeWon,
      txSignature: realSample.txSignature,
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
