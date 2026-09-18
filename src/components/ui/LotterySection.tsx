"use client";

import React, { useState } from "react";
import { useLotteryCycle } from "@/hooks/useLotteryCycle";
import { soundEngine } from "@/lib/soundEngine";
import {
  Clock,
  Sparkles,
  Award,
  Users,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Copy,
  Wallet,
  Coins,
  Cpu,
  Flame,
  ExternalLink,
  BookOpen,
  Github,
} from "lucide-react";

interface LotterySectionProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
  onOpenDocs: () => void;
}

export function LotterySection({
  walletAddress,
  onConnectWallet,
  onOpenDocs,
}: LotterySectionProps) {
  const {
    formattedCountdown,
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
  } = useLotteryCycle(walletAddress);

  const [copiedCa, setCopiedCa] = useState<boolean>(false);
  const tokenCA = process.env.NEXT_PUBLIC_TOKEN_MINT || "";
  const isCaReady = Boolean(tokenCA && tokenCA !== "WAITING_PUMP_FUN_CA");

  const handleCopyCa = () => {
    if (!isCaReady) {
      alert("Real Contract Address will be published immediately upon Pump.fun launch!");
      return;
    }
    soundEngine.playClick();
    navigator.clipboard.writeText(tokenCA);
    setCopiedCa(true);
    setTimeout(() => setCopiedCa(false), 2000);
  };

  return (
    <section id="lottery" className="w-full max-w-6xl mx-auto px-4 py-12 font-mono select-none">
      {/* 1. Header & Hero Intro */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-vaultBorder">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black tracking-widest text-goldAccent uppercase bg-goldAccent/10 px-2.5 py-1 rounded-md border border-goldAccent/25">
              3-MINUTE HOLDER REWARD VAULT
            </span>
            <span className="text-[11px] font-bold text-emeraldWin bg-emeraldWin/10 px-2 py-0.5 rounded-md border border-emeraldWin/25 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emeraldWin animate-ping" />
              LIVE CYCLE
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            THE VAULT PAYS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-goldAccent via-emeraldWin to-cyan-400">
              THE HOLDERS.
            </span>
          </h2>
          <p className="text-xs md:text-sm text-textMuted mt-2 max-w-xl leading-relaxed">
            Every creator fee and voluntary vault tribute is accumulated into the liquidity reward pool. Every 3 minutes, one random token holder is drawn balance-weighted to receive the jackpot.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenDocs();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-vaultPanel border border-vaultBorder hover:border-goldAccent text-textMuted hover:text-white text-xs font-bold transition-all shadow-md"
          >
            <BookOpen className="w-4 h-4 text-goldAccent" />
            <span>HOW IT WORKS</span>
          </button>

          <a
            href="https://github.com/egg3degg/greed-vault"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-vaultPanel border border-vaultBorder hover:border-cyan-400 text-textMuted hover:text-white text-xs font-bold transition-all shadow-md"
          >
            <Github className="w-4 h-4 text-cyan-400" />
            <span>GITHUB</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. Token CA Bar */}
      <div className="my-6">
        <button
          onClick={handleCopyCa}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-vaultPanel/80 hover:bg-vaultPanel border border-vaultBorder hover:border-goldAccent/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">TOKEN CA</span>
            <span className="text-xs md:text-sm font-black text-white font-mono group-hover:text-goldAccent transition-colors">
              {isCaReady ? tokenCA : "WAITING FOR PUMP.FUN LAUNCH"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-textMuted group-hover:text-white">
            {isCaReady ? (
              copiedCa ? (
                <span className="flex items-center gap-1 text-emeraldWin font-bold">
                  <Check className="w-3.5 h-3.5" /> COPIED!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> CLICK TO COPY
                </span>
              )
            ) : (
              <span className="text-[10px] bg-goldAccent/15 text-goldAccent px-2.5 py-1 rounded-full border border-goldAccent/30 font-bold animate-pulse">
                PENDING CREATION
              </span>
            )}
          </div>
        </button>
      </div>

      {/* 3. Primary Cycle Engine Dashboard (Countdown + Vault Pool) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Countdown Box */}
        <div className="p-6 md:p-8 rounded-3xl bg-vaultPanel border border-vaultBorder relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-goldAccent to-emeraldWin" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-goldAccent" />
              NEXT REWARD DRAW
            </span>
            <span className="text-[10px] text-textMuted">SOLANA MAINNET</span>
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl md:text-6xl font-black text-white tracking-tight">
              {formattedCountdown}
            </span>
            <span className="text-xs text-emeraldWin font-bold animate-pulse">
              ● ACTIVE DRAW
            </span>
          </div>
          <p className="text-xs text-textMuted mt-1">
            Three-minute cycle. When the clock hits 00:00, snapshot is verified and winner is drawn.
          </p>
        </div>

        {/* Vault Fees Pool */}
        <div className="p-6 md:p-8 rounded-3xl bg-vaultPanel border border-vaultBorder relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emeraldWin to-cyan-400" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-2">
              <Coins className="w-4 h-4 text-emeraldWin" />
              VAULT · FEES TO DISTRIBUTE
            </span>
            <span className="text-[10px] bg-emeraldWin/15 text-emeraldWin px-2 py-0.5 rounded-full border border-emeraldWin/30">
              ACCUMULATING
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl md:text-5xl font-black text-emeraldWin">
              {vaultSolBalance.toFixed(4)} SOL
            </span>
            <span className="text-sm font-bold text-textMuted">
              ≈ ${vaultUsdValue} USD
            </span>
          </div>
          <p className="text-xs text-textMuted mt-1">
            Funded automatically by trading volume and voluntary tributes to the creator vault.
          </p>
        </div>
      </div>

      {/* 4. Live Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        <div className="p-4 rounded-2xl bg-vaultPanel/90 border border-vaultBorder flex flex-col">
          <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold">ELIGIBLE HOLDERS</span>
          <span className="text-2xl font-black text-white mt-1">{eligibleHoldersCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/90 border border-vaultBorder flex flex-col">
          <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold">TOTAL TICKET WEIGHT</span>
          <span className="text-2xl font-black text-goldAccent mt-1">
            {(totalTicketWeight / 1000000).toFixed(1)}M
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/90 border border-vaultBorder flex flex-col">
          <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold">LAST WINNER</span>
          <span className="text-sm md:text-base font-black text-white font-mono mt-2 truncate">
            {lastWinner.winnerAddress.slice(0, 4)}...{lastWinner.winnerAddress.slice(-4)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/90 border border-vaultBorder flex flex-col">
          <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold">ENGINE STATUS</span>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emeraldWin animate-ping" />
            <span className="text-xs font-black text-emeraldWin">DISTRIBUTING</span>
          </div>
        </div>
      </div>

      {/* 5. User Ticket Status & Cashout Action Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-vaultPanel via-[#141E33] to-vaultPanel border border-goldAccent/30 shadow-2xl my-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-goldAccent" />
            <span className="text-xs font-bold text-goldAccent uppercase tracking-wider">
              YOUR LOTTERY TICKETS & CASH-OUT STATUS
            </span>
          </div>

          {walletAddress ? (
            <div className="flex flex-wrap items-baseline gap-4 mt-2">
              <div>
                <span className="text-[10px] text-textMuted block">YOUR BALANCE TICKETS</span>
                <span className="text-xl font-black text-white">
                  {(userTickets / 1000000).toFixed(2)}M TICKETS
                </span>
              </div>
              <div>
                <span className="text-[10px] text-textMuted block">ROUND WIN CHANCE</span>
                <span className="text-xl font-black text-emeraldWin">
                  {userWinProbability}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-textMuted block">CLAIMABLE WINNINGS</span>
                <span className="text-xl font-black text-goldAccent">
                  {userClaimableSol > 0 ? `${userClaimableSol.toFixed(4)} SOL` : "0.00 SOL"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-textMuted mt-1">
              Connect your Solana wallet to view your ticket count, round probability, and claim winning rewards.
            </p>
          )}
        </div>

        {/* Action Button: Cashout vs Connect */}
        <div>
          {walletAddress ? (
            userClaimableSol > 0 ? (
              <button
                onClick={claimPrize}
                disabled={isClaiming}
                className="px-6 py-3 rounded-2xl bg-goldAccent hover:bg-[#E5C100] text-black font-black text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(255,215,0,0.5)] active:scale-95 transition-all"
              >
                <Flame className="w-4 h-4 fill-black" />
                <span>{isClaiming ? "PROCESSING CASHOUT..." : `CASHOUT ${userClaimableSol.toFixed(4)} SOL`}</span>
              </button>
            ) : hasClaimedCurrentRound ? (
              <div className="px-4 py-2 rounded-xl bg-emeraldWin/20 border border-emeraldWin/40 text-emeraldWin text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>PRIZE CLAIMED TO WALLET!</span>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-xs font-bold text-slate-300 block">TICKETS ACTIVE</span>
                <span className="text-[10px] text-textMuted">Eligible for next 3-min draw</span>
              </div>
            )
          ) : (
            <button
              onClick={() => {
                soundEngine.playClick();
                onConnectWallet();
              }}
              className="px-5 py-2.5 rounded-2xl bg-emeraldWin hover:bg-emeraldWin/90 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,146,0.3)]"
            >
              <Wallet className="w-4 h-4" />
              <span>CONNECT WALLET TO CHECK</span>
            </button>
          )}
        </div>
      </div>

      {/* 6. Detailed Distribution Data Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6 text-left">
        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">TOTAL SOL DISTRIBUTED</span>
          <span className="text-base font-black text-white mt-1 block">{totalSolDistributed.toFixed(2)} SOL</span>
          <span className="text-[10px] text-textMuted mt-0.5 block">Confirmed holder payouts</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">COMMUNITY DEV FEE</span>
          <span className="text-base font-black text-emeraldWin mt-1 block">0% FEE</span>
          <span className="text-[10px] text-textMuted mt-0.5 block">100% pool goes to winner</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">NEXT PRIZE POOL</span>
          <span className="text-base font-black text-goldAccent mt-1 block">ACCUMULATING</span>
          <span className="text-[10px] text-textMuted mt-0.5 block">Current Epoch 85</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">MINIMUM THRESHOLD</span>
          <span className="text-base font-black text-white mt-1 block">0.0500 SOL</span>
          <span className="text-[10px] text-textMuted mt-0.5 block">Guaranteed pool floor</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">LAST CLAIM</span>
          <span className="text-base font-black text-white mt-1 block">{lastWinner.amountSol.toFixed(4)} SOL</span>
          <span className="text-[10px] text-textMuted mt-0.5 block">Claimed from vault</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">WINNER WALLET</span>
          <span className="text-base font-black text-goldAccent font-mono mt-1 block truncate">
            {lastWinner.winnerAddress.slice(0, 4)}...{lastWinner.winnerAddress.slice(-4)}
          </span>
          <span className="text-[10px] text-textMuted mt-0.5 block">Selected · Payout recorded</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">SELECTION MODEL</span>
          <span className="text-base font-black text-cyan-400 mt-1 block">BALANCE WEIGHTED</span>
          <span className="text-[10px] text-textMuted mt-0.5 block">1 Token = 1 Ticket</span>
        </div>

        <div className="p-4 rounded-2xl bg-vaultPanel/80 border border-vaultBorder">
          <span className="text-[10px] text-textMuted uppercase font-bold block">CYCLE STATUS</span>
          <span className="text-base font-black text-emeraldWin mt-1 block">RUNNING</span>
          <span className="text-[10px] text-textMuted mt-0.5 block">Every 180s on mainnet</span>
        </div>
      </div>

      {/* 7. How It Works: 3-Step Simple Grid */}
      <div className="my-10 p-6 md:p-8 rounded-3xl bg-vaultPanel/60 border border-vaultBorder">
        <div className="mb-6">
          <span className="text-[11px] font-black text-goldAccent uppercase tracking-widest">HOW IT WORKS</span>
          <h3 className="text-2xl font-black text-white mt-1">ONE VAULT. ONE RANDOM HOLDER.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-vaultBg/80 border border-vaultBorder">
            <span className="text-xs font-black text-goldAccent">01</span>
            <h4 className="text-sm font-black text-white my-1">HOLD $GREED</h4>
            <p className="text-xs text-textMuted leading-relaxed">
              Every token in your wallet automatically acts as a lottery ticket. No staking or lockups required.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vaultBg/80 border border-vaultBorder">
            <span className="text-xs font-black text-emeraldWin">02</span>
            <h4 className="text-sm font-black text-white my-1">WEIGHTED DRAW</h4>
            <p className="text-xs text-textMuted leading-relaxed">
              Every 3 minutes, an automated snapshot selects one winner weighted by their holdings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vaultBg/80 border border-vaultBorder">
            <span className="text-xs font-black text-cyan-400">03</span>
            <h4 className="text-sm font-black text-white my-1">INSTANT CASHOUT</h4>
            <p className="text-xs text-textMuted leading-relaxed">
              Creator fees are disbursed directly to the winner or claimable via 1-click cashout right on the app.
            </p>
          </div>
        </div>
      </div>

      {/* 8. On-Chain Activity / Recent Payouts Feed */}
      <div className="my-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-textMuted uppercase tracking-wider block">ONCHAIN ACTIVITY</span>
            <h3 className="text-lg font-black text-white">LIVE WINNER PAYOUTS</h3>
          </div>
          <span className="text-xs text-emeraldWin font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emeraldWin animate-ping" />
            SOLANA MAINNET
          </span>
        </div>

        <div className="space-y-2.5">
          {pastWinners.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-vaultPanel/80 border border-vaultBorder hover:border-emeraldWin/30 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-goldAccent/10 border border-goldAccent/25 flex items-center justify-center text-goldAccent font-black">
                  #{w.roundNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white font-mono">
                      {w.winnerAddress.slice(0, 6)}...{w.winnerAddress.slice(-6)}
                    </span>
                    <span className="text-[10px] text-textMuted font-sans">
                      ({w.winProbability}% weight)
                    </span>
                  </div>
                  <span className="text-[10px] text-textMuted">{w.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-black text-emeraldWin text-sm">
                  +{w.amountSol.toFixed(4)} SOL
                </span>
                <a
                  href={`https://solscan.io/tx/${w.txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-textMuted hover:text-white transition-colors"
                >
                  <span>Solscan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
