# 👑 $GREED — 3D Escalation Vault & 3-Minute Holder Lottery

[![Website](https://img.shields.io/badge/Live%20App-greed--vault.pages.dev-FFD700?style=for-the-badge&logo=cloudflare)](https://greed-vault.pages.dev)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-00F092?style=for-the-badge&logo=solana)](https://solscan.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-cyan?style=for-the-badge)](LICENSE)

> Interactive 3D WebGL Escalation Vault (`1X ➔ 64X`) & Automated 3-Minute Holder Reward Lottery powered by Pump.fun creator fees and voluntary tributes on Solana.

---

## 🌟 Core Features

### 1. 3-Minute Automated Holder Lottery
- **Continuous Epochs**: Every 180 seconds, token holder accounts are snapshotted via Solana RPC.
- **Balance-Weighted Drawing**: Every token counts as one lottery ticket (`1 $GREED = 1 Ticket`). Whales have proportional probability, but every holder participates with zero lockups or staking fees.
- **Vault Pool**: Trading creator fees and community tributes accumulate directly into the reward vault.
- **Instant Cashout**: Winners receive payouts directly to their wallets with 1-click cashout support and Solscan transaction tracking.

### 2. 3D Escalation Vault (`doubleornothing.fun`)
- Real-time Three.js WebGL procedural gold challenge coin with physics flips.
- High-stakes ladder: `1X ➔ 2X ➔ 4X ➔ 8X ➔ 16X ➔ 32X ➔ 64X` (or BUST).
- Procedural Web Audio synthesizer (no external audio files, sub-bass impact, cascading chimes, bronze gong).
- Viral Greed Evaluation Biometric Cards with 1-click PNG export and pre-formatted tweet generation.

### 3. Multi-Wallet Solana Support
- Integrated support for **Phantom**, **Jupiter**, **Solflare**, and Solana Standard auto-detection.
- Direct non-custodial voluntary dev tributes and transparent creator wallet allocation.

---

## 🤖 Automated Lottery Runner

The repository includes a standalone, open-source cron runner in `scripts/lottery-runner.ts`:

```bash
# Set environment variables
export SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
export TOKEN_MINT_ADDRESS="<YOUR_TOKEN_MINT>"
export VAULT_PRIVATE_KEY="<BASE58_SECRET_KEY>"

# Run single lottery epoch
npx ts-node scripts/lottery-runner.ts
```

### Selection Formula
$$\text{Win Probability} = \left(\frac{\text{Holder Balance}}{\text{Eligible Circulating Supply}}\right) \times 100$$

Entropy is derived directly from the recent Solana confirmed blockhash, ensuring provably fair winner selection.

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Compile static production export
npm run build

# Serve static build locally
npm run start
```

---

## 🌐 Deployments

- **Production URL**: [https://greed-vault.pages.dev](https://greed-vault.pages.dev)
- **Repository**: [https://github.com/egg3degg/greed-vault](https://github.com/egg3degg/greed-vault)
- **Network**: Solana Mainnet-Beta

---

## 📄 License
MIT License. Open source and verifiable by the community.
