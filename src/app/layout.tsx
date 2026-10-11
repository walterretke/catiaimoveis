import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { CORRETORA, SITE_NAME, siteUrl } from "@/content/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} | Corretora em Jaraguá do Sul`,
    template: `%s | ${CORRETORA.nome}`,
  },
  description: CORRETORA.bio,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    images: ["/imoveis/corretora/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1a2b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
