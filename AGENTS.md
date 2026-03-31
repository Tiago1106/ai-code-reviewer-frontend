# AI Code Reviewer (Frontend)

## Objetivo
Aplicação web que envia um trecho de código para a API e renderiza um review estruturado.

O MVP foca no fluxo de produto e na qualidade de UI:
- Home (explica o app)
- Tela de revisão (linguagem + editor + contexto)
- Tela de resultado (busca por `id` e renderiza)
- Sem login/histórico no MVP

Depois do MVP: i18n, resultados reais via Ollama, autenticação + histórico, e review de PR do GitHub.

## Tecnologias (alvo)
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Componente `CodeBlock` customizado (sem dependência de editor externo)
  - Syntax highlight via `highlight.js` (leve, sem overhead de editor completo)
  - Estilo inspirado no ray.so (fundo escuro, line numbers, fonte monospace)

## Compatibilidade
- Node.js: usar a versão instalada no ambiente (evitar APIs experimentais)
- Gerenciador: npm

## Tipografia
- **JetBrains Mono**: títulos, labels, badges, botões, line numbers, código — tudo que é "terminal-like"
- **IBM Plex Mono**: textos descritivos, explicações, recommendations — corpo de texto monospace mais legível
- Fallback: `monospace`
- Todas as fontes são monospace — estética de terminal/developer

## Estrutura de pastas (planejada)
- `app/` (App Router)
- `app/page.tsx` (Home)
- `app/review/page.tsx` (Revisão)
- `app/result/[id]/page.tsx` (Resultado)
- `components/`
- `components/states/` (Loading, Empty, Error)
- `lib/api.ts` (client para API)
- `lib/types.ts` (contratos)

## Componentes reutilizáveis (MVP)
Objetivo:
- Evitar duplicação e padronizar UI e estados.

Sugestão:
- `components/ui/`:
  - `Button`
  - `Select`
  - `Textarea`
  - `Badge` (severity/category)
  - `CodeBlock` (exibição de código com syntax highlight e suporte a diff)
- `components/states/`:
  - `LoadingState`
  - `EmptyState`
  - `ErrorState` (com ação de retry quando fizer sentido)

## Como rodar (MVP)
- Web: http://localhost:3000

Comandos (npm):
- `npm install`
- `npm run dev`

## Variáveis de ambiente (MVP)
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`

Observação:
- `NEXT_PUBLIC_*` fica exposto no browser, então nunca colocar segredos aqui.

## Arquivo .env (MVP)
- Criar `.env.local` com `NEXT_PUBLIC_API_BASE_URL`
- Manter um `.env.example` no repositório (sem segredos) para facilitar setup

## Networking (MVP)
- O formulário de review e o CodeBlock exigem componente client (`"use client"`)
- Requests para API via `fetch` com tratamento de erro e estado de loading
- (Opcional) usar `AbortController` para cancelar request ao trocar de rota

## Notas de arquitetura (Next)
- Por padrão, páginas são Server Components; o formulário de review deve ficar em Client Component
- A página `/result/[id]` pode ser Server Component (fetch no servidor) ou Client Component (fetch no browser)

## Feedback de navegação (MVP)
- Ao clicar "Revisar":
  - Texto do botão muda de `$ revisar_codigo` para `$ analisando...`
  - Campos do formulário (linguagem, código, contexto) ficam com opacity 0.4
  - Botão fica desabilitado (sem clique duplo)
- Ao navegar para `/result/[id]`, a página mostra skeleton/spinner até o fetch completar
- Considerar `useRouter` do Next.js para navegação programática após POST

## Rotas (MVP)
- `/` Home
- `/review` Criar uma revisão
- `/result/[id]` Resultado (carrega da API)

## Fluxo de UX (MVP)
1. Usuário vai em `/review`
2. Seleciona a linguagem (lista pré-definida)
3. Cola/escreve o código no textarea (estilizado como CodeBlock)
4. (Opcional) adiciona contexto
5. Clica em "Revisar"
6. Frontend chama `POST {API_BASE_URL}/reviews`
7. Backend retorna `{ id }`
8. Front navega para `/result/{id}`
9. A página de resultado chama `GET {API_BASE_URL}/reviews/{id}` e renderiza

## Lista de linguagens (MVP)
Usar estas opções:
- JavaScript (`javascript`)
- TypeScript (`typescript`)
- Python (`python`)
- Go (`go`)
- Java (`java`)

## Contratos de API (MVP)

### POST /reviews
Request:
```ts
type CreateReviewRequest = {
  language: 'javascript' | 'typescript' | 'python' | 'go' | 'java'
  code: string
  context?: string
}
```

Response:
```ts
type CreateReviewResponse = { id: string }
```

### GET /reviews/:id
Response:
```ts
type GetReviewResponse = {
  id: string
  status: 'done'
  result: ReviewResult
}
```

`ReviewResult`:
```ts
type ReviewResult = {
  summary: string
  positives: { title: string; explanation: string }[]
  issues: {
    severity: 'low' | 'medium' | 'high' | 'critical'
    category: 'quality' | 'security' | 'performance'
    title: string
    explanation: string
    recommendation: string
    diff?: string
  }[]
  suggestions: string[]
  questions: string[]
  overallScore: number
}
```

## Design Tokens (Paleta de Cores)

### Backgrounds
| Token | Valor | Uso |
|-------|-------|-----|
| `bg-primary` | `#2B2B2B` | Fundo principal das páginas |
| `bg-surface` | `#333333` | Cards, inputs, selects |
| `bg-elevated` | `#3D3D3D` | Elementos elevados (hover, dropdowns) |
| `bg-codeblock` | `#1E1B2E` | Fundo do CodeBlock (escuro com tint roxo) |

