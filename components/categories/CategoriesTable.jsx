// components/categories/CategoriesTable.jsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CategoryStatusBadge from "./CategoryStatusBadge";
import { CATEGORIES } from "../../lib/categoriesData";
import { Search, Filter, Rows, Rows4, Download, Plus, Eye } from "lucide-react";
import SlideOver from "../common/SlideOver";

// Grade base no desktop: Título | Miniaturas | Status | Ações
const COLS = "1.1fr 2fr 160px 88px";

const ALL_STATUSES = ["Todos", "Visível", "Pausada", "Arquivada"];

const EMPTY_CATEGORY = {
  emoji: "🥘",
  title: "",
  status: "Visível",
  thumbs: [],
};

export default function CategoriesTable() {
  const reduce = useReducedMotion();

  const [items, setItems] = useState(CATEGORIES);

  // Preferências da UI (persistência leve)
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(() => {
    if (typeof window === "undefined") return "Todos";
    return localStorage.getItem("categories:status") || "Todos";
  });
  const [dense, setDense] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("categories:dense") === "true";
  });

  // Painéis
  const [mode, setMode] = useState(null); // view | create
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [thumbInput, setThumbInput] = useState("");

  useEffect(() => {
    localStorage.setItem("categories:status", status);
  }, [status]);
  useEffect(() => {
    localStorage.setItem("categories:dense", String(dense));
  }, [dense]);

  // Filtro client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      const titleOk = q
        ? [c.title, ...(c.thumbs || [])].join(" ").toLowerCase().includes(q)
        : true;
      const statusOk = status === "Todos" ? true : c.status === status;
      return titleOk && statusOk;
    });
  }, [query, status, items]);

  // Exportar CSV (dados filtrados)
  function exportCSV() {
    const header = ["titulo", "status", "quantidade_produtos"];
    const rows = filtered.map((c) => [c.title, c.status, (c.thumbs || []).length]);
    const csv = [header, ...rows]
      .map((r) => r.map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categorias.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function startCreate() {
    setForm(EMPTY_CATEGORY);
    setThumbInput("");
    setMode("create");
  }

  function addThumb() {
    const url = thumbInput.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, thumbs: [...prev.thumbs, url] }));
    setThumbInput("");
  }

  function submitCreate(e) {
    e.preventDefault();
    const next = { ...form };
    setItems((prev) => [next, ...prev]);
    setMode(null);
  }

  return (
    <div className="space-y-4">
      {/* Título */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Categorias</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
          >
            <Plus size={16} /> Nova categoria
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label="Exportar categorias para CSV"
            title="Exportar CSV"
          >
            <Download size={16} aria-hidden="true" /> CSV
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Busca */}
        <label className="relative block w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-3 grid place-items-center">
            <Search size={16} className="text-slate-400" aria-hidden="true" />
          </span>
          <input
            type="search"
            placeholder="Buscar por título ou produto..."
            className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar categorias"
          />
        </label>

        {/* Ações: filtro, densidade e CSV */}
        <div className="flex items-center gap-2">
          {/* Filtro de status */}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-2 py-1.5 shadow-sm">
            <Filter size={16} className="text-slate-500" aria-hidden="true" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent text-sm text-slate-700 focus:outline-none"
              aria-label="Filtrar por status"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Densidade */}
          <button
            type="button"
            onClick={() => setDense((d) => !d)}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label={`Alternar densidade ${dense ? "padrão" : "compacta"}`}
            title="Densidade"
          >
            {dense ? <Rows4 size={16} /> : <Rows size={16} />} {dense ? "Compacto" : "Padrão"}
          </button>
        </div>
      </div>

      {/* Tabela / lista */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        {/* Cabeçalho (sticky em desktops) */}
        <div
          className="px-4 py-3 text-xs text-slate-500 grid items-center bg-slate-50/60 rounded-t-2xl sticky top-0 z-[1]"
          style={{ gridTemplateColumns: COLS }}
          role="row"
          aria-label="Cabeçalho da lista de categorias"
        >
          <div>Título</div>
          <div>Produtos</div>
          <div>Status</div>
          <div className="text-right">Ações</div>
        </div>

        {/* Linhas */}
        <motion.ul
          className="divide-y divide-slate-200 max-h-[56vh] overflow-auto"
          role="list"
          aria-label="Lista de categorias"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: reduce ? 0 : 0.05, ease: "easeOut" },
            },
          }}
        >
          {filtered.map((c) => (
            <motion.li
              key={c.title}
              className={`px-4 grid items-center transition-colors hover:bg-slate-50/60 focus-within:bg-slate-50/60 ${
                dense ? "py-2" : "py-3"
              }`}
              style={{ gridTemplateColumns: COLS }}
              variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
              role="row"
            >
              {/* Título + emoji */}
              <div className="flex items-center gap-3 text-slate-800 min-w-0">
                <span className="text-lg" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="truncate" title={c.title}>
                  {c.title}
                </span>
              </div>

              {/* Miniaturas (fileira) */}
              <div className="flex flex-wrap items-center gap-2">
                {c.thumbs.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-8 w-8 overflow-hidden rounded-lg border border-slate-200 ring-1 ring-white shadow-sm"
                    title={c.title}
                  >
                    <Image
                      src={src}
                      alt={c.title}
                      fill
                      className="object-cover"
                      sizes="32px"
                      priority={false}
                    />
                  </div>
                ))}
                {c.thumbs?.length === 0 && (
                  <span className="text-xs text-slate-400">Sem imagens</span>
                )}
              </div>

              {/* Status */}
              <div className="justify-self-start lg:justify-self-auto">
                <CategoryStatusBadge status={c.status} />
              </div>

              <div className="flex justify-end">
                <button
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label={`Ver categoria ${c.title}`}
                  onClick={() => {
                    setActive(c);
                    setMode("view");
                  }}
                >
                  <Eye size={14} /> Ver
                </button>
              </div>
            </motion.li>
          ))}

          {/* Estado vazio */}
          {filtered.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-slate-500">
              Nenhuma categoria encontrada.
            </li>
          )}
        </motion.ul>
      </div>

      {/* Rodapé com contagem */}
      <div className="text-xs text-slate-500">
        Mostrando{" "}
        <span className="font-medium text-slate-700">{filtered.length}</span> de{" "}
        <span className="font-medium text-slate-700">{items.length}</span> categorias
      </div>

      {/* Painel de visualização */}
      <SlideOver
        open={mode === "view" && !!active}
        title={active ? active.title : "Categoria"}
        onClose={() => {
          setMode(null);
          setActive(null);
        }}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="text-xl">{active.emoji}</span>
              <CategoryStatusBadge status={active.status} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {active.thumbs.map((src, i) => (
                <div
                  key={i}
                  className="relative h-28 rounded-xl overflow-hidden border border-slate-200"
                >
                  <Image src={src} alt={active.title} fill className="object-cover" />
                </div>
              ))}
              {active.thumbs.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500 px-4 py-6">
                  Nenhuma imagem cadastrada.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Painel de criação */}
      <SlideOver
        open={mode === "create"}
        title="Nova categoria"
        onClose={() => setMode(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setMode(null)}
              className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="category-create"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Salvar
            </button>
          </div>
        }
      >
        <form id="category-create" onSubmit={submitCreate} className="space-y-4">
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Emoji</span>
            <input
              type="text"
              maxLength={4}
              value={form.emoji}
              onChange={(e) => setForm((p) => ({ ...p, emoji: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </label>
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Título</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </label>
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Visível">Visível</option>
              <option value="Pausada">Pausada</option>
              <option value="Arquivada">Arquivada</option>
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-sm text-slate-600">Miniaturas (URLs)</span>
            <div className="flex gap-2">
              <input
                type="url"
                value={thumbInput}
                onChange={(e) => setThumbInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addThumb}
                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.thumbs.map((src, i) => (
                <div key={i} className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
              {form.thumbs.length === 0 && (
                <span className="text-xs text-slate-400">Nenhuma imagem ainda.</span>
              )}
            </div>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
