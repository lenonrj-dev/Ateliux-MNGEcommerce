// components/couriers/CourierStatusBadge.jsx
"use client";

import {
  CheckCircle,
  Truck,
  Moon,
  Pause,
  Slash,
  AlertCircle,
} from "lucide-react";

export default function CourierStatusBadge({ status = "Indefinido" }) {
  const s = String(status).trim();

  // Cores (tema claro) por status
  const tone =
    /^(Dispon[ií]vel)$/i.test(s)
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : /^(Em entrega|Em rota)$/i.test(s)
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : /^Pausado$/i.test(s)
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : /^Bloqueado$/i.test(s)
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : /^(Offline|Indispon[ií]vel)$/i.test(s)
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  // Ícone por status (apenas visual)
  const Icon = /^(Dispon[ií]vel)$/i.test(s)
    ? CheckCircle
    : /^(Em entrega|Em rota)$/i.test(s)
    ? Truck
    : /^Pausado$/i.test(s)
    ? Pause
    : /^Bloqueado$/i.test(s)
    ? Slash
    : /^(Offline|Indispon[ií]vel)$/i.test(s)
    ? Moon
    : AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tone}`}
      role="status"
      aria-label={`Status do entregador: ${s}`}
      title={s}
    >
      {/* Pontinho usa currentColor para manter contraste automático */}
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" aria-hidden="true" />
      <Icon size={14} aria-hidden="true" />
      <span className="leading-none">{s}</span>
    </span>
  );
}
