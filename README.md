<div align="center">
  <h1>Ateliux Demo Ecommerce Dashboard</h1>
  <p><strong>Versão 0.3.0</strong> · Projeto #3 online · Next.js 15 + React 19 · Deploy otimizado para Vercel</p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15.5-black?logo=next.js" />
    <img src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Framer--motion-12-ff69b4?logo=framer&logoColor=white" />
  </p>
</div>

## O que é
Painel administrativo de ecommerce de comida brasileira, pronto para demos e deploy imediato na Vercel. Inclui KPIs, pedidos, produtos, clientes, entregadores, lojas e categorias — tudo em pt-BR, com dados mock realistas, animações suaves e mapa de entregas em modo produção (Centro de Volta Redonda/RJ).

## Mapa do projeto
```
app/
 ├─ layout.js           // Layout root (pt-BR, tema claro)
 ├─ page.js             // Redirect para /dashboard
 └─ (shell)/            // Área autenticada com sidebar/topbar
     ├─ layout.js       // Shell com Sidebar + Topbar + Provider
     ├─ loading.js      // Skeleton global do shell
     ├─ dashboard/      // Visão geral com KPIs, gráficos e mapa (charts lazy via dynamic import)
     ├─ pedidos/        // Tabela de pedidos + slide-over
     ├─ clientes/       // Tabela de clientes + slide-over
     ├─ produtos/       // Catálogo com grid/lista, filtros e slide-over
     ├─ categorias/     // Gestão de categorias com slide-over
     ├─ entregadores/   // Gestão de entregadores + avaliações
     └─ lojas/          // Gestão de lojas com modos list/map/grid

components/
 ├─ common/     // Sidebar, Topbar, UserProfileProvider, SlideOver
 ├─ dashboard/  // Cards, Charts, DeliveryMap, Timeline, Trending, RecentOrders
 ├─ orders/     // OrdersTable, Pagination, StatusBadge
 ├─ products/, categories/, customers/, couriers/, stores/ // Tabelas e badges

lib/
 ├─ mockData.js         // KPIs, trending, timeline, pedidos recentes
 ├─ ordersData.js       // Pedidos mockados (BRL, endereços BR)
 ├─ productsData.js     // Produtos brasileiros
 ├─ customersData.js    // Clientes brasileiros
 ├─ couriersData.js     // Entregadores brasileiros
 ├─ storesData.js       // Lojas brasileiras
 └─ categoriesData.js   // Categorias temáticas brasileiras

config:
 ├─ next.config.mjs     // output standalone, compress, imagens otimizadas (avif/webp), optimizePackageImports
 ├─ eslint.config.mjs   // Next core web vitals
 ├─ postcss.config.mjs  // Tailwind 4
 └─ package.json        // Scripts: dev/build/start/lint
```

## Alterações recentes (datadas)
- 2025-11-25 — Seletor de idioma funcional (persiste no perfil) e dropdown sem setas duplicadas; notificações sobre fundo branco e z-index alto para não serem encobertas.
- 2025-11-24 — Mapa de entregas em produção real, centralizado no Centro de Volta Redonda/RJ com mapa estático OSM e marcadores operacionais.
- 2025-11-23 — Readme revitalizado, versão 0.3.0 e mapeamento completo do projeto.
- 2025-11-23 — Correção de BOM em arquivos e lint zerado.
- 2025-11-23 — Deploy-hardened: Next config com `output: "standalone"`, compress, imagens AVIF/WEBP e import otimizado de `lucide-react`; scripts sem Turbopack para builds previsíveis na Vercel.
- 2025-11-22 — Dashboard brasileira (dados, moedas, nomes, endereços) e charts/mapa carregados via `next/dynamic` com skeletons.
- 2025-11-22 — Ajustes de acessibilidade, hidratação e UX (skeleton global, badges em pt-BR, tooltips e filtros).

## Como rodar
```bash
npm install
npm run dev     # ambiente local
npm run lint    # checagem
npm run build   # build de produção (standalone pronto p/ Vercel)
npm run start   # servir build
```

## Deploy na Vercel
- Output: `.next` (standalone), Node 18+.
- Scripts: `npm run build` / `npm run start`.
- Imagens remotas liberadas (Unsplash, Cloudinary, pravatar, OSM static map, etc.) com AVIF/WEBP.

<div align="center">
  <sub>Feito com café + código limpo. Surpreenda no GitHub com uma dashboard brasileira, rápida e pronta para produção.</sub>
</div>
