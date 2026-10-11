import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CORRETORA } from "@/content/site";

export const metadata: Metadata = { title: "Política de privacidade" };

const SECOES = [
  {
    titulo: "1. Coleta de informações",
    texto:
      "Este site não possui formulários de cadastro. O contato acontece pelo WhatsApp, onde você inicia a conversa por vontade própria. Antes de abrir o WhatsApp, perguntamos se você possui valor de entrada, apenas para direcionar melhor o atendimento.",
  },
  {
    titulo: "2. Cookies e medição de anúncios",
    texto:
      "Utilizamos o Meta Pixel e a API de Conversões do Meta para medir o desempenho dos nossos anúncios. Essas ferramentas podem registrar dados técnicos como endereço IP, navegador, páginas visitadas e a resposta sobre entrada, sem identificar você pelo nome. Você pode limitar esse rastreamento nas configurações de anúncios do Facebook/Instagram ou do seu navegador.",
  },
  {
    titulo: "3. Links para terceiros",
    texto:
      "O site contém links para o WhatsApp e o Instagram. Não nos responsabilizamos pelas políticas de privacidade desses aplicativos.",
  },
  {
    titulo: "4. Seus direitos",
    texto: `Conforme a LGPD, você pode solicitar informações ou a exclusão de dados pelo telefone ${CORRETORA.telefone}.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
        <h1 className="mb-10 font-display text-4xl font-semibold text-ink">Política de privacidade</h1>
        <div className="space-y-8 leading-relaxed text-ink-soft">
          {SECOES.map((s) => (
            <section key={s.titulo}>
              <h2 className="mb-2 font-semibold text-ink">{s.titulo}</h2>
              <p>{s.texto}</p>
            </section>
          ))}
          <p className="pt-6 text-sm text-muted">Última atualização: outubro de 2026.</p>
        </div>
      </div>
    </main>
  );
}