### Borders
| Token | Valor | Uso |
|-------|-------|-----|
| `border` | `#4A4A4A` | Bordas padrão |

### Accent
| Token | Valor | Uso |
|-------|-------|-----|
| `accent-primary` | `#8B5CF6` | Cor de destaque principal (roxo) |

### Text
| Token | Valor | Uso |
|-------|-------|-----|
| `text-primary` | `#FAFAFA` | Texto principal |
| `text-secondary` | `#9CA3AF` | Texto secundário, placeholders |
| `text-tertiary` | `#6B6B6B` | Texto terciário, pontuação em código |

### Diff
| Token | Valor | Uso |
|-------|-------|-----|
| `diff-add-bg` | `#10B98140` | Fundo de linhas adicionadas |
| `diff-add-text` | `#10B981` | Texto de linhas adicionadas |
| `diff-remove-bg` | `#EF444440` | Fundo de linhas removidas |
| `diff-remove-text` | `#EF4444` | Texto de linhas removidas |

### Severity (semânticas)
| Token | Valor | Uso |
|-------|-------|-----|
| `severity-low` | `#10B981` | Badge low |
| `severity-medium` | `#F59E0B` | Badge medium |
| `severity-high` | `#EF4444` | Badge high |
| `severity-critical` | `#DC2626` | Badge critical |

### Regras de uso do `accent-primary` (#8B5CF6)
Purple APENAS em:
- Fill do `Button/Primary`
- Prompt `>` no logo
- Link ativo da navbar
- Texto e dot do hero tag
- Ícones dos feature cards (`[>]`, `[+/-]`, `[5]`)
- Prefixo `[+]` nos positives
- Texto `>>` nas recommendations dentro de issues
- Valor do score (número grande)

NÃO usar purple em:
- Títulos de seção (`// summary`, `// issues`, etc.) — usam `#FAFAFA` (text-primary)
- Fundo de inputs/selects — usam `#333333` (bg-surface)
- Fill do `Button/Secondary` — usa `#2B2B2B` (bg-primary)
- Placeholder text — usa `#9CA3AF` (text-secondary)

### Syntax Highlight (tokens do CodeBlock)
| Token | Cor | Exemplo |
|-------|-----|---------|
| keywords | `#C678DD` | `function`, `const`, `return`, `for` |
| strings | `#98C379` | `"hello"`, `'world'` |
| types/functions | `#61AFEF` | `calculateTotal`, `number`, `Array` |
| attributes/params | `#D19A66` | `items`, `price`, `total` |
| punctuation | `#6B6B6B` | `{`, `}`, `(`, `)`, `;` |

## Componente Navbar (`components/ui/Navbar`)
Barra de navegação reutilizável, presente em todas as páginas.

### Estrutura
- Logo: `> code_reviewer` (o `>` é purple accent-primary)
- Links: `home`, `review` (font: JetBrains Mono, 14px)
- CTA button: `$ start_review` (Button/Primary)
- Borda inferior: 1px `#4A4A4A`
- Padding: `16px 40px`

