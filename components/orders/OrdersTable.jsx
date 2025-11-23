// components/orders/OrdersTable.jsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MoreHorizontal,
  Search as SearchIcon,
  Download,
  ArrowUpDown,
  Rows,
  Rows4,
  Plus,
  CheckCircle,
  Package,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import {
  ORDERS,
  TOTAL_ORDERS,
  PAGE,
  TOTAL_PAGES,
} from "../../lib/ordersData";
import Pagination from "./Pagination";
import SlideOver from "../common/SlideOver";

// Grid igual ao print
const COLS = "140px 140px 220px 120px 160px 1fr 160px 88px";

// Utils
function parseMoney(str = "") {
  const s = String(str).replace(/[^\d,.\-]/g, "");
  if (s.includes(".")) return parseFloat(s.replace(/,/g, "")); // en-US
  return parseFloat(s.replace(/\./g, "").replace(",", ".")); // pt-BR
}
function parseDate(d) {
  if (!d) return 0;
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return new Date(d).getTime();
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`).getTime();
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}

const STATUS_OPTIONS = ["Pendente", "A caminho", "Pronto", "Cancelado"];

const EMPTY_ORDER = {
  id: "#",
  status: "Pendente",
  products: [],
  amount: "R$ 0,00",
  store: "Ateliux",
  customer: "Cliente",
  createdAt: new Date().toLocaleString("pt-BR"),
};

export default function OrdersTable() {
  const reduce = useReducedMotion();

  // Dados dinâmicos
  const [items, setItems] = useState(ORDERS);

  // Preferências com persistência leve
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(() => {
    if (typeof window === "undefined") return "createdAt"; // 'status' | 'amount' | 'createdAt'
    return localStorage.getItem("orders:sortKey") || "createdAt";
  });
  const [sortDir, setSortDir] = useState(() => {
    if (typeof window === "undefined") return "desc"; // 'asc' | 'desc'
    return localStorage.getItem("orders:sortDir") || "desc";
  });
  const [dense, setDense] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("orders:dense") === "true";
  });

  // Painéis
  const [mode, setMode] = useState(null); // view | create
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(EMPTY_ORDER);
  const [newProduct, setNewProduct] = useState("");

  useEffect(() => {
    localStorage.setItem("orders:sortKey", sortKey);
  }, [sortKey]);
  useEffect(() => {
    localStorage.setItem("orders:sortDir", sortDir);
  }, [sortDir]);
  useEffect(() => {
    localStorage.setItem("orders:dense", String(dense));
  }, [dense]);

  // Busca + ordenação client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items;

    if (q) {
      arr = arr.filter((o) =>
        [o.id, o.store, o.customer, o.status, o.amount, o.createdAt]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    const sorted = [...arr].sort((a, b) => {
      if (sortKey === "status") {
        const as = (a.status || "").toLowerCase();
        const bs = (b.status || "").toLowerCase();
        return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
      }
      if (sortKey === "amount") {
        const aa = parseMoney(a.amount);
        const bb = parseMoney(b.amount);
        return sortDir === "asc" ? aa - bb : bb - aa;
      }
      // createdAt
      const ad = parseDate(a.createdAt);
      const bd = parseDate(b.createdAt);
      return sortDir === "asc" ? ad - bd : bd - ad;
    });

    return sorted;
  }, [query, sortKey, sortDir, items]);

  function toggleSort(key) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir(key === "createdAt" ? "desc" : "asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  }

  function exportCSV() {
    const header = ["id", "status", "valor", "loja", "cliente", "criado_em"];
    const rows = filtered.map((o) => [
      o.id,
      o.status,
      o.amount,
      o.store,
      o.customer,
      o.createdAt,
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
    a.download = "pedidos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function startCreate() {
    setForm({
      ...EMPTY_ORDER,
      id: `#${Math.floor(Math.random() * 900000 + 100000)}`,
      products: [],
    });
    setNewProduct("");
    setMode("create");
  }

  function submitCreate(e) {
    e.preventDefault();
    const next = {
      ...form,
      products: form.products.length
        ? form.products
        : [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop",
          ],
    };
    setItems((prev) => [next, ...prev]);
    setMode(null);
  }

  function addProductThumb() {
    const url = newProduct.trim();
    if (!url) return;
    setForm((p) => ({ ...p, products: [...p.products, url] }));
    setNewProduct("");
  }

  return (
    <div className="space-y-4">
      {/* Título + Ações */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Pedidos</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
          >
            <Plus size={16} /> Novo pedido
          </button>

          {/* Busca */}
          <label className="relative block w-full sm:w-80">
            <span className="absolute inset-y-0 left-3 grid place-items-center">
              <SearchIcon size={16} className="text-slate-400" aria-hidden="true" />
            </span>
            <input
              type="search"
              placeholder="Buscar por pedido, cliente ou loja..."
              className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar pedidos"
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
            aria-label="Exportar pedidos"
            title="Exportar CSV"
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      {/* Tabela com cabeçalho sticky e scroll horizontal */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {/* Cabeçalho */}
          <div
            className="min-w-[1120px] grid items-center bg-slate-50/60 px-4 py-3 text-xs text-slate-500 sticky top-0 z-[1]"
            style={{ gridTemplateColumns: COLS }}
            role="row"
            aria-label="Cabeçalho da lista de pedidos"
          >
            <div className="flex items-center gap-2">
              Pedido <SearchIcon size={14} className="text-slate-400" aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={() => toggleSort("status")}
              className="flex items-center gap-2 text-left hover:text-slate-700"
              aria-label={`Ordenar por status (${sortKey === "status" ? sortDir : "asc"})`}
              title="Ordenar por status"
            >
              Status <ArrowUpDown size={14} />
            </button>
            <div>Produtos</div>
            <button
              type="button"
              onClick={() => toggleSort("amount")}
              className="flex items-center gap-2 text-left hover:text-slate-700"
              aria-label={`Ordenar por valor (${sortKey === "amount" ? sortDir : "asc"})`}
              title="Ordenar por valor"
            >
              Valor <ArrowUpDown size={14} />
            </button>
            <div>Loja</div>
            <div className="flex items-center gap-2">
              Cliente <SearchIcon size={14} className="text-slate-400" aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={() => toggleSort("createdAt")}
              className="flex items-center gap-2 text-left hover:text-slate-700"
              aria-label={`Ordenar por criado em (${sortKey === "createdAt" ? sortDir : "desc"})`}
              title="Ordenar por criado em"
            >
              Criado em <ArrowUpDown size={14} />
            </button>
            <div className="text-right">Ações</div>
          </div>

          {/* Linhas */}
          <motion.ul
            className="min-w-[1120px] divide-y divide-slate-200"
            role="list"
            aria-label="Lista de pedidos"
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
            {filtered.map((o) => (
              <motion.li
                key={o.id}
                className={`grid items-center px-4 transition-colors hover:bg-slate-50/60 focus-within:bg-slate-50/60 ${
                  dense ? "py-2" : "py-3"
                }`}
                style={{ gridTemplateColumns: COLS }}
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                role="row"
              >
                {/* Pedido */}
                <div className="text-slate-700">{o.id}</div>

                {/* Status */}
                <div className="pr-2">
                  <StatusBadge status={o.status} />
                </div>

                {/* Produtos */}
                <div className="flex items-center gap-2">
                  {o.products.slice(0, 4).map((src, i) => (
                    <div
                      key={i}
                      className="relative h-9 w-9 overflow-hidden rounded-lg border border-slate-200 ring-1 ring-white shadow-sm"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="36px"
                        priority={false}
                      />
                    </div>
                  ))}
                </div>

                {/* Valor */}
                <div className="font-semibold text-slate-900">{o.amount}</div>

                {/* Loja */}
                <div className="text-slate-700 truncate" title={o.store}>
                  {o.store}
                </div>

                {/* Cliente */}
                <div className="text-slate-700 truncate" title={o.customer}>
                  {o.customer}
                </div>

                {/* Criado em */}
                <div className="text-slate-700">{o.createdAt}</div>

                {/* Ações */}
                <div className="flex justify-end">
                  <button
                    className="rounded-2xl p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    aria-haspopup="menu"
                    aria-label={`Ações do pedido ${o.id}`}
                    onClick={() => {
                      setActive(o);
                      setMode("view");
                    }}
                  >
                    <MoreHorizontal size={18} aria-hidden="true" />
                  </button>
                </div>
              </motion.li>
            ))}

            {filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-slate-500">
                Nenhum pedido encontrado.
              </li>
            )}
          </motion.ul>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 bg-white">
          <div>
            {filtered.length} exibidos • {TOTAL_ORDERS} no total
          </div>
          <Pagination page={PAGE} totalPages={TOTAL_PAGES} />
        </div>
      </div>

      {/* Visualização */}
      <SlideOver
        open={mode === "view" && !!active}
        title={active ? `Pedido ${active.id}` : "Pedido"}
        onClose={() => {
          setMode(null);
          setActive(null);
        }}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={active.status} />
              <span className="text-sm text-slate-500">{active.createdAt}</span>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} /> {active.amount}
              </div>
              <div className="flex items-center gap-2">
                <Package size={14} /> {active.products.length} itens
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> {active.store}
              </div>
              <div className="flex items-center gap-2">
                <User size={14} /> {active.customer}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} /> {active.createdAt}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {active.products.map((src, i) => (
                <div key={i} className="relative h-20 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Criação */}
      <SlideOver
        open={mode === "create"}
        title="Novo pedido"
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
              form="order-create"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Criar pedido
            </button>
          </div>
        }
      >
        <form id="order-create" onSubmit={submitCreate} className="space-y-4">
          <Input
            label="ID do pedido"
            value={form.id}
            onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
            required
          />
          <Input
            label="Valor"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Loja"
              value={form.store}
              onChange={(e) => setForm((p) => ({ ...p, store: e.target.value }))}
              required
            />
            <Input
              label="Cliente"
              value={form.customer}
              onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))}
              required
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
            label="Criado em"
            value={form.createdAt}
            onChange={(e) => setForm((p) => ({ ...p, createdAt: e.target.value }))}
          />
          <div className="space-y-2">
            <span className="text-sm text-slate-600">Produtos (URLs de imagem)</span>
            <div className="flex gap-2">
              <input
                type="url"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                placeholder="https://..."
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addProductThumb}
                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.products.map((src, i) => (
                <div key={i} className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
              {form.products.length === 0 && (
                <span className="text-xs text-slate-400">Nenhum item adicionado.</span>
              )}
            </div>
          </div>
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
