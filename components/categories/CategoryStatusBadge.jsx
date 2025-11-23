// components/categories/CategoryStatusBadge.jsx
"use client";

import { Eye, EyeOff, Pause, Archive } from "lucide-react";

export default function CategoryStatusBadge({ status = "Indefinido" }) {
  // Normaliza para comparação sem depender de acento/caixa
  const s = String(status).trim();

  // Mapa semântico de status -> classes (tema claro)
  const tone =
    /^(Vis[ií]vel|Ativa|Publicado|Publicada)$/i.test(s)
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : /^(Pausada|Em revis[aã]o)$/i.test(s)
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : /^(Arquivada|Oculta|Inativa)$/i.test(s)
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : /^(Bloqueada|Removida)$/i.test(s)
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  // Ícone correspondente (opcional, mas melhora escaneabilidade)
  const Icon = /^(Vis[ií]vel|Ativa|Publicado|Publicada)$/i.test(s)
    ? Eye
    : /^(Pausada|Em revis[aã]o)$/i.test(s)
    ? Pause
    : /^(Arquivada)$/i.test(s)
    ? Archive
    : /^(Oculta|Inativa)$/i.test(s)
    ? EyeOff
    : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tone}`}
      role="status"
      aria-label={`Status: ${s}`}
      title={s}
    >
      {/* Pontinho de estado usando currentColor para manter contraste */}
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" aria-hidden="true" />
      {Icon ? <Icon size={14} aria-hidden="true" /> : null}
      <span className="leading-none">{s}</span>
    </span>
  );
}
