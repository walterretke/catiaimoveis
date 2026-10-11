// Imóveis iniciais do site. São usados apenas enquanto nada foi salvo pelo
// painel /admin. Depois do primeiro salvamento, os dados passam a vir do
// armazenamento (src/lib/store.ts) e este arquivo deixa de ser lido.

import type { Imovel } from "./imoveis";

const img = (slug: string, nome: string) => `/imoveis/${slug}/${nome}.webp`;

const mirage = (n: string) => img("loteamento-mirage", n);
const baependi = (n: string) => img("mobiliado-baependi", n);
const geminado = (n: string) => img("geminado-tresrios", n);

export const SEED_IMOVEIS: Imovel[] = [
  {
    slug: "mobiliado-baependi",
    ogImage: "/imoveis/mobiliado-baependi/og.jpg",
    entradaMinima: 69_600,
    status: "disponivel",
    nome: "Apartamento Mobiliado Baependi",
    titulo: ["Mobiliado", "Baependi"],
    tipo: "Apartamento",
    preco: 348_000,
    precoAntigo: 368_000,
    notaPreco: "Aceita financiamento. Entrada sugerida a partir de R$ 69.600",
    selos: ["Oportunidade única", "100% mobiliado e equipado"],
    specs: [
      { label: "Dormitórios", valor: "2" },
      { label: "Garagem", valor: "Coberta" },
      { label: "Centro", valor: "5 min" },
    ],
    resumo: "De R$ 368 mil por R$ 348 mil. É só trazer as malas — aceita financiamento.",
    capa: baependi("principal"),
    galeria: {
      titulo: "É só trazer suas malas.",
      texto:
        "Acabamento premium (gesso e piso vinílico) e vendido 100% mobiliado, decorado e equipado. Fotos reais do imóvel.",
      fotos: [
        { src: baependi("principal"), legenda: "Visão geral" },
        { src: baependi("sala-tv"), legenda: "Sala de TV" },
        { src: baependi("cozinha"), legenda: "Cozinha" },
        { src: baependi("cozinha-detalhe"), legenda: "Cozinha — detalhe" },
        { src: baependi("quarto-1"), legenda: "Quarto 1" },
        { src: baependi("quarto-2"), legenda: "Quarto 2" },
        { src: baependi("quarto-2-angulo"), legenda: "Quarto 2 — outro ângulo" },
        { src: baependi("banheiro"), legenda: "Banheiro" },
      ],
    },
    destaques: {
      titulo: "O que fica para você",
      texto: "Tudo o que está no imóvel já é seu. Sem dor de cabeça, sem gastos extras.",
      itens: [
        "Cozinha planejada completa (geladeira Bosch, forno, cooktop, coifa)",
        "Lavanderia sob medida com máquina Electrolux 10 kg",
        'Sofá retrátil, Smart TV Philco 40", painel e mesa de jantar',
        "2 dormitórios climatizados com ar-condicionado",
        "2 camas de casal e roupeiro",
        "Churrasqueira interna planejada",
        "Garagem coberta",
        "Acabamento premium: gesso e piso vinílico",
        "Torneira elétrica na cozinha",
      ],
      imagem: baependi("cozinha-detalhe"),
    },
    localizacao: {
      bairro: "Baependi",
      cidade: "Jaraguá do Sul / SC",
      referencia: "5 min do Centro • Portaria da WEG II",
      texto: "Localização estratégica, colado na portaria da WEG II e a apenas 5 minutos do Centro da cidade.",
    },
    seo: {
      title: "Apartamento Mobiliado Baependi | R$ 348.000 - Jaraguá do Sul",
      description:
        "Apartamento 100% mobiliado, decorado e equipado no Baependi, Jaraguá do Sul. 2 dormitórios, acabamento premium, a 5 min do Centro. Aceita financiamento!",
    },
  },
  {
    slug: "geminado-tresrios",
    ogImage: "/imoveis/geminado-tresrios/og.jpg",
    entradaMinima: 92_000,
    status: "disponivel",
    nome: "Geminado de Alto Padrão no Loteamento Mirage",
    titulo: ["Geminado", "Alto Padrão"],
    tipo: "Casa geminada",
    preco: 460_000,
    notaPreco: "Aceita financiamento. Consulte as condições.",
    selos: ["Lançamento", "Novo e pronto para morar"],
    specs: [
      { label: "Área privativa", valor: "91 m²" },
      { label: "Dormitórios", valor: "1 suíte + 1" },
      { label: "Garagem", valor: "2 carros" },
    ],
    resumo: "91 m² com suíte, área gourmet e acabamento de alto padrão.",
    capa: geminado("quintal-2"),
    galeria: {
      titulo: "Conforto, elegância e praticidade.",
      texto: "Com 91 m² de área privativa, o imóvel foi planejado para oferecer tudo isso em cada ambiente.",
      fotos: [
        { src: geminado("fachada"), legenda: "Fachada" },
        { src: geminado("sala"), legenda: "Sala de estar" },
        { src: geminado("sala-2"), legenda: "Sala de estar — outro ângulo" },
        { src: geminado("area-gourmet"), legenda: "Área gourmet" },
        { src: geminado("suite"), legenda: "Suíte" },
        { src: geminado("dormitorio"), legenda: "Dormitório" },
        { src: geminado("banheiro-1"), legenda: "Banheiro 1" },
        { src: geminado("banheiro-2"), legenda: "Banheiro 2" },
        { src: geminado("quintal-1"), legenda: "Quintal" },
        { src: geminado("quintal-2"), legenda: "Quintal e fachada" },
        { src: geminado("garagem"), legenda: "Garagem" },
      ],
    },
    destaques: {
      titulo: "Tudo o que você precisa",
      texto: "Espaço, elegância e sofisticação, ideal para quem valoriza um imóvel moderno.",
      itens: [
        "1 suíte + 1 dormitório",
        "2 banheiros já montados",
        "Garagem para 2 carros",
        "Área gourmet interna",
        "Interfone",
        "Jardim de entrada",
        "Acabamentos modernos e de alto padrão",
        "Imóvel novo e pronto para morar",
      ],
      imagem: geminado("area-gourmet"),
    },
    localizacao: {
      bairro: "Três Rios do Norte",
      cidade: "Jaraguá do Sul / SC",
      referencia: "Loteamento Mirage",
      texto: "Região que vem crescendo e se valorizando, com excelente aproveitamento dos espaços.",
    },
    seo: {
      title: "Geminado Alto Padrão Loteamento Mirage | R$ 460.000 - Jaraguá do Sul",
      description:
        "Geminado novo de alto padrão no Loteamento Mirage, Três Rios do Norte. 91 m², suíte, área gourmet e garagem para 2 carros. Aceita financiamento.",
    },
  },
  {
    slug: "loteamento-mirage",
    ogImage: "/imoveis/loteamento-mirage/og.jpg",
    entradaMinima: 77_000,
    status: "disponivel",
    nome: "Mirage",
    titulo: ["Loteamento", "Mirage"],
    tipo: "Apartamento",
    preco: 385_000,
    notaPreco: "Entrada sugerida a partir de R$ 77.000",
    selos: ["Últimas unidades disponíveis"],
    specs: [
      { label: "Área privativa", valor: "80 m²" },
      { label: "Dormitórios", valor: "1 suíte + 2" },
      { label: "Sacada", valor: "Churrasqueira" },
    ],
    resumo: "Apartamento novo de 80 m² com suíte e sacada com churrasqueira em Três Rios do Norte.",
    capa: mirage("fachada"),
    galeria: {
      titulo: "Conheça cada ambiente.",
      texto: "Fotos reais de todos os ângulos para você ter certeza de que este é o seu novo lar.",
      fotos: [
        { src: mirage("fachada-frontal"), legenda: "Fachada" },
        { src: mirage("sala-cozinha"), legenda: "Sala e cozinha integradas" },
        { src: mirage("sala"), legenda: "Sala" },
        { src: mirage("cozinha"), legenda: "Cozinha" },
        { src: mirage("suite"), legenda: "Suíte" },
        { src: mirage("dormitorio-1"), legenda: "Dormitório" },
        { src: mirage("dormitorio-2"), legenda: "Dormitório" },
        { src: mirage("dormitorio-3"), legenda: "Dormitório" },
        { src: mirage("banheiro"), legenda: "Banheiro" },
        { src: mirage("planta"), legenda: "Planta" },
        { src: mirage("fachada-lateral"), legenda: "Fachada lateral" },
        { src: mirage("estacionamento"), legenda: "Estacionamento" },
      ],
    },
    comparativoIA: [
      { titulo: "Sala e cozinha", real: mirage("ia-sala-cozinha"), mobiliado: mirage("ia-sala-cozinha-mobiliado") },
      { titulo: "Suíte", real: mirage("ia-quarto"), mobiliado: mirage("ia-quarto-mobiliado") },
      { titulo: "Banheiro", real: mirage("ia-banheiro"), mobiliado: mirage("ia-banheiro-mobiliado") },
    ],
    destaques: {
      titulo: "O prédio",
      itens: [
        "Sacada com churrasqueira a carvão",
        "1 suíte + 2 dormitórios amplos",
        "Vaga de garagem privativa",
        "Fino acabamento com gesso",
        "Localização em plena valorização",
      ],
      imagem: mirage("fachada"),
    },
    localizacao: {
      bairro: "Três Rios do Norte",
      cidade: "Jaraguá do Sul / SC",
      referencia: "Loteamento Mirage",
      texto: "Bairro em constante crescimento, unindo a paz da natureza com a conveniência da cidade.",
    },
    seo: {
      title: "Apartamento Novo à Venda | Loteamento Mirage - R$ 385.000",
      description:
        "80 m² • 1 suíte + 2 dormitórios • sacada com churrasqueira. Apartamento novo no Loteamento Mirage, Três Rios do Norte, Jaraguá do Sul.",
    },
  },
];
