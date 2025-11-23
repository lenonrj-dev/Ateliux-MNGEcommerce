// app/(shell)/conta/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Check,
  Globe,
  Mail,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Undo2,
  User,
} from "lucide-react";
import { useUserProfile } from "../../../components/common/UserProfileProvider";

const LANG_OPTIONS = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "Inglês (EUA)" },
  { value: "es-ES", label: "Espanhol" },
];

const ROLE_OPTIONS = ["Operações", "Suporte", "Vendas", "Marketing", "Financeiro"];

export default function ContaPage() {
  const { profile, updateProfile, resetProfile, ready } = useUserProfile();
  const reduce = useReducedMotion();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  useEffect(() => setForm(profile), [profile]);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(profile),
    [form, profile]
  );

  useEffect(() => {
    if (!dirty) return;
    setSaved(false);
  }, [dirty]);

  const heroMotion = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  };

  function handleSubmit(e) {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function handleField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleNotification(key) {
    setForm((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications?.[key] },
    }));
  }

  function randomAvatar() {
    const id = Math.floor(Math.random() * 70) + 1;
    const avatar = `https://i.pravatar.cc/128?img=${id}`;
    setForm((prev) => ({ ...prev, avatar }));
    updateProfile({ avatar });
  }

  if (!ready) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Carregando preferências da conta...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Minha conta
          </h1>
          <p className="text-sm text-slate-500">
            Dados do usuário, preferências e notificações da Ateliux.
          </p>
        </div>
        {saved && (
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-3 py-1.5 text-sm border border-green-200">
            <Check size={16} />
            Alterações salvas
          </div>
        )}
      </div>

      {/* Resumo */}
      <motion.section
        className="rounded-2xl border border-slate-200 bg-white shadow-md p-5"
        initial="hidden"
        animate="show"
        variants={heroMotion}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden ring-4 ring-blue-50 bg-slate-100">
              <Image
                src={form.avatar}
                alt={`Avatar de ${form.name}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-900">{form.name}</span>
                <span className="rounded-full bg-blue-50 text-blue-700 text-xs px-2 py-1 border border-blue-100">
                  {form.role || "Operação"}
                </span>
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <Mail size={14} /> {form.email}
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <Phone size={14} /> {form.phone}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 border border-emerald-100">
              <ShieldCheck size={14} /> Conta verificada
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 text-xs px-3 py-1.5 border border-slate-200">
              <Globe size={14} /> {form.language}
            </span>
            <button
              type="button"
              onClick={randomAvatar}
              className="inline-flex items-center gap-2 rounded-full bg-white text-slate-700 text-xs px-3 py-1.5 border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <RefreshCw size={14} /> Trocar avatar
            </button>
          </div>
        </div>
      </motion.section>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
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
          {/* Dados pessoais */}
          <motion.section
            className="rounded-2xl border border-slate-200 bg-white shadow-md p-5 space-y-4"
            variants={heroMotion}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Dados pessoais</h2>
                <p className="text-sm text-slate-500">
                  Nome público e contatos usados no painel.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <User size={14} /> Nome completo
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleField("name", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Seu nome"
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm text-slate-600">Cargo</span>
                <select
                  value={form.role}
                  onChange={(e) => handleField("role", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Mail size={14} /> E-mail
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleField("email", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="voce@ateliux.com"
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Phone size={14} /> Telefone
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleField("phone", e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="+55 11 99999-0000"
                />
              </label>
            </div>
          </motion.section>

          {/* Preferências */}
          <motion.section
            className="rounded-2xl border border-slate-200 bg-white shadow-md p-5 space-y-4"
            variants={heroMotion}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Preferências</h2>
                <p className="text-sm text-slate-500">Idioma e avisos de comunicação.</p>
              </div>
            </div>

            <label className="space-y-1 block">
              <span className="text-sm text-slate-600 flex items-center gap-2">
                <Globe size={14} /> Idioma do painel
              </span>
              <select
                value={form.language}
                onChange={(e) => handleField("language", e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {LANG_OPTIONS.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Bell size={14} /> Notificações
              </h3>
              <div className="space-y-2">
                {[
                  { key: "email", label: "E-mail", desc: "Alertas de pedidos e clientes" },
                  { key: "push", label: "Push", desc: "Alertas rápidos no painel" },
                  { key: "sms", label: "SMS", desc: "Somente em casos críticos" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!form.notifications?.[item.key]}
                      onChange={() => toggleNotification(item.key)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.section>
        </motion.div>

        {/* Segurança e ações */}
        <motion.section
          className="rounded-2xl border border-slate-200 bg-white shadow-md p-5 space-y-4"
          initial="hidden"
          animate="show"
          variants={heroMotion}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Segurança e sessão</h2>
              <p className="text-sm text-slate-500">Controles rápidos para proteção e acesso.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 px-3 py-2">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={() => setTwoFactor((v) => !v)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-900">2FA habilitada</div>
                <div className="text-xs text-slate-500">
                  Autenticação em duas etapas simulada para demonstração.
                </div>
              </div>
            </label>

            <div className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={14} /> Sessões ativas
              </div>
              <div>3 sessões conectadas (web, iOS, Android)</div>
              <button
                type="button"
                className="self-start inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 text-xs px-3 py-1.5 border border-amber-200 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                <Undo2 size={14} /> Encerrar todas
              </button>
            </div>
          </div>
        </motion.section>

        {/* Ações */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            {dirty ? "Existem mudanças não salvas." : "Tudo está sincronizado."}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => resetProfile()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
            >
              <RefreshCw size={16} /> Restaurar padrão
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!dirty}
            >
              <Save size={16} /> Salvar mudanças
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
