import { test } from "node:test";
import assert from "node:assert/strict";
import { fbcDoClique, origemPermitida } from "./meta-event.ts";

const HOST = "www.catiaimoveis.com.br";
const SITE = `https://${HOST}`;

test("aceita evento enviado pelo próprio site", () => {
  assert.equal(origemPermitida(SITE, HOST, `${SITE}/residencial-dubai?fbclid=abc`), true);
  assert.equal(origemPermitida(SITE, "WWW.catiaimoveis.com.br"), true);
  assert.equal(origemPermitida("http://localhost:3000", "localhost:3000"), true);
});

test("recusa outra origem, origem ausente e URL de outro site", () => {
  assert.equal(origemPermitida("https://outro-site.com", HOST), false);
  assert.equal(origemPermitida(null, HOST), false);
  assert.equal(origemPermitida("texto-invalido", HOST), false);
  assert.equal(origemPermitida(SITE, null), false);
  assert.equal(origemPermitida(SITE, HOST, "https://outro-site.com/x"), false);
  assert.equal(origemPermitida(SITE, HOST, "sem-url"), false);
});

test("fbc: o cookie do Pixel tem prioridade", () => {
  assert.equal(fbcDoClique("fb.1.111.COOKIE", `${SITE}/?fbclid=URL`, 999), "fb.1.111.COOKIE");
});

test("fbc: sem cookie, monta a partir do fbclid sem alterar o valor", () => {
  assert.equal(fbcDoClique(undefined, `${SITE}/x?a=1&fbclid=AbC-123_x`, 1700000000000), "fb.1.1700000000000.AbC-123_x");
});

test("fbc: sem cookie e sem fbclid, não envia", () => {
  assert.equal(fbcDoClique(undefined, `${SITE}/x`, 1), undefined);
  assert.equal(fbcDoClique(undefined, "url-invalida", 1), undefined);
});
