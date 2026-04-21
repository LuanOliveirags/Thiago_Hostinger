# PLAYBOOK — Operação e Incidentes

Guia de referência rápida para deploy, rollback e resolução de problemas.

---

## 1. Deploy em produção

### Via GitHub Pages (automático)
```bash
git checkout main
git merge develop          # ou merge da PR aprovada
git push origin main
```
O GitHub Actions executa `validate` → `build` → deploy automaticamente.  
Acompanhe em: **repositório → Actions → Deploy — GitHub Pages**.

> O build gera `dist/` via Vite. O `dist/` é o que vai para o GitHub Pages — **não versionar `dist/`**.

### Via Hostinger (manual/FTP)
1. Execute `npm run build` localmente.
2. Acesse o painel Hostinger → **Gerenciador de Arquivos** → `public_html/`.
3. Faça upload do conteúdo de `dist/`: `index.html`, `assets/`, `img/`, `CNAME`.
4. **Não envie**: `src/`, `node_modules/`, `css/` (source), arquivos de config.
5. Valide o site em produção após o upload.

---

## 2. Rollback rápido

### Produção — GitHub Pages
```bash
# Identifica o commit estável anterior
git log --oneline main

# Cria um commit de reversão (não destrói histórico)
git revert <hash-do-commit-ruim>
git push origin main
```
O pipeline de deploy irá redeployar automaticamente com a versão revertida.

### Staging — gh-pages-staging
```bash
git checkout develop
git revert <hash-do-commit-ruim>
git push origin develop
```
O workflow `staging.yml` redeploya a branch `gh-pages-staging` automaticamente.

### Hostinger
1. Acesse o painel Hostinger → **Backups**.
2. Restaure o backup mais recente estável.
   - OU: re-faça o upload do `dist/` de uma versão anterior.

> **Boa prática**: antes de cada deploy manual na Hostinger, baixe um ZIP do `public_html/` atual como backup.

---

## 3. Checklist de release

Antes de publicar qualquer mudança em produção:

- [ ] `npm run validate` passou sem erros (lint + format + 17 testes)
- [ ] `npm run build` concluiu sem warnings críticos
- [ ] Testado localmente via `npm run dev` em Chrome + Firefox (mobile e desktop)
- [ ] Menu mobile abre e fecha corretamente
- [ ] FAQ accordion responde ao clique
- [ ] Modal de resultados abre com swipe funcional
- [ ] Carrossel de feedbacks avança e faz auto-slide
- [ ] Preloader aparece e some ao carregar a página
- [ ] Scroll suave dos links do menu funciona
- [ ] Links "Contratar agora" apontam para URLs corretas
- [ ] Nenhum erro no console do navegador (F12)

---

## 4. Monitoramento de erros front-end

Atualmente sem ferramenta de monitoramento configurada.

**Recomendação futura**: integrar [Sentry](https://sentry.io) com:
```html
<script src="https://browser.sentry-cdn.com/..."></script>
```
e inicializar em `src/main.js`:
```js
Sentry.init({ dsn: 'SUA_DSN_AQUI', environment: 'production' });
```

---

## 5. Ambientes

| Ambiente | Branch | URL | Workflow |
|---|---|---|---|
| `prod` | `main` | thiagobazillio.shop | `deploy.yml` — build + GitHub Pages |
| `staging` | `develop` | `gh-pages-staging` branch | `staging.yml` — build + branch |
| `dev` | local | localhost:5173 | `npm run dev` (Vite HMR) |

---

## 6. Testes automatizados

```bash
npm run test            # Roda todos os testes (17 no total)
npm run test:watch      # Modo watch para desenvolvimento
npm run test:coverage   # Relatório de cobertura em coverage/
```

Suítes de teste:

| Arquivo | Feature | Testes |
|---|---|---|
| `tests/faq.test.js` | FAQ accordion | 3 |
| `tests/menu.test.js` | Menu mobile | 3 |
| `tests/modal.test.js` | Modal de resultados | 5 |
| `tests/carousel.test.js` | Carrossel de feedbacks | 4 |
| `tests/preloader.test.js` | Preloader | 2 |

---

## 7. Contatos de emergência

- **Desenvolvedor**: [Luan Gs](https://www.instagram.com/luanoliveirags/)
- **Domínio**: Hostinger — painel em [hpanel.hostinger.com](https://hpanel.hostinger.com)
- **Repositório**: GitHub (verificar URL do repo)
