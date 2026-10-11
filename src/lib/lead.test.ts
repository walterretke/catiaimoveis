import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildLeadMessage,
  buildWhatsAppUrl,
  entradaOpcoes,
  formatMil,
  trackAbriuEnquete,
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

for (const [nome, opcoes] of [
  ["genéricas", entradaOpcoes()],
  ["com valor", entradaOpcoes(77_000)],
] as const) {
  const opcao = (id: string) => opcoes.find((o) => o.id === id)!;

  for (const id of ["completa", "parcial"]) {
    test(`[${nome}] "${id}" dispara Lead no Pixel e na CAPI com o mesmo event_id`, () => {
      const { fbqCalls, serverCalls, deps, ctx } = setup();

      assert.equal(trackEntrada(opcao(id), ctx, deps), true);

      assert.deepEqual(fbqCalls, [
        ["track", "Lead", { content_name: "loteamento-mirage", entrada: id }, { eventID: "evt-123" }],
      ]);
      assert.equal(serverCalls.length, 1);
      assert.equal(serverCalls[0].event_name, "Lead");
      assert.equal(serverCalls[0].event_id, "evt-123");
    });
  }

  test(`[${nome}] "sem-entrada" NÃO dispara Lead, só o evento personalizado SemEntrada`, () => {
    const { fbqCalls, serverCalls, deps, ctx } = setup();

    assert.equal(trackEntrada(opcao("sem-entrada"), ctx, deps), false);

    assert.equal(fbqCalls.length, 1);
    assert.equal(fbqCalls[0][0], "trackCustom");
    assert.equal(fbqCalls[0][1], "SemEntrada");
    assert.equal(serverCalls.length, 1);
    assert.equal(serverCalls[0].event_name, "SemEntrada");
    assert.ok(!fbqCalls.some((c) => c[1] === "Lead"));
    assert.ok(!serverCalls.some((c) => c.event_name === "Lead"));
  });

  test(`[${nome}] só a opção sem entrada é não qualificada`, () => {
    assert.deepEqual(
      opcoes.filter((o) => !o.qualificado).map((o) => o.id),
      ["sem-entrada"],
    );
  });
}

test("faixas com valor usam a entrada mínima e metade dela", () => {
  const [completa, parcial, sem] = entradaOpcoes(77_000);
  assert.equal(completa.label, "Tenho R$ 77 mil ou mais");
  assert.equal(parcial.label, "Tenho entre R$ 39 mil e R$ 77 mil");
  assert.equal(sem.label, "Tenho menos de R$ 39 mil ou não tenho");
  assert.equal(formatMil(69_600), "R$ 69,6 mil");
});

test("pixel bloqueado (sem fbq) ainda envia pela CAPI", () => {
  const { ctx } = setup();
  const sent: LeadEventPayload[] = [];
  trackEntrada(entradaOpcoes()[0], ctx, { sendServerEvent: (p) => void sent.push(p) });
  assert.equal(sent.length, 1);
});

test("abrir a enquete gera só AbriuEnquete (nunca Lead)", () => {
  const calls: unknown[][] = [];
  trackAbriuEnquete("home", (...a) => void calls.push(a));
  assert.deepEqual(calls, [["trackCustom", "AbriuEnquete", { content_name: "home" }]]);
});

test("mensagem do WhatsApp inclui imóvel e resposta da entrada", () => {
  const msg = buildLeadMessage(entradaOpcoes(77_000)[1], "Mirage (R$ 385.000)");
  assert.equal(
    msg,
    "Olá Cátia! Tenho interesse no Mirage (R$ 385.000). Sobre a entrada: Tenho entre R$ 39 mil e R$ 77 mil. Gostaria de mais informações.",
  );
  assert.match(buildLeadMessage(entradaOpcoes()[0]), /^Olá Cátia! Estou procurando imóveis/);
  assert.equal(
    buildWhatsAppUrl("5547999999999", "a b&c"),
    "https://api.whatsapp.com/send?phone=5547999999999&text=a%20b%26c",
  );
});
