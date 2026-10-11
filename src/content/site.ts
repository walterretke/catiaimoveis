export const CORRETORA = {
  nome: "Cátia Manske",
  creci: "66755-F",
  telefone: "(47) 99617-4283",
  whatsapp: "5547996174283",
  instagram: "https://www.instagram.com/corretoracatiamanske",
  instagramHandle: "@corretoracatiamanske",
  foto: "/imoveis/corretora/catia.webp",
  rede: "Domus Corretores Associados",
  bio: "Especialista em realizar sonhos em Jaraguá do Sul. Minha missão é encontrar o lar perfeito que se encaixe no seu momento de vida.",
  endereco: ["Rua Roberto Ziemann, 1787 - Sala 03", "Amizade - Jaraguá do Sul/SC"],
  cnpj: "57.154.695/0001-83",
} as const;

export const SITE_NAME = `${CORRETORA.nome} Imóveis`;

/** URL pública do site (para sitemap, OG e JSON-LD). */
export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}
