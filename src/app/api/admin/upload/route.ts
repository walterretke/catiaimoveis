import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { salvarFoto, storageDisponivel } from "@/lib/store";

// Recebe UMA foto já redimensionada no navegador (ver src/app/admin/_ui/foto-utils.ts).
const MAX_BYTES = 4 * 1024 * 1024;
const TIPOS: Record<string, string> = { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" };

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  if (!storageDisponivel()) {
    return NextResponse.json({ erro: "Armazenamento não configurado na Vercel." }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const slug = String(form.get("slug") ?? "").replace(/[^a-z0-9-]/g, "").slice(0, 60);

  if (!(file instanceof Blob) || !TIPOS[file.type]) {
    return NextResponse.json({ erro: "Envie uma imagem JPG, PNG ou WebP." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ erro: "Imagem muito grande (máx. 4 MB)." }, { status: 413 });
  }

  const url = await salvarFoto(slug, file, TIPOS[file.type]);
  return NextResponse.json({ url });
}
