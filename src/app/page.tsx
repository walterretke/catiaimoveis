"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  MessageCircle, 
  MapPin, 
  CheckCircle, 
  Award, 
  Home, 
  Waves, 
  TreePine, 
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { WHATSAPP_LINK_GENERAL, PROPERTY_DETAILS } from "@/lib/constants";

// Custom Instagram SVG for consistency
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function BrokerHomePage() {
  const handleWhatsAppClick = () => {
    const eventId = crypto.randomUUID();
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {}, { eventID: eventId });
    }

    fetch('/api/meta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: eventId,
        event_url: currentUrl,
        client_user_agent: userAgent
      })
    }).catch(console.error);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white overflow-x-hidden antialiased">
      {/* 1. Hero Section - Refined for PC */}
      <section className="relative min-h-[85vh] md:min-h-[75vh] w-full flex items-center justify-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Fachada.JPG"
            alt="Jaraguá do Sul"
            fill
            className="object-cover opacity-20 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
        </div>

        <div className="container relative z-10 mx-auto px-6 py-12 text-center max-w-5xl">
          <div className="mb-8 inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-md border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">
            <Award className="size-3.5" />
            +20 Anos de Experiência
          </div>

          <div className="relative mx-auto mb-8 size-40 md:size-48">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 opacity-10" />
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="/images/foto-corretora.jpg"
                alt="Cátia Manske"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-6">
            Cátia Manske
          </h1>
          
          <p className="text-lg md:text-xl font-bold text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Especialista em realizar sonhos imobiliários em Jaraguá do Sul e toda região norte de Santa Catarina.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a 
              href={WHATSAPP_LINK_GENERAL}
              onClick={handleWhatsAppClick}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg text-sm"
            >
              <MessageCircle className="size-5" />
              Falar pelo WhatsApp
            </a>
            <a 
              href="https://www.instagram.com/corretoracatiamanske"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-xl font-black uppercase tracking-widest transition-all border border-white/10 text-sm"
            >
              <InstagramIcon className="size-5" />
              Siga no Instagram
            </a>
          </div>
        </div>
      </section>

      {/* 2. Authority & Association - Domus Branding */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                <div className="h-1 w-8 bg-blue-600 rounded-full" />
                Expertise Profissional
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-6">
                Corretores Associados <br /> <span className="text-blue-600 italic font-medium">Domus.</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                Como parte da rede Domus, ofereço segurança jurídica e as melhores oportunidades de Jaraguá do Sul, com a bagagem de quem entende do mercado catarinense.
              </p>
              <div className="grid gap-4">
                {[
                  "Processos de financiamento ágeis",
                  "Consultoria para investimentos",
                  "Atendimento personalizado Domus",
                  "Amplo portfólio de imóveis selecionados"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-green-500 shrink-0" />
                    <span className="text-base font-bold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Award className="size-48" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-8">Área de Atuação</h3>
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <MapPin className="size-6 text-blue-500 shrink-0 mt-1" />
                        <div>
                           <p className="text-lg font-bold uppercase tracking-tight">Jaraguá do Sul</p>
                           <p className="text-slate-400 text-sm mt-1">Foco nos principais lançamentos e bairros em valorização.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <MapPin className="size-6 text-blue-500 shrink-0 mt-1" />
                        <div>
                           <p className="text-lg font-bold uppercase tracking-tight">Região & Litoral</p>
                           <p className="text-slate-400 text-sm mt-1">Joinville, Guaramirim, Schroeder e o litoral catarinense.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solutions Grid - Refined Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Encontre o seu lugar
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Soluções sob medida para o seu perfil
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Home />, title: "Casas & Aptos", desc: "Sua nova moradia com conforto." },
              { icon: <TreePine />, title: "Chácaras", desc: "Paz e natureza no interior." },
              { icon: <Waves />, title: "Litoral", desc: "O refúgio perfeito no mar." },
              { icon: <Star />, title: "Investimentos", desc: "Rentabilidade garantida." }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all group">
                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-lg font-black mb-2 text-slate-900">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Project Link */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link href="/loteamento-mirage" className="block relative group">
            <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
              <Image 
                src="/images/Fachada.JPG" 
                alt="Loteamento Mirage" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent" />
              <div className="absolute inset-0 flex items-center p-10 md:p-16">
                <div className="max-w-md text-white">
                  <span className="inline-block bg-blue-600 px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest mb-4">Destaque do Mês</span>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">Loteamento <br /> Mirage</h3>
                  <p className="text-base text-slate-300 font-medium mb-8">Últimas unidades com condições especiais em Três Rios do Norte.</p>
                  <div className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-black uppercase text-xs">
                    Ver detalhes <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Footer - Domus Compliance */}
      <footer className="py-16 px-6 bg-slate-950 text-white border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="max-w-sm">
               <h3 className="text-2xl font-black tracking-tighter mb-4 text-blue-500">Cátia Manske</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 Associada aos Corretores Associados Domus. Transformando negociações imobiliárias em Jaraguá do Sul.
               </p>
               <div className="space-y-1 text-xs text-slate-500 font-medium">
                  <p>Rua Roberto Ziemann, 1787 - Sala 03</p>
                  <p>Amizade - Jaraguá do Sul/SC</p>
                  <p>CNPJ: 57.154.695/0001-83</p>
               </div>
            </div>
            <div className="flex flex-col md:flex-row gap-12 md:gap-20">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Navegação</h4>
                  <nav className="flex flex-col gap-3">
                     <Link href="/" className="text-sm font-bold hover:text-blue-400 transition-colors">Início</Link>
                     <Link href="/loteamento-mirage" className="text-sm font-bold hover:text-blue-400 transition-colors">Loteamento Mirage</Link>
                     <Link href="/privacidade" className="text-sm font-bold hover:text-blue-400 transition-colors">Privacidade</Link>
                  </nav>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Contato Direto</h4>
                  <p className="text-sm font-bold mb-2">(47) 99617-4283</p>
                  <a href={PROPERTY_DETAILS.instagram} target="_blank" className="text-sm font-bold hover:text-blue-400 transition-colors flex items-center gap-2">
                    <InstagramIcon className="size-4" /> @corretoracatiamanske
                  </a>
               </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Cátia Manske Imóveis • CRECI 66755-F • Domus Corretores Associados
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href={WHATSAPP_LINK_GENERAL}
          onClick={handleWhatsAppClick}
          className="flex h-14 w-14 items-center justify-center bg-[#25D366] text-white rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <MessageCircle className="size-7" />
        </a>
      </div>
    </main>
  );
}
