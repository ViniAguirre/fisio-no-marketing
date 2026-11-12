import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || 'https://fisio.antidotodigital.com.br').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'seo-files',
        generateBundle() {
          const day = new Date().toISOString().slice(0, 10)
          this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` })
          this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${day}</lastmod><priority>1.0</priority></url>\n</urlset>\n` })
          this.emitFile({ type: 'asset', fileName: 'llms.txt', source: [
            '# Fisio no Marketing',
            '',
            '> Projeto de Vinicius Aguirre (fisioterapeuta de formação, com carreira empresarial e a saúde como maior expertise) para ajudar fisioterapeutas a organizar a base da clínica: site, uso profissional de IA, processos, dados e vendas.',
            '',
            '## Ofertas',
            '- Comunidade gratuita no WhatsApp: prompts gratuitos, algumas aulas abertas e networking.',
            '- Pacote Anual, R$ 997 à vista (ou em até 10x no cartão, com acréscimo da taxa do cartão; contratação pelo WhatsApp): encontros semanais por Google Meet; skills de uso diário (artes, copys, scripts, landing pages); código de indicação com 15% do valor do pacote por novo participante; site e blog otimizados e conectados ao Google; IA autônoma própria; participação na construção de um sistema de gestão de clínicas feito pela comunidade.',
            '- Não incluso no Pacote Anual: servidor VPS (cerca de R$ 40 por mês), domínio (geralmente até R$ 50) e custo de uso do modelo de IA (varia).',
            '',
            '## Página',
            `- ${siteUrl}/`,
            ''].join('\n') })
        },
      },
      {
        name: 'inject-site-url',
        transformIndexHtml(html) {
          return html.replaceAll('__SITE_URL__', siteUrl)
        },
      },
    ],
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
