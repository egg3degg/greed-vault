"use client";

import React, { useRef, useState } from "react";
import { RunSummary } from "@/hooks/useGreedGame";
import { Download, Share2, RefreshCw, X, ShieldAlert, Trophy, Skull } from "lucide-react";

interface GreedCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: RunSummary | null;
  onPlayAgain: () => void;
}

export function GreedCertificateModal({
  isOpen,
  onClose,
  summary,
  onPlayAgain,
}: GreedCertificateModalProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen || !summary) return null;

  const isWin = summary.outcome === "CASHED_OUT";

  /**
   * Render high-resolution 1200x675 certificate image to Canvas and download
   */
  const handleDownloadPNG = () => {
    setIsExporting(true);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // 1. Dark Brushed Obsidian Background
    const bgGrad = ctx.createRadialGradient(600, 337, 80, 600, 337, 700);
    bgGrad.addColorStop(0, "#13161F");
    bgGrad.addColorStop(0.7, "#090B0F");
    bgGrad.addColorStop(1, "#040507");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 675);

    // 2. Gold/Crimson Outer Border
    ctx.strokeStyle = isWin ? "#FFD700" : "#FF3344";
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, 1152, 627);

    // Inner hairline border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 1128, 603);

    // 3. Header Stamp
    ctx.fillStyle = isWin ? "#FFD700" : "#FF3344";
    ctx.font = "900 24px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("OFFICIAL PSYCHOLOGICAL EVALUATION — ESCALATION VAULT", 600, 85);

    ctx.fillStyle = "#8E9AA8";
    ctx.font = "14px 'Courier New', monospace";
    ctx.fillText(`PROTOCOL ID: ${summary.id.toUpperCase()} • MODE: ${summary.mode} • ${summary.timestamp}`, 600, 115);

    // 4. Main Rank Display
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText(summary.greedRank, 600, 200);

    // 5. Greed Meter Bar
    const barW = 500;
    const barH = 14;
    const barX = (1200 - barW) / 2;
    const barY = 230;

    ctx.fillStyle = "#1E2430";
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = isWin ? "#00F092" : "#FF3344";
    ctx.fillRect(barX, barY, (barW * summary.greedScore) / 100, barH);

    ctx.fillStyle = "#A0AEC0";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`GREED INDEX: ${summary.greedScore}%`, 600, 275);

    // 6. Metrics Grid
    const col1X = 280;
    const col2X = 600;
    const col3X = 920;
    const statsY = 380;

    // Stat 1: Multiplier
    ctx.fillStyle = "#6B7280";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("PEAK MULTIPLIER", col1X, statsY);
    ctx.fillStyle = "#FFD700";
    ctx.font = "900 48px sans-serif";
    ctx.fillText(`${summary.multiplierAchieved}X`, col1X, statsY + 50);

    // Stat 2: Initial Stake
    ctx.fillStyle = "#6B7280";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("INITIAL WAGER", col2X, statsY);
    ctx.fillStyle = "#E5E7EB";
    ctx.font = "900 48px sans-serif";
    ctx.fillText(`${summary.initialStake} SOL`, col2X, statsY + 50);

    // Stat 3: Final Outcome
    ctx.fillStyle = "#6B7280";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("FINAL PAYOUT", col3X, statsY);
    ctx.fillStyle = isWin ? "#00F092" : "#FF3344";
    ctx.font = "900 48px sans-serif";
    ctx.fillText(isWin ? `+${summary.finalPayout} SOL` : "0.00 SOL", col3X, statsY + 50);

    // 7. Footer Branding
    ctx.fillStyle = "#4B5563";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("$GREED • https://doubleornothing.fun", 600, 585);

    // Trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Greed_Certificate_${summary.greedRank.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();
    setIsExporting(false);
  };

  /**
   * Compose tweet and open Web Intent
   */
  const handleShareOnX = () => {
    const text = isWin
      ? `👑 Just tested my greed in the $GREED 3D Escalation Vault.\n\n` +
        `Rank: ${summary.greedRank} (${summary.greedScore}% Greed Score)\n` +
        `Peak Multiplier: ${summary.multiplierAchieved}X\n` +
        `Final Payout: +${summary.finalPayout} SOL\n\n` +
        `Are you paper hands or can you double down? Test your greed:\n` +
        `https://doubleornothing.fun`
      : `💀 Cooked by greed in the $GREED 3D Escalation Vault.\n\n` +
        `Rank: ${summary.greedRank} (${summary.greedScore}% Greed Score)\n` +
        `Made it to ${summary.multiplierAchieved}X and refused to cash out. Lost everything.\n\n` +
        `Can you walk away or will greed take you too?\n` +
        `https://doubleornothing.fun`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-vaultPanel border border-vaultBorder rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-textMuted hover:text-white rounded-lg transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Header */}
        <div className={`p-6 text-center border-b border-vaultBorder relative ${isWin ? "bg-emeraldWin/10" : "bg-crimsonBust/10"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-white/10 bg-black/40">
            {isWin ? <Trophy className="w-3.5 h-3.5 text-goldAccent" /> : <Skull className="w-3.5 h-3.5 text-crimsonBust" />}
            <span>Diagnostic Certificate #{summary.id.slice(-6)}</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white mb-1">
            {summary.greedRank}
          </h2>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-textMuted">
            <span>GREED LEVEL:</span>
            <span className={`font-bold ${isWin ? "text-emeraldWin" : "text-crimsonBust"}`}>
              {summary.greedScore}%
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="p-3.5 rounded-xl bg-vaultBg border border-vaultBorder">
              <span className="text-[11px] text-textMuted block mb-1">PEAK MULTIPLIER</span>
              <span className="text-2xl font-black text-goldAccent">{summary.multiplierAchieved}X</span>
            </div>

            <div className="p-3.5 rounded-xl bg-vaultBg border border-vaultBorder">
              <span className="text-[11px] text-textMuted block mb-1">INITIAL WAGER</span>
              <span className="text-2xl font-black text-white">{summary.initialStake}</span>
              <span className="text-[10px] text-textMuted ml-1">SOL</span>
            </div>

            <div className="p-3.5 rounded-xl bg-vaultBg border border-vaultBorder">
              <span className="text-[11px] text-textMuted block mb-1">FINAL PAYOUT</span>
              <span className={`text-2xl font-black ${isWin ? "text-emeraldWin" : "text-crimsonBust"}`}>
                {isWin ? `+${summary.finalPayout}` : "0.00"}
              </span>
              <span className="text-[10px] text-textMuted ml-1">SOL</span>
            </div>
          </div>

          {/* Psychological Verdict */}
          <div className="p-4 rounded-xl bg-vaultBg/70 border border-vaultBorder text-center">
            <span className="text-xs text-textMuted uppercase font-mono tracking-wider block mb-1">
              Behavioral Diagnosis
            </span>
            <p className="text-sm font-sans text-gray-200 leading-relaxed italic">
              &ldquo;{summary.outcome === "BUSTED"
                ? "You held a golden bag and stared glory in the face, but the temptation of one more double destroyed the position. The classic degen curse."
                : "Exceptional composure. You defied human greed, locked in the multiple, and stepped away a victor before variance caught up with you."}&rdquo;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="py-3 px-4 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 bg-vaultBg hover:bg-vaultBorder border border-vaultBorder text-white transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Rendering..." : "Download Pass"}</span>
              </button>

              <button
                onClick={handleShareOnX}
                className="py-3 px-4 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white transition-all shadow-[0_0_20px_rgba(29,161,242,0.35)]"
              >
                <Share2 className="w-4 h-4" />
                <span>Flex on X</span>
              </button>
            </div>

            <button
              onClick={() => {
                onPlayAgain();
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl font-extrabold font-mono text-sm flex items-center justify-center gap-2 bg-goldAccent hover:bg-[#E5C100] text-black transition-all shadow-[0_0_25px_rgba(255,215,0,0.3)]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>TEST GREED AGAIN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
