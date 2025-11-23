// components/dashboard/DeliveryMap.jsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

const markers = [
  { id: "centro", top: "46%", left: "54%", status: "entregue", label: "Centro" },
  { id: "aterro", top: "52%", left: "60%", status: "em-rota", label: "Aterrado" },
  { id: "vila", top: "58%", left: "50%", status: "em-rota", label: "Vila Santa Cecília" },
  { id: "jardim", top: "38%", left: "65%", status: "pendente", label: "Jardim Amália" },
];

const STATIC_MAP =
  "https://staticmap.openstreetmap.de/staticmap.php?center=-22.5121,-44.1023&zoom=14&size=1200x720&maptype=mapnik&markers=-22.5121,-44.1023,lightblue1|-22.5055,-44.0970,lightblue1|-22.5202,-44.1049,lightblue1|-22.5180,-44.0900,lightblue1";

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
        aria-label="Mapa de entregas em produção - Centro de Volta Redonda"
      >
        <img
          src={STATIC_MAP}
          alt="Mapa centralizado em Volta Redonda (Centro)"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />

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
              <span className="relative block h-4 w-4">
                <span className="absolute inset-0 rounded-full bg-blue-400/40 animate-ping" aria-hidden="true" />
                <span className={`relative block h-4 w-4 rounded-full ${tone}`} />
              </span>
              <span className="sr-only">
                Marcador de entrega ({m.label}): {m.status === "entregue" ? "entregue" : m.status === "pendente" ? "pendente" : "em rota"}
              </span>
            </motion.div>
          );
        })}

        <div className="absolute left-4 bottom-4 rounded-full bg-slate-900/80 text-white px-3 py-1.5 text-xs backdrop-blur shadow-lg flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          Operação em produção · Centro, Volta Redonda/RJ
        </div>
      </motion.div>
    </div>
  );
}
