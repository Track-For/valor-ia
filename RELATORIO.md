# Relatório de implementação

## Conceito

**CAPITAL EM MOVIMENTO.**

A experiência usa uma única energia amarela como fio narrativo. Ela começa como luz e órbita no hero, vira progresso nos produtos, atravessa camadas de conhecimento e patrimônio, conecta empresas, desenha uma trajetória no simulador e converge no CTA final.

A direção visual mantém preto, grafite, branco e amarelo como único acento. O resultado evita iconografia de criptomoedas, gráficos de promessa, interfaces financeiras inventadas e dados comerciais não verificados.

## Seções

| Seção | Status | Observações |
|---|---|---|
| Header | Concluída | Navegação compacta no desktop, CTA oficial e menu fullscreen no mobile. |
| Preloader | Concluída | Ponto, linha e órbita em até 1,7 s. É ignorado com movimento reduzido. |
| Hero | Concluída | Headline institucional, órbita WebGL, resposta sutil ao ponteiro e fallback raster. |
| Universo XP | Concluída | Quatro superfícies de vidro com estado ativo e continuidade do CapitalFlow. |
| Produtos e serviços | Concluída | Pin horizontal no desktop e carrossel com scroll snap no mobile. |
| Informação e relatórios | Concluída com pendência de asset | Visual conceitual gerado. Deve ser trocado pela capa oficial do relatório. |
| Aplicativo XP | Concluída com pendência de asset | Estrutura 2.5D pronta. A tela está marcada como placeholder oficial pendente. |
| Wealth Planning | Concluída | Mudança deliberada para superfície clara, camadas concêntricas e conteúdo institucional. |
| XP Empresas | Concluída | Rede abstrata original, sem linguagem visual de blockchain. |
| Simulador | Concluída | Trajetória abstrata sem curva de rentabilidade ou recomendação fictícia. |
| Níveis de relacionamento | Concluída com validação pendente | Digital, Exclusive, Signature e Unique vieram do material fornecido. Nenhum benefício ou faixa foi inventado. |
| Institucional numérico | Omitida | Nenhum número histórico foi usado porque não havia confirmação no material inicial. |
| Manifesto | Concluída | Revelação progressiva das frases e retorno da órbita. |
| FAQ | Concluída | Accordion simples, navegável por teclado e sem espetáculo excessivo. |
| CTA final | Concluída | Linhas convergem para uma órbita com CTAs oficiais. |
| Footer | Concluída | Links institucionais e legais reorganizados, com aviso informativo resumido. |

## Efeitos

| Efeito | Propósito | Desktop | Mobile | Fallback |
|---|---|---|---|---|
| CapitalFlow | Unificar a narrativa | Linha lateral com progresso | Linha incorporada aos capítulos | Linha estática |
| Hero pin | Representar travessia e mudança de escala | Pin controlado apenas em telas acima de 1120 px e 720 px de altura | Movimento vertical ligado ao scroll | Hero estático completo |
| Órbita 3D | Materializar capital em movimento | Shader WebGL completo | Shader médio quando suportado | Imagem gerada |
| Cards de vidro | Comunicar camadas | Blur, saturação e highlight interno | CSS glass simplificado | Superfície sólida |
| Produtos horizontais | Mostrar amplitude do ecossistema | Pin e scrub sincronizados | Scroll snap de 86 vw | Rolagem horizontal nativa |
| Relatório editorial | Dar peso ao conteúdo | Escala e correção de rotação | Composição vertical | Imagem estática |
| Smartphone | Sugerir acesso integrado | Rotação 3D de -18 a 18 graus | Rotação reduzida | Placeholder estático |
| Capital Layers | Representar horizontes patrimoniais | Camadas com profundidade e contrarrotação | Camadas simplificadas | Imagem conceitual |
| Trajetória | Levar do presente à direção | Linha desenhada com scroll | Mesmo desenho em área menor | Linha completa |
| Tier stack | Mostrar evolução de relacionamento | Sticky stack de 76 vh | Sticky stack de 68 a 70 svh | Cards em sequência |
| Manifesto | Construir a mensagem em etapas | Pin e scrub de palavras | Pin mais compacto | Texto final visível |
| Convergência | Fechar o sistema visual | Linhas animadas convergentes | Menos área e mesma linguagem | Órbita estática |

## Shaders

- `HeroOrbit`: vertex e fragment shaders customizados com `uTime`, `uProgress`, `uMouse`, `uIntensity` e `uGlow`. Usa Fresnel discreto para misturar metal escuro e amarelo.
- O liquid glass dos cards foi implementado como aproximação web em CSS, com blur, saturação, borda e highlight interno. Não foi apresentado como material oficial Apple.
- A rede empresarial e as camadas patrimoniais usam assets raster originais e composição CSS/GSAP. Isso reduz custo de GPU e evita shaders sem função narrativa.

## Performance

