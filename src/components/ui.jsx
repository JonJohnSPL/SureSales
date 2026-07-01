export const Card = ({ title, children, right }) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
    {title && (
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {right}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

export const Stat = ({ label, value, tone = "navy" }) => {
  const tones = {
    navy: "bg-navy text-white",
    green: "bg-emerald-600 text-white",
    yellow: "bg-amber-500 text-white",
    red: "bg-rose-600 text-white",
    slate: "bg-slate-700 text-white",
  };
  return (
    <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200">
      <div className={`px-4 py-2 text-xs uppercase tracking-wide ${tones[tone]}`}>{label}</div>
      <div className="px-4 py-5 text-3xl font-bold text-slate-800 bg-white">{value}</div>
    </div>
  );
};

export const Pill = ({ tone = "slate", children }) => {
  const tones = {
    green: "bg-emerald-100 text-emerald-800",
    yellow: "bg-amber-100 text-amber-800",
    red: "bg-rose-100 text-rose-800",
    slate: "bg-slate-100 text-slate-700",
    navy: "bg-sky-100 text-sky-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>;
};

export const healthTone = (h) => ({ Green:"green", Yellow:"yellow", Red:"red" }[h] || "slate");
export const priorityTone = (p) => ({ High:"red", Medium:"yellow", Low:"slate" }[p] || "slate");