### Estado ativo
- Na Home: link "home" fica purple (`#8B5CF6`)
- Na Review: link "review" fica purple
- No Result: nenhum link ativo, CTA muda para `$ new_review`

## Componente CodeBlock (`components/ui/CodeBlock`)
Componente customizado (do zero, sem CodeMirror) para exibir código com estilo inspirado no ray.so.

### Estilo visual
- Fundo escuro (`#1E1B2E` — bg-codeblock)
- Borda arredondada (`rounded-lg`)
- Fonte: `JetBrains Mono` ou fallback `monospace`
- Line numbers visíveis (coluna separada, cor `#6B6B6B`)
- Padding interno consistente
- Sem line wrapping; scroll horizontal para linhas longas

### Props
```ts
type CodeBlockProps = {
  code: string
  language?: 'javascript' | 'typescript' | 'python' | 'go' | 'java'
  showLineNumbers?: boolean    // default: true
  maxHeight?: number           // em px; se ultrapassar, scroll vertical
  maxLines?: number            // limite de linhas exibidas (default: 500, trunca com "...")
  maxLength?: number           // limite de caracteres exibidos (trunca com "...")
  diff?: boolean               // se true, renderiza linhas no estilo diff (PR)
}
```

### Syntax highlight
- Usar `highlight.js` (import apenas as linguagens necessárias para manter bundle leve)
- Mapear linguagem -> módulo highlight.js:
  - `javascript` / `typescript`: `highlight.js/lib/languages/typescript`
  - `python`: `highlight.js/lib/languages/python`
  - `go`: `highlight.js/lib/languages/go`
  - `java`: `highlight.js/lib/languages/java`
- Tema: custom via Tailwind (não importar CSS do highlight.js; estilizar os tokens manualmente)

### Modo diff (`diff={true}`)
Quando `diff` é `true`, o componente interpreta o `code` como unified diff:
- Linhas com prefixo `-`: fundo vermelho suave, texto vermelho
- Linhas com prefixo `+`: fundo verde suave, texto verde
- Linhas sem prefixo: fundo neutro (contexto)
- O prefixo (`+`/`-`) fica visível na linha
- Line numbers contam apenas linhas de contexto e do respectivo lado (old/new)

### Modo input (na página `/review`)
Na tela de revisão, o usuário precisa digitar/colar código. Opções:
- Usar um `<textarea>` estilizado com a mesma aparência do CodeBlock (fundo escuro, fonte mono)
- O `CodeBlock` em si é somente leitura (exibição); a entrada de código fica no textarea
- Syntax highlight no textarea é opcional no MVP (pode ser adicionado depois)

### Uso no projeto
- `/review`: textarea estilizado para input de código (estilo visual do CodeBlock)
- `/result/[id]`: `CodeBlock` para exibir diffs das issues
- Reutilizável em qualquer lugar que precise exibir código

## Estados de erro e loading
- `/review`: desabilitar submit enquanto o request estiver em andamento; mostrar erro se falhar
- `/result/[id]`:
  - loading (skeleton/spinner simples)
  - 404: "ID inválido ou expirado" e link para `/review`
  - erro genérico: botão de tentar de novo

### Tratamento de erros HTTP
- Timeout: definir timeout de 15s no fetch; mostrar mensagem de timeout com retry
- Erro de rede (offline / `TypeError: Failed to fetch`): mensagem "Sem conexão" com retry
- Resposta com body inválido (JSON parse error): tratar como erro genérico
- Status 400: mostrar mensagem genérica (validação deveria ter pego no frontend)
- Status 500: mensagem genérica com retry

## Validação no frontend (MVP)
Validar antes de enviar o request para evitar roundtrips desnecessários:
- Linguagem: obrigatória (select deve ter valor selecionado)
- Código: não pode estar vazio ou conter apenas espaços
- Contexto: opcional, sem validação
- Desabilitar botão de submit se a validação não passar
- Mostrar mensagens de validação inline (não usar `alert`)

## Responsividade (MVP)
- Desktop-first, mas o layout não pode quebrar em telas menores
- Breakpoint mínimo funcional: 375px (mobile comum)
- O editor de código pode ter scroll horizontal em telas pequenas
- Evitar layouts lado a lado que não colapsam em mobile

## Renderização do resultado (`/result/[id]`)

