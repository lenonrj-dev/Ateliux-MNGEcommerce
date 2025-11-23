// components/couriers/CouriersTable.jsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Plus,
  Eye,
  Search,
  Filter,
  Rows,
  Rows4,
  Download,
  Phone,
  Building2,
  Hash,
  Gauge,
} from "lucide-react";

import { COURIERS, TOTAL_COURIERS, PAGE, TOTAL_PAGES } from "../../lib/couriersData";
import CourierStatusBadge from "./CourierStatusBadge";
import StarRating from "./StarRating";
import Pagination from "../orders/Pagination";
import SlideOver from "../common/SlideOver";

// Grid: ID | Avatar | Nome | ID Veículo | Telefone | Loja | Avaliação | Status | Ações
const COLS = "120px 80px 1.3fr 140px 180px 1.2fr 160px 140px 88px";
const STATUS_OPTIONS = ["Disponível", "Em entrega", "Em rota", "Offline", "Pausado", "Bloqueado"];

const EMPTY_FORM = {
  name: "",
  vehicleId: "",
  phone: "",
  store: "",
  rating: 4,
  status: "Disponível",
  avatar: "https://i.pravatar.cc/64",
};

export default function CouriersTable() {
  const reduce = useReducedMotion();

  // Estado dos dados
  const [items, setItems] = useState(COURIERS);

  // Preferências leves (persistidas)
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(() => {
    if (typeof window === "undefined") return "Todos";
    return localStorage.getItem("couriers:status") || "Todos";
  });
  const [dense, setDense] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("couriers:dense") === "true";
  });

  // UI de painel
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState(null); // "view" | "create"
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    localStorage.setItem("couriers:status", status);
  }, [status]);
  useEffect(() => {
    localStorage.setItem("couriers:dense", String(dense));
  }, [dense]);

  // Filtro client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      const txt = [c.id, c.name, c.phone, c.store, c.vehicleId].join(" ").toLowerCase();
      const qOk = q ? txt.includes(q) : true;
      const sOk = status === "Todos" ? true : String(c.status).toLowerCase() === status.toLowerCase();
      return qOk && sOk;
    });
  }, [query, status, items]);

  // Exportar CSV (dados filtrados)
  function exportCSV() {
    const header = ["id", "nome", "veiculo_id", "telefone", "loja", "avaliacao", "status"];
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.vehicleId,
      c.phone,
      c.store,
      c.rating,
      c.status,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entregadores.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function startCreate() {
    setForm({
      ...EMPTY_FORM,
      vehicleId: `VEH-${Math.floor(Math.random() * 900 + 100)}`,
      avatar: `https://i.pravatar.cc/64?img=${Math.floor(Math.random() * 70) + 1}`,
    });
    setMode("create");
    setActive(null);
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
      {/* Header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Entregadores</h1>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Busca */}
          <label className="relative block w-full sm:w-72">
            <span className="absolute inset-y-0 left-3 grid place-items-center">
              <Search size={16} className="text-slate-400" aria-hidden="true" />
            </span>
            <input
              type="search"
              placeholder="Buscar por ID, nome, loja..."
              className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar entregadores"
            />
          </label>

          {/* Filtro status */}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-2 py-1.5 shadow-sm">
            <Filter size={16} className="text-slate-500" aria-hidden="true" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent text-sm text-slate-700 focus:outline-none"
              aria-label="Filtrar por status"
            >
              {["Todos", ...STATUS_OPTIONS].map((s) => (
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

          {/* CSV */}
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label="Exportar CSV"
            title="Exportar CSV"
          >
            <Download size={16} aria-hidden="true" /> CSV
          </button>

          {/* Adicionar */}
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
            aria-label="Adicionar entregador"
            onClick={startCreate}
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        {/* Cabeçalho (sticky) */}
        <div className="overflow-x-auto">
          <div
            className="min-w-[1040px] grid items-center bg-slate-50/60 px-4 py-3 text-xs text-slate-500 sticky top-0 z-[1]"
            style={{ gridTemplateColumns: COLS }}
            role="row"
            aria-label="Cabeçalho da lista de entregadores"
          >
            <div>ID #</div>
            <div>Avatar</div>
            <div>Nome</div>
            <div>ID do veículo</div>
            <div>Telefone</div>
            <div>Loja</div>
            <div>Avaliação</div>
            <div>Status</div>
            <div className="text-right">Ações</div>
          </div>

          {/* Linhas */}
          <motion.ul
            className="min-w-[1040px] divide-y divide-slate-200"
            role="list"
            aria-label="Lista de entregadores"
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
            {filtered.map((c) => (
              <motion.li
                key={c.id}
                className={`grid items-center px-4 transition-colors hover:bg-slate-50/60 focus-within:bg-slate-50/60 ${
                  dense ? "py-2" : "py-3"
                }`}
                style={{ gridTemplateColumns: COLS }}
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                role="row"
              >
                {/* ID */}
                <div className="text-slate-700">{c.id}</div>

                {/* Avatar */}
                <div>
                  <div className="relative h-9 w-9 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white shadow-sm">
                    <Image src={c.avatar} alt={c.name} fill className="object-cover" />
                  </div>
                </div>

                {/* Nome */}
                <div className="text-slate-900 font-medium truncate" title={c.name}>
                  {c.name}
                </div>

                {/* Veículo */}
                <div className="text-slate-700">{c.vehicleId}</div>

                {/* Telefone */}
                <div className="text-slate-700">{c.phone}</div>

                {/* Loja */}
                <div className="text-slate-700 truncate" title={c.store}>
                  {c.store}
                </div>

                {/* Avaliação */}
                <div>
                  <StarRating value={c.rating} />
                </div>

                {/* Status */}
                <div>
                  <CourierStatusBadge status={c.status} />
                </div>

                {/* Ações */}
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    aria-haspopup="dialog"
                    aria-label={`Ver detalhes de ${c.name}`}
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

            {filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-slate-500">
                Nenhum entregador encontrado.
              </li>
            )}
          </motion.ul>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 bg-white">
          <div>
            {filtered.length} exibidos • {TOTAL_COURIERS} no total
          </div>
          <Pagination page={PAGE} totalPages={TOTAL_PAGES} />
        </div>
      </div>

      {/* Painel de detalhes */}
      <SlideOver
        open={mode === "view" && !!active}
        title={active ? `Entregador ${active.name}` : "Entregador"}
        onClose={() => {
          setMode(null);
          setActive(null);
        }}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden ring-4 ring-blue-50">
                <Image src={active.avatar} alt={active.name} fill className="object-cover" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">{active.name}</div>
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <Hash size={14} /> {active.id}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Field label="Status">
                <CourierStatusBadge status={active.status} />
              </Field>
              <Field label="Loja">
                <span className="inline-flex items-center gap-2 text-sm text-slate-800">
                  <Building2 size={14} /> {active.store}
                </span>
              </Field>
              <Field label="Veículo">
                <span className="inline-flex items-center gap-2 text-sm text-slate-800">
                  <Gauge size={14} /> {active.vehicleId}
                </span>
              </Field>
              <Field label="Telefone">
                <span className="inline-flex items-center gap-2 text-sm text-slate-800">
                  <Phone size={14} /> {active.phone}
                </span>
              </Field>
              <Field label="Avaliação">
                <StarRating value={active.rating} />
              </Field>
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Painel de criação */}
      <SlideOver
        open={mode === "create"}
        title="Novo entregador"
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
              form="courier-create"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Adicionar
            </button>
          </div>
        }
      >
        <form id="courier-create" onSubmit={submitCreate} className="space-y-4">
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <Input
            label="ID do veículo"
            value={form.vehicleId}
            onChange={(e) => setForm((p) => ({ ...p, vehicleId: e.target.value }))}
            required
          />
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            required
          />
          <Input
            label="Loja"
            value={form.store}
            onChange={(e) => setForm((p) => ({ ...p, store: e.target.value }))}
            required
          />
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
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Avaliação (0-5)</span>
            <input
              type="number"
              min={0}
              max={5}
              step={1}
              value={form.rating}
              onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </label>
          <Input
            label="Avatar (URL)"
            value={form.avatar}
            onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))}
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

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      {children}
    </div>
  );
}
