"use client";

import React from "react";
import { useGreedGame, MULTIPLIERS } from "@/hooks/useGreedGame";
import { Header } from "@/components/ui/Header";
import { Greed3DScene } from "@/components/canvas/Greed3DScene";
import { GreedCertificateModal } from "@/components/ui/GreedCertificateModal";
import { TokenBanner } from "@/components/ui/TokenBanner";
import { Flame, ShieldAlert, Award, ArrowRight, RotateCcw, Zap } from "lucide-react";

export default function GreedVaultPage() {
  const {
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
  } = useGreedGame();

  const isFlipping = gameStatus === "FLIPPING";
  const isIdle = gameStatus === "IDLE";
  const isWon = gameStatus === "ROUND_WON";
  const isBusted = gameStatus === "BUSTED";

  const wagerOptions = [0.1, 0.25, 0.5, 1.0, 2.0];

  return (
    <main className="relative flex flex-col h-screen w-screen overflow-hidden bg-vaultBg font-mono select-none">
      {/* 1. Header */}
      <Header
        gameMode={gameMode}
        onSelectGameMode={setGameMode}
        arcadeBalance={arcadeBalance}
        onResetArcadeBalance={resetArcadeBalance}
      />

      {/* 2. Main 3D Viewport & HUD Overlay */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Real-Time Three.js WebGL Scene */}
        <Greed3DScene
          gameStatus={gameStatus}
          lastOutcome={lastOutcome}
          currentMultiplier={currentMultiplier}
        />

        {/* Floating Top Multiplier Ladder */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-vaultPanel/80 border border-vaultBorder backdrop-blur-md max-w-[94vw] overflow-x-auto">
          {MULTIPLIERS.map((mult, idx) => {
            const isCurrent = idx === currentLevel;
            const isPassed = idx < currentLevel;
            return (
              <div
                key={mult}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 shrink-0 ${
                  isCurrent
                    ? "bg-goldAccent text-black shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105"
                    : isPassed
                    ? "bg-emeraldWin/20 text-emeraldWin border border-emeraldWin/40"
                    : "text-textMuted bg-vaultBg/40 border border-white/5"
                }`}
              >
                <span>{mult}X</span>
                {isCurrent && <span className="animate-ping text-[10px]">●</span>}
              </div>
            );
          })}
        </div>

        {/* Floating Center / Bottom Decision Deck */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4 flex flex-col items-center gap-4">
          {/* Status Alert Banner */}
          {isWon && (
            <div className="animate-bounce bg-emeraldWin/15 border border-emeraldWin/40 text-emeraldWin px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,146,0.3)]">
              <Award className="w-4 h-4" />
              <span>FLIP SUCCESSFUL! DOUBLED TO {currentMultiplier}X</span>
            </div>
          )}

          {isBusted && (
            <div className="bg-crimsonBust/15 border border-crimsonBust/40 text-crimsonBust px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,51,68,0.3)]">
              <ShieldAlert className="w-4 h-4" />
              <span>SKULL FACE! COOKED BY GREED AT {currentMultiplier}X</span>
            </div>
          )}

          {/* Pot Card */}
          <div className="w-full bg-vaultPanel/85 border border-vaultBorder rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-textMuted uppercase tracking-wider block">CURRENT POT</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">{currentPot}</span>
                <span className="text-xs font-bold text-goldAccent font-mono">
                  {gameMode === "ARCADE" ? "pSOL" : "SOL"}
                </span>
                <span className="text-xs text-textMuted">({currentMultiplier}X)</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-textMuted uppercase tracking-wider block">NEXT DOUBLE</span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-xl font-black text-goldAccent">+{nextPot}</span>
                <span className="text-[10px] text-textMuted font-mono">
                  {gameMode === "ARCADE" ? "pSOL" : "SOL"}
                </span>
                <span className="text-[10px] text-emeraldWin">({nextMultiplier}X)</span>
              </div>
            </div>
          </div>

          {/* Wager Selection Pills (Only when idle) */}
          {isIdle && (
            <div className="flex items-center gap-2 p-1 bg-vaultBg/80 border border-vaultBorder rounded-xl backdrop-blur-md">
              <span className="text-[11px] text-textMuted px-2">WAGER:</span>
              {wagerOptions.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setStakeAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    stakeAmount === amt
                      ? "bg-goldAccent text-black"
                      : "text-textMuted hover:text-white"
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          )}

          {/* Action Button Controls */}
          <div className="w-full grid grid-cols-1 gap-2.5">
            {isIdle && (
              <button
                onClick={doubleDown}
                disabled={isFlipping}
                className="w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 bg-goldAccent hover:bg-[#E5C100] text-black transition-all shadow-[0_0_30px_rgba(255,215,0,0.35)] active:scale-[0.98]"
              >
                <Flame className="w-5 h-5 fill-black" />
                <span>FLIP TO DOUBLE (2X)</span>
              </button>
            )}

            {isWon && (
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={cashOut}
                  disabled={isFlipping}
                  className="py-4 rounded-xl font-black text-sm flex items-center justify-center gap-1.5 bg-vaultBg hover:bg-vaultBorder border border-emeraldWin/50 text-emeraldWin transition-all shadow-[0_0_20px_rgba(0,240,146,0.2)] active:scale-[0.98]"
                >
                  <span>CASH OUT ({currentPot})</span>
                </button>

                <button
                  onClick={doubleDown}
                  disabled={isFlipping}
                  className="py-4 rounded-xl font-black text-sm flex items-center justify-center gap-1.5 bg-goldAccent hover:bg-[#E5C100] text-black transition-all shadow-[0_0_25px_rgba(255,215,0,0.4)] active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>DOUBLE DOWN ({nextMultiplier}X)</span>
                </button>
              </div>
            )}

            {isFlipping && (
              <div className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-vaultPanel border border-goldAccent/40 text-goldAccent animate-pulse">
                <span className="w-3 h-3 rounded-full bg-goldAccent animate-ping" />
                <span>COIN IS IN THE AIR...</span>
              </div>
            )}

            {isBusted && (
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setShowCertificate(true)}
                  className="py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-vaultBg hover:bg-vaultBorder border border-vaultBorder text-white transition-all"
                >
                  <span>VIEW CERTIFICATE</span>
                </button>

                <button
                  onClick={resetRun}
                  className="py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 bg-crimsonBust hover:bg-red-600 text-white transition-all shadow-[0_0_20px_rgba(255,51,68,0.3)] active:scale-[0.98]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>PLAY AGAIN</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Certificate Diagnostic Modal */}
      <GreedCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        summary={activeRunSummary}
        onPlayAgain={resetRun}
      />

      {/* 4. Token & Pump.fun Banner */}
      <TokenBanner />
    </main>
  );
}
