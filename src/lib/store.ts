// Armazenamento dos imóveis e das fotos enviadas pelo painel.
//
// Produção (Vercel): Vercel Blob — exige a variável BLOB_READ_WRITE_TOKEN,
// criada automaticamente ao conectar um Blob Store (público) ao projeto.
// Desenvolvimento local sem token: arquivos em `.data/` e `public/uploads/`.
//
// Cada salvamento grava uma NOVA versão do JSON (nunca sobrescreve). A leitura
// pega a mais recente; isso evita cache de CDN servindo dado velho e dá
// histórico para "desfazer".

import { list, put, del } from "@vercel/blob";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { unstable_cache } from "next/cache";
import type { Imovel } from "@/content/imoveis";
import { SEED_IMOVEIS } from "@/content/imoveis-seed";

export const IMOVEIS_TAG = "imoveis";

const VERSAO_PREFIX = "data/imoveis-";
const MAX_VERSOES = 30;

// Token de leitura/escrita ou, nas conexões novas da Vercel, BLOB_STORE_ID + OIDC.
const temBlob = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** `false` quando está na Vercel sem Blob configurado (painel não consegue salvar). */
export function storageDisponivel(): boolean {
  return temBlob() || !process.env.VERCEL;
}

interface Versao {
  id: string; // ex.: "2026-10-11T18-20-00-000Z"
  ref: string; // URL (blob) ou caminho do arquivo (local)
}

// ---------- backend: Vercel Blob ----------

async function blobVersoes(): Promise<Versao[]> {
  const versoes: Versao[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: VERSAO_PREFIX, cursor, limit: 1000 });
    for (const b of res.blobs) {
      versoes.push({ id: b.pathname.slice(VERSAO_PREFIX.length).replace(/\.json$/, ""), ref: b.url });
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return versoes.sort((a, b) => b.id.localeCompare(a.id));
}

// ---------- backend: arquivos locais (dev) ----------

const LOCAL_DIR = path.join(process.cwd(), ".data", "versoes");

async function localVersoes(): Promise<Versao[]> {
  try {
    const files = await readdir(LOCAL_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => ({ id: f.replace(/^imoveis-|\.json$/g, ""), ref: path.join(LOCAL_DIR, f) }))
      .sort((a, b) => b.id.localeCompare(a.id));
  } catch {
    return [];
  }
}

// ---------- API ----------

async function versoes(): Promise<Versao[]> {
  return temBlob() ? blobVersoes() : localVersoes();
}

async function lerVersao(v: Versao): Promise<Imovel[]> {
  if (temBlob()) {
    const res = await fetch(v.ref, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao ler dados (${res.status})`);
    return res.json();
  }
  return JSON.parse(await readFile(v.ref, "utf8"));
}

/** Leitura sem cache (painel). Sem nenhuma versão salva, usa os imóveis iniciais. */
export async function lerImoveis(): Promise<Imovel[]> {
  if (!storageDisponivel()) return SEED_IMOVEIS;
  const [atual] = await versoes();
  return atual ? lerVersao(atual) : SEED_IMOVEIS;
}

/** Leitura com cache (site público). Invalidada pelo painel a cada salvamento. */
export const getImoveis = unstable_cache(lerImoveis, ["imoveis"], { tags: [IMOVEIS_TAG] });

export async function getImovel(slug: string): Promise<Imovel | undefined> {
  return (await getImoveis()).find((i) => i.slug === slug);
}

export async function salvarImoveis(imoveis: Imovel[]): Promise<void> {
  const id = new Date().toISOString().replace(/[:.]/g, "-");
  const json = JSON.stringify(imoveis, null, 2);

  if (temBlob()) {
    await put(`${VERSAO_PREFIX}${id}.json`, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365, // imutável: cada versão tem nome único
    });
  } else {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, `imoveis-${id}.json`), json);
  }

  // Mantém só as últimas versões
  const antigas = (await versoes()).slice(MAX_VERSOES);
  if (antigas.length) {
    if (temBlob()) await del(antigas.map((v) => v.ref));
    else await Promise.all(antigas.map((v) => rm(v.ref)));
  }
}

/** Desfaz a última alteração (apaga a versão mais recente). Retorna se havia o que desfazer. */
export async function desfazerUltima(): Promise<boolean> {
  const [atual] = await versoes();
  if (!atual) return false;
  if (temBlob()) await del(atual.ref);
  else await rm(atual.ref);
  return true;
}

export async function quantidadeVersoes(): Promise<number> {
  return storageDisponivel() ? (await versoes()).length : 0;
}

/** Salva uma foto (já redimensionada no navegador) e devolve a URL pública. */
export async function salvarFoto(slug: string, file: Blob, ext: string): Promise<string> {
  const nome = `${slug || "sem-slug"}/${randomUUID().slice(0, 8)}.${ext}`;
  if (temBlob()) {
    const blob = await put(`fotos/${nome}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
    });
    return blob.url;
  }
  const destino = path.join(process.cwd(), "public", "uploads", nome);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${nome}`;
}
