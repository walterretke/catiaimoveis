import { test } from "node:test";
import assert from "node:assert/strict";
import { handleMcp, texto, type Tool } from "./protocol.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Res = Record<string, any>;

const INFO = { name: "teste", version: "1.0.0", instructions: "oi" };
const TOOLS: Tool[] = [
  {
    name: "eco",
    description: "repete",
    inputSchema: { type: "object", properties: { msg: { type: "string" } } },
    run: async (args) => texto(String(args.msg)),
  },
  {
    name: "quebra",
    description: "falha",
    inputSchema: { type: "object" },
    run: async () => {
      throw new Error("deu ruim");
    },
  },
];

const call = (method: string, params?: Record<string, unknown>, id: number | undefined = 1) =>
  handleMcp({ jsonrpc: "2.0", ...(id !== undefined && { id }), method, params }, TOOLS, INFO) as Promise<Res>;

test("initialize devolve a versão pedida quando suportada", async () => {
  const r = await call("initialize", { protocolVersion: "2025-06-18" });
  assert.equal(r.result.protocolVersion, "2025-06-18");
  assert.deepEqual(r.result.serverInfo, { name: "teste", version: "1.0.0" });
  assert.equal(r.result.instructions, "oi");
  assert.ok(r.result.capabilities.tools);
});

test("initialize com versão desconhecida devolve a mais recente", async () => {
  const r = await call("initialize", { protocolVersion: "1999-01-01" });
  assert.equal(r.result.protocolVersion, "2025-11-25");
});

test("notificação não tem resposta", async () => {
  assert.equal(await call("notifications/initialized", undefined, undefined), undefined);
});

test("tools/list não expõe a função run", async () => {
  const r = await call("tools/list");
  assert.equal(r.result.tools.length, 2);
  assert.equal(r.result.tools[0].name, "eco");
  assert.equal("run" in r.result.tools[0], false);
});

test("tools/call executa a ferramenta", async () => {
  const r = await call("tools/call", { name: "eco", arguments: { msg: "olá" } });
  assert.deepEqual(r.result, { content: [{ type: "text", text: "olá" }] });
});

test("erro da ferramenta vira resultado com isError", async () => {
  const r = await call("tools/call", { name: "quebra", arguments: {} });
  assert.equal(r.result.isError, true);
  assert.match(r.result.content[0].text, /deu ruim/);
});

test("ferramenta e método desconhecidos dão erro JSON-RPC", async () => {
  assert.equal((await call("tools/call", { name: "nada" })).error.code, -32602);
  assert.equal((await call("resources/list")).error.code, -32601);
});

test("lote mistura respostas e ignora notificações", async () => {
  const r = (await handleMcp(
    [
      { jsonrpc: "2.0", method: "notifications/initialized" },
      { jsonrpc: "2.0", id: 7, method: "ping" },
    ],
    TOOLS,
    INFO,
  )) as unknown[];
  assert.deepEqual(r, [{ jsonrpc: "2.0", id: 7, result: {} }]);
});

test("mensagem inválida", async () => {
  const r = (await handleMcp({ foo: 1 }, TOOLS, INFO)) as Res;
  assert.equal(r.error.code, -32600);
});
