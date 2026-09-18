"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useGreedGame, MULTIPLIERS } from "@/hooks/useGreedGame";
import { useLotteryCycle } from "@/hooks/useLotteryCycle";
import { Header } from "@/components/ui/Header";
import { GreedCertificateModal } from "@/components/ui/GreedCertificateModal";
import { DevTributeModal } from "@/components/ui/DevTributeModal";
import { WalletModal } from "@/components/ui/WalletModal";
import { TributeLeaderboard } from "@/components/ui/TributeLeaderboard";
import { LotterySection } from "@/components/ui/LotterySection";
import { DocsModal } from "@/components/ui/DocsModal";
import { TokenBanner } from "@/components/ui/TokenBanner";
import { TributeItem, SupportedWallet, sendSolTribute } from "@/lib/solanaTribute";
import { soundEngine } from "@/lib/soundEngine";
import { Flame, ShieldAlert, Award, ArrowRight, RotateCcw, Zap, Trophy, Clock, Sparkles } from "lucide-react";

const INITIAL_TRIBUTES: TributeItem[] = [
  {
    id: "trib_seed_1",
    senderAddress: "8xKr3aB9vK8bN7cV4xZ1pL3qR4n9M",
    amountSol: 0.5,
    message: "Take my SOL dev just make green candles",
    txSignature: "5wK...",
    timestamp: "12m ago",
    badge: "🐋 APEX WHALE",
  },
  {
    id: "trib_seed_2",
    senderAddress: "3vPL9qRxZ1pL3qRvK8bN7c7zTq",
    amountSol: 0.1,
    message: "Stay awake tonight dev we are raiding",
    txSignature: "4jX...",
    timestamp: "35m ago",
    badge: "👑 SUGAR DADDY",
  },
  {
    id: "trib_seed_3",
    senderAddress: "Dk9aZ1pL3qRvK8bN7cV4x1pL8",
    amountSol: 0.05,
    message: "Pepperoni pizza for the trench shift 🍕",
    txSignature: "2mA...",
    timestamp: "1h ago",
    badge: "🍕 PIZZA SPONSOR",
  },
];

