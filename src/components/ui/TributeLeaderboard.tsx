"use client";

import React from "react";
import { TributeItem } from "@/lib/solanaTribute";
import { Trophy, Flame, ExternalLink, Sparkles, Heart } from "lucide-react";

interface TributeLeaderboardProps {
  tributes: TributeItem[];
  onOpenTributeModal: () => void;
}

export function TributeLeaderboard({ tributes, onOpenTributeModal }: TributeLeaderboardProps) {
  const totalSolDonated = tributes.reduce((acc, curr) => acc + curr.amountSol, 0);

  return (
    <div className="w-full max-w-lg bg-vaultPanel/85 border border-vaultBorder rounded-2xl p-4 backdrop-blur-xl shadow-2xl font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-vaultBorder pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-goldAccent" />
          <span className="font-black text-white text-sm">DEV TRIBUTE LEADERBOARD</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] bg-goldAccent/10 border border-goldAccent/30 px-2 py-0.5 rounded-lg text-goldAccent font-bold">
          <span>RAISED:</span>
          <span>{totalSolDonated.toFixed(2)} SOL</span>
        </div>
      </div>

      {/* Top 3 High Donors */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {tributes.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-vaultBg/60 border border-vaultBorder hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                idx === 0 ? "bg-goldAccent text-black" : idx === 1 ? "bg-gray-300 text-black" : "bg-[#CD7F32] text-black"
              }`}>
                {idx + 1}
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white truncate max-w-[100px] sm:max-w-[130px]">
                    {item.senderAddress.slice(0, 4)}...{item.senderAddress.slice(-4)}
                  </span>
                  <span className="text-[9px] bg-white/5 border border-white/10 px-1 py-0.2 rounded text-textMuted shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate italic max-w-[180px] sm:max-w-[240px]">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-black text-goldAccent text-sm block">
                +{item.amountSol} SOL
              </span>
              <span className="text-[9px] text-textMuted block">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA to Donate */}
      <div className="mt-3 pt-3 border-t border-vaultBorder flex items-center justify-between">
        <span className="text-[11px] text-textMuted">Want your name etched here?</span>
        <button
          onClick={onOpenTributeModal}
          className="px-3 py-1.5 rounded-xl bg-goldAccent hover:bg-[#E5C100] text-black font-extrabold flex items-center gap-1.5 text-xs transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
        >
          <Flame className="w-3.5 h-3.5 fill-black" />
          <span>FEED THE DEV</span>
        </button>
      </div>
    </div>
  );
}
