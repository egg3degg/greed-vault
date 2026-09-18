import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const DEV_WALLET =
  process.env.NEXT_PUBLIC_TREASURY_WALLET || "CKgNyTVoGGiAqwjbFi2K6NZUqiMPCmhzi6CDFwuD6CBV";

export const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

export type SupportedWallet = "phantom" | "jupiter" | "solflare" | "generic";

export interface SolanaWalletProvider {
  publicKey?: { toString: () => string };
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect?: () => Promise<void>;
  signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
  isPhantom?: boolean;
  isJupiter?: boolean;
  isSolflare?: boolean;
}

export interface TributeItem {
  id: string;
  senderAddress: string;
  amountSol: number;
  message: string;
  txSignature: string;
  timestamp: string;
  badge: string;
}

/**
 * Detects and retrieves the appropriate Solana wallet provider from the browser window
 */
export function getWalletProvider(type: SupportedWallet = "generic"): SolanaWalletProvider | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    phantom?: { solana?: SolanaWalletProvider };
    solflare?: SolanaWalletProvider;
    jupiter?: SolanaWalletProvider;
    solana?: SolanaWalletProvider;
  };

  if (type === "phantom") {
    if (win.phantom?.solana) return win.phantom.solana;
    if (win.solana?.isPhantom) return win.solana;
  } else if (type === "solflare") {
    if (win.solflare) return win.solflare;
    if (win.solana?.isSolflare) return win.solana;
  } else if (type === "jupiter") {
    if (win.jupiter) return win.jupiter;
    if (win.solana?.isJupiter) return win.solana;
  }

  // Fallback / generic detection
  return win.phantom?.solana || win.solflare || win.jupiter || win.solana || null;
}

/**
 * Connect to the specified Solana wallet provider
 */
export async function connectSolanaWallet(
  type: SupportedWallet
): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    const provider = getWalletProvider(type);
    if (!provider) {
      const name = type === "phantom" ? "Phantom" : type === "jupiter" ? "Jupiter" : type === "solflare" ? "Solflare" : "Solana";
      return {
        success: false,
        error: `${name} wallet not detected. Please install the extension or open in a Web3 browser.`,
      };
    }

    const res = await provider.connect();
    const address = res.publicKey ? res.publicKey.toString() : "";
    return { success: true, address };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`Failed to connect ${type} wallet:`, err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Executes a transparent SOL tribute/donation transaction via connected Solana wallet
 */
export async function sendSolTribute(
  amountSol: number,
  senderPublicKeyStr: string,
  walletType: SupportedWallet = "generic"
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    const provider = getWalletProvider(walletType);
    if (!provider) {
      throw new Error("No connected Solana wallet detected.");
    }

    const connection = new Connection(RPC_URL, "confirmed");
    const senderPubkey = new PublicKey(senderPublicKeyStr);
    const devPubkey = new PublicKey(DEV_WALLET);

    const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
    if (lamports <= 0) {
      throw new Error("Invalid tribute amount.");
    }

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

    const transaction = new Transaction({
      feePayer: senderPubkey,
      recentBlockhash: blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: senderPubkey,
        toPubkey: devPubkey,
        lamports,
      })
    );

    const { signature } = await provider.signAndSendTransaction(transaction);

    // Confirm transaction in the background
    connection
      .confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      )
      .catch((err) => console.warn("Background confirmation warning:", err));

    return { success: true, signature };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Tribute failed:", err);
    return { success: false, error: errorMsg };
  }
}
