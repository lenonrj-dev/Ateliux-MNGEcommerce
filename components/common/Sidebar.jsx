// components/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Tags,
  Store,
  Bike,
  LogOut,
  UserCog,
} from "lucide-react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const NAV = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/categorias", label: "Categorias", icon: Tags },
  { href: "/lojas", label: "Lojas", icon: Store },
  { href: "/entregadores", label: "Entregadores", icon: Bike },
  { href: "/conta", label: "Minha conta", icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <aside
      className="flex h-full flex-col bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70"
      aria-label="Barra lateral de navegação"
    >
      {/* Header */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-200">
        <Image
          src="/ateliux-logo.svg"
          alt="Ateliux"
          width={28}
          height={28}
          className="rounded"
          priority
        />
        <span className="font-semibold tracking-wide text-slate-900">
          Ateliux
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2" role="navigation">
        <ul className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <motion.li
                key={href}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.18,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm outline-none",
                    "transition-colors duration-150",
                    active
                      ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,.25)]"
                      : "text-slate-700 hover:bg-slate-50 focus:bg-slate-50",
                  ].join(" ")}
                >
                  <Icon
                    size={18}
                    className={[
                      "shrink-0 transition-transform duration-150",
                      active ? "scale-110" : "group-hover:scale-105",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="truncate">{label}</span>
                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="p-2 border-t border-slate-200">
        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/40"
          aria-label="Sair da conta"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  );
}
