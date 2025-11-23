// components/Topbar.jsx
"use client";

import Link from "next/link";
import { Search, ChevronDown, Bell, UserCog, CheckCircle, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useUserProfile } from "./UserProfileProvider";
import { useEffect, useRef, useState } from "react";

const LANG_LABEL = {
  "pt-BR": "Português",
  "en-US": "Inglês (EUA)",
  "es-ES": "Espanhol",
};

const NOTIFICATIONS = [
  {
    type: "success",
    title: "Pedido #921 enviado",
    desc: "O entregador saiu para entrega há 3 minutos.",
    time: "agora",
  },
  {
    type: "info",
    title: "Nova loja aprovada",
    desc: "Mercado Paulista foi ativado.",
    time: "há 25 min",
  },
  {
    type: "warning",
    title: "Estoque crítico",
    desc: "Feijoada completa está com baixa disponibilidade.",
    time: "há 2 h",
  },
];

export default function Topbar() {
  const reduce = useReducedMotion();
  const { profile, updateProfile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const languageLabel = LANG_LABEL[profile.language] || profile.language;

  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center" role="banner">
      <div className="px-4 w-full flex items-center gap-4">
        {/* Busca global */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
        >
          <label className="relative block" aria-label="Buscar">
            <span className="absolute inset-y-0 left-3 grid place-items-center">
              <Search size={16} className="text-slate-400" aria-hidden="true" />
            </span>
            <input
              type="search"
              inputMode="search"
              placeholder="Buscar por pedidos, clientes ou produtos"
              className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              aria-label="Campo de busca global"
            />
          </label>
        </motion.div>

        {/* Idioma / preferências */}
        <motion.label
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500/30 shadow-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut", delay: reduce ? 0 : 0.04 }}
        >
          <span className="sr-only">Selecionar idioma</span>
          <select
            value={profile.language}
            onChange={(e) => updateProfile({ language: e.target.value })}
            className="bg-transparent text-sm text-slate-700 focus:outline-none pr-5 appearance-none"
            aria-label={`Idioma atual: ${languageLabel}`}
          >
            {Object.entries(LANG_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} aria-hidden="true" className="pointer-events-none" />
        </motion.label>

        {/* Notificações */}
        <div className="relative" ref={popoverRef}>
          <motion.button
            type="button"
            className="relative rounded-full p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut", delay: reduce ? 0 : 0.08 }}
            aria-label="Abrir notificações"
            onClick={() => setOpen((v) => !v)}
          >
            <Bell size={18} aria-hidden="true" />
            {profile.notifications?.push && (
              <span
                className="absolute -top-0.5 -right-0.5 inline-block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white"
                aria-hidden="true"
              />
            )}
          </motion.button>

          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-slate-200 bg-white">
                <div className="text-sm font-semibold text-slate-900">Notificações</div>
                <div className="text-xs text-slate-500">Atualizado automaticamente</div>
              </div>
              <ul className="divide-y divide-slate-200 bg-white">
                {NOTIFICATIONS.map((n, idx) => (
                  <li key={idx} className="px-4 py-3 bg-white hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <BadgeIcon type={n.type} />
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-900">{n.title}</div>
                        <div className="text-xs text-slate-600">{n.desc}</div>
                        <div className="text-[11px] text-slate-400">{n.time}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full text-center text-sm text-blue-700 py-2 bg-white hover:bg-blue-50"
              >
                Marcar como lidas
              </button>
            </motion.div>
          )}
        </div>

        {/* Usuário */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut", delay: reduce ? 0 : 0.12 }}
        >
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-sm text-slate-900 font-medium">{profile.name}</div>
            <div className="text-xs text-slate-500">{profile.email}</div>
          </div>
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-2 pr-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            aria-label="Abrir painel da conta"
          >
            <Image
              src={profile.avatar}
              alt={`Avatar de ${profile.name}`}
              width={32}
              height={32}
              className="rounded-full ring-2 ring-white shadow-sm"
              priority
            />
            <UserCog size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </header>
  );
}

function BadgeIcon({ type }) {
  const base = "inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-inner";
  if (type === "success") {
    return (
      <span className={`${base} bg-emerald-500`}>
        <CheckCircle size={16} />
      </span>
    );
  }
  if (type === "warning") {
    return (
      <span className={`${base} bg-amber-500`}>
        <TriangleAlert size={16} />
      </span>
    );
  }
  return (
    <span className={`${base} bg-blue-500`}>
      <Bell size={16} />
    </span>
  );
}
