// components/stores/StoresTable.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Download,
  Eye,
  Grid3X3,
  List,
  MapPin,
  Plus,
  Search as SearchIcon,
  Rows,
  Rows4,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

import StoreStatusBadge from "./StoreStatusBadge";
import { STORES, TOTAL_STORES, PAGE, TOTAL_PAGES } from "../../lib/storesData";
import Pagination from "../orders/Pagination";
import SlideOver from "../common/SlideOver";

const COLS = "120px 1.1fr 1.4fr 180px 2fr 140px 88px"; // ID | Título | Email | Telefone | Endereço | Status | Ações

const EMPTY_STORE = {
  title: "",
  email: "",
  phone: "",
  address: "",
  status: "Aberta",
};

export default function StoresTable() {
  const reduce = useReducedMotion();

  // Estado dos dados
  const [items, setItems] = useState(STORES);

  // Preferências leves com persistência
  const [query, setQuery] = useState("");
  const [dense, setDense] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("stores:dense") === "true";
  });
  const [viewMode, setViewMode] = useState("list"); // list | map | grid (mock)

  useEffect(() => {
    localStorage.setItem("stores:dense", String(dense));
  }, [dense]);

  // Painéis
  const [mode, setMode] = useState(null); // "view" | "create"
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(EMPTY_STORE);

  // Busca client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = items;
    if (!q) return base;
    return base.filter((s) =>
      [s.id, s.title, s.email, s.phone, s.address].join(" ").toLowerCase().includes(q)
    );
  }, [query, items]);

  // Exporta CSV com base no filtro atual
  function exportCSV() {
    const header = ["id", "titulo", "email", "telefone", "endereco", "status"];
    const rows = filtered.map((s) => [s.id, s.title, s.email, s.phone, s.address, s.status]);
    const csv = [header, ...rows]
      .map((r) => r.map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lojas.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function startCreate() {
    setForm({
      ...EMPTY_STORE,
      title: `Nova loja ${items.length + 1}`,
      email: "contato@ateliux.com",
      phone: "+55 11 99999-0000",
    });
    setMode("create");
  }

  function submitCreate(e) {
    e.preventDefault();
    const next = {
      id: `#${String(items.length + 1).padStart(3, "0")}`,
      ...form,
    };
    setItems((prev) => [next, ...prev]);
    setMode(null);
  }

  return (
    <div className="space-y-4">
      {/* Header de ações */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Lojas</h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Busca */}
          <label className="relative block w-full sm:w-80">
            <span className="absolute inset-y-0 left-3 grid place-items-center">
              <SearchIcon size={16} className="text-slate-400" aria-hidden="true" />
            </span>
            <input
              type="search"
              placeholder="Buscar por ID, título, e-mail, telefone, endereço..."
              className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar lojas"
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
            aria-label="Exportar lojas"
            title="Exportar CSV"
          >
            <Download size={16} /> Exportar
          </button>

          {/* Alternadores de visual */}
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
          <button
            className={`h-9 w-9 grid place-items-center rounded-2xl border ${
              viewMode === "map" ? "border-blue-500 text-blue-600 bg-blue-50" : "border-slate-300 bg-white"
            } hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm`}
            aria-label="Modo mapa"
            title="Modo mapa"
            onClick={() => setViewMode("map")}
          >
            <MapPin size={16} />
          </button>
          <button
            className="h-9 w-9 grid place-items-center rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label="Modo mosaico"
            title="Modo mosaico"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 size={16} />
          </button>

          {/* Adicionar loja */}
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
            aria-label="Adicionar loja"
            onClick={startCreate}
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      {/* Visão compacta em cards quando não está na tabela */}
      {viewMode !== "list" && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3 flex items-start gap-3"
            >
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 grid place-items-center text-sm font-semibold">
                {s.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-slate-900">{s.title}</div>
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <MapPin size={14} /> {s.address}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <StoreStatusBadge status={s.status} />
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
            className="min-w-[1120px] grid items-center bg-slate-50/60 px-4 py-3 text-xs text-slate-500 sticky top-0 z-[1]"
            style={{ gridTemplateColumns: COLS }}
            role="row"
            aria-label="Cabeçalho da lista de lojas"
          >
            <div>ID #</div>
            <div>Título</div>
            <div>E-mail</div>
            <div>Telefone</div>
            <div>Endereço</div>
            <div>Status</div>
            <div className="text-right">Ações</div>
          </div>

          {/* Linhas */}
          <motion.ul
            className="min-w-[1120px] divide-y divide-slate-200"
            role="list"
            aria-label="Lista de lojas"
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
            {filtered.map((s) => (
              <motion.li
                key={s.id}
                className={`grid items-center px-4 transition-colors hover:bg-slate-50/60 focus-within:bg-slate-50/60 ${
                  dense ? "py-2" : "py-3"
                }`}
                style={{ gridTemplateColumns: COLS }}
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                role="row"
              >
                <div className="text-slate-700">{s.id}</div>
                <div className="text-slate-900 font-medium truncate" title={s.title}>
                  {s.title}
                </div>
                <div className="text-slate-700 truncate" title={s.email}>
                  {s.email}
                </div>
                <div className="text-slate-700">{s.phone}</div>
                <div className="text-slate-700 truncate" title={s.address}>
                  {s.address}
                </div>
                <div>
                  <StoreStatusBadge status={s.status} />
                </div>
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    aria-haspopup="dialog"
                    aria-label={`Ver detalhes de ${s.title}`}
                    onClick={() => {
                      setActive(s);
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
                Nenhuma loja encontrada.
              </li>
            )}
          </motion.ul>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 bg-white">
          <div>
            {filtered.length} exibidas • {TOTAL_STORES} no total
          </div>
          <Pagination page={PAGE} totalPages={TOTAL_PAGES} />
        </div>
      </div>

      {/* Visualização */}
      <SlideOver
        open={mode === "view" && !!active}
        title={active ? `Loja ${active.title}` : "Loja"}
        onClose={() => {
          setMode(null);
          setActive(null);
        }}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 text-xs">
                {active.id}
              </span>
              <StoreStatusBadge status={active.status} />
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold text-slate-900">{active.title}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin size={14} /> {active.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Mail size={14} /> {active.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Phone size={14} /> {active.phone}
              </div>
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Cadastro */}
      <SlideOver
        open={mode === "create"}
        title="Nova loja"
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
              form="store-create"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Salvar loja
            </button>
          </div>
        }
      >
        <form id="store-create" onSubmit={submitCreate} className="space-y-4">
          <Input
            label="Nome da loja"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            required
          />
          <Input
            label="Endereço"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            required
          />
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Aberta">Aberta</option>
              <option value="Fechada">Fechada</option>
            </select>
          </label>
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
