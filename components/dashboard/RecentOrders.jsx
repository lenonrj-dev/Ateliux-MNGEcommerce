// components/dashboard/RecentOrders.jsx
"use client";

import { recentOrders } from "../../lib/mockData";
import { MoreHorizontal, Search, ArrowUpDown, Download, Rows, Rows4 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// Util
function initials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

// Converte "R$ 34,50" -> 34.5 (ou "US$ 3,450.00" -> 3450)
function parseMoney(str = "") {
  const s = String(str).replace(/[^\d,.\-]/g, "");
  if (s.includes(".")) return parseFloat(s.replace(/,/g, ""));
  return parseFloat(s.replace(/\./g, "").replace(",", "."));
}

export default function RecentOrders() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [sortVal, setSortVal] = useState(() => {
    if (typeof window === "undefined") return "desc"; // desc por valor
    return localStorage.getItem("orders:sortVal") || "desc";
  });
  const [dense, setDense] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("orders:dense") === "true";
  });

  useEffect(() => {
    localStorage.setItem("orders:sortVal", sortVal);
  }, [sortVal]);
  useEffect(() => {
    localStorage.setItem("orders:dense", String(dense));
  }, [dense]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = recentOrders;
    if (q) {
      arr = arr.filter((o) =>
        [o.id, o.name, o.address, ...(o.items || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    arr = [...arr].sort((a, b) => {
      const va = parseMoney(a.total);
      const vb = parseMoney(b.total);
      return sortVal === "asc" ? va - vb : vb - va;
    });
    return arr;
  }, [query, sortVal]);

  function exportCSV() {
    const header = ["id", "cliente", "endereco", "itens", "total"];
    const rows = filtered.map((o) => [
      o.id,
      o.name,
      o.address,
      (o.items || []).join(" | "),
      o.total,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r
          .map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pedidos-recentes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!recentOrders?.length) {
    return (
      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
          Nenhum pedido recente.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      {/* Toolbar */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Busca */}
        <label className="relative block w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-3 grid place-items-center">
            <Search size={16} className="text-slate-400" aria-hidden="true" />
          </span>
          <input
            type="search"
            placeholder="Buscar por ID, cliente, endereço ou item..."
            className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar pedidos"
          />
        </label>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortVal((s) => (s === "asc" ? "desc" : "asc"))}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label={`Ordenar por valor ${sortVal === "asc" ? "descendente" : "ascendente"}`}
            title="Ordenar por valor"
          >
            <ArrowUpDown size={16} aria-hidden="true" /> {sortVal === "asc" ? "Valor ↓" : "Valor ↑"}
          </button>

          <button
            type="button"
            onClick={() => setDense((d) => !d)}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label={`Alternar densidade ${dense ? "padrão" : "compacta"}`}
            title="Densidade"
          >
            {dense ? <Rows4 size={16} /> : <Rows size={16} />} {dense ? "Compacto" : "Padrão"}
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label="Exportar CSV"
            title="Exportar CSV"
          >
            <Download size={16} aria-hidden="true" /> CSV
          </button>
        </div>
      </div>

      {/* Lista */}
      <motion.ul
        className="divide-y divide-slate-200"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: reduce ? 0 : 0.05, ease: "easeOut" },
          },
        }}
        role="list"
        aria-label="Pedidos recentes"
      >
        {filtered.map((o) => (
          <motion.li
            key={o.id}
            className={`flex items-start gap-4 px-2 md:px-3 transition-colors rounded-xl hover:bg-slate-50/60 focus-within:bg-slate-50/60 ${
              dense ? "py-2" : "py-3"
            }`}
            variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
          >
            {/* ID */}
            <div className="w-24 shrink-0">
              <span className="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs px-2 py-1 ring-1 ring-slate-200">
                {o.id}
              </span>
            </div>

            {/* Avatar + info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <div className="hidden sm:grid place-items-center h-9 w-9 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-100">
                  {initials(o.name)}
                </div>

                <div className="min-w-0">
                  <div className="font-medium text-slate-900 truncate">{o.name}</div>
                  <div className="text-slate-500 text-sm truncate">{o.address}</div>
                  <ul className={`mt-1 text-sm text-slate-600 list-disc pl-5 space-y-0.5 ${dense ? "hidden md:block" : ""}`}>
                    {o.items.map((i, idx) => (
                      <li key={idx} className="marker:text-slate-400">
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="w-28 text-right font-semibold text-slate-900 shrink-0">
              {o.total}
            </div>

            {/* Ações */}
            <div className="shrink-0">
              <button
                className="rounded-2xl p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                aria-haspopup="menu"
                aria-label={`Ações do pedido ${o.id}`}
                onClick={() => {}}
              >
                <MoreHorizontal size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      {/* Rodapé simples com contagem */}
      <div className="mt-3 text-xs text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{filtered.length}</span> de{" "}
        <span className="font-medium text-slate-700">{recentOrders.length}</span> pedidos
      </div>
    </div>
  );
}
