"use client";

import React, { useState } from "react";
import { PetCat } from "./PetCat";
import { soundEngine } from "@/lib/soundEngine";
import {
  Sparkles,
  ExternalLink,
  Trophy,
  Clock,
  Coins,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { LotteryWinner } from "@/hooks/useLotteryCycle";

interface MainLotteryWidgetProps {
  secondsRemaining: number;
  formattedCountdown: string;
  currentRound: number;
  vaultSolBalance: number;
  vaultUsdValue: number;
  lastWinner: LotteryWinner;
  userWalletAddress: string | null;
  userTickets: number;
  userWinProbability: number;
  userClaimableSol: number;
  isClaiming: boolean;
  onClaimReward: () => void;
  onOpenFullLottery: () => void;
  onConnectWallet: () => void;
  gameStatus?: "idle" | "flipping" | "won" | "busted";
  multiplier?: number;
}

export function MainLotteryWidget({
  secondsRemaining,
  formattedCountdown,
  currentRound,
  vaultSolBalance,
  vaultUsdValue,
  lastWinner,
  userWalletAddress,
  userTickets,
  userWinProbability,
  userClaimableSol,
  isClaiming,
  onClaimReward,
  onOpenFullLottery,
  onConnectWallet,
  gameStatus = "idle",
  multiplier = 1,
}: MainLotteryWidgetProps) {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Total epoch is 180s
  const progressPercent = Math.max(0, Math.min(100, ((180 - secondsRemaining) / 180) * 100));

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[320px] sm:max-w-[340px]">
      {/* Top Lucky Neko Cat Mascot */}
      <div className="relative -mb-4 z-30">
        <PetCat gameStatus={gameStatus} multiplier={multiplier} size="md" />
      </div>

      {/* Main Glass Widget Card */}
      <div className="w-full bg-vaultPanel/95 border border-vaultBorder/90 rounded-2xl p-4 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-3 relative z-20 border-t-goldAccent/30 hover:border-goldAccent/50 transition-all">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-vaultBorder/60 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🎰</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white font-mono tracking-tight">
                  3-MIN LOTTERY
                </span>
                <span className="text-[9px] bg-emeraldWin/15 text-emeraldWin px-1.5 py-0.5 rounded font-bold border border-emeraldWin/30 animate-pulse">
                  ROUND #{currentRound}
                </span>
              </div>
              <span className="text-[9px] text-textMuted font-mono block">
                100% Fees to 1 Random Holder
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-[10px] text-textMuted hover:text-white px-1.5 py-0.5 rounded bg-vaultBg/80 border border-vaultBorder"
            title={isMinimized ? "Expand Widget" : "Minimize Widget"}
          >
            {isMinimized ? "＋" : "－"}
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Live 3-Minute Timer & Progress Bar */}
            <div className="bg-vaultBg/80 border border-vaultBorder rounded-xl p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-goldAccent font-bold text-[11px]">
                  <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: "8s" }} />
                  NEXT DRAW IN:
                </span>
                <span className="text-white font-black font-mono tracking-wider animate-pulse text-sm">
                  ⏱ {formattedCountdown}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5 relative">
                <div
                  className="h-full bg-gradient-to-r from-goldAccent via-amber-400 to-emeraldWin transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Accumulated Prize Pool */}
            <div className="flex items-center justify-between bg-gradient-to-r from-goldAccent/10 via-amber-500/5 to-transparent border border-goldAccent/30 rounded-xl p-2.5">
              <div>
                <span className="text-[9px] text-textMuted uppercase font-bold tracking-wider block">
                  PRIZE POOL (FEES)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-goldAccent font-mono">
                    {vaultSolBalance.toFixed(4)}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">SOL</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-textMuted uppercase font-bold tracking-wider block">
                  USD VALUE
                </span>
                <span className="text-xs font-mono font-bold text-emeraldWin">
                  ≈ ${vaultUsdValue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Last Round Winner Card */}
            <div className="flex items-center justify-between bg-vaultBg/60 border border-vaultBorder/80 rounded-xl px-2.5 py-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Trophy className="w-3.5 h-3.5 text-goldAccent shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-textMuted uppercase font-bold block">
                    LAST WINNER
                  </span>
                  <span className="font-mono font-bold text-slate-200 text-[11px] truncate">
                    {lastWinner.winnerAddress.slice(0, 4)}...{lastWinner.winnerAddress.slice(-4)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-right">
                <span className="text-xs font-bold text-emeraldWin font-mono">
                  +{lastWinner.amountSol} SOL
                </span>
                <a
                  href={`https://solscan.io/tx/${lastWinner.txSignature}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-textMuted hover:text-white"
                  title="View Solscan Tx"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* User Ticket Status & Instant Cashout Button */}
            <div className="border-t border-vaultBorder/60 pt-2 flex flex-col gap-2">
              {userWalletAddress ? (
                <div className="bg-emeraldWin/10 border border-emeraldWin/30 rounded-xl p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-textMuted font-bold uppercase">
                      YOUR TICKETS
                    </span>
                    <span className="font-mono font-black text-white text-xs">
                      {userTickets.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-textMuted font-bold uppercase">
                      WIN CHANCE
                    </span>
                    <span className="font-mono font-black text-emeraldWin text-xs">
                      {userWinProbability}%
                    </span>
                  </div>

                  {/* Cashout / Claim Action if claimable */}
                  {userClaimableSol > 0 ? (
                    <button
                      onClick={onClaimReward}
                      disabled={isClaiming}
                      className="w-full mt-1 py-2 rounded-lg font-black text-xs bg-emeraldWin hover:bg-[#00D984] text-black transition-all flex items-center justify-center gap-1 shadow-[0_0_20px_rgba(0,240,146,0.4)] animate-bounce"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>
                        {isClaiming ? "CLAIMING..." : `CLAIM / CASHOUT (${userClaimableSol} SOL)`}
                      </span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-center text-emeraldWin/80 font-mono block mt-0.5">
                      ✓ Auto-entered for next draw
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={onConnectWallet}
                  className="w-full py-2 rounded-xl bg-goldAccent/15 hover:bg-goldAccent/25 border border-goldAccent/30 text-goldAccent font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Connect Wallet to Check Tickets</span>
                </button>
              )}

              {/* Full Details link */}
              <button
                onClick={onOpenFullLottery}
                className="w-full py-1.5 rounded-lg text-[10px] font-mono font-bold text-textMuted hover:text-white hover:bg-vaultBg/80 border border-transparent hover:border-vaultBorder transition-all flex items-center justify-center gap-1"
              >
                <span>Open Full Lottery Page & History</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
