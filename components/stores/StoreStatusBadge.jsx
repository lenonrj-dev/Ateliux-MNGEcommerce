// components/stores/StoreStatusBadge.jsx
"use client";

import { CheckCircle, DoorClosed, Wrench, AlertTriangle, Clock } from "lucide-react";

export default function StoreStatusBadge({ status = "Indefinido" }) {
  const s = String(status).trim();

  // Paleta (tema claro) por status comum
  const tone =
    /^Aberta$/i.test(s)
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : /^(Fechada|Encerrada)$/i.test(s)
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : /^Em manuten[cç][aã]o$/i.test(s)
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : /^Alerta$/i.test(s)
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : /^Hor[áa]rio reduzido$/i.test(s)
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  // Ícone correspondente (opcional)
  const Icon = /^Aberta$/i.test(s)
    ? CheckCircle
    : /^(Fechada|Encerrada)$/i.test(s)
    ? DoorClosed
    : /^Em manuten[cç][aã]o$/i.test(s)
    ? Wrench
    : /^Alerta$/i.test(s)
    ? AlertTriangle
    : /^Hor[áa]rio reduzido$/i.test(s)
    ? Clock
    : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tone}`}
      role="status"
      aria-label={`Status da loja: ${s}`}
      title={s}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" aria-hidden="true" />
      {Icon ? <Icon size={14} aria-hidden="true" /> : null}
      <span className="leading-none">{/^(Fechada|Encerrada)$/i.test(s) ? "Fechada" : s}</span>
    </span>
  );
}
