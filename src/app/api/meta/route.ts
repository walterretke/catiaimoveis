import { NextResponse, type NextRequest } from "next/server";

// API de Conversões do Meta (lado servidor). Recebe o mesmo event_id do Pixel
// para o Meta deduplicar. A decisão de QUANDO disparar fica em `src/lib/lead.ts`.
// "Lead" = tem entrada. "SemEntrada" = evento personalizado (não conta como Lead).

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v24.0";
const EVENTOS = new Set(["Lead", "SemEntrada"]);
const ENTRADAS = new Set(["completa", "parcial", "sem-entrada"]);

function str(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.length > 0 && value.length <= max ? value : undefined;
}

export async function POST(request: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return NextResponse.json({ error: "Missing Meta credentials" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId = str(body.event_id, 100);
  const eventUrl = str(body.event_url, 2000);
  const eventName = body.event_name;
  if (
    typeof eventName !== "string" ||
    !EVENTOS.has(eventName) ||
    !eventId ||
    !eventUrl?.startsWith("http")
  ) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const custom = (body.custom_data ?? {}) as Record<string, unknown>;
  const entrada = str(custom.entrada, 20);
  const contentName = str(custom.content_name, 120);

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    undefined;

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_id: eventId,
    event_source_url: eventUrl,
    user_data: {
      client_user_agent:
        str(body.client_user_agent, 1000) ?? request.headers.get("user-agent") ?? undefined,
      client_ip_address: clientIp,
      // Cookies do Pixel (mesma origem, chegam junto no fetch): melhoram a
      // correspondência do evento com quem clicou no anúncio.
      fbp: request.cookies.get("_fbp")?.value,
      fbc: request.cookies.get("_fbc")?.value,
    },
    custom_data: {
      ...(contentName && { content_name: contentName }),
      ...(entrada && ENTRADAS.has(entrada) && { entrada }),
    },
  };

  const payload = {
    data: [event],
    ...(process.env.META_TEST_EVENT_CODE && { test_event_code: process.env.META_TEST_EVENT_CODE }),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Meta Conversions API error:", data);
      return NextResponse.json({ error: "Failed to send event to Meta" }, { status: 502 });
    }
    return NextResponse.json({ success: true, events_received: data.events_received });
  } catch (error) {
    console.error("Error sending Meta event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
