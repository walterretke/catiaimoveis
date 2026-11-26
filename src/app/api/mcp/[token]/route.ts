// Conector do Claude (MCP) para os imóveis do site.
//
// URL para adicionar no Claude (Configurações > Conectores > Adicionar conector personalizado):
//   https://<dominio>/api/mcp/<MCP_TOKEN>
//
// O token na URL é a senha do conector: quem tiver a URL consegue alterar os
// imóveis. É separado do ADMIN_PASSWORD; para revogar, troque MCP_TOKEN na Vercel.

import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { handleMcp } from "@/lib/mcp/protocol";
import { IMOVEIS_TOOLS, SERVER_INFO } from "@/lib/mcp/imoveis-tools";

export const dynamic = "force-dynamic";

const TOKEN_MIN = 32;

function tokenValido(recebido: string): boolean {
  const esperado = process.env.MCP_TOKEN;
  if (!esperado || esperado.length < TOKEN_MIN) return false;
  const h = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(recebido), h(esperado));
}

type Ctx = { params: Promise<{ token: string }> };

const naoEncontrado = () => new NextResponse(null, { status: 404 });

export async function POST(request: NextRequest, { params }: Ctx) {
  if (!tokenValido((await params).token)) return naoEncontrado();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 });
  }

  const res = await handleMcp(body, IMOVEIS_TOOLS, SERVER_INFO);
  if (res === undefined) return new NextResponse(null, { status: 202 });
  return NextResponse.json(res, { headers: { "Cache-Control": "no-store" } });
}

// Servidor sem sessão: não há stream de eventos (GET) nem sessão para encerrar (DELETE).
export async function GET(_: NextRequest, { params }: Ctx) {
  if (!tokenValido((await params).token)) return naoEncontrado();
  return new NextResponse(null, { status: 405, headers: { Allow: "POST" } });
}

export const DELETE = GET;
