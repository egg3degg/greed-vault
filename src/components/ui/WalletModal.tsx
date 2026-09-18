"use client";

import React, { useState } from "react";
import { SupportedWallet, connectSolanaWallet, getWalletProvider } from "@/lib/solanaTribute";
import { soundEngine } from "@/lib/soundEngine";
import { X, Wallet, ShieldCheck, ExternalLink, Loader2, Sparkles } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (address: string, walletType: SupportedWallet) => void;
}

interface WalletOption {
  id: SupportedWallet;
  name: string;
  badge: string;
  icon: string;
  color: string;
  downloadUrl: string;
  detectKey: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "phantom",
    name: "Phantom",
    badge: "RECOMMENDED",
    icon: "👻",
    color: "from-purple-600/20 to-purple-900/30 border-purple-500/40 hover:border-purple-400",
    downloadUrl: "https://phantom.app/",
    detectKey: "phantom",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    badge: "DEGEN FAVORITE",
    icon: "🪐",
    color: "from-emerald-600/20 to-teal-900/30 border-emerald-500/40 hover:border-emerald-400",
    downloadUrl: "https://jup.ag/",
    detectKey: "jupiter",
  },
  {
    id: "solflare",
    name: "Solflare",
    badge: "INSTITUTIONAL",
    icon: "🔥",
    color: "from-amber-600/20 to-orange-900/30 border-amber-500/40 hover:border-amber-400",
    downloadUrl: "https://solflare.com/",
    detectKey: "solflare",
  },
  {
    id: "generic",
    name: "Solana Standard",
    badge: "AUTO-DETECT",
    icon: "⚡",
    color: "from-blue-600/20 to-indigo-900/30 border-blue-500/40 hover:border-blue-400",
    downloadUrl: "https://solana.com/",
    detectKey: "solana",
  },
];

export function WalletModal({ isOpen, onClose, onConnected }: WalletModalProps) {
  const [connectingWallet, setConnectingWallet] = useState<SupportedWallet | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectWallet = async (wallet: WalletOption) => {
    soundEngine.playClick();
    setConnectingWallet(wallet.id);
    setErrorMessage(null);

    const provider = getWalletProvider(wallet.id);
    if (!provider) {
      setErrorMessage(`${wallet.name} not detected. Install extension or click the link to download.`);
      setConnectingWallet(null);
      return;
    }

    const res = await connectSolanaWallet(wallet.id);
    if (res.success && res.address) {
      soundEngine.playWin(1);
      onConnected(res.address, wallet.id);
      onClose();
    } else {
      setErrorMessage(res.error || `Failed to connect ${wallet.name}`);
    }
    setConnectingWallet(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-md bg-vaultPanel border border-vaultBorder rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-emeraldWin to-goldAccent" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-textMuted hover:text-white bg-vaultBg/60 border border-white/5 hover:border-white/20 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emeraldWin/15 border border-emeraldWin/30 flex items-center justify-center text-emeraldWin">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>CONNECT WALLET</span>
              <span className="text-[10px] bg-emeraldWin/20 text-emeraldWin px-2 py-0.5 rounded-full border border-emeraldWin/40">
                REAL SOL
              </span>
            </h2>
            <p className="text-xs text-textMuted">Select your preferred Solana wallet</p>
          </div>
        </div>

        {/* Real SOL Notice */}
        <div className="my-4 p-3 rounded-2xl bg-goldAccent/10 border border-goldAccent/25 text-[11px] text-textMuted flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-goldAccent shrink-0 mt-0.5" />
          <div>
            <span className="text-goldAccent font-bold block">Entry Tribute (0.10 SOL)</span>
            <span>
              Upon connection, you will be prompted to confirm a voluntary 0.1 SOL tribute directly to dev. You will be pinned to the live multiplayer leaderboard!
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-crimsonBust/15 border border-crimsonBust/40 text-xs text-crimsonBust flex items-center justify-between">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wallet List */}
        <div className="space-y-2.5 my-4">
          {WALLET_OPTIONS.map((wallet) => {
            const isConnecting = connectingWallet === wallet.id;
            return (
              <button
                key={wallet.id}
                onClick={() => handleSelectWallet(wallet)}
                disabled={connectingWallet !== null}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r border transition-all ${wallet.color} group disabled:opacity-50`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="text-left">
                    <span className="font-extrabold text-white text-sm block group-hover:text-goldAccent transition-colors">
                      {wallet.name}
                    </span>
                    <span className="text-[10px] text-textMuted uppercase tracking-wider">
                      {wallet.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <span className="text-xs text-textMuted group-hover:text-white transition-colors">
                      Connect →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="pt-3 border-t border-vaultBorder/60 flex items-center justify-between text-[10px] text-textMuted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emeraldWin" />
            100% Non-Custodial & Transparent
          </span>
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Need a wallet?</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
