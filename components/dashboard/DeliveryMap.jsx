// components/dashboard/DeliveryMap.jsx
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const markers = [
  // Posições percentuais fictícias (top/left) para simular entregas no mapa
  { id: "m1", top: "30%", left: "22%", status: "em-rota" },
  { id: "m2", top: "55%", left: "40%", status: "entregue" },
  { id: "m3", top: "48%", left: "68%", status: "em-rota" },
  { id: "m4", top: "20%", left: "77%", status: "pendente" },
];

export default function DeliveryMap() {
  const reduce = useReducedMotion();

  return (
    <div className="px-4 pb-4">
        <motion.div
          className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: "easeOut" }}
          role="region"
          aria-label="Mapa de entregas (demonstração)"
        >
        {/* Imagem do mapa (decorativa) */}
        <Image
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 66vw, 100vw"
          aria-hidden="true"
          priority
        />

        {/* Marcadores fictícios de entregas com ping */}
        {markers.map((m, i) => {
          const tone =
            m.status === "entregue"
              ? "bg-emerald-500 ring-2 ring-white"
              : m.status === "pendente"
              ? "bg-amber-500 ring-2 ring-white"
              : "bg-blue-500 ring-2 ring-white"; // em-rota

          return (
            <motion.div
              key={m.id}
              className="absolute"
              style={{ top: m.top, left: m.left }}
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: reduce ? 0 : 0.2,
                ease: "easeOut",
                delay: reduce ? 0 : i * 0.04,
              }}
            >
              <span className="relative block h-3.5 w-3.5">
                {/* ping */}
                <span className="absolute inset-0 rounded-full bg-blue-400/40 animate-ping" aria-hidden="true" />
                {/* dot */}
                <span className={`relative block h-3.5 w-3.5 rounded-full ${tone}`} />
              </span>
              <span className="sr-only">
                Marcador de entrega: {m.status === "entregue" ? "entregue" : m.status === "pendente" ? "pendente" : "em rota"}
              </span>
            </motion.div>
          );
        })}

        {/* Card de aviso (mantém a ideia original, com UI/UX melhor) */}
        <motion.div
          className="absolute left-4 top-4 w-80 rounded-xl bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-lg border border-slate-200 p-4 text-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut", delay: reduce ? 0 : 0.06 }}
          role="dialog"
          aria-labelledby="map-warning-title"
        >
          <div id="map-warning-title" className="font-medium text-slate-800 mb-1">
            Mapa em modo demonstração
          </div>
          <p className="text-slate-600">
            Este ambiente não carrega o Google Maps real. Os pontos e trajetos são ilustrativos para fins de demo.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Integração: desativada</span>
            <button
              type="button"
              className="rounded-2xl bg-slate-100 hover:bg-slate-200 px-3 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="Fechar aviso"
              onClick={(e) => {
                // comportamento simples: esconder o card localmente
                const el = e.currentTarget.closest("[role='dialog']");
                if (el) el.style.display = "none";
              }}
            >
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
