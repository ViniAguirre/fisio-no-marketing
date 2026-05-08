---
id: 0001F
type: feature-about
slug: landing-page-setup
status: in-progress
created: 2026-05-08
updated: 2026-05-08
related: [OWNER]
---

## TL;DR

Transforma o `landing-page.jsx` existente num projeto Vite + React completo, deployável em VPS via Portainer (Docker). Inclui meta tags SEO, Open Graph, favicon, estrutura para analytics (GA / Meta Pixel) e `Dockerfile` + `docker-compose.yml` com nginx. Design e copy do JSX original permanecem 100% intactos.

## Problem

- `landing-page.jsx` existe isolado — sem bundler, `package.json`, `index.html`; não roda nem builda
- Sem meta tags, o link compartilhado no WhatsApp/Instagram não gera preview (crítico para viralização)
- Sem Dockerfile, não há caminho claro para deploy no VPS já existente com Portainer

## Users

| Role | Goal | Pain |
|---|---|---|
| Vini (owner) | Publicar a LP no domínio próprio | Código JSX pronto mas sem infraestrutura ao redor |
| Visitante fisioterapeuta | Acessar LP e entrar no grupo | — |

## Scope

**Includes:**
- Setup Vite + React com TailwindCSS (já usado no JSX)
- `index.html` com meta tags SEO (`title`, `description`, Open Graph, Twitter Card)
- Favicon integrado (arquivo fornecido pelo Vini)
- Placeholder comentado para Google Analytics e Meta Pixel em `index.html`
- `Dockerfile` multi-stage (build Vite → nginx serve estático)
- `docker-compose.yml` compatível com Portainer
- `.gitignore`, `README.md` com instruções de build e deploy
- `WHATSAPP_LINK` movido para variável de ambiente `.env`

**Does NOT Include:**
- Alteração de design, copy ou estrutura do JSX original (fora de escopo — "manter como está")
- Backend / API de captura de leads (próxima feature)
- CI/CD pipeline automático (pode ser feature futura; deploy manual via Portainer é suficiente agora)

## Success Metrics

| Metric | Target | Source |
|---|---|---|
| `npm run dev` funciona sem erros | 100% dos casos | Terminal local |
| `npm run build` gera `/dist` sem erros | 100% dos casos | Terminal local |
| Container Docker sobe sem erros | 1ª tentativa | Portainer logs |
| Preview OG aparece ao compartilhar URL | Aparece título + descrição | WhatsApp / Facebook debugger |

## References

- Arquivo fonte: `landing-page.jsx` (raiz do projeto)
- Deploy target: VPS com Portainer
- Favicon: a ser fornecido por Vini antes do commit final
