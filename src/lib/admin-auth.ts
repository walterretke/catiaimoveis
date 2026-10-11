// Login do painel: uma senha (variável ADMIN_PASSWORD) e um cookie assinado.
// Trocar a senha na Vercel derruba todas as sessões abertas.

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_session";
const DURACAO_S = 60 * 60 * 24 * 30; // 30 dias

function segredo(): string | undefined {
  const senha = process.env.ADMIN_PASSWORD;
  return senha ? createHash("sha256").update(`catia-admin:${senha}`).digest("hex") : undefined;
}

function assinar(valor: string, chave: string): string {
  return createHmac("sha256", chave).update(valor).digest("base64url");
}

function iguais(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export const adminConfigurado = () => !!process.env.ADMIN_PASSWORD;

export function senhaCorreta(tentativa: string): boolean {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha) return false;
  // compara hashes para não vazar o tamanho da senha
  const h = (s: string) => createHash("sha256").update(s).digest("hex");
  return iguais(h(tentativa), h(senha));
}

export async function criarSessao(): Promise<void> {
  const chave = segredo();
  if (!chave) throw new Error("ADMIN_PASSWORD não configurada");
  const expira = String(Math.floor(Date.now() / 1000) + DURACAO_S);
  (await cookies()).set(COOKIE, `${expira}.${assinar(expira, chave)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_S,
  });
}

export async function encerrarSessao(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const chave = segredo();
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!chave || !valor) return false;
  const [expira, assinatura] = valor.split(".");
  if (!expira || !assinatura || Number(expira) < Date.now() / 1000) return false;
  return iguais(assinatura, assinar(expira, chave));
}

/** Use no topo de toda página e Server Action do painel. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
