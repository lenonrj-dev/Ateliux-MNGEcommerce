// components/dashboard/Charts.jsx
"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { revenueData, ordersData, customersData } from "../../lib/mockData";

// Tooltip genérico com tema claro e semântica acessível
function CardTooltip({ active, payload, label, prefix = "", suffix = "" }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div
      role="dialog"
      aria-label="Detalhe do ponto do gráfico"
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-slate-900">
        {prefix}
        {Intl.NumberFormat("pt-BR").format(val)}
        {suffix}
      </div>
    </div>
  );
}

// Estilos compartilhados (tema claro)
const gridProps = { strokeDasharray: "3 3", stroke: "#E5E7EB" }; // slate-200
const xTick = { fill: "#6B7280", fontSize: 12 }; // slate-500
const yTick = { fill: "#6B7280", fontSize: 12 };

export function RevenueChart() {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={revenueData}
          margin={{ left: 8, right: 16, top: 10, bottom: 0 }}
        >
          {/* Gradiente azul suave */}
          <defs>
            <linearGradient id="revLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.25} />
            </linearGradient>
          </defs>

          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" tick={xTick} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
          <YAxis
            tick={yTick}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            tickFormatter={(v) =>
              `R$ ${(v / 1000).toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })} mil`
            }
          />
          <Tooltip content={<CardTooltip prefix="R$ " />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#revLine)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart() {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ordersData}
          margin={{ left: 8, right: 16, top: 10, bottom: 0 }}
        >
          {/* Gradiente verde suave */}
          <defs>
            <linearGradient id="ordersBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.35} />
            </linearGradient>
          </defs>

          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" tick={xTick} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
          <YAxis tick={yTick} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
          <Tooltip content={<CardTooltip />} />
          <Bar
            dataKey="value"
            fill="url(#ordersBar)"
            radius={[10, 10, 0, 0]}
            animationDuration={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CustomersChart() {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={customersData}
          margin={{ left: 8, right: 16, top: 10, bottom: 0 }}
        >
          {/* Gradiente roxo suave */}
          <defs>
            <linearGradient id="customersBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.35} />
            </linearGradient>
          </defs>

          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" tick={xTick} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
          <YAxis tick={yTick} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
          <Tooltip content={<CardTooltip />} />
          <Bar
            dataKey="value"
            fill="url(#customersBar)"
            radius={[10, 10, 0, 0]}
            animationDuration={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
