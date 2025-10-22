# Mini CRM - BrasilAPI (Mock)

Aplicacao SPA em React 19 que simula um funil de prospeccao B2B consumindo a [BrasilAPI](https://brasilapi.com.br/) para enriquecer dados de leads. O projeto demonstra praticas modernas de frontend: autenticacao mockada com persistencia, rotas protegidas via TanStack Router, data fetching com TanStack Query, formularios tipados (React Hook Form + Zod), design system com Tailwind + Radix/shadcn e visualizacoes com Recharts.

## Destaques Rapidos
- **Stack:** Vite, React 19, TypeScript.
- **UX/UI:** Tailwind CSS, componentes shadcn/Radix, tema claro com gradientes e badges acessiveis.
- **Estado e Dados:** TanStack Router, TanStack Query, interceptadores Axios com injecao de token.
- **Formularios:** React Hook Form + Zod com enriquecimento por CNPJ/CEP.
- **Charts:** Recharts para pipeline, distribuicao por cidade e progresso da meta.
- **Qualidade:** ESLint, Vitest, Testing Library, MSW preparado para mocks.

## Arquitetura
- **TanStack Router:** separa rotas publicas (`/login`) e autenticadas (`/`, `/leads`, `/leads/novo`, `/leads/:leadId`) com guards e redirecionamentos.
- **Auth mockada:** sessao persistida em `localStorage`; Axios injeta token e trata erros em um unico interceptor.
- **TanStack Query:** cache local para leads, com invalidacao apos criar, editar ou resetar.
- **Formularios tipados:** React Hook Form + Zod garantem validacao consistente e enrichment via BrasilAPI.
- **Design System:** componentes compartilhados em `src/components/ui` seguindo o estilo shadcn; foco em reuso e acessibilidade.
- **Recharts:** dashboards com pipeline compacto, distribuicao por cidade e progresso da meta mensal.

## Fluxos principais
1. **Login mockado**: credenciais pre-definidas geram token fake e liberam as rotas protegidas.
2. **Dashboard**: cards de resumo, pipeline, graficos de distribuicao e progresso.
3. **Listagem de Leads**: busca, filtro por etapa, CSV export e link para detalhes.
4. **Novo Lead**: enriquecimento via CNPJ/CEP, selecao de banco e salvamento com feedback.
5. **Detalhes do Lead**: ficha completa com dados oficiais, notas internas e proximos passos sugeridos.

## Credenciais mock
- Email: `pedro@mini-crm.dev`
- Senha: `123456`

> Autenticacao e dados sao inteiramente mockados e ficam somente no navegador.

## Como rodar
```bash
# instalar dependencias
npm install

# executar em modo desenvolvimento
npm run dev
```
O Vite sobe por padrao em `http://localhost:5173`. Para build de producao, use `npm run build`.

## Scripts uteis
| Comando             | Descricao                                                   |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Ambiente de desenvolvimento com HMR                         |
| `npm run build`     | Gera build de producao (`dist/`)                            |
| `npm run preview`   | Servidor de preview da build                                |
| `npm run lint`      | ESLint com configuracao TypeScript + React Hooks + Refresh |
| `npm run test`      | Vitest em modo run (jsdom)                                  |
| `npm run test:watch`| Vitest em modo watch                                        |

## Estrutura de pastas
```
src/
├─ app/                 # bootstrap (router, providers, query client)
├─ components/          # ui compartilhados + telas de feedback
│  └─ ui/               # design system (button, input, select, etc.)
├─ features/
│  ├─ auth/             # provider, mocks, login
│  ├─ dashboard/        # pagina e widgets do dashboard
│  └─ leads/            # hooks, schemas, paginas (lista, novo, detalhes)
├─ layouts/             # AppLayout protegido e PublicLayout
├─ lib/                 # http client, formatters, utils
├─ services/            # integracoes com BrasilAPI
├─ styles/              # Tailwind globals + tokens de tema (modo claro)
└─ test/                # setup Vitest + MSW
```

## Design System
- Tokens de cor em HSL com tema claro, gradientes suaves e badges com alto contraste.
- Componentes baseados em shadcn/ui (Button, Select, Label, Slider, etc.) usando Radix.
- Utilitario `cn()` (clsx + tailwind-merge) evita conflitos de classe.
- Paginacao customizada com Radix Dropdown e alinhamento responsivo.

## APIs e dados
- **BrasilAPI**
  - `/cnpj/v1/{cnpj}` para enriquecer dados corporativos.
  - `/cep/v2/{cep}` para endereco.
  - `/banks/v1` listado no select de bancos.
- **Repositorio local de leads**
  - Persistido via `localStorage` com dataset inicial mockado.
  - CRUD (list, find, create, update, reset) em `lead-repository.ts`.

## Testes
- Vitest + Testing Library configurados em `src/test/setup.ts`.
- MSW pronto para handlers customizados.
- Cenarios sugeridos:
  - Login (sucesso/erro) com React Hook Form.
  - Enriquecimento por CNPJ/CEP com mocks MSW.
  - Hooks de leads garantindo invalidacao de cache no TanStack Query.

## Roadmap sugerido
1. Criar tela `/leads/:leadId/edit` reaproveitando o formulario.
2. Adicionar historico de atividades e timeline por lead.
3. Incluir novos graficos (pizza por etapa, receita prevista).
4. Implementar toggle light/dark com os mesmos tokens.
5. Cobrir fluxo end-to-end com Playwright ou Cypress.
6. Configurar pipeline de deploy (Vercel, Netlify ou GitHub Pages).

---
