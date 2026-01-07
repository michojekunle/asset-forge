import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { wagmiConfig } from "@/config/wagmi";

export const metadata: Metadata = {
  title: "Asset Forge | RWA Creator Studio",
  description: "Create and deploy tokenized real-world assets on Mantle. No blockchain expertise required. Launch RWA tokens in minutes with our intuitive no-code platform.",
  keywords: ["RWA", "real world assets", "tokenization", "Mantle", "blockchain", "DeFi", "crypto"],
  authors: [{ name: "Asset Forge Team" }],
  openGraph: {
    title: "Asset Forge | RWA Creator Studio",
    description: "Create and deploy tokenized real-world assets on Mantle in minutes.",
    type: "website",
    locale: "en_US",
    siteName: "Asset Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asset Forge | RWA Creator Studio",
    description: "Create and deploy tokenized real-world assets on Mantle in minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    (await headers()).get("cookie")
  );

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers initialState={initialState}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-24 lg:pt-28">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
