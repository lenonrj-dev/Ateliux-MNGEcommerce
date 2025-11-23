// components/common/SlideOver.jsx
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function SlideOver({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="h-full w-full max-w-xl bg-white shadow-2xl ring-1 ring-slate-200 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="text-base font-semibold text-slate-900">{title}</div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label="Fechar painel"
              >
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-auto px-5 py-4">{children}</div>
            {footer ? <div className="border-t border-slate-200 px-5 py-4">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