### Layout geral
- Navbar (sem link ativo, CTA `$ new_review`)
- Content wrapper: 960px centralizado, padding 48px 80px
- Seções empilhadas verticalmente com gap 40px

### Header
- Lado esquerdo: título `$ review_result`, metadata (linguagem, timestamp, status)
- Lado direito: **Donut chart** (ring chart 100x100px)
  - Track: ellipse com stroke 8px `#4A4A4A`
  - Arc: path com stroke 8px `#8B5CF6`, preenchimento proporcional ao score (60% para 6/10)
  - Centro: score value em `#8B5CF6` (fontSize 24, bold) + `/10` em `#9CA3AF` (fontSize 12)

### Seções do resultado
1. **Summary** (`// summary`) — card com borda, texto corrido
2. **Positives** (`// positives`) — lista de cards com prefixo `[+]` em purple
3. **Issues** (`// issues [N]`) — cards com:
   - Header: badges de severity (cor semântica) + category
   - Título (bold)
   - Explicação (texto corrido)
   - Recommendation com prefixo `>>` em purple
   - DiffBlock (CodeBlock com diff=true)
4. **Suggestions** (`// suggestions`) — cards com prefixo `>>` em purple, texto de sugestão
5. **Questions** (`// questions`) — cards com prefixo `?` em amarelo (`#F59E0B`), texto da pergunta

### Renderização de diff nas issues (MVP)
Quando uma issue tem o campo `diff`, usar `<CodeBlock code={diff} diff={true} />`:
- Cada linha que começa com `-` é uma remoção (fundo vermelho claro, texto vermelho)
- Cada linha que começa com `+` é uma adição (fundo verde claro, texto verde)
- Linhas sem prefixo são contexto (fundo neutro)
- Usar fonte monospace, mesmo estilo do CodeBlock
- Exibir dentro de um bloco com borda arredondada e scroll horizontal

Exemplo visual (como o GitHub mostra em PRs):
```
- file_get_contents(NEXMO_APPLICATION_PRIVATE_KEY_PATH),
- NEXMO_APPLICATION_ID
+ file_get_contents(VONAGE_APPLICATION_PRIVATE_KEY_PATH),
+ VONAGE_APPLICATION_ID
```

## Padrões de acessibilidade (MVP)
- Inputs com `label`
- Foco visível (tailwind focus ring)
- Botão de submit com `aria-busy` durante request

## Testes (MVP)
Estratégia mínima para garantir que o fluxo funciona:

Unit tests:
- `lib/api.ts`: testar chamadas de fetch (mock de fetch/responses)
- Componentes de estado: renderizam corretamente com props válidas

Ferramentas:
- Vitest (ou Jest) + React Testing Library
- MSW (Mock Service Worker) para mockar a API nos testes

Scripts:
- `npm run test`
- `npm run test:watch`

Nota: testes e2e (Playwright/Cypress) ficam para pós-MVP.

## Plano de i18n (pós-MVP)
Queremos PT-BR e EN.

Proposta:
- Adicionar i18n depois do MVP estar estável (para não aumentar escopo agora)
- Opções técnicas:
  - `next-intl` (recomendado)
  - ou i18n por rotas do Next
- Manter contratos da API neutros; strings do UI ficam no frontend
- Arquivos de tradução por chave:
  - `messages/en.json`
  - `messages/pt-BR.json`

MVP: usar uma língua (PT-BR) para reduzir escopo.

## Estrutura de i18n (pós-MVP)
- Evitar strings hardcoded em componentes (quando migrar para i18n)
- Centralizar textos por chaves
- Considerar locale no path (ex: `/pt-BR/...` e `/en/...`) dependendo da lib escolhida

## Roadmap

### MVP (Agora)
- 3 rotas + fluxo ponta a ponta
- Tailwind layout
- CodeBlock customizado com syntax highlight e modo diff
- Renderer do resultado mock

### Nova feature: Resultado real via IA
- Se o backend virar assíncrono: lidar com `status: processing|done|error`
- Melhorar formatação de sugestões com código

### Nova feature: Auth + historico
- Login via GitHub OAuth
- Páginas de perfil e histórico

## Scripts (quando o projeto for criado)
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

### Nova feature: GitHub PR Review
- Selecionar repo + PR e disparar review

### Projeto final
- i18n (PT-BR/EN)
- UI polida + formatos de export (Markdown)
- Performance (cache, paginação/virtualização quando fizer sentido)
