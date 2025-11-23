// components/customers/CustomersTable.jsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Download,
  Eye,
  Search as SearchIcon,
  ArrowUpDown,
  Rows,
  Rows4,
  Plus,
  Phone,
  Calendar,
  Mail,
} from "lucide-react";
import {
  CUSTOMERS,
  TOTAL_CUSTOMERS,
  PAGE,
  TOTAL_PAGES,
} from "../../lib/customersData";
import CustomerStatusBadge from "./CustomerStatusBadge";
import Pagination from "../orders/Pagination";
import SlideOver from "../common/SlideOver";

// Grid igual ao print
const COLS = "120px 80px 1fr 200px 220px 140px 88px";

// Utils
const parseDate = (d) => {
  if (!d) return 0;
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return new Date(d).getTime();
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`).getTime();
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
};

const EMPTY_CUSTOMER = {
  name: "",
  phone: "",
  email: "contato@cliente.com",
  createdAt: new Date().toLocaleDateString("pt-BR"),
  status: "Ativo",
  avatar: "https://i.pravatar.cc/64",
};

export default function CustomersTable() {
  const reduce = useReducedMotion();

  // Dados
  const [items, setItems] = useState(CUSTOMERS);

  // Preferências leves com persistência
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(() => {
    if (typeof window === "undefined") return "createdAt";
    return localStorage.getItem("customers:sortKey") || "createdAt"; // 'name' | 'createdAt'
  });
  const [sortDir, setSortDir] = useState(() => {
    if (typeof window === "undefined") return "desc";
    return localStorage.getItem("customers:sortDir") || "desc"; // 'asc' | 'desc'
  });
  const [dense, setDense] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("customers:dense") === "true";
  });

  // Painéis
  const [mode, setMode] = useState(null); // view | create
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(EMPTY_CUSTOMER);

  useEffect(() => {
    localStorage.setItem("customers:sortKey", sortKey);
  }, [sortKey]);
  useEffect(() => {
    localStorage.setItem("customers:sortDir", sortDir);
  }, [sortDir]);
  useEffect(() => {
    localStorage.setItem("customers:dense", String(dense));
  }, [dense]);

  // Busca + ordenação client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items;

    if (q) {
      arr = arr.filter((c) =>
        [c.id, c.name, c.phone, c.createdAt]
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
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  }

  function exportCSV() {
    const header = ["id", "nome", "telefone", "criado_em", "status"];
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.phone,
      c.createdAt,
      c.status,
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
    a.download = "clientes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function startCreate() {
    setForm({
      ...EMPTY_CUSTOMER,
      id: `#${String(items.length + 1).padStart(3, "0")}`,
      avatar: `https://i.pravatar.cc/64?img=${Math.floor(Math.random() * 70) + 1}`,
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
      {/* Header + ações */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Clientes</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
          >
            <Plus size={16} /> Novo cliente
          </button>

          {/* Busca */}
          <label className="relative block w-full sm:w-72">
            <span className="absolute inset-y-0 left-3 grid place-items-center">
              <SearchIcon size={16} className="text-slate-400" aria-hidden="true" />
            </span>
            <input
              type="search"
              placeholder="Buscar por ID, nome, telefone..."
              className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar clientes"
            />
          </label>

          {/* Ordenação por Nome */}
          <button
            type="button"
            onClick={() => toggleSort("name")}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label={`Ordenar por nome (${sortKey === "name" ? sortDir : "asc"})`}
            title="Ordenar por nome"
          >
            <ArrowUpDown size={16} aria-hidden="true" />
            Nome {sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>

          {/* Ordenação por Criado em */}
          <button
            type="button"
            onClick={() => toggleSort("createdAt")}
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label={`Ordenar por criado em (${sortKey === "createdAt" ? sortDir : "desc"})`}
            title="Ordenar por criado em"
          >
            <ArrowUpDown size={16} aria-hidden="true" />
            Criado em {sortKey === "createdAt" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>

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
            aria-label="Exportar clientes"
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
            className="min-w-[980px] grid items-center bg-slate-50/60 px-4 py-3 text-xs text-slate-500 sticky top-0 z-[1]"
            style={{ gridTemplateColumns: COLS }}
            role="row"
            aria-label="Cabeçalho da lista de clientes"
          >
            <div className="flex items-center gap-2">ID #</div>
            <div>Avatar</div>
            <div className="flex items-center gap-2">
              Nome
              <span className="text-slate-300">•</span>
            </div>
            <div className="flex items-center gap-2">
              Telefone <SearchIcon size={14} className="text-slate-400" />
            </div>
            <div className="flex items-center gap-2">
              Criado em <span className="text-slate-300">•</span>
            </div>
            <div className="flex items-center gap-2">Status</div>
            <div className="text-right">Ações</div>
          </div>

          {/* Linhas */}
          <motion.ul
            className="min-w-[980px] divide-y divide-slate-200"
            role="list"
            aria-label="Lista de clientes"
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

                {/* Telefone */}
                <div className="text-slate-700">{c.phone}</div>

                {/* Criado em */}
                <div className="text-slate-700">{c.createdAt}</div>

                {/* Status */}
                <div>
                  <CustomerStatusBadge status={c.status} />
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
                Nenhum cliente encontrado.
              </li>
            )}
          </motion.ul>
        </div>

        {/* Rodapé + paginação */}
        <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 bg-white">
          <div>
            {filtered.length} exibidos • {TOTAL_CUSTOMERS} no total
          </div>
          <Pagination page={PAGE} totalPages={TOTAL_PAGES} />
        </div>
      </div>

      {/* Painel de visualização */}
      <SlideOver
        open={mode === "view" && !!active}
        title={active ? active.name : "Cliente"}
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
                <CustomerStatusBadge status={active.status} />
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Phone size={14} /> {active.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} /> {active.email || "contato@ateliux.com"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} /> Criado em {active.createdAt}
              </div>
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Painel de criação */}
      <SlideOver
        open={mode === "create"}
        title="Novo cliente"
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
              form="customer-create"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Salvar cliente
            </button>
          </div>
        }
      >
        <form id="customer-create" onSubmit={submitCreate} className="space-y-4">
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
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            required
          />
          <Input
            label="E-mail (apenas exibição)"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            label="Criado em"
            value={form.createdAt}
            onChange={(e) => setForm((p) => ({ ...p, createdAt: e.target.value }))}
          />
          <label className="space-y-1 block">
            <span className="text-sm text-slate-600">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Ativo">Ativo</option>
              <option value="Ocioso">Ocioso</option>
              <option value="Suspenso">Suspenso</option>
            </select>
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
