export const WHATSAPP_NUMBER = "5547996174283";
export const WHATSAPP_MESSAGE = "Olá Cátia, tenho interesse no Loteamento Mirage (R$ 385.000). Gostaria de agendar uma visita e fazer uma simulação de financiamento.";
export const WHATSAPP_LINK = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const WHATSAPP_MESSAGE_GENERAL = "Olá, Cátia! Estou procurando imóveis e gostaria do seu auxílio.";
export const WHATSAPP_LINK_GENERAL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_GENERAL)}`;

export const PROPERTY_DETAILS = {
  name: "LOTEAMENTO MIRAGE",
  tagline: "Onde o conforto encontra a sua nova história.",
  price: "R$ 385.000,00",
  specs: "80m² privativos • 1 Suíte + 2 Dormitórios • Sacada com Churrasqueira",
  description: "Um espaço planejado para quem não abre mão de qualidade de vida, sol da manhã e ambientes integrados que convidam ao convívio.",
  location: "Três Rios do Norte, Jaraguá do Sul",
  instagram: "https://www.instagram.com/corretoracatiamanske",
  broker: {
    name: "Cátia Manske",
    creci: "66755-F",
    phone: "(47) 99617-4283",
    bio: "Especialista em realizar sonhos em Jaraguá do Sul. Minha missão é encontrar o lar perfeito que se encaixe no seu momento de vida.",
  },
};
