import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ENTRADA_OPCOES,
  buildLeadMessage,
  buildWhatsAppUrl,
  trackEntrada,
  type LeadEventPayload,
} from "./lead.ts";

function setup() {
  const fbqCalls: unknown[][] = [];
  const serverCalls: LeadEventPayload[] = [];
  const deps = {
    fbq: (...args: unknown[]) => void fbqCalls.push(args),
    sendServerEvent: (p: LeadEventPayload) => void serverCalls.push(p),
  };
  const ctx = {
    eventId: "evt-123",
    contentName: "loteamento-mirage",
    url: "https://exemplo.com/loteamento-mirage",
    userAgent: "UA",
  };
  return { fbqCalls, serverCalls, deps, ctx };
}

const opcao = (id: string) => ENTRADA_OPCOES.find((o) => o.id === id)!;

for (const id of ["completa", "parcial"]) {
  test(`entrada "${id}" dispara Lead no Pixel e na CAPI com o mesmo event_id`, () => {
    const { fbqCalls, serverCalls, deps, ctx } = setup();

    assert.equal(trackEntrada(opcao(id), ctx, deps), true);

    assert.equal(fbqCalls.length, 1);
    const [cmd, event, data, opts] = fbqCalls[0];
    assert.equal(cmd, "track");
    assert.equal(event, "Lead");
    assert.deepEqual(data, { content_name: "loteamento-mirage", entrada: id });
    assert.deepEqual(opts, { eventID: "evt-123" });

    assert.equal(serverCalls.length, 1);
    assert.equal(serverCalls[0].event_name, "Lead");
    assert.equal(serverCalls[0].event_id, "evt-123");
    assert.equal(serverCalls[0].event_url, ctx.url);
  });
}

test('"sem-entrada" NÃO dispara nenhum evento', () => {
  const { fbqCalls, serverCalls, deps, ctx } = setup();
  assert.equal(trackEntrada(opcao("sem-entrada"), ctx, deps), false);
  assert.equal(fbqCalls.length, 0);
  assert.equal(serverCalls.length, 0);
});

test("pixel bloqueado (sem fbq) ainda envia pela CAPI", () => {
  const { serverCalls, ctx } = setup();
  const sent: LeadEventPayload[] = [];
  trackEntrada(opcao("completa"), ctx, { sendServerEvent: (p) => void sent.push(p) });
  assert.equal(sent.length, 1);
  assert.equal(serverCalls.length, 0);
});

test("só existe uma opção não qualificada e ela é a de sem entrada", () => {
  const naoQualificadas = ENTRADA_OPCOES.filter((o) => !o.qualificado).map((o) => o.id);
  assert.deepEqual(naoQualificadas, ["sem-entrada"]);
});

test("mensagem do WhatsApp inclui imóvel e resposta da entrada", () => {
  const msg = buildLeadMessage(opcao("parcial"), "Mirage (R$ 385.000)");
  assert.equal(
    msg,
    "Olá Cátia! Tenho interesse no Mirage (R$ 385.000). Sobre a entrada: Tenho apenas uma parte do valor. Gostaria de mais informações.",
  );
  assert.match(buildLeadMessage(opcao("completa")), /^Olá Cátia! Estou procurando imóveis/);
  assert.equal(
    buildWhatsAppUrl("5547999999999", "a b&c"),
    "https://api.whatsapp.com/send?phone=5547999999999&text=a%20b%26c",
  );
});
