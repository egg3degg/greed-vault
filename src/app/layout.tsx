import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://doubleornothing.fun"),
  title: "$GREED | Double or Nothing 3D Vault",
  description:
    "How greedy are you really? High-stakes 3D escalation vault on Solana. Double your bag up to 64x or get cooked by greed.",
  openGraph: {
    title: "$GREED | Double or Nothing 3D Vault",
    description: "Double your bag up to 64x or get cooked by greed.",
    images: ["/og-greed.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "$GREED | Double or Nothing 3D Vault",
    description: "Double your bag up to 64x or get cooked by greed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-vaultBg text-textLight min-h-screen antialiased selection:bg-goldAccent selection:text-black">
        {children}
      </body>
    </html>
  );
}
