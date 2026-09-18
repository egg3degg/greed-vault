"use client";

import React from "react";
import { soundEngine } from "@/lib/soundEngine";
import { X, BookOpen, ShieldCheck, Code, Cpu, Flame, ExternalLink, CheckCircle } from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-vaultPanel border border-vaultBorder rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-y-auto flex flex-col">
        {/* Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-goldAccent via-emeraldWin to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-textMuted hover:text-white bg-vaultBg/60 border border-white/10 hover:border-white/20 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-goldAccent/15 border border-goldAccent/30 flex items-center justify-center text-goldAccent">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">PROTOCOL SPECIFICATION</h2>
              <span className="text-[10px] bg-emeraldWin/20 text-emeraldWin px-2 py-0.5 rounded-full border border-emeraldWin/40 font-bold">
                V1.0 LIVE
              </span>
            </div>
            <p className="text-xs text-textMuted">3-Minute Holder Reward Vault & Verifiable Payout Architecture</p>
          </div>
        </div>

        {/* Docs Content Sections */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-vaultBg/70 border border-vaultBorder">
            <div className="flex items-center gap-2 font-black text-white text-sm mb-2 text-goldAccent">
              <Cpu className="w-4 h-4" />
              <span>01. THE 3-MINUTE REWARD CYCLE</span>
            </div>
            <p>
              $GREED converts trading creator fees and community vault tributes into continuous, automated reward distributions. Every 180 seconds (3 minutes), an on-chain snapshot of token holders is captured. A balance-weighted drawing selects one holder wallet, and the accumulated SOL pool is disbursed directly to their address.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-2xl bg-vaultBg/70 border border-vaultBorder">
            <div className="flex items-center gap-2 font-black text-white text-sm mb-2 text-emeraldWin">
              <Flame className="w-4 h-4" />
              <span>02. BALANCE-WEIGHTED TICKETS (1 TOKEN = 1 TICKET)</span>
            </div>
            <p>
              Holders do not need to stake, deposit, or lock up tokens. Tickets are dynamically calculated:
            </p>
            <div className="my-2 p-2.5 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-emeraldWin">
              Win Probability (%) = (User $GREED Balance / Total Eligible Circulating Supply) × 100
            </div>
            <p className="text-[11px] text-textMuted">
              Whales have proportional weight, but micro-holders still participate in every single 3-minute epoch.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl bg-vaultBg/70 border border-vaultBorder">
            <div className="flex items-center gap-2 font-black text-white text-sm mb-2 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>03. 100% NON-CUSTODIAL & CASHOUT OPTION</span>
            </div>
            <p>
              Your tokens never leave your personal wallet. When your address is selected as the winning holder, the SOL reward is either automatically transferred via on-chain transaction or made available for 1-click <strong>Instant Cashout</strong> right on this dashboard.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-4 rounded-2xl bg-vaultBg/70 border border-vaultBorder">
            <div className="flex items-center gap-2 font-black text-white text-sm mb-2 text-purple-400">
              <Code className="w-4 h-4" />
              <span>04. OPEN-SOURCE DISTRIBUTION BOT</span>
            </div>
            <p>
              The distribution bot runs continuously using the official <code>@solana/web3.js</code> SDK. It queries token accounts, verifies blockhash entropy, executes the payout, and records all signatures to Solscan.
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-textMuted text-[11px]">Inspect the bot script:</span>
              <a
                href="https://github.com/egg3degg/greed-vault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-goldAccent bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all"
              >
                <span>github.com/egg3degg/greed-vault</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-vaultBorder flex items-center justify-between text-[11px] text-textMuted">
          <span className="flex items-center gap-1.5 text-emeraldWin">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified Mainnet Architecture
          </span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-goldAccent text-black font-extrabold hover:bg-goldAccent/90 transition-all"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
}
