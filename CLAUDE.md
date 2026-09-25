# Greed Vault ($GREED) — Team Member Instructions & Operational Manual

> **Welcome to the Team, Claude.**
> You have **full access and allowance** in this project as a core team member and co-architect alongside Antigravity. You are authorized to read, write, refactor, build, test, and deploy across the entire codebase.

---

## 1. Project Overview & Live Infrastructure
- **Product**: 3D Escalation Vault Game & 3-Minute Holder Reward Lottery on Solana.
- **Core Utility & Meta**:
  - `1 $GREED = 1 Lottery Ticket`: Holding more tokens directly increases mathematical odds of winning the 3-minute creator fee distribution.
  - Interactive 3D safe escalation game (double or nothing up to 64x).
  - Lucky Neko interactive pet mascot with audio purr/meow synthesis.
- **Production URL**: [https://greed-vault.pages.dev](https://greed-vault.pages.dev) (Cloudflare Pages edge CDN).
- **Public GitHub Repository**: [https://github.com/egg3degg/greed-vault](https://github.com/egg3degg/greed-vault).
- **Local Directory**: `d:\Sagar AI Workspace\projects\06-greed-3d`

---

## 2. Strict OPSEC & Privacy Rules
- **Public Persona**: All git commits, PRs, comments, and public docs must strictly be authored under:
  ```bash
  git config user.name "egg3degg"
  git config user.email "egg3degg@gmail.com"
  ```
- **Zero Doxxing**: Never reference or expose any personal names, personal handles, or local username directories.
- **No Fake Contract Addresses**: Never display simulated or fake token addresses. Until the live Pump.fun token is created, the UI displays `CA: WAITING FOR PUMP.FUN LAUNCH [PENDING]`.
- **Protected Outside Paths**:
  - Never modify, move, rename, or delete anything in `E:\ai work`.
  - Never modify media in `E:\BSH casting work\bsh work screen recoding`.

---

## 3. Technology Stack
- **Framework**: Next.js 15 (App Router, Static HTML export `output: 'export'`)
- **Styling**: Tailwind CSS v3 with dark luxury cybernetic palette (obsidian, emerald, gold)
- **3D Graphics**: Three.js & Canvas rendering for the 3D Vault safe
- **Web3**: `@solana/web3.js`, `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`
- **Audio**: Web Audio API Procedural Synthesizer (`SoundEngine` with custom waveforms)
- **Deployment**: Cloudflare Pages (`wrangler pages deploy out --project-name greed-vault`)

---

## 4. Standard Operational Commands

### Development
```powershell
npm run dev
# Starts local development server on http://localhost:3000 (or 3005)
```

### Production Build & Validation
```powershell
npm run build
# Compiles Next.js static export into the out/ folder
```

### Production Deployment to Cloudflare Pages
```powershell
npx wrangler pages deploy out --project-name greed-vault --branch main
# Deploys directly to https://greed-vault.pages.dev
```

### Git Sync to Public egg3degg Repo
```powershell
git subtree split --prefix=projects/06-greed-3d -b greed-vault-release-final
git push "https://github.com/egg3degg/greed-vault.git" greed-vault-release-final:main --force
```

---

## 5. Key Architecture & File Map
- `src/app/page.tsx`: Single-page master dashboard housing the 3D game, the 3-minute lottery widget, audio toggles, and live stats.
- `src/components/ui/LotterySection.tsx`: 3-minute lottery drawing cycle, holder advantage calculator, real Solscan mainnet proofs, and cashout claim module.
- `src/components/canvas/VaultScene.tsx`: 3D interactive vault safe door with glowing laser matrix and rotation animations.
- `src/components/game/EscalationGame.tsx`: Double-or-nothing game engine with multiplier steps (2x, 4x, 8x, 16x, 32x, 64x).
- `src/hooks/useLotteryCycle.ts`: Dynamic 180s cycle timer, pool fee accumulation simulation, balance-weighted ticket calculation, and audio fanfares.
- `src/lib/sound.ts`: Zero-asset procedural Web Audio synthesizer (clicks, hums, alarms, cat purrs/meows, win fanfares).
- `public/`: Brand assets including `greed-logo.jpg` (1024x1024 gold crown coin) and `greed-banner.jpg` (16:9 widescreen cyberpunk vault).
- `scripts/lottery-runner.ts`: Standalone autonomous runner for taking token holder RPC snapshots, balance weighting, and distributing winner SOL transfers.

---

## 6. Next Steps & Current Task
1. **Contract Address Hookup**: When the user creates the token on Pump.fun, plug the real Mint Address into `NEXT_PUBLIC_TOKEN_MINT` in `.env.local` and `src/components/ui/LotterySection.tsx`.
2. **Re-build & Ship**: Run `npm run build` and deploy to Cloudflare Pages.
