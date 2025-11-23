// components/orders/StatusBadge.jsx
"use client";

import { CheckCircle, Truck, Clock, AlertCircle } from "lucide-react";

export default function StatusBadge({ status = "Indefinido" }) {
  const s = String(status).trim();

  // Cores (tema claro) por status
  const tone =
    /^Pronto$/i.test(s)
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : /^A caminho$/i.test(s)
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : /^Pendente$/i.test(s)
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  // Ícone por status
  const Icon = /^Pronto$/i.test(s)
    ? CheckCircle
    : /^A caminho$/i.test(s)
    ? Truck
    : /^Pendente$/i.test(s)
    ? Clock
    : AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tone}`}
      role="status"
      aria-label={`Status do pedido: ${s}`}
      title={s}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" aria-hidden="true" />
      <Icon size={14} aria-hidden="true" />
      <span className="leading-none">{s}</span>
    </span>
  );
}
