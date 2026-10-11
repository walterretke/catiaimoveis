# Cátia Manske Imóveis

Landing pages dos imóveis da corretora Cátia Manske, feitas para tráfego pago (Meta Ads).
Next.js 16 (App Router) + Tailwind v4, deploy na Vercel.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testes da regra de lead
npm run build
```

Variáveis de ambiente: veja `.env.example`.


## Painel de imóveis (/admin)

Cadastrar, editar, ocultar, marcar como vendido, reordenar, duplicar e excluir
imóveis acontece em `/admin`, que também funciona pelo celular. As alterações
entram no site na hora, sem precisar de deploy.

- **Senha:** variável `ADMIN_PASSWORD` na Vercel.
- **Armazenamento:** Vercel Blob (store **público** conectado ao projeto, que cria
  `BLOB_READ_WRITE_TOKEN`). Guarda as fotos enviadas e o JSON dos imóveis.
- Cada salvamento gera uma versão nova, e as 30 últimas ficam guardadas. O botão
  **Desfazer** volta para a versão anterior.
- As fotos são redimensionadas no navegador antes do envio (JPEG de no máximo 1600px).
- Enquanto nada foi salvo pelo painel, o site usa `src/content/imoveis-seed.ts`.
- Local, sem token do Blob: os dados ficam em `.data/` e as fotos em `public/uploads/`.

Para anúncios de imóveis sem página própria, use a página genérica:
`/imovel?nome=Casa%20no%20Centro&valor=450.000`

## Rastreamento (Meta Pixel + API de Conversões)

**Regra:** só conta como `Lead` quem tem entrada.

Todo botão de WhatsApp abre uma única pergunta. Nas páginas de imóvel, as opções
usam faixas calculadas a partir da entrada mínima, que por padrão é 20% do preço.
Para um imóvel de R$ 385.000:

| Opção | Evento |
|---|---|
| Tenho R$ 77 mil ou mais | `Lead` (`entrada: completa`) |
| Tenho entre R$ 39 mil e R$ 77 mil | `Lead` (`entrada: parcial`) |
| Tenho menos de R$ 39 mil ou não tenho | `SemEntrada` (evento personalizado, **não** é Lead) |

Quem abre a pergunta também gera `AbriuEnquete` (só Pixel), para ver o funil.

**Uso sugerido no Meta Ads:**
- Crie um público personalizado com quem disparou `SemEntrada` e **exclua-o** das campanhas.
- Com volume suficiente, crie a conversão personalizada `Lead` + `entrada = completa`.

| Arquivo | Papel |
|---|---|
| `src/lib/lead.ts` | Faixas, regra de qualificação e mensagem do WhatsApp (testes em `lead.test.ts`) |
| `src/components/lead/LeadProvider.tsx` | Pergunta e redirecionamento para o WhatsApp |
| `src/app/api/meta/route.ts` | API de Conversões (aceita só `Lead` e `SemEntrada`) |
| `src/app/(site)/layout.tsx` | Pixel (`PageView`). Fica fora do `/admin` |

Para testar sem sujar os dados, defina `META_TEST_EVENT_CODE` com o código da aba
*Testar eventos* do Events Manager.
