import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-6 antialiased">
      <div className="container mx-auto max-w-3xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-600 font-bold mb-10 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Voltar para a página inicial
        </Link>
        
        <h1 className="text-4xl font-black tracking-tighter mb-8 text-slate-900">Política de Privacidade</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <p>
            Esta política de privacidade descreve como coletamos e usamos suas informações quando você utiliza nosso site.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-2 uppercase tracking-widest text-sm">1. Coleta de Informações</h2>
          <p>
            Nosso site não coleta dados pessoais automaticamente através de formulários. A única forma de contato é via clique direto para o WhatsApp, onde você inicia a conversa por vontade própria.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-2 uppercase tracking-widest text-sm">2. Uso de Cookies</h2>
          <p>
            Podemos utilizar cookies básicos para análise de tráfego e performance do site através de ferramentas como o Google Analytics ou Meta Pixel, visando melhorar sua experiência de navegação.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-2 uppercase tracking-widest text-sm">3. Links para Terceiros</h2>
          <p>
            Nosso site contém links para o WhatsApp e Instagram. Não nos responsabilizamos pelas políticas de privacidade ou conteúdo desses aplicativos externos.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-2 uppercase tracking-widest text-sm">4. Segurança</h2>
          <p>
            Estamos empenhados em garantir que suas informações estejam seguras. No entanto, lembre-se que nenhum método de transmissão pela internet é 100% seguro.
          </p>
          
          <p className="pt-10 text-sm text-slate-500">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </main>
  );
}
