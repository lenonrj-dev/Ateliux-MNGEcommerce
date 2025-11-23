export default function Loading() {
  return (
    <div className="min-h-dvh grid grid-cols-[240px_1fr] bg-gray-50">
      <aside className="border-r border-slate-200 bg-white p-4">
        <div className="h-10 w-28 rounded bg-slate-200 animate-pulse mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </aside>
      <main className="p-6 space-y-4">
        <div className="h-8 w-40 rounded bg-slate-200 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <div className="h-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-72 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <div className="h-full rounded-xl bg-slate-100 animate-pulse" />
          </div>
          <div className="h-72 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <div className="h-full rounded-xl bg-slate-100 animate-pulse" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="h-64 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </main>
    </div>
  );
}
