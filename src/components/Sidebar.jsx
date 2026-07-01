import { LayoutDashboard, ListChecks, Download, LogOut } from "lucide-react";

const items = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"projects",  label:"Project Tracker", icon:ListChecks },
];

export default function Sidebar({ active, onChange, onExport, user, onSignOut }) {
  return (
    <aside className="flex w-16 shrink-0 flex-col bg-slate-950 text-white md:w-52">
      <div className="border-b border-white/15 px-3 py-4 md:px-4">
        <div className="hidden text-[11px] font-semibold uppercase tracking-widest text-sky-200 md:block">SPL Pittsburgh</div>
        <div className="text-center text-lg font-bold leading-6 md:hidden">SS</div>
        <div className="hidden text-lg font-bold leading-6 md:block">SureSales</div>
        <div className="mt-0.5 hidden text-[11px] text-slate-300 md:block">Appalachia client work tracker</div>
      </div>
      <nav className="flex-1 py-2">
        {items.map(({ id, label, icon:Icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className={`flex w-full items-center justify-center gap-2.5 px-3 py-2 text-sm font-medium hover:bg-white/10 md:justify-start md:px-4 ${
              active === id ? "border-l-4 border-sky-300 bg-white/15 pl-2 text-white md:pl-3" : "text-slate-200"
            }`}>
            <Icon size={16} /> <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>
      <button onClick={onExport}
        className="mx-2 mb-3 flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-2 py-2 text-sm font-semibold hover:bg-white/20 md:mx-3 md:px-3">
        <Download size={14} /> <span className="hidden md:inline">Export JSON</span>
      </button>
      {onSignOut && (
        <div className="px-3 pb-3">
          {user?.email && <div className="mb-2 hidden truncate text-[11px] text-slate-300 md:block">{user.email}</div>}
          <button onClick={onSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-2 py-2 text-sm font-semibold hover:bg-white/20 md:px-3">
            <LogOut size={14} /> <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
