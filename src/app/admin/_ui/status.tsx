import type { ImovelStatus } from "@/content/imoveis";

export const STATUS_LABEL: Record<ImovelStatus, string> = {
  disponivel: "Disponível",
  vendido: "Vendido",
  oculto: "Oculto",
};

export const STATUS_AJUDA: Record<ImovelStatus, string> = {
  disponivel: "Aparece na página inicial.",
  vendido: "Página continua no ar com selo de vendido e sugere outros imóveis.",
  oculto: "Página funciona pelo link, mas não aparece na página inicial. Bom para preparar antes de publicar.",
};

const CORES: Record<ImovelStatus, string> = {
  disponivel: "bg-wa/15 text-wa-dark",
  vendido: "bg-red-100 text-red-700",
  oculto: "bg-line text-muted",
};

export function StatusBadge({ status }: { status: ImovelStatus }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${CORES[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
