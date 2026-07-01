export const Card = ({ title, children, right, className = "" }) => (
  <div className={`rounded-md border border-slate-300 bg-white shadow-sm ${className}`}>
    {title && (
      <div className="flex items-center justify-between gap-3 border-b border-slate-300 px-4 py-2.5">
        <div className="min-w-0 text-sm font-semibold text-slate-950">{title}</div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    )}
    <div className="p-4">{children}</div>
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
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
      <div className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}>{label}</div>
      <div className="bg-white px-3 py-3 text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
};

export const Pill = ({ tone = "slate", children }) => {
  const tones = {
    green: "border-emerald-700 bg-emerald-100 text-emerald-950",
    yellow: "border-amber-700 bg-amber-100 text-amber-950",
    red: "border-rose-700 bg-rose-100 text-rose-950",
    slate: "border-slate-500 bg-slate-100 text-slate-900",
    navy: "border-sky-700 bg-sky-100 text-sky-950",
    purple: "border-violet-700 bg-violet-100 text-violet-950",
  };
  return (
    <span className={`inline-flex max-w-full items-center rounded border px-1.5 py-0.5 text-[11px] font-semibold leading-4 ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const healthTone = (h) =>
  ({
    Healthy: "green",
    Stable: "green",
    "At Risk": "yellow",
    Concerning: "red",
    Critical: "red",
    Green: "green",
    Yellow: "yellow",
    Red: "red",
  })[h] || "slate";

export const priorityTone = (p) =>
  ({ Urgent: "red", High: "red", Medium: "yellow", Low: "slate" })[p] ||
  "slate";

export const bucketTone = (bucket) => ({ New: "purple", Current: "navy" })[bucket] || "slate";

export const inputClass =
  "w-full rounded-md border border-slate-400 bg-white px-2.5 py-1.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

export const selectClass =
  "w-full rounded-md border border-slate-400 bg-white px-2.5 py-1.5 text-sm text-slate-950 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100";

export const buttonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-md bg-navy px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900";

export const ghostButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-400 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-800 hover:border-slate-500 hover:bg-slate-100";

export const labelClass = "text-[11px] font-semibold uppercase tracking-wide text-slate-600";
