"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ExternalLink,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  Undo2,
} from "lucide-react";
import { formatPreco, type Imovel } from "@/content/imoveis";
import {
  alterarStatus,
  desfazer,
  duplicarImovel,
  excluirImovel,
  logout,
  moverImovel,
  type ActionResult,
} from "../actions";
import { StatusBadge } from "./status";

interface Props {
  imoveis: Imovel[];
  podeDesfazer: boolean;
  storageOk: boolean;
}

export function AdminList({ imoveis, podeDesfazer, storageOk }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const run = (fn: () => Promise<ActionResult>, sucesso: string) =>
    startTransition(async () => {
      const res = await fn();
      setMsg(res.ok ? { tipo: "ok", texto: sucesso } : { tipo: "erro", texto: res.erro });
      router.refresh();
    });

  const excluir = (i: Imovel) => {
    const ok = window.confirm(
      `Excluir "${i.nome}"?\n\nA página /${i.slug} vai sair do ar — anúncios que apontam para ela vão parar de funcionar.\n\nSe o imóvel só foi vendido, prefira marcar como "Vendido".`,
    );
    if (ok) run(() => excluirImovel(i.slug), "Imóvel excluído. Use “Desfazer” se foi sem querer.");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 pb-24 md:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Imóveis</h1>
          <p className="text-sm text-muted">
            {imoveis.length} cadastrados. A ordem aqui é a mesma da página inicial.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {podeDesfazer && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Desfazer a última alteração salva?")) run(desfazer, "Última alteração desfeita.");
              }}
              disabled={pending}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-sm font-medium"
            >
              <Undo2 className="size-4" /> Desfazer
            </button>
          )}
          <form action={logout}>
            <button className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-muted hover:text-ink">
              <LogOut className="size-4" /> Sair
            </button>
          </form>
        </div>
      </header>

      {!storageOk && (
        <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          O armazenamento ainda não foi configurado na Vercel, então nada pode ser salvo. Crie um Blob Store
          (público) em <strong>Storage</strong> e conecte ao projeto.
        </p>
      )}

      {msg && (
        <p
          role="status"
          className={`mb-4 rounded-xl p-3 text-sm ${msg.tipo === "ok" ? "bg-wa/10 text-wa-dark" : "bg-red-50 text-red-700"}`}
        >
          {msg.texto}
        </p>
      )}

      <Link
        href="/admin/novo"
        className="mb-6 flex h-14 items-center justify-center gap-2 rounded-2xl bg-ink font-semibold text-white"
      >
        <Plus className="size-5" /> Cadastrar novo imóvel
      </Link>

      <ul className={`space-y-3 ${pending ? "pointer-events-none opacity-60" : ""}`}>
        {imoveis.map((i, idx) => (
          <li key={i.slug} className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex gap-3">
              <img src={i.capa} alt="" className="size-20 shrink-0 rounded-xl bg-sand object-cover md:size-24" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold">{i.nome}</p>
                  <StatusBadge status={i.status} />
                </div>
                <p className="text-sm text-muted">
                  {formatPreco(i.preco)} • {i.tipo}
                </p>
                <p className="truncate text-xs text-muted">/{i.slug}</p>
              </div>
            </div>

            {/* Vendido: liga/desliga sem entrar na edição */}
            <button
              type="button"
              role="switch"
              aria-checked={i.status === "vendido"}
              onClick={() =>
                run(
                  () => alterarStatus(i.slug, i.status === "vendido" ? "disponivel" : "vendido"),
                  i.status === "vendido"
                    ? `"${i.nome}" voltou a ficar disponível.`
                    : `"${i.nome}" marcado como vendido. A página continua no ar com o selo “Vendido”.`,
                )
              }
              className="mt-3 flex w-full items-center gap-3 rounded-xl bg-sand px-3 py-2.5 text-left"
            >
              <span
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${i.status === "vendido" ? "bg-red-500" : "bg-line"}`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${i.status === "vendido" ? "left-6" : "left-1"}`}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">Vendido</span>
                <span className="block text-xs text-muted">
                  {i.status === "vendido"
                    ? "Aparece no site com o selo “Vendido”. Toque para desfazer."
                    : "Toque quando vender. A página continua no ar com o selo “Vendido”."}
                </span>
              </span>
            </button>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={`/admin/editar/${i.slug}`} className="btn-admin h-11 border-ink bg-ink text-white">
                <Pencil className="size-4" /> Editar
              </Link>
              <a href={`/${i.slug}`} target="_blank" rel="noopener noreferrer" className="btn-admin h-11">
                <ExternalLink className="size-4" /> Ver no site
              </a>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1 text-xs">
              <button
                type="button"
                className="btn-admin h-8 px-2 text-xs"
                disabled={idx === 0}
                onClick={() => run(() => moverImovel(i.slug, -1), "Ordem atualizada.")}
              >
                <ArrowUp className="size-3.5" /> Subir
              </button>
              <button
                type="button"
                className="btn-admin h-8 px-2 text-xs"
                disabled={idx === imoveis.length - 1}
                onClick={() => run(() => moverImovel(i.slug, 1), "Ordem atualizada.")}
              >
                <ArrowDown className="size-3.5" /> Descer
              </button>
              <button
                type="button"
                className="btn-admin h-8 px-2 text-xs"
                onClick={() =>
                  run(() => duplicarImovel(i.slug), "Cópia criada como “Oculto”. Edite e mude para Disponível.")
                }
              >
                <Copy className="size-3.5" /> Duplicar
              </button>
              <button
                type="button"
                className="btn-admin ml-auto h-8 px-2 text-xs text-red-600"
                onClick={() => excluir(i)}
              >
                <Trash2 className="size-3.5" /> Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      {pending && (
        <div className="fixed inset-x-0 bottom-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-white shadow-lg">
            <Loader2 className="size-4 animate-spin" /> Salvando…
          </span>
        </div>
      )}
    </main>
  );
}
