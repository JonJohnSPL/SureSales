import { LayoutDashboard, ListChecks, Filter, Target, Download } from "lucide-react";

const items = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"projects",  label:"Project Tracker", icon:ListChecks },
  { id:"funnel",    label:"Funnel", icon:Filter },
  { id:"targets",   label:"Target Accounts", icon:Target },
];

export default function Sidebar({ active, onChange, onExport }) {
  return (
    <aside className="w-60 shrink-0 bg-navy text-white flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-xs uppercase tracking-widest text-sky-200">SPL Pittsburgh</div>
        <div className="text-xl font-bold">SureSales</div>
        <div className="text-[11px] text-sky-200 mt-1">Appalachia funnel + project tracker</div>
      </div>
      <nav className="flex-1 py-3">
        {items.map(({ id, label, icon:Icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-white/10 ${
              active === id ? "bg-white/15 border-l-4 border-sky-300 pl-4" : ""
            }`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>
      <button onClick={onExport}
        className="m-4 flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg py-2">
        <Download size={14} /> Export JSON
      </button>
    </aside>
  );
}
