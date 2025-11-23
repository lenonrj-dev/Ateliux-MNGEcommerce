// app/(shell)/dashboard/page.jsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardsRow from "../../../components/dashboard/Cards";
import {
  RevenueChart,
  OrdersChart,
  CustomersChart,
} from "../../../components/dashboard/Charts";
import DeliveryMap from "../../../components/dashboard/DeliveryMap";
import Timeline from "../../../components/dashboard/Timeline";
import RecentOrders from "../../../components/dashboard/RecentOrders";
import Trending from "../../../components/dashboard/Trending";

// Card shell reutilizável para padronizar UI e acessibilidade
function Card({ title, children, regionId, className = "" }) {
  return (
    <motion.section
      role="region"
      aria-labelledby={regionId}
      tabIndex={0}
      className={`rounded-2xl border border-slate-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {title ? (
        <div className="p-4">
          <h2
            id={regionId}
            className="text-sm font-medium text-slate-800 tracking-wide"
          >
            {title}
          </h2>
        </div>
      ) : null}
      {children}
    </motion.section>
  );
}

export default function DashboardPage() {
  const reduce = useReducedMotion();

  // Variants para entrada em grupo
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Título */}
      <motion.h1
        className="text-2xl font-semibold text-slate-900 tracking-tight"
        variants={{ hidden: { y: 6, opacity: 0 }, show: { y: 0, opacity: 1 } }}
      >
        Visão geral
      </motion.h1>

      {/* KPIs + Gráficos */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      >
        <Card regionId="kpi-revenue">
          <div className="px-4 pb-4">
            <CardsRow title="Faturamento diário" value="R$ 18.400" delta="+1,2%" />
            <div className="mt-2">
              <RevenueChart />
            </div>
          </div>
        </Card>

        <Card regionId="kpi-orders">
          <div className="px-4 pb-4">
            <CardsRow title="Pedidos diários" value="240" delta="+2,0%" />
            <div className="mt-2">
              <OrdersChart />
            </div>
          </div>
        </Card>

        <Card regionId="kpi-customers">
          <div className="px-4 pb-4">
            <CardsRow title="Novos clientes" value="72" delta="+0,8%" />
            <div className="mt-2">
              <CustomersChart />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Mapa (2 colunas) + Timeline (1 coluna) — preenche a linha sem buracos */}
      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      >
        <Card title="Mapa de entregas" regionId="mapa-entregas" className="lg:col-span-2">
          <div className="px-4 pb-4">
            <DeliveryMap />
          </div>
        </Card>

        <Card title="Linha do tempo" regionId="linha-tempo">
          <div className="px-4 pb-4">
            <Timeline />
          </div>
        </Card>
      </motion.div>

      {/* Produtos em alta — fica acima para não sobrar espaço ao lado dos pedidos */}
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <Card title="Produtos em alta" regionId="produtos-em-alta">
          <div className="px-4 pb-4">
            <Trending />
          </div>
        </Card>
      </motion.div>

      {/* Pedidos recentes — ocupa toda a base */}
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <Card title="Pedidos recentes" regionId="pedidos-recentes">
          <RecentOrders /> {/* o componente já tem padding interno */}
        </Card>
      </motion.div>
    </motion.div>
  );
}