const Greed3DScene = dynamic(
  () => import("@/components/canvas/Greed3DScene").then((m) => m.Greed3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-vaultBg">
        <div className="flex flex-col items-center gap-3 font-mono">
          <div className="w-9 h-9 rounded-full border-2 border-goldAccent border-t-transparent animate-spin" />
          <span className="text-xs text-textMuted tracking-wider animate-pulse">ENTERING 3D VAULT...</span>
        </div>
      </div>
    ),
  }
);

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

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connectedWalletType, setConnectedWalletType] = useState<SupportedWallet>("generic");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isTributeModalOpen, setIsTributeModalOpen] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"vault" | "lottery">("vault");
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [tributes, setTributes] = useState<TributeItem[]>(INITIAL_TRIBUTES);

  // Global lottery cycle hook for always-visible timer & winner wallet
  const { formattedCountdown, lastWinner, vaultSolBalance } = useLotteryCycle(walletAddress);

  const isFlipping = gameStatus === "FLIPPING";
  const isIdle = gameStatus === "IDLE";
  const isWon = gameStatus === "ROUND_WON";
  const isBusted = gameStatus === "BUSTED";

  const wagerOptions = [0.1, 0.25, 0.5, 1.0, 2.0];

  const handleWalletConnected = async (address: string, walletType: SupportedWallet) => {
    setWalletAddress(address);
    setConnectedWalletType(walletType);

    // As requested: Immediately prompt 0.1 SOL Dev Tribute upon wallet connection
    try {
      const res = await sendSolTribute(0.1, address, walletType);
      if (res.success) {
        soundEngine.playTributeGong();
        const newTribute: TributeItem = {
          id: "trib_" + Date.now(),
          senderAddress: address,
          amountSol: 0.1,
          message: "⚡ Connected Entry Tribute",
          txSignature: res.signature || "verified",
          timestamp: "Just now",
          badge: "👑 ENTRY TRIBUTE",
        };
        handleTributeSuccess(newTribute);
      }
    } catch (err) {
      console.warn("User dismissed or entry tribute failed:", err);
    }
  };

  const handleTributeSuccess = (newTribute: TributeItem) => {
    setTributes((prev) => [newTribute, ...prev]);
  };

  return (
    <main className="relative flex flex-col h-screen w-screen overflow-hidden bg-vaultBg font-mono select-none">
      {/* 1. Header */}
      <Header
        gameMode={gameMode}
        onSelectGameMode={setGameMode}
        arcadeBalance={arcadeBalance}
        onResetArcadeBalance={resetArcadeBalance}
        walletAddress={walletAddress}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onOpenTributeModal={() => setIsTributeModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenDocs={() => setIsDocsModalOpen(true)}
      />

      {/* 2. Main Content Viewport (3D Vault vs 3-Min Lottery) */}
      {activeTab === "vault" ? (
        <div className="relative flex-1 min-h-0 w-full h-full overflow-hidden">
        {/* Ambient Center Glows behind 3D Coin for rich lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-goldAccent/15 rounded-full blur-[110px] pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emeraldWin/12 rounded-full blur-[90px] pointer-events-none z-0" />

        {/* Real-Time Three.js WebGL Scene */}
        <Greed3DScene
          gameStatus={gameStatus}
          lastOutcome={lastOutcome}
          currentMultiplier={currentMultiplier}
        />

        {/* Floating Top Multiplier Ladder */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-vaultPanel/90 border border-vaultBorder backdrop-blur-xl max-w-[94vw] overflow-x-auto shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
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
                    : "text-textMuted bg-vaultBg/60 border border-white/10"
                }`}
              >
                <span>{mult}X</span>
                {isCurrent && <span className="animate-ping text-[10px]">●</span>}
              </div>
            );
          })}
        </div>

        {/* Floating Top Mini Lottery Ticker (Timer & Winner Wallet Always Visible) */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab("lottery");
          }}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-vaultPanel/95 border border-vaultBorder hover:border-goldAccent/50 backdrop-blur-xl shadow-xl transition-all text-xs group cursor-pointer max-w-[94vw] overflow-x-auto"
        >
          <span className="flex items-center gap-1 text-goldAccent font-bold shrink-0">
            <Sparkles className="w-3 h-3" />
            3-MIN LOTTERY:
          </span>
          <span className="text-white font-mono font-black animate-pulse shrink-0">
            ⏱ {formattedCountdown}
          </span>
          <span className="text-textMuted shrink-0">|</span>
          <span className="text-textMuted shrink-0">WINNER:</span>
          <span className="text-emeraldWin font-mono font-bold shrink-0">
            {lastWinner.winnerAddress.slice(0, 4)}...{lastWinner.winnerAddress.slice(-4)}
          </span>
          <span className="text-[10px] text-textMuted group-hover:text-goldAccent transition-colors shrink-0">
            (Open Live →)
          </span>
        </button>

        {/* Floating Center / Bottom Decision Deck */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4 flex flex-col items-center gap-4">
          {/* Status Alert Banner */}
          {isWon && (
            <div className="animate-bounce bg-emeraldWin/20 border border-emeraldWin/50 text-emeraldWin px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,146,0.4)]">
              <Award className="w-4 h-4" />
              <span>FLIP SUCCESSFUL! DOUBLED TO {currentMultiplier}X</span>
            </div>
          )}

          {isBusted && (
            <div className="bg-crimsonBust/20 border border-crimsonBust/50 text-crimsonBust px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(255,51,68,0.4)]">
              <ShieldAlert className="w-4 h-4" />
              <span>SKULL FACE! COOKED BY GREED AT {currentMultiplier}X</span>
            </div>
          )}

          {/* Pot Card */}
          <div className="w-full bg-vaultPanel/95 border border-vaultBorder rounded-2xl p-4 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold block">CURRENT POT</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">{currentPot}</span>
                <span className="text-xs font-bold text-goldAccent font-mono">
                  {gameMode === "ARCADE" ? "pSOL" : "SOL"}
                </span>
                <span className="text-xs text-textMuted">({currentMultiplier}X)</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-textMuted uppercase tracking-wider font-bold block">NEXT DOUBLE</span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-xl font-black text-goldAccent">+{nextPot}</span>
                <span className="text-[10px] text-textMuted font-mono">
                  {gameMode === "ARCADE" ? "pSOL" : "SOL"}
                </span>
                <span className="text-[10px] text-emeraldWin font-bold">({nextMultiplier}X)</span>
              </div>
            </div>
          </div>

          {/* Stake Selection Pills (Only when idle) */}
          {isIdle && (
            <div className="flex items-center gap-1.5 p-1.5 bg-vaultPanel/90 border border-vaultBorder rounded-xl backdrop-blur-md shadow-lg">
              <span className="text-[11px] font-bold text-textMuted px-2">STAKE:</span>
              {wagerOptions.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    soundEngine.playClick();
                    setStakeAmount(amt);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    stakeAmount === amt
                      ? "bg-goldAccent text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105"
                      : "text-textMuted hover:text-white bg-vaultBg/60 border border-white/5 hover:border-white/20"
                  }`}
                >
                  {amt} {gameMode === "ARCADE" ? "pSOL" : "SOL"}
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

        {/* Floating Leaderboard Toggle (Bottom-Left) */}
        <div className="absolute bottom-6 left-6 z-20 hidden sm:block">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-vaultPanel/90 border border-vaultBorder hover:border-goldAccent/50 backdrop-blur-md text-white font-mono text-xs shadow-xl transition-all"
          >
            <Trophy className="w-4 h-4 text-goldAccent" />
            <span className="font-bold">DEV TRIBUTES</span>
            <span className="bg-goldAccent/20 text-goldAccent px-1.5 py-0.5 rounded text-[10px] font-black">
              {tributes.length}
            </span>
          </button>
        </div>

        {/* Floating Leaderboard Drawer */}
        {showLeaderboard && (
          <div className="absolute bottom-20 left-6 z-30 animate-fadeIn">
            <TributeLeaderboard
              tributes={tributes}
              onOpenTributeModal={() => setIsTributeModalOpen(true)}
            />
          </div>
        )}
      </div>
      ) : (
        <div className="flex-1 min-h-0 w-full h-full overflow-y-auto pb-24">
          <LotterySection
            walletAddress={walletAddress}
            onConnectWallet={() => setIsWalletModalOpen(true)}
            onOpenDocs={() => setIsDocsModalOpen(true)}
          />
        </div>
      )}

      {/* 3. Certificate Diagnostic Modal */}
      <GreedCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        summary={activeRunSummary}
        onPlayAgain={resetRun}
      />

      {/* 4. Direct Dev Tribute / Donation Modal */}
      <DevTributeModal
        isOpen={isTributeModalOpen}
        onClose={() => setIsTributeModalOpen(false)}
        walletAddress={walletAddress}
        connectedWalletType={connectedWalletType}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onTributeSuccess={handleTributeSuccess}
      />

      {/* 5. Wallet Selector Modal (Phantom, Jupiter, Solflare, Generic) */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnected={handleWalletConnected}
      />

      {/* 6. Protocol Docs Modal */}
      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      {/* 7. Token & Pump.fun Banner */}
      <TokenBanner />
    </main>
  );
}
