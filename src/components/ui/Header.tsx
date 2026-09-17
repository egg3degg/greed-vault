"use client";

import React, { useState } from "react";
import { GameMode } from "@/hooks/useGreedGame";
import { soundEngine } from "@/lib/soundEngine";
import { Volume2, VolumeX, RefreshCw, Wallet, Flame, ShieldCheck } from "lucide-react";

interface HeaderProps {
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  arcadeBalance: number;
  onResetArcadeBalance: () => void;
  walletAddress: string | null;
  onConnectWallet: () => Promise<void>;
  onOpenTributeModal: () => void;
}

export function Header({
  gameMode,
  onSelectGameMode,
  arcadeBalance,
  onResetArcadeBalance,
  walletAddress,
  onConnectWallet,
  onOpenTributeModal,
}: HeaderProps) {
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());

  const toggleSound = () => {
    const nextMuted = soundEngine.toggleMuted();
    setIsMuted(nextMuted);
  };

  const handleWalletClick = async () => {
    soundEngine.playClick();
    await onConnectWallet();
  };

  return (
    <header className="w-full border-b border-vaultBorder bg-vaultBg/80 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">👑</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-lg tracking-tight font-mono">$GREED</span>
              <span className="text-[10px] bg-goldAccent/15 text-goldAccent px-1.5 py-0.5 rounded font-bold font-mono border border-goldAccent/30">
                3D VAULT
              </span>
            </div>
            <span className="text-[10px] text-textMuted font-mono block -mt-0.5">
              doubleornothing.fun
            </span>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center bg-vaultPanel border border-vaultBorder p-1 rounded-xl">
        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectGameMode("ARCADE");
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-all flex items-center gap-1.5 ${
            gameMode === "ARCADE"
              ? "bg-goldAccent text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              : "text-textMuted hover:text-white"
          }`}
        >
          <span>🥋 DOJO (pSOL)</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectGameMode("REAL_SOL");
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold transition-all flex items-center gap-1.5 ${
            gameMode === "REAL_SOL"
              ? "bg-emeraldWin text-black shadow-[0_0_15px_rgba(0,240,146,0.3)]"
              : "text-textMuted hover:text-white"
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>⚡ REAL SOL</span>
        </button>
      </div>

      {/* Right Controls: Balance & Wallet */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {gameMode === "ARCADE" ? (
          <div className="flex items-center gap-2 bg-vaultPanel border border-vaultBorder px-3 py-1.5 rounded-xl">
            <span className="text-textMuted text-[11px]">CHIPS:</span>
            <span className="font-extrabold text-goldAccent">{arcadeBalance.toFixed(2)} pSOL</span>
            <button
              onClick={onResetArcadeBalance}
              title="Reset Dojo Balance to 5.00 pSOL"
              className="p-1 hover:text-white text-textMuted transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleWalletClick}
            className="flex items-center gap-2 bg-emeraldWin/15 border border-emeraldWin/30 text-emeraldWin px-3 py-1.5 rounded-xl font-bold hover:bg-emeraldWin/25 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {walletAddress
                ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                : "Connect Phantom"}
            </span>
          </button>
        )}

        {/* Direct Feed the Dev Button */}
        <button
          onClick={onOpenTributeModal}
          className="px-2.5 py-1.5 rounded-xl bg-goldAccent/20 hover:bg-goldAccent text-goldAccent hover:text-black border border-goldAccent/40 font-bold transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(255,215,0,0.2)]"
          title="Send voluntary SOL tribute directly to developer wallet"
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">FEED DEV</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-vaultPanel border border-vaultBorder text-textMuted hover:text-white transition-colors"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-crimsonBust" /> : <Volume2 className="w-4 h-4 text-goldAccent" />}
        </button>
      </div>
    </header>
  );
}
