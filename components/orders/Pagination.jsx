// components/orders/Pagination.jsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function Pagination({
  page = 1,
  totalPages = 1,
  onChange, // opcional: (newPage:number) => void
  maxButtons = 5, // qtde máxima de botões numéricos visíveis
  pageSizeLabel = "10 / página", // label informativo (opcional)
  className = "",
}) {
  const reduce = useReducedMotion();
  const current = clamp(page, 1, totalPages);

  const items = buildPages(current, totalPages, maxButtons);

  const canPrev = current > 1;
  const canNext = current < totalPages;

  const go = (n) => {
    const next = clamp(n, 1, totalPages);
    if (next === current) return;
    if (typeof onChange === "function") onChange(next);
  };

  return (
    <nav
      className={`flex items-center gap-1 ${className}`}
      aria-label="Paginação"
    >
      {/* Anterior */}
      <button
        type="button"
        onClick={() => go(current - 1)}
        disabled={!canPrev}
        className={btnClass({ disabled: !canPrev, icon: true })}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {/* Números + reticências */}
      {items.map((it, idx) =>
        it === "ellipsis" ? (
          <span
            key={`e-${idx}`}
            className="inline-flex h-8 px-2 items-center text-slate-400 select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <motion.button
            key={it}
            type="button"
            onClick={() => go(it)}
            className={pageBtnClass(it === current)}
            aria-current={it === current ? "page" : undefined}
            aria-label={it === current ? `Página ${it}, atual` : `Ir para página ${it}`}
            initial={{ opacity: 0, y: reduce ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.12, ease: "easeOut" }}
          >
            {it}
          </motion.button>
        )
      )}

      {/* Próxima */}
      <button
        type="button"
        onClick={() => go(current + 1)}
        disabled={!canNext}
        className={btnClass({ disabled: !canNext, icon: true })}
        aria-label="Próxima página"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      {/* Ir para última (mostra totalPages) */}
      {totalPages > 1 && (
        <button
          type="button"
          onClick={() => go(totalPages)}
          className={btnClass({})}
          aria-label={`Ir para a última página (${totalPages})`}
          title={`Última: ${totalPages}`}
        >
          {totalPages}
        </button>
      )}

      {/* Info de tamanho de página (opcional, mantém seu texto) */}
      {pageSizeLabel && (
        <span className="ml-2 text-slate-500 text-xs">{pageSizeLabel}</span>
      )}
    </nav>
  );
}

/* ------------------------------- helpers ------------------------------- */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Retorna array com números de páginas e "ellipsis"
 * Ex.: [1, "ellipsis", 8, 9, 10, "ellipsis", 42]
 */
function buildPages(page, total, maxButtons = 5) {
  if (total <= 0) return [];
  if (total <= maxButtons + 2) {
    // cabe tudo sem reticências (incluindo 1 e last)
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const side = Math.floor(maxButtons / 2);
  let start = Math.max(2, page - side);
  let end = Math.min(total - 1, page + side);

  // Ajusta janela quando encosta nos extremos
  if (page <= 1 + side) {
    start = 2;
    end = 1 + maxButtons;
  } else if (page >= total - side) {
    start = total - maxButtons;
    end = total - 1;
  }

  const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const result = [1];
  if (start > 2) result.push("ellipsis");
  result.push(...range);
  if (end < total - 1) result.push("ellipsis");
  result.push(total);

  return unique(result);
}

function unique(arr) {
  return arr.filter((v, i) => arr.indexOf(v) === i);
}

function btnClass({ disabled = false, icon = false }) {
  const base =
    "h-8 rounded-2xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30";
  const sizing = icon ? "w-8 grid place-items-center px-0" : "px-3";
  const tone = disabled
    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
  return `${base} ${sizing} ${tone}`;
}

function pageBtnClass(active) {
  const base =
    "h-8 min-w-8 px-3 rounded-2xl border text-sm transition-colors focus:outline-none focus:ring-2";
  return active
    ? `${base} border-blue-300 bg-blue-50 text-blue-700 focus:ring-blue-500/30`
    : `${base} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-blue-500/20`;
}
