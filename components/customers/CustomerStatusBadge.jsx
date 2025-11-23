// components/customers/CustomerStatusBadge.jsx
"use client";

import { CheckCircle, Clock, AlertTriangle, Slash, Sparkles, UserX } from "lucide-react";

export default function CustomerStatusBadge({ status = "Indefinido" }) {
  const s = String(status).trim();

  // Paleta por status (tema claro)
  const tone =
    /^Ativo$/i.test(s)
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : /^Ocioso$/i.test(s)
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : /^(Inadimplente|Suspenso)$/i.test(s)
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : /^Bloqueado$/i.test(s)
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : /^Novo$/i.test(s)
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : /^Inativo$/i.test(s)
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  // Ícone por status (opcional, melhora scanning)
  const Icon = /^Ativo$/i.test(s)
    ? CheckCircle
    : /^Ocioso$/i.test(s)
    ? Clock
    : /^(Inadimplente|Suspenso)$/i.test(s)
    ? AlertTriangle
    : /^Bloqueado$/i.test(s)
    ? Slash
    : /^Novo$/i.test(s)
    ? Sparkles
    : /^Inativo$/i.test(s)
    ? UserX
    : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tone}`}
      role="status"
      aria-label={`Status do cliente: ${s}`}
      title={s}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" aria-hidden="true" />
      {Icon ? <Icon size={14} aria-hidden="true" /> : null}
      <span className="leading-none">{s}</span>
    </span>
  );
}
