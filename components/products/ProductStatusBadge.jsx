// components/products/ProductStatusBadge.jsx
"use client";

import { CheckCircle, XCircle, PauseCircle, AlertTriangle, Clock } from "lucide-react";

export default function ProductStatusBadge({ status = "Indefinido" }) {
  const s = String(status).trim();

  // Paleta (tema claro) por status
  const tone =
    /^(Dispon[ií]vel)$/i.test(s)
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : /^(Indispon[ií]vel|Esgotado|Em falta)$/i.test(s)
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : /^Pausado$/i.test(s)
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : /^Em revis[aã]o$/i.test(s)
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : /^Com alerta$/i.test(s)
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  // Ícone correspondente (opcional, melhora escaneabilidade)
  const Icon =
    /^(Dispon[ií]vel)$/i.test(s)
      ? CheckCircle
      : /^(Indispon[ií]vel|Esgotado|Em falta)$/i.test(s)
      ? XCircle
      : /^Pausado$/i.test(s)
      ? PauseCircle
      : /^Em revis[aã]o$/i.test(s)
      ? Clock
      : /^Com alerta$/i.test(s)
      ? AlertTriangle
      : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tone}`}
      role="status"
      aria-label={`Status do produto: ${s}`}
      title={s}
    >
      {/* Pontinho usa currentColor para manter contraste automático */}
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" aria-hidden="true" />
      {Icon ? <Icon size={14} aria-hidden="true" /> : null}
      <span className="leading-none">{s}</span>
    </span>
  );
}
