import "./globals.css";

export const metadata = {
  title: "Ateliux - Painel",
  description: "Painel administrativo de demonstração da Ateliux, totalmente em português do Brasil.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="min-h-dvh bg-gray-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
