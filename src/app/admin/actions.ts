"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { slugify, type Imovel } from "@/content/imoveis";
import { normalizeImovel } from "@/lib/imovel-normalize";
import {
  criarSessao,
  encerrarSessao,
  requireAdmin,
  senhaCorreta,
} from "@/lib/admin-auth";
import { IMOVEIS_TAG, desfazerUltima, lerImoveis, salvarImoveis, storageDisponivel } from "@/lib/store";

export type ActionResult = { ok: true; slug?: string } | { ok: false; erro: string };

const SEM_STORAGE =
  "O armazenamento não está configurado. Conecte um Blob Store (público) ao projeto na Vercel.";

function publicar() {
  updateTag(IMOVEIS_TAG);
  revalidatePath("/", "layout");
}

async function alterar(fn: (lista: Imovel[]) => Imovel[] | string): Promise<ActionResult> {
  await requireAdmin();
  if (!storageDisponivel()) return { ok: false, erro: SEM_STORAGE };
  const resultado = fn(await lerImoveis());
  if (typeof resultado === "string") return { ok: false, erro: resultado };
  await salvarImoveis(resultado);
  publicar();
  return { ok: true };
}

// ---------- login ----------

export async function login(_: unknown, form: FormData): Promise<{ erro?: string }> {
  const senha = String(form.get("senha") ?? "");
  if (!senhaCorreta(senha)) {
    await new Promise((r) => setTimeout(r, 800)); // freia tentativas em série
    return { erro: "Senha incorreta." };
  }
  await criarSessao();
  redirect("/admin");
}

export async function logout() {
  await encerrarSessao();
  redirect("/admin/login");
}

// ---------- imóveis ----------

/** `slugOriginal` vazio = imóvel novo. */
export async function salvarImovel(dados: unknown, slugOriginal: string): Promise<ActionResult> {
  const norm = normalizeImovel(dados);
  if (!norm.ok) return norm;
  const novo = norm.imovel;

  const res = await alterar((lista) => {
    const conflito = lista.find((i) => i.slug === novo.slug && i.slug !== slugOriginal);
    if (conflito) return `Já existe um imóvel com o endereço "/${novo.slug}".`;
    const idx = lista.findIndex((i) => i.slug === slugOriginal);
    if (slugOriginal && idx >= 0) return lista.map((i, n) => (n === idx ? novo : i));
    return [novo, ...lista]; // novo aparece primeiro na home
  });
  return res.ok ? { ok: true, slug: novo.slug } : res;
}

export async function excluirImovel(slug: string): Promise<ActionResult> {
  return alterar((lista) => lista.filter((i) => i.slug !== slug));
}

export async function moverImovel(slug: string, direcao: -1 | 1): Promise<ActionResult> {
  return alterar((lista) => {
    const i = lista.findIndex((x) => x.slug === slug);
    const j = i + direcao;
    if (i < 0 || j < 0 || j >= lista.length) return lista;
    const nova = [...lista];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    return nova;
  });
}

export async function alterarStatus(slug: string, status: Imovel["status"]): Promise<ActionResult> {
  return alterar((lista) => lista.map((i) => (i.slug === slug ? { ...i, status } : i)));
}

export async function duplicarImovel(slug: string): Promise<ActionResult> {
  let novoSlug = "";
  const res = await alterar((lista) => {
    const original = lista.find((i) => i.slug === slug);
    if (!original) return "Imóvel não encontrado.";
    let n = 2;
    do novoSlug = slugify(`${original.slug}-${n++}`);
    while (lista.some((i) => i.slug === novoSlug));
    const copia: Imovel = { ...structuredClone(original), slug: novoSlug, status: "oculto", nome: `${original.nome} (cópia)` };
    delete copia.ogImage;
    const idx = lista.indexOf(original);
    return [...lista.slice(0, idx + 1), copia, ...lista.slice(idx + 1)];
  });
  return res.ok ? { ok: true, slug: novoSlug } : res;
}

export async function desfazer(): Promise<ActionResult> {
  await requireAdmin();
  if (!storageDisponivel()) return { ok: false, erro: SEM_STORAGE };
  if (!(await desfazerUltima())) return { ok: false, erro: "Nada para desfazer." };
  publicar();
  return { ok: true };
}
