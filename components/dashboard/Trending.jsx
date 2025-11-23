// components/dashboard/Trending.jsx
"use client";

import Image from "next/image";
import { trending } from "../../lib/mockData";
import { motion, useReducedMotion } from "framer-motion";

export default function Trending() {
  const reduce = useReducedMotion();

  if (!trending?.length) {
    return (
      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
          Nenhum produto em alta no momento.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <motion.ul
        className="space-y-4"
        role="list"
        aria-label="Produtos em alta"
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
        {trending.map((p) => (
          <motion.li
            key={p.rank}
            className="group flex items-center gap-4 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-slate-200 hover:bg-slate-50/60 focus-within:bg-slate-50/60"
            variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
          >
            {/* Imagem do produto */}
            <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <Image
                src={p.img}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                sizes="56px"
                priority={false}
              />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 truncate">{p.title}</div>
              <div className="text-slate-500 text-sm">{p.price}</div>
              <div className="text-slate-500 text-sm">
                Pedido {p.orders} {Number(p.orders) === 1 ? "vez" : "vezes"}
              </div>
            </div>

            {/* Rank */}
            <div className="shrink-0">
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-sm font-semibold ring-1 ring-amber-200"
                aria-label={`Posição no ranking: ${p.rank}`}
                title={`#${p.rank}`}
              >
                {p.rank}
              </span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
