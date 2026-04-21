# Thiago Bazillio — Site Oficial

Landing page de consultoria online de treinamento feminino.  
Publicado em: [thiagobazillio.shop](https://thiagobazillio.shop)

---

## Stack

- HTML5 + CSS3 + JavaScript (ES Modules)
- **Bundler**: [Vite 5](https://vitejs.dev/) — HMR em dev, build otimizado para prod
- **Testes**: [Vitest 2](https://vitest.dev/) + jsdom
- **Linting/Format**: ESLint 8 + Prettier 3
- **Deploy**: GitHub Pages via GitHub Actions

## Estrutura do projeto

```
index.html               # Ponto de entrada HTML único
vite.config.js           # Configuração do Vite
package.json
.env.example             # Variáveis de ambiente necessárias
│
├── public/
│     CNAME              # Domínio personalizado (thiagobazillio.shop)
│
├── css/
│     main.css           # Importa todos os módulos CSS
│     base/
│       style.css        # Reset e tipografia global
│       responsive.css   # Media queries globais
│       sec_generic.css  # Estilos genéricos de seção
│     layout/
│       header.css       # Header fixo
│       header_hero.css  # Variação hero do header
│       menu.css         # Menu mobile e desktop
│       palette.css      # Variáveis de cores e tokens
│       rodape.css       # Footer
│     components/
│       preloader.css    # Tela de carregamento
│       modal_img.css    # Modal de imagem em tela cheia
│     sections/
│       01_hero.css
│       02_consultoria.css
│       03_sobre.css
│       04_simetria.css
│       05_comofunciona.css
│       06_diferenciais.css
│       07_planos.css
│       08_resultados.css
│       09_feedback.css
│       10_faq.css
│
├── src/
│     main.js            # Entry point do Vite — dispara initApp()
│     app/
│       init.js          # Orquestra todas as features
│     shared/
│       constants.js     # Seletores e classes CSS reutilizáveis
│       dom.js           # Helpers de DOM (query, toggleClass…)
│     features/
│       menu/
│         menu.js        # Menu mobile + desktop
│       header/
│         header.js      # Efeito de scroll no header
│       preloader/
│         preloader.js   # Tela de carregamento
│       faq/
│         faq.js         # Accordion de perguntas
│       resultados/
│         modal-image.js # Modal de resultados (com setas)
│         resultados.js  # Lógica adicional de resultados
│       feedbacks/
│         carousel-feedback.js  # Carrossel com auto-slide e dots
│         feedbacks.js          # Lógica adicional de feedbacks
│       analytics/
│         analytics.js   # GA4 — rastreamento de eventos
│       monitoring/
│         sentry.js      # Sentry — monitoramento de erros (produção)
│
├── tests/
│     setup.js           # Mocks globais (matchMedia, IntersectionObserver…)
│     analytics.test.js
│     carousel.test.js
│     faq.test.js
│     header.test.js
│     menu.test.js
│     modal.test.js
│     preloader.test.js
│
├── docs/
│     CHANGELOG.md       # Histórico de versões
│     PLAYBOOK.md        # Guia de rollback e operações
│
├── img/                 # Imagens estáticas (IMG_*, F_*, logo, perfil…)
└── dist/                # Saída do build (gerado pelo Vite, não versionar)
```

---

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` — Vite serve com HMR (hot module replacement).

---

## Scripts disponíveis

```bash
npm run dev            # Servidor de desenvolvimento (Vite HMR)
npm run build          # Gera build de produção em dist/
npm run preview        # Prévia local do build gerado

npm run lint           # Verificar erros de lint
npm run lint:fix       # Corrigir erros de lint automaticamente
npm run format         # Formatar todos os arquivos
npm run format:check   # Verificar formatação (usado no CI)

npm run test           # Rodar testes uma vez
npm run test:watch     # Rodar testes em modo watch
npm run test:coverage  # Cobertura de código

npm run validate       # lint + format:check + test (pipeline completo)
```

---

## Como publicar

### Produção — GitHub Pages (automático)

Qualquer push para `main` dispara [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
1. `npm run validate` (lint + format + testes)
2. `npm run build` → gera `dist/`
3. Deploy do `dist/` para GitHub Pages

### Staging (automático)

Qualquer push para `develop` dispara [`.github/workflows/staging.yml`](.github/workflows/staging.yml):
1. `npm run validate`
2. `npm run build` → deploy para branch `gh-pages-staging`

---

## Como fazer rollback

Ver [PLAYBOOK.md](docs/PLAYBOOK.md).

---

## Funcionalidades críticas (não quebrar)

| Funcionalidade | Módulo responsável | Teste |
|---|---|---|
| Menu mobile (hamburguer + overlay) | `src/features/menu/menu.js` | `tests/menu.test.js` |
| FAQ accordion | `src/features/faq/faq.js` | `tests/faq.test.js` |
| Modal de resultados (com setas) | `src/features/resultados/modal-image.js` | `tests/modal.test.js` |
| Carrossel de feedbacks | `src/features/feedbacks/carousel-feedback.js` | `tests/carousel.test.js` |
| Preloader | `src/features/preloader/preloader.js` | `tests/preloader.test.js` |
| Efeito scroll no header | `src/features/header/header.js` | `tests/header.test.js` |
| Analytics GA4 | `src/features/analytics/analytics.js` | `tests/analytics.test.js` |
| Monitoramento Sentry | `src/features/monitoring/sentry.js` | — |
| Destaque de cards / reveal | `src/app/init.js` | — |

---

## Convenções

- **Nomeação de arquivos**: `kebab-case.js`
- **Funções exportadas**: `initNomeDaFeature()` — chamadas em `src/app/init.js`
- **Sem side-effects no nível de módulo**: toda lógica dentro de funções exportadas
- **Sem `var`**: usar `const` ou `let`
- **Sem `console.log` em produção**
- **Imagens estáticas**: mantidas em `img/` na raiz (Vite as serve como assets estáticos)
