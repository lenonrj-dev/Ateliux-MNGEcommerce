// components/dashboard/Cards.jsx (CardsRow)
"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function CardsRow({ title, value, delta }) {
  const reduce = useReducedMotion();

  // Interpreta o delta recebido como string, ex.: "+1,2%" | "-0,5%" | "0%"
  const str = String(delta ?? "").trim();
  const isNeg = str.startsWith("-");
  const isZero = str === "0" || str === "0%" || str === "+0%" || str === "-0%";
  const Icon = isZero ? ChevronUp : isNeg ? ChevronDown : ChevronUp;

  const tone =
    isZero ? "text-slate-600"
    : isNeg ? "text-rose-600"
    : "text-emerald-600";

  const toneBg =
    isZero ? "bg-slate-100"
    : isNeg ? "bg-rose-50"
    : "bg-emerald-50";

  return (
    <motion.div
      className="p-4 border-b border-slate-200"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
      role="region"
      aria-label={`Indicador ${title}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">{title}</div>

        {/* Badge de variação com contraste e semântica */}
        <span
          className={`inline-flex items-center gap-1 text-xs ${tone} ${toneBg} rounded-full px-2 py-1`}
          aria-label={`Variação ${isNeg ? "negativa" : isZero ? "neutra" : "positiva"} de ${str}`}
        >
          <Icon size={14} aria-hidden="true" />
          {str}
        </span>
      </div>

      {/* Valor com forte legibilidade e foco acessível */}
      <motion.output
        className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight outline-none"
        aria-live="polite"
        aria-label={`Valor atual: ${value}`}
        initial={false}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.14, ease: "easeOut" }}
      >
        {value}
      </motion.output>
    </motion.div>
  );
}
