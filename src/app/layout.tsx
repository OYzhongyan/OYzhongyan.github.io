import type { Metadata } from "next";
import { Newsreader, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { MathJaxProvider } from "@/components/ui/MathJaxProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${siteConfig.title} · ${siteConfig.author.displayName}`,
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.displayName }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} ${mono.variable} font-sans`}>
        <ThemeProvider>
          <MathJaxProvider />
          <Navigation />
          <main className="pt-16 lg:pt-20 min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
