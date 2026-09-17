import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const DEV_WALLET =
  process.env.NEXT_PUBLIC_TREASURY_WALLET || "CKgNyTVoGGiAqwjbFi2K6NZUqiMPCmhzi6CDFwuD6CBV";

export const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

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
 * Executes a transparent SOL tribute/donation transaction via connected Phantom wallet
 */
export async function sendSolTribute(
  amountSol: number,
  senderPublicKeyStr: string
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    if (typeof window === "undefined" || !(window as unknown as { solana?: { isPhantom?: boolean } }).solana) {
      throw new Error("Phantom wallet not detected. Please install Phantom to send tribute.");
    }

    const solana = (window as unknown as {
      solana: {
        isPhantom?: boolean;
        signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
      };
    }).solana;

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

    const { signature } = await solana.signAndSendTransaction(transaction);

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
