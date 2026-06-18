Markdown
# Instruções para Implementação de Rastreamento Meta (Pixel + API de Conversões)

## Contexto e Objetivo
Sua tarefa é implementar o rastreamento duplo (Deduplicação) do Meta Ads em um projeto Next.js 15 (App Router). 

Você deve usar o Meta Pixel no lado do cliente (Client-side) e a API de Conversões no lado do servidor (Server-side), disparando o evento "Lead" no botão que redireciona o usuário para o WhatsApp.

## Regra de Ouro
**Leia o código existente antes de alterar qualquer coisa.** Não suponha que determinados métodos, componentes ou caminhos existam com nomes específicos. Localize o arquivo de Layout principal e o componente onde o botão do WhatsApp foi criado na etapa anterior. O novo código de rastreamento deve se adaptar ao código existente de forma natural, sem reescrever a estrutura ou o design que já está funcionando.

## Passo a Passo da Implementação

### 1. Variáveis de Ambiente
Crie ou atualize o arquivo `.env.local` na raiz do projeto com as credenciais reais fornecidas:
```env
NEXT_PUBLIC_META_PIXEL_ID=1496534501790335
META_ACCESS_TOKEN=EAASpp0bnUKUBR6zuFez1SKOVW8vz6IalnqpeGJcgGwCUvakI6uujDTA7WB22FhFofy4IewZABPymYmp9FNuKHQ8FEO3UVjD2b7MkD8YBPoiT1hhBc2UvrdwytFFNzsuX8IZAkaWX8RjkeFYQt2hxpF7BkqM9yU3eZBDbRLRMup3eJ3k3DOPIV33AryF3Y05SAZDZD
2. Configuração do Pixel Base (Client-side)
Ação: Localize o arquivo principal de layout da aplicação (geralmente src/app/layout.tsx).

Implementação: Importe o componente <Script> do next/script e adicione o script base de inicialização do Meta Pixel dentro do <head> da aplicação, utilizando a estratégia afterInteractive.

Código a ser injetado:

TypeScript
<Script id="meta-pixel" strategy="afterInteractive">
  {\`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    '[https://connect.facebook.net/en_US/fbevents.js](https://connect.facebook.net/en_US/fbevents.js)');
    fbq('init', '\${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
    fbq('track', 'PageView');
  \`}
</Script>
Fallback (Noscript): Adicione a tag <noscript> correspondente logo após a abertura do <body> no mesmo arquivo layout.tsx:

TypeScript
<noscript>
  <img 
    height="1" 
    width="1" 
    style={{ display: 'none' }}
    src={\`https://www.facebook.com/tr?id=\${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1\`}
    alt=""
  />
</noscript>
3. Criação da Rota da API de Conversões (Server-side)
Ação: Crie um novo arquivo de rota para a API do Next.js. O caminho deve ser src/app/api/meta/route.ts.

Implementação: Crie uma função POST que receba no body da requisição os parâmetros event_id, event_url e client_user_agent.

Lógica: A rota deve fazer um fetch para a Graph API do Facebook (https://graph.facebook.com/v19.0/${process.env.NEXT_PUBLIC_META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}), enviando um payload JSON configurado para o evento Lead.

Mapeamento do Payload: - event_name deve ser "Lead".

action_source deve ser "website".

O event_id recebido no body DEVE ser repassado na raiz dos dados do evento para garantir a deduplicação com o Pixel do front-end.

Repasse o client_user_agent em user_data.client_user_agent.

Repasse a event_url em event_source_url.

4. Disparo do Evento (O Botão do WhatsApp)
Ação: Localize o(s) arquivo(s) onde o botão ou link de redirecionamento para o WhatsApp está renderizado.

Implementação: Mantenha a interface do botão intacta. Adicione ou adapte a diretiva para Client Component ("use client"). Intercepte o evento de clique (onClick).

Lógica do Clique:

Gere um identificador único com crypto.randomUUID() e guarde na variável eventId.

Capture a URL atual (window.location.href) e o User Agent (navigator.userAgent).

Dispare o evento para o Pixel no navegador: (window as any).fbq('track', 'Lead', {}, { eventID: eventId });

Dispare a requisição para a rota interna via fetch('/api/meta', { method: 'POST', body: JSON.stringify({ event_id: eventId, event_url: currentUrl, client_user_agent: userAgent }) }).

Importante: Não use await no fetch. A ação deve ocorrer em background para não atrasar o clique do usuário.

Redirecione o usuário para a URL original do WhatsApp.

Requisitos de Qualidade
Não quebre a tipagem do TypeScript. Adicione any na tipagem do window apenas para o fbq, evitando erros de compilação.

Retorne o código completo dos arquivos modificados para facilitar a cópia e substituição.