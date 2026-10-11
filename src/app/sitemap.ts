import type { MetadataRoute } from "next";
import { IMOVEIS } from "@/content/imoveis";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: base, priority: 1 },
    ...IMOVEIS.map((i) => ({ url: `${base}/${i.slug}`, priority: i.status === "disponivel" ? 0.9 : 0.3 })),
    { url: `${base}/privacidade`, priority: 0.1 },
  ];
}
