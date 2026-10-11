import type { MetadataRoute } from "next";
import { isPublicado } from "@/content/imoveis";
import { getImoveis } from "@/lib/store";
import { siteUrl } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  return [
    { url: base, priority: 1 },
    ...(await getImoveis()).filter(isPublicado).map((i) => ({ url: `${base}/${i.slug}`, priority: i.status === "disponivel" ? 0.9 : 0.3 })),
    { url: `${base}/privacidade`, priority: 0.1 },
  ];
}
