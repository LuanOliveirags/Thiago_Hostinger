# Changelog

Todas as mudanças notáveis neste projeto são documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).  
Versionamento seguindo [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

---

## [2.0.0] — 2026-04-21

### Adicionado
- Arquitetura feature-oriented em `src/features/` (Fase 2)
- Pipeline de build com Vite 5 (`npm run dev`, `npm run build`)
- Suite de testes automatizados com Vitest 2 + jsdom (17 → 29 testes)
- Workflow de staging automático (`develop` → `gh-pages-staging`)
- Monitoramento de erros em produção com Sentry (`VITE_SENTRY_DSN`)
- Observabilidade de eventos críticos via GA4 (`VITE_GA_MEASUREMENT_ID`)
  - Rastreamento de CTAs, abertura de modal, FAQ, carrossel e scroll depth
- Otimizações de performance: preload de LCP, `fetchpriority="high"`, `rel="preconnect"` para CDN
- Separação do chunk do Sentry para não bloquear o bundle principal
- Drop automático de `console.log`/`debugger` no build de produção
- Processo formal de release com scripts `release:patch/minor/major`
- Workflow de criação de GitHub Release em tags `v*.*.*`
- Arquivo `.env.example` com documentação das variáveis de ambiente

### Alterado
- Canonical URL e Open Graph atualizados para `thiagobazillio.shop`
- Todos os links `target="_blank"` agora incluem `rel="noopener noreferrer"`
- `vite.config.js` usa forma funcional (`defineConfig(({ command }) => ...)`) para separar configuração de dev/build
- Workflows `deploy.yml` e `staging.yml` recebem env vars de secrets do GitHub

### Corrigido
- URLs do meta OG e canonical apontavam para domínio desatualizado

---

## [1.0.0] — 2026-04-14

### Adicionado
- Estrutura base modular em `js/` (Fase 1)
- Correção de bugs críticos: `initModalImage()` vazio, orphan em `resultados.js`
- ESLint 8 + Prettier 3 + `.gitignore`
- SEO completo: meta description, keywords, Open Graph, Twitter Card, canonical
- `loading="lazy"` em todas as 15 imagens da galeria
- GitHub Actions: `ci.yml` (lint + format) e `deploy.yml` (GitHub Pages)
- `README.md` e `PLAYBOOK.md`

---

[Unreleased]: https://github.com/seu-usuario/thiago-bazillio-site/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/seu-usuario/thiago-bazillio-site/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/seu-usuario/thiago-bazillio-site/releases/tag/v1.0.0
