// components/products/ProductsTable.jsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Download,
  Eye,
  Grid3X3,
  List,
  Plus,
  Search as SearchIcon,
  ArrowUpDown,
  Rows,
  Rows4,
} from "lucide-react";

import {
  PRODUCTS,
  TOTAL_PRODUCTS,
  PAGE,
  TOTAL_PAGES,
} from "../../lib/productsData";
import ProductStatusBadge from "./ProductStatusBadge";
import Pagination from "../orders/Pagination";
import SlideOver from "../common/SlideOver";

// Grid igual ao print
const COLS = "120px 100px 240px 1fr 140px 200px 160px 88px";

const STATUS_OPTIONS = ["Disponível", "Indisponível", "Pausado", "Em revisão", "Com alerta"];

const EMPTY_PRODUCT = {
  name: "",
  desc: "",
  price: "R$ 0,00",
  category: { label: "Sem categoria", emoji: "🍽️" },
  status: "Disponível",
  img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop",
};

// Utils
function parseMoney(str = "") {
  const s = String(str).replace(/[^\d,.\-]/g, "");
  if (s.includes(".")) return parseFloat(s.replace(/,/g, "")); // en-US
  return parseFloat(s.replace(/\./g, "").replace(",", ".")); // pt-BR
}

export default function ProductsTable() {
  const reduce = useReducedMotion();

  // Dados mutáveis para a demo
  const [items, setItems] = useState(PRODUCTS);

  // Preferências leves com persistência
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(() => {
    if (typeof window === "undefined") return "name"; // 'name' | 'price' | 'category' | 'status'
    return localStorage.getItem("products:sortKey") || "name";
  });
  const [sortDir, setSortDir] = useState(() => {
    if (typeof window === "undefined") return "asc"; // 'asc' | 'desc'
    return localStorage.getItem("products:sortDir") || "asc";
  });
  const [dense, setDense] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("products:dense") === "true";
  });
  const [viewMode, setViewMode] = useState("list"); // list | grid

  useEffect(() => {
    localStorage.setItem("products:sortKey", sortKey);
  }, [sortKey]);
  useEffect(() => {
    localStorage.setItem("products:sortDir", sortDir);
  }, [sortDir]);
  useEffect(() => {
    localStorage.setItem("products:dense", String(dense));
  }, [dense]);

  // Painéis
  const [mode, setMode] = useState(null); // view | create
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items;

    if (q) {
      arr = arr.filter((p) =>
        [p.id, p.name, p.desc, p.category?.label, p.status, p.price]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    const sorted = [...arr].sort((a, b) => {
      if (sortKey === "name") {
        const an = (a.name || "").toLowerCase();
        const bn = (b.name || "").toLowerCase();
        return sortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
      }
      if (sortKey === "price") {
        const ap = parseMoney(a.price);
        const bp = parseMoney(b.price);
        return sortDir === "asc" ? ap - bp : bp - ap;
      }
      if (sortKey === "category") {
        const ac = (a.category?.label || "").toLowerCase();
        const bc = (b.category?.label || "").toLowerCase();
        return sortDir === "asc" ? ac.localeCompare(bc) : bc.localeCompare(ac);
      }
      // status
      const as = (a.status || "").toLowerCase();
      const bs = (b.status || "").toLowerCase();
      return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });

    return sorted;
  }, [query, sortKey, sortDir, items]);

  function toggleSort(key) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir(key === "price" ? "desc" : "asc"); // preço começa desc, demais asc
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  }

  function exportCSV() {
    const header = ["id", "nome", "descricao", "preco", "categoria", "status"];
    const rows = filtered.map((p) => [
      p.id,
      p.name,
      p.desc,
      p.price,
      p.category?.label,
      p.status,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r
          .map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "produtos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function startCreate() {
    setForm({
      ...EMPTY_PRODUCT,
      name: `Produto ${items.length + 1}`,
      id: `#${String(items.length + 1).padStart(3, "0")}`,
    });
    setMode("create");
  }

  function submitCreate(e) {
    e.preventDefault();
    const next = {
      id: form.id || `#${String(items.length + 1).padStart(3, "0")}`,
      ...form,
    };
    setItems((prev) => [next, ...prev]);
    setMode(null);
  }

  return (
    <div className="space-y-4">
      {/* Header de ações */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Produtos</h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Busca */}
          <label className="relative block w-full sm:w-80">
            <span className="absolute inset-y-0 left-3 grid place-items-center">
              <SearchIcon size={16} className="text-slate-400" aria-hidden="true" />
            </span>
            <input
              type="search"
              placeholder="Buscar por ID, nome, categoria..."
              className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar produtos"
            />
          </label>

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

          {/* Exportar */}
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label="Exportar produtos"
            title="Exportar CSV"
          >
            <Download size={16} /> Exportar
          </button>

          {/* Alternadores de visual */}
          <button
            className={`h-9 w-9 grid place-items-center rounded-2xl border ${
              viewMode === "grid" ? "border-blue-500 text-blue-600 bg-blue-50" : "border-slate-300 bg-white"
            } hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm`}
            aria-label="Modo grade"
            title="Modo grade"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            className={`h-9 w-9 grid place-items-center rounded-2xl border ${
              viewMode === "list" ? "border-blue-500 text-blue-600 bg-blue-50" : "border-slate-300 bg-white"
            } hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm`}
            aria-label="Modo lista"
            title="Modo lista"
            onClick={() => setViewMode("list")}
          >
            <List size={16} />
          </button>

          {/* Adicionar produto */}
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
            aria-label="Adicionar produto"
            onClick={startCreate}
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      {/* Cards em modo grade */}
      {viewMode === "grid" && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 6).map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="relative h-40">
                <Image src={p.img} alt={p.name} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-slate-500">{p.id}</div>
                  <ProductStatusBadge status={p.status} />
                </div>
                <div className="font-semibold text-slate-900">{p.name}</div>
                <div className="text-sm text-slate-600 line-clamp-2">{p.desc}</div>
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{p.category?.emoji}</span>
                    {p.category?.label}
                  </span>
                  <span className="font-semibold text-slate-900">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabela com cabeçalho sticky e scroll horizontal */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {/* Cabeçalho */}
          <div
            className="min-w-[1180px] grid items-center bg-slate-50/60 px-4 py-3 text-xs text-slate-500 sticky top-0 z-[1]"
            style={{ gridTemplateColumns: COLS }}
            role="row"
            aria-label="Cabeçalho da lista de produtos"
          >
            <div className="flex items-center gap-2">
              ID # <SearchIcon size={14} className="text-slate-400" aria-hidden="true" />
            </div>
            <div>Imagens</div>

            <button
              type="button"
              onClick={() => toggleSort("name")}
              className="flex items-center gap-2 text-left hover:text-slate-700"
              aria-label={`Ordenar por nome (${sortKey === "name" ? sortDir : "asc"})`}
              title="Ordenar por nome"
            >
              Nome <ArrowUpDown size={14} />
            </button>

            <div className="flex items-center gap-2">Descrição</div>

            <button
              type="button"
              onClick={() => toggleSort("price")}
              className="flex items-center gap-2 text-left hover:text-slate-700"
              aria-label={`Ordenar por preço (${sortKey === "price" ? sortDir : "desc"})`}
              title="Ordenar por preço"
            >
              Preço <ArrowUpDown size={14} />
            </button>

            <button
              type="button"
              onClick={() => toggleSort("category")}
              className="flex items-center gap-2 text-left hover:text-slate-700"
              aria-label={`Ordenar por categoria (${sortKey === "category" ? sortDir : "asc"})`}
              title="Ordenar por categoria"
            >
              Categoria <ArrowUpDown size={14} />
            </button>

            <button
              type="button"
              onClick={() => toggleSort("status")}
              className="flex items-center gap-2 text-left hover:text-slate-700"
              aria-label={`Ordenar por status (${sortKey === "status" ? sortDir : "asc"})`}
              title="Ordenar por status"
            >
              Status <ArrowUpDown size={14} />
            </button>

            <div className="text-right">Ações</div>
          </div>

          {/* Linhas */}
          <motion.ul
            className="min-w-[1180px] divide-y divide-slate-200"
            role="list"
            aria-label="Lista de produtos"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: reduce ? 0 : 0.04, ease: "easeOut" },
              },
            }}
          >
            {filtered.map((p) => (
              <motion.li
                key={p.id}
                className={`grid items-center px-4 transition-colors hover:bg-slate-50/60 focus-within:bg-slate-50/60 ${
                  dense ? "py-2" : "py-3"
                }`}
                style={{ gridTemplateColumns: COLS }}
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                role="row"
              >
                {/* ID */}
                <div className="text-slate-700">{p.id}</div>

                {/* Imagem */}
                <div className="flex items-center">
                  <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-slate-200 ring-1 ring-white shadow-sm">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                      priority={false}
                    />
                  </div>
                </div>

                {/* Nome */}
                <div className="text-slate-900 font-medium truncate" title={p.name}>
                  {p.name}
                </div>

                {/* Descrição */}
                <div className="text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis" title={p.desc}>
                  {p.desc}
                </div>

                {/* Preço */}
                <div className="font-semibold text-slate-900">{p.price}</div>

                {/* Categoria */}
                <div className="text-slate-700 flex items-center gap-2 truncate" title={p.category?.label}>
                  <span aria-hidden="true">{p.category?.emoji}</span>
                  {p.category?.label}
                </div>

                {/* Status */}
                <div>
                  <ProductStatusBadge status={p.status} />
                </div>

                {/* Ações */}
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    aria-haspopup="dialog"
                    aria-label={`Ver detalhes de ${p.name}`}
                    onClick={() => {
                      setActive(p);
                      setMode("view");
                    }}
                  >
                    <Eye size={14} /> Ver
                  </button>
                </div>
              </motion.li>
            ))}

            {filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-slate-500">
                Nenhum produto encontrado.
              </li>
            )}
          </motion.ul>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 bg-white">
          <div>
            {filtered.length} exibidos • {TOTAL_PRODUCTS} no total
          </div>
          <Pagination page={PAGE} totalPages={TOTAL_PAGES} />
        </div>
      </div>

      {/* Painel de visualização */}
      <SlideOver
        open={mode === "view" && !!active}
        title={active ? active.name : "Produto"}
        onClose={() => {
          setMode(null);
          setActive(null);
        }}
      >
        {active ? (
          <div className="space-y-4">
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200">
              <Image src={active.img} alt={active.name} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold text-slate-900">{active.name}</div>
              <ProductStatusBadge status={active.status} />
            </div>
            <div className="text-sm text-slate-600">{active.desc}</div>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">{active.category?.emoji}</span>
                {active.category?.label}
              </span>
              <span className="font-semibold text-slate-900">{active.price}</span>
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Painel de criação */}
      <SlideOver
        open={mode === "create"}
        title="Novo produto"
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
              form="product-create"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Salvar produto
            </button>
          </div>
        }
      >
        <form id="product-create" onSubmit={submitCreate} className="space-y-4">
          <Input
            label="ID"
            value={form.id || ""}
            onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
          />
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Descrição</span>
            <textarea
              value={form.desc}
              onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              rows={3}
              required
            />
          </label>
          <Input
            label="Preço"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Categoria"
              value={form.category.label}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: { ...p.category, label: e.target.value } }))
              }
              required
            />
            <Input
              label="Emoji da categoria"
              value={form.category.emoji}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: { ...p.category, emoji: e.target.value } }))
              }
            />
          </div>
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Imagem (URL)"
            type="url"
            value={form.img}
            onChange={(e) => setForm((p) => ({ ...p, img: e.target.value }))}
          />
        </form>
      </SlideOver>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="space-y-1 block">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
    </label>
  );
}
