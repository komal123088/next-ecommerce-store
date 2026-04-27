export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 p-6 space-y-6">
      <div className="h-16 bg-slate-800 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-32 animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 h-80 animate-pulse" />
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-80 animate-pulse" />
      </div>
    </div>
  );
}
