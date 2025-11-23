// components/couriers/StarRating.jsx
"use client";

export default function StarRating({
  value = 0,
  max = 5,         // "sm" | "md" | "lg"
  size = "sm",
  showValue = false,   // mostra "3.5/5" ao lado
  className = "",
}) {
  // Limita valor ao intervalo [0, max]
  const v = Math.max(0, Math.min(Number(value) || 0, max));

  // Mapeia tamanho -> classes utilitárias
  const sizeMap = {
    sm: "h-4 w-4",     // 16px
    md: "h-5 w-5",     // 20px
    lg: "h-6 w-6",     // 24px
  };
  const iconSize = sizeMap[size] || sizeMap.sm;

  // Gera um array [0..max-1] e calcula a fração preenchida de cada estrela (0..1)
  const fills = Array.from({ length: max }, (_, i) => {
    const frac = v - i;
    return frac >= 1 ? 1 : frac > 0 ? frac : 0;
  });

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={`Avaliação: ${v} de ${max}`}
      role="img"
    >
      {/* Estrelas */}
      {fills.map((f, idx) => (
        <Star key={idx} percent={f} className={iconSize} />
      ))}

      {/* Valor numérico opcional */}
      {showValue && (
        <span className="ml-1 text-xs text-slate-600" aria-hidden="true">
          {Number.isInteger(v) ? v : v.toFixed(1)}/{max}
        </span>
      )}
    </div>
  );
}

/** Ícone de estrela com preenchimento parcial via gradiente */
function Star({ percent = 0, className = "" }) {
  // percent ∈ [0..1]; usamos gradiente para preencher parcialmente
  const id = useStableId();

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Gradiente único por instância para controlar o corte */}
        <linearGradient id={`starFill-${id}`} x1="0" y1="0" x2="100%" y2="0">
          <stop offset={`${Math.max(0, Math.min(100, percent * 100))}%`} stopColor="#F59E0B" />
          <stop offset={`${Math.max(0, Math.min(100, percent * 100))}%`} stopColor="#CBD5E1" />
        </linearGradient>
      </defs>

      {/* Contorno leve (slate-300) para consistência em tema claro */}
      <path
        d="M12 17.27l-5.18 3.05 1.4-5.99L3 9.74l6.05-.52L12 3.5l2.95 5.72 6.05.52-5.22 4.59 1.4 5.99L12 17.27z"
        fill={`url(#starFill-${id})`}
        stroke="#CBD5E1"
        strokeWidth="0.75"
      />
    </svg>
  );
}

/** Gera um ID estável por montagem (sem colisão entre estrelas) */
function useStableId() {
  // Número aleatório pequeno (suficiente para evitar colisões entre instâncias)
  // Sem uso de crypto para manter compatibilidade SSR.
  const id = typeof window === "undefined"
    ? Math.floor(Math.random() * 1e6)
    : (StarRatingCounter = (StarRatingCounter + 1) % 1e9);
  return id;
}

// Escopo local para contador simples em ambiente client
let StarRatingCounter = Math.floor(Math.random() * 1e6);
