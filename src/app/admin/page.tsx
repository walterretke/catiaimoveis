import { requireAdmin } from "@/lib/admin-auth";
import { lerImoveis, quantidadeVersoes, storageDisponivel } from "@/lib/store";
import { AdminList } from "./_ui/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const [imoveis, versoes] = await Promise.all([lerImoveis(), quantidadeVersoes()]);

  return (
    <AdminList imoveis={imoveis} podeDesfazer={versoes > 0} storageOk={storageDisponivel()} />
  );
}
