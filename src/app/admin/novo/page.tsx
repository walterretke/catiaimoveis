import { requireAdmin } from "@/lib/admin-auth";
import { ImovelForm } from "../_ui/ImovelForm";

export default async function NovoImovelPage() {
  await requireAdmin();
  return <ImovelForm />;
}
