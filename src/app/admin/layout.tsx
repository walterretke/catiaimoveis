import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Painel | Cátia Manske Imóveis" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-sand text-ink">{children}</div>;
}