- Canvas carregado dinamicamente apenas no cliente.
- `dpr` limitado a `[1, 1.5]` no nível alto e `[1, 1.2]` no médio.
- Render do canvas pausado fora da área visível com `IntersectionObserver`.
- `usePerformanceTier()` retorna `high`, `medium` ou `low` usando preferência de movimento, memória, núcleos e largura.
- Lenis e ScrollTrigger compartilham o ticker do GSAP.
- Todos os contextos GSAP, listeners, ticker e Lenis possuem cleanup.
- Imagens usam `next/image`, dimensões reservadas e `sizes` responsivo.
- A página foi prerenderizada como rota estática.

## Responsividade

Hero e overflow foram testados em:

- 320 x 568
- 360 x 800
- 375 x 812
- 390 x 844
- 430 x 932
- 768 x 1024
- 900 x 600
- 1024 x 768
- 1200 x 600
- 1366 x 768
- 1440 x 900
- 1920 x 1080

Todas as resoluções terminaram sem erro de página ou overflow horizontal. A largura de 768 px apresentou inicialmente 8 px de overflow no carrossel do Universo XP; o cálculo foi corrigido e revalidado com `scrollWidth` igual a `innerWidth`.

O hero também foi revalidado durante a rolagem em 900 x 600 e 1200 x 600. Nesses formatos compactos, o pin é removido e a órbita recebe apenas uma transformação sutil. Em desktops amplos, a escala máxima foi reduzida e o wash amarelo passou a ser difuso, evitando que a transição pareça um recorte do layout.

Em 390 x 844 e 1440 x 900 foram capturados hero, universo, produtos, relatório, app, wealth, empresas, simulador, tiers, manifesto, FAQ, CTA e footer. As imagens estão em `artifacts/visual/`.

## Acessibilidade

- Um único `h1` e hierarquia semântica de headings.
- Link de salto para o conteúdo principal.
- Estados de foco visíveis em amarelo.
- Botões e alvos com pelo menos 44 px.
- Navegação mobile com `aria-expanded`, `aria-controls` e fechamento explícito.
- FAQ com estado expandido e associação ao conteúdo.
- Canvas decorativo com conteúdo DOM equivalente e imagem de fallback.
- Contraste alto entre texto, superfícies e CTA.
- `prefers-reduced-motion` remove preloader, Lenis, pins, parallax, rotação, cursor e animações contínuas.
- `prefers-reduced-transparency` troca vidro por superfícies sólidas.

## Dados pendentes

- Logo oficial da XP em arquivo aprovado. O projeto atual não possuía esse asset.
- Valor oficial do amarelo XP, caso exista token corporativo diferente de `#FFE600`.
- Screenshot oficial e atual do aplicativo XP.
- Capa oficial do relatório Onde Investir.
- Confirmação institucional dos níveis Digital, Exclusive, Signature e Unique, com elegibilidade e condições.
- Texto jurídico final aprovado para o footer.
- Imagem Open Graph oficial.
- URLs de campanhas, taxas, produtos promocionais e condições comerciais. Nenhuma foi criada neste protótipo.

## Assets gerados

Modo usado: ferramenta integrada `imagegen`.

Arquivos finais no projeto:

- `public/images/capital-orbit.png`
- `public/images/capital-layers.png`
- `public/images/business-network.png`

Prompts finais:

1. Órbita: render 3D premium de uma fita metálica contínua em órbita aberta, metal preto e reflexos amarelos controlados, composição horizontal com espaço negativo à esquerda, sem logo, texto, moeda, gráfico, UI, azul ou roxo.
2. Camadas: natureza-morta 3D editorial com páginas de grafite, vidro fumê e uma fita amarela atravessando as camadas, composição 4:5, sem texto, logo, UI, percentuais, gráficos, pessoas ou moeda.
3. Empresas: campo 3D esparso de nós metálicos e filamentos, cinco núcleos amarelos ativos e uma corrente amarela, sem mapa, blockchain, hexágonos, circuitos, UI, texto, logo, moeda, azul ou roxo.

## Build

Executado em 14 de outubro de 2026:

| Comando | Resultado |
|---|---|
| `npm run build` | Aprovado. Compilação, TypeScript, geração estática e otimização concluídas. |
| `npm run lint` | Aprovado. Nenhum erro ou warning. |
| `npx tsc --noEmit` | Aprovado. Nenhum erro de tipo. |
| Playwright Core + Edge | Aprovado nos 10 viewports, sem erros de página nos testes finais. |
| `npm audit --omit=dev --audit-level=high` | Aprovado. Nenhuma vulnerabilidade em dependências de produção. |

Observação: o Next emitiu apenas um aviso de configuração do root do Turbopack porque existe outro `package-lock.json` acima do repositório. Esse aviso não impediu o build.

O CLI `shadcn`, adicionado pelo scaffold paralelo, permanece em `devDependencies`. A auditoria completa ainda sinaliza vulnerabilidades transitivas nessa ferramenta de desenvolvimento; nenhuma correção forçada foi aplicada porque a alternativa indicada pelo npm exige mudança incompatível de versão.
