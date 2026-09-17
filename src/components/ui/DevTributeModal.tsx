"use client";

import React, { useState } from "react";
import { DEV_WALLET, sendSolTribute, TributeItem } from "@/lib/solanaTribute";
import { soundEngine } from "@/lib/soundEngine";
import confetti from "canvas-confetti";
import { X, Flame, Coffee, Pizza, Crown, Sparkles, Check, AlertTriangle, ExternalLink } from "lucide-react";

interface DevTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  onConnectWallet: () => Promise<void>;
  onTributeSuccess: (tribute: TributeItem) => void;
}

const TIER_OPTIONS = [
  { amount: 0.01, label: "0.01 SOL", icon: Coffee, title: "Night-Shift Coffee", badge: "☕ COFFEE DONOR" },
  { amount: 0.05, label: "0.05 SOL", icon: Pizza, title: "Trench Pizza", badge: "🍕 PIZZA SPONSOR" },
  { amount: 0.1, label: "0.10 SOL", icon: Crown, title: "Dev's Sugar Daddy", badge: "👑 SUGAR DADDY" },
  { amount: 0.5, label: "0.50 SOL", icon: Flame, title: "Apex Trench Whale", badge: "🐋 APEX WHALE" },
];

export function DevTributeModal({
  isOpen,
  onClose,
  walletAddress,
  onConnectWallet,
  onTributeSuccess,
}: DevTributeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(0.05);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTier = TIER_OPTIONS.find((t) => t.amount === selectedAmount) || TIER_OPTIONS[1];

  const handleSendTribute = async () => {
    soundEngine.playClick();

    if (!walletAddress) {
      await onConnectWallet();
      return;
    }

    setIsSending(true);
    const result = await sendSolTribute(selectedAmount, walletAddress);
    setIsSending(false);

    if (result.success && result.signature) {
      setTxSignature(result.signature);
      soundEngine.playTributeGong();

      // Golden coin shower confetti
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#FFD700", "#FFA500", "#00F092", "#FFFFFF"],
      });

      const newTribute: TributeItem = {
        id: `trib_${Date.now()}`,
        senderAddress: walletAddress,
        amountSol: selectedAmount,
        message: customMessage.trim() || "PUMP IT TO VALHALLA DEV",
        txSignature: result.signature,
        timestamp: new Date().toLocaleTimeString(),
        badge: currentTier.badge,
      };

      onTributeSuccess(newTribute);
    } else {
      alert(`Tribute failed: ${result.error || "User rejected transaction"}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-vaultPanel border border-vaultBorder rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,215,0,0.25)] font-mono">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-textMuted hover:text-white rounded-lg transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 text-center border-b border-vaultBorder bg-gradient-to-b from-goldAccent/15 to-transparent relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-goldAccent/40 bg-black/50 text-goldAccent">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DIRECT DEV TRIBUTE & FLEX SHRINE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
            FEED THE DEV
          </h2>

          <p className="text-xs text-textMuted max-w-sm mx-auto">
            Send real SOL directly to dev wallet <span className="text-goldAccent">{DEV_WALLET.slice(0, 4)}...{DEV_WALLET.slice(-4)}</span> to fund Red Bull, pizza, and chart staring.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="p-6 space-y-5">
          {txSignature ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emeraldWin/20 border-2 border-emeraldWin flex items-center justify-center mx-auto text-emeraldWin">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">TRIBUTE CONFIRMED!</h3>
                <p className="text-xs text-emeraldWin mt-1">
                  You donated {selectedAmount} SOL directly to the dev! Your name is etched onto the Live Leaderboard.
                </p>
              </div>

              <a
                href={`https://solscan.io/tx/${txSignature}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-goldAccent hover:underline"
              >
                <span>View on Solscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setTxSignature(null);
                  onClose();
                }}
                className="w-full py-3 rounded-xl font-bold bg-goldAccent text-black hover:bg-[#E5C100] transition-all"
              >
                CLOSE & RETURN TO VAULT
              </button>
            </div>
          ) : (
            <>
              {/* Tier Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {TIER_OPTIONS.map((tier) => {
                  const Icon = tier.icon;
                  const isSelected = selectedAmount === tier.amount;
                  return (
                    <button
                      key={tier.amount}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedAmount(tier.amount);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-goldAccent/15 border-goldAccent shadow-[0_0_15px_rgba(255,215,0,0.25)]"
                          : "bg-vaultBg/70 border-vaultBorder hover:border-white/20 text-textMuted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-goldAccent" : "text-textMuted"}`} />
                        <span className={`text-xs font-black ${isSelected ? "text-goldAccent" : "text-white"}`}>
                          {tier.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-white block">{tier.title}</span>
                      <span className="text-[9px] text-textMuted block mt-0.5">{tier.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Shoutout Message */}
              <div>
                <label className="text-[11px] text-textMuted block mb-1.5">
                  YOUR LEADERBOARD SHOUTOUT (OPTIONAL):
                </label>
                <input
                  type="text"
                  maxLength={50}
                  placeholder="e.g. Pump it to Valhalla dev"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-vaultBg border border-vaultBorder rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-textMuted focus:outline-none focus:border-goldAccent"
                />
              </div>

              {/* 100% Honest Disclosure */}
              <div className="p-3.5 rounded-xl bg-crimsonBust/10 border border-crimsonBust/30 text-[10px] text-gray-300 leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-crimsonBust shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-crimsonBust block mb-0.5">100% HONEST DEGEN WARNING:</span>
                  This button executes a real voluntary SOL transfer directly to dev address <span className="font-mono text-white font-bold">{DEV_WALLET.slice(0, 6)}...{DEV_WALLET.slice(-6)}</span>. You receive zero financial returns, zero promises, and zero tokens—only pure leaderboard glory.
                </div>
              </div>

              {/* Main Submit Action */}
              <button
                onClick={handleSendTribute}
                disabled={isSending}
                className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-goldAccent hover:bg-[#E5C100] text-black transition-all shadow-[0_0_30px_rgba(255,215,0,0.35)] active:scale-[0.98]"
              >
                {isSending ? (
                  <span className="animate-pulse">CONFIRMING IN PHANTOM...</span>
                ) : (
                  <>
                    <Flame className="w-4 h-4 fill-black" />
                    <span>
                      {walletAddress
                        ? `SEND ${selectedAmount} SOL TRIBUTE TO DEV`
                        : "CONNECT PHANTOM TO TRIBUTE"}
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
