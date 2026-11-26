// Servidor MCP mínimo (JSON-RPC sobre HTTP, sem estado), sem dependências.
//
// Implementa o necessário do transporte "Streamable HTTP" para o Claude usar
// como conector personalizado: initialize, ping, tools/list e tools/call.
// Cada POST é independente (sem sessão), e a resposta é sempre JSON.

export interface ToolResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

export interface Tool {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  run: (args: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ServerInfo {
  name: string;
  version: string;
  instructions?: string;
}

type Id = string | number | null;

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: Id;
  method: string;
  params?: Record<string, unknown>;
}

export const PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

export const texto = (text: string, isError = false): ToolResult => ({
  content: [{ type: "text", text }],
  ...(isError && { isError: true }),
});

const erro = (id: Id, code: number, message: string) => ({ jsonrpc: "2.0" as const, id, error: { code, message } });
const ok = (id: Id, result: unknown) => ({ jsonrpc: "2.0" as const, id, result });

function isRequest(m: unknown): m is JsonRpcRequest {
  return !!m && typeof m === "object" && (m as JsonRpcRequest).jsonrpc === "2.0" && typeof (m as JsonRpcRequest).method === "string";
}

async function handleOne(msg: unknown, tools: Tool[], info: ServerInfo) {
  if (!isRequest(msg)) return erro(null, -32600, "Invalid Request");
  // Notificações (sem id) não têm resposta.
  if (msg.id === undefined) return undefined;
  const { id, method, params = {} } = msg;

  switch (method) {
    case "initialize": {
      const pedida = typeof params.protocolVersion === "string" ? params.protocolVersion : "";
      return ok(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(pedida) ? pedida : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: info.name, version: info.version },
        ...(info.instructions && { instructions: info.instructions }),
      });
    }
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, {
        tools: tools.map(({ name, title, description, inputSchema, annotations }) => ({
          name,
          ...(title && { title }),
          description,
          inputSchema,
          ...(annotations && { annotations }),
        })),
      });
    case "tools/call": {
      const tool = tools.find((t) => t.name === params.name);
      if (!tool) return erro(id, -32602, `Ferramenta desconhecida: ${String(params.name)}`);
      const args = params.arguments && typeof params.arguments === "object" ? (params.arguments as Record<string, unknown>) : {};
      try {
        return ok(id, await tool.run(args));
      } catch (e) {
        // Erro da ferramenta vai como resultado, para o Claude poder explicar ao usuário.
        return ok(id, texto(`Erro: ${e instanceof Error ? e.message : String(e)}`, true));
      }
    }
    default:
      return erro(id, -32601, `Método não suportado: ${method}`);
  }
}

/** Processa o corpo de um POST. `undefined` = só notificações (responder 202). */
export async function handleMcp(body: unknown, tools: Tool[], info: ServerInfo): Promise<unknown> {
  if (Array.isArray(body)) {
    const res = (await Promise.all(body.map((m) => handleOne(m, tools, info)))).filter(Boolean);
    return res.length ? res : undefined;
  }
  return handleOne(body, tools, info);
}
