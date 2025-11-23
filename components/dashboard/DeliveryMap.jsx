// components/dashboard/DeliveryMap.jsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14944.028928333349!2d-44.1023!3d-22.5121!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9e8e90da39b8fb%3A0x75f2b3d6f5439991!2sCentro%2C%20Volta%20Redonda%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1732400000000!5m2!1spt-BR!2sbr";

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
        aria-label="Mapa de entregas - Centro de Volta Redonda"
      >
        <iframe
          src={EMBED_SRC}
          title="Mapa de Volta Redonda (Centro)"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />

        <div className="absolute left-4 bottom-4 rounded-full bg-slate-900/80 text-white px-3 py-1.5 text-xs backdrop-blur shadow-lg flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          Operação em produção · Centro, Volta Redonda/RJ
        </div>
      </motion.div>
    </div>
  );
}
