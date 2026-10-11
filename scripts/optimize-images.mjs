// Gera as imagens otimizadas servidas pelo site a partir das fotos originais.
//
//   node scripts/optimize-images.mjs
//
// Originais ficam em `fotos-originais/` (fora de `public/`, não são servidas).
// Saída: `public/imoveis/<slug>/<nome>.webp` (máx. 1600px no lado maior) + `og.jpg` 1200x630
// para pré-visualização de link no WhatsApp/Facebook.
//
// Para cadastrar um imóvel novo: coloque as fotos em `fotos-originais/<pasta>`,
// adicione uma entrada em MANIFEST e rode o script.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "fotos-originais";
const OUT = "public/imoveis";
const MAX_SIZE = 1600; // lado maior (as fotos são quase todas verticais)
const QUALITY = 78;

/** slug -> { og: arquivo usado no og.jpg, fotos: { destino: origem } } */
const MANIFEST = {
  "loteamento-mirage": {
    og: "fachada",
    fotos: {
      fachada: "mirage/Fachada.JPG",
      "fachada-frontal": "mirage/album/WhatsApp Image 2026-06-16 at 20.09.56.jpeg",
      "fachada-lateral": "mirage/album/WhatsApp Image 2026-06-16 at 20.09.57.jpeg",
      estacionamento: "mirage/album/WhatsApp Image 2026-06-16 at 20.09.57 (1).jpeg",
      planta: "mirage/album/WhatsApp Image 2026-06-16 at 20.09.57 (2).jpeg",
      "sala-cozinha": "mirage/album/WhatsApp Image 2026-06-16 at 20.09.57 (3).jpeg",
      cozinha: "mirage/album/WhatsApp Image 2026-06-16 at 20.09.57 (4).jpeg",
      sala: "mirage/album/WhatsApp Image 2026-06-16 at 20.09.58.jpeg",
      suite: "mirage/album/WhatsApp Image 2026-06-16 at 20.09.58 (4).jpeg",
      "dormitorio-1": "mirage/album/WhatsApp Image 2026-06-16 at 20.09.58 (1).jpeg",
      "dormitorio-2": "mirage/album/WhatsApp Image 2026-06-16 at 20.09.58 (2).jpeg",
      "dormitorio-3": "mirage/album/WhatsApp Image 2026-06-16 at 20.09.58 (3).jpeg",
      banheiro: "mirage/album/WhatsApp Image 2026-06-16 at 20.09.59.jpeg",
      "ia-sala-cozinha": "mirage/Sala e Cozinha.JPG",
      "ia-sala-cozinha-mobiliado": "mirage/Sala e Cozinha - Mobiliado.png",
      "ia-quarto": "mirage/Quarto.JPG",
      "ia-quarto-mobiliado": "mirage/Quarto - Imobiliado.png",
      "ia-banheiro": "mirage/Banheiro.JPG",
      "ia-banheiro-mobiliado": "mirage/Banheiro - Imobiliado.png",
    },
  },
  "mobiliado-baependi": {
    og: "principal",
    fotos: {
      principal: "mobiliado-baependi/principal.jpg",
      "sala-tv": "mobiliado-baependi/sala de tv.jpg",
      cozinha: "mobiliado-baependi/cozinha 2.jpg",
      "cozinha-detalhe": "mobiliado-baependi/cozinha 3.jpg",
      "quarto-1": "mobiliado-baependi/quarto 1.jpg",
      "quarto-2": "mobiliado-baependi/quarto 2.jpg",
      "quarto-2-angulo": "mobiliado-baependi/quarto 2 foto 2.jpg",
      banheiro: "mobiliado-baependi/banheiro.jpg",
    },
  },
  "geminado-tresrios": {
    og: "quintal-2",
    fotos: {
      fachada: "geminado-tresrios/PORTAO_ENTRADA_PRINCIPAL.jpg",
      entrada: "geminado-tresrios/ENTRADA_INTERNO.jpg",
      sala: "geminado-tresrios/SALA_DE_ESTAR.jpg",
      "sala-2": "geminado-tresrios/SALA_DE_ESTAR_2.jpg",
      "area-gourmet": "geminado-tresrios/AREA_DE FESTA.jpg",
      "saida-area-gourmet": "geminado-tresrios/SAIDA_AREA_DE_fESTA.jpg",
      suite: "geminado-tresrios/QUARTO_1.jpg",
      dormitorio: "geminado-tresrios/QUARTO_2.jpg",
      "quarto-3": "geminado-tresrios/QUARTO_3.jpg",
      "banheiro-1": "geminado-tresrios/BANHEIRO_1.jpg",
      "banheiro-2": "geminado-tresrios/BANHEIRO_2.jpg",
      "quintal-1": "geminado-tresrios/QUINTAL_1.jpg",
      "quintal-2": "geminado-tresrios/QUINTAL_2.jpg",
      garagem: "geminado-tresrios/GARAGEM_1_IMAGEM_BOA.jpg",
    },
  },
  corretora: {
    og: "catia",
    fotos: { catia: "corretora/foto-corretora.jpg" },
  },
};

async function run() {
  let total = 0;
  for (const [slug, { og, fotos }] of Object.entries(MANIFEST)) {
    const dir = path.join(OUT, slug);
    await mkdir(dir, { recursive: true });

    for (const [name, src] of Object.entries(fotos)) {
      const input = path.join(SRC, src);
      const info = await sharp(input)
        .rotate() // respeita orientação EXIF de fotos de celular
        .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(path.join(dir, `${name}.webp`));
      total += info.size;
    }

    await sharp(path.join(SRC, fotos[og]))
      .rotate()
      .resize(1200, 630, { fit: "cover", position: slug === "corretora" ? "top" : "centre" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(dir, "og.jpg"));

    console.log(`✓ ${slug} (${Object.keys(fotos).length} fotos)`);
  }
  console.log(`Total webp: ${(total / 1024 / 1024).toFixed(1)} MB`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
