import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { lerImoveis } from "@/lib/store";
import { ImovelForm } from "../../_ui/ImovelForm";

export const dynamic = "force-dynamic";

export default async function EditarImovelPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const imovel = (await lerImoveis()).find((i) => i.slug === slug);
  if (!imovel) notFound();
  return <ImovelForm imovel={imovel} />;
}
