// components/dashboard/Timeline.jsx
"use client";

import { timeline } from "../../lib/mockData";
import { motion, useReducedMotion } from "framer-motion";

const badge = (status) => {
  const map = {
    Pronto: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Entregue: "bg-blue-50 text-blue-700 border-blue-200",
    "A caminho": "bg-sky-50 text-sky-700 border-sky-200",
    Cancelado: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-50 text-slate-700 border-slate-200";
};

export default function Timeline() {
  const reduce = useReducedMotion();

  return (
    <div className="px-4 pb-2 h-72 overflow-auto">
      <motion.ul
        role="list"
        aria-label="Atualizações recentes"
        className="space-y-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: reduce ? 0 : 0.06, ease: "easeOut" },
          },
        }}
      >
        {timeline.map((t) => (
          <motion.li
            key={t.id}
            className="group flex items-center justify-between gap-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50/60 transition-colors px-3 py-2 focus-within:bg-slate-50/60"
            variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
          >
            {/* Status */}
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs ${badge(
                t.status
              )}`}
              aria-label={`Status: ${t.status}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current/70" aria-hidden="true" />
              {t.status}
            </span>

            {/* ID */}
            <span
              className="text-slate-600 text-sm font-medium tabular-nums"
              title={`ID: ${t.id}`}
            >
              {t.id}
            </span>

            {/* Tempo */}
            <time
              className="text-slate-500 text-sm"
              dateTime={t.time?.toString?.()}
              aria-label={`Horário: ${t.time}`}
            >
              {t.time}
            </time>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
