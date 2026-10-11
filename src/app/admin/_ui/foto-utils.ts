// Redimensiona a foto NO NAVEGADOR antes de enviar: foto de celular (3–8 MB)
// vira um JPEG de ~300 KB, o upload fica rápido e cabe no limite da Vercel.

const MAX_LADO = 1600;
const QUALIDADE = 0.82;

async function carregar(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Fallback para navegadores sem suporte às opções do createImageBitmap
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    URL.revokeObjectURL(url);
    return img;
  }
}

export async function prepararFoto(file: File): Promise<Blob> {
  const img = await carregar(file);
  const escala = Math.min(1, MAX_LADO / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao processar imagem"))), "image/jpeg", QUALIDADE),
  );
}

export async function enviarFoto(file: File, slug: string): Promise<string> {
  const blob = await prepararFoto(file);
  const form = new FormData();
  form.append("file", blob, "foto.jpg");
  form.append("slug", slug);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || `Falha no envio (${res.status})`);
  return json.url as string;
}
