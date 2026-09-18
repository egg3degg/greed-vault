"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles, Send } from "lucide-react";

export function TokenBanner() {
  const tokenCA = process.env.NEXT_PUBLIC_TOKEN_MINT || "";
  const pumpUrl = process.env.NEXT_PUBLIC_PUMPFUN_URL || "https://pump.fun/create";
  const tgUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/GreedVaultSol";
  const [copied, setCopied] = useState<boolean>(false);

  const isCaReady = Boolean(tokenCA && tokenCA !== "WAITING_PUMP_FUN_CA");

  const handleCopyCA = () => {
    if (!isCaReady) {
      alert("Real Contract Address will be published immediately upon Pump.fun launch!");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tokenCA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="w-full border-t border-vaultBorder bg-vaultPanel/90 backdrop-blur-md px-4 py-2.5 z-30">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        {/* Token CA pill */}
        <div className="flex items-center gap-2 bg-vaultBg/80 border border-vaultBorder px-3 py-1.5 rounded-xl">
          <span className="text-goldAccent font-black">CA:</span>
          <span className="text-slate-300 truncate max-w-[180px] sm:max-w-[280px]">
            {isCaReady ? tokenCA : "WAITING FOR PUMP.FUN LAUNCH"}
          </span>
          {isCaReady ? (
            <button
              onClick={handleCopyCA}
              className="p-1 hover:text-white text-textMuted transition-colors ml-1"
              title="Copy Contract Address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emeraldWin" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="text-[10px] bg-goldAccent/15 text-goldAccent px-2 py-0.5 rounded-full border border-goldAccent/30 font-bold animate-pulse">
              PENDING
            </span>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <a
            href={pumpUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-goldAccent hover:bg-[#E5C100] text-black font-extrabold transition-all text-xs shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>{isCaReady ? "Buy on Pump.fun" : "Create Coin on Pump.fun"}</span>
          </a>

          {isCaReady && (
            <a
              href={`https://dexscreener.com/solana/${tokenCA}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vaultBg/80 border border-vaultBorder text-gray-300 hover:text-white hover:bg-vaultBorder transition-all text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Chart</span>
            </a>
          )}

          <a
            href={tgUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-vaultPanel border border-vaultBorder text-gray-300 hover:text-white transition-all"
            title="Telegram Community"
          >
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
