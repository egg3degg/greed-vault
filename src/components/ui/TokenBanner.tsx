"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles, Send } from "lucide-react";

export function TokenBanner() {
  const tokenCA = process.env.NEXT_PUBLIC_TOKEN_MINT || "GreedVaU1tS01anaMainnetChA11engeC01nPump";
  const pumpUrl = process.env.NEXT_PUBLIC_PUMPFUN_URL || "https://pump.fun";
  const tgUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/GreedVaultSol";
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCA = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tokenCA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="w-full border-t border-vaultBorder bg-vaultBg/90 backdrop-blur-md px-4 py-2.5 z-30">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        {/* Token CA pill */}
        <div className="flex items-center gap-2 bg-vaultPanel border border-vaultBorder px-3 py-1.5 rounded-xl">
          <span className="text-goldAccent font-black">CA:</span>
          <span className="text-gray-300 truncate max-w-[180px] sm:max-w-[280px]">
            {tokenCA}
          </span>
          <button
            onClick={handleCopyCA}
            className="p-1 hover:text-white text-textMuted transition-colors ml-1"
            title="Copy Contract Address"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emeraldWin" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <a
            href={pumpUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-goldAccent hover:bg-[#E5C100] text-black font-extrabold transition-all text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Pump.fun Coin</span>
          </a>

          <a
            href={`https://dexscreener.com/solana/${tokenCA}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vaultPanel border border-vaultBorder text-gray-300 hover:text-white hover:bg-vaultBorder transition-all text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Chart</span>
          </a>

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
