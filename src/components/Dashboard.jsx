import { Card, Stat, Pill, healthTone, priorityTone } from "./ui.jsx";

export default function Dashboard({ projects }) {
  const today = new Date().toISOString().slice(0,10);
  const open      = projects.filter(p => p.status !== "Closed").length;
  const high      = projects.filter(p => p.priority === "High").length;
  const needsDate = projects.filter(p => p.stage === "Needs Dates").length;
  const recovery  = projects.filter(p => p.stage === "Recovery").length;
  const overdue   = projects.filter(p => p.status !== "Closed" && p.dueDate && p.dueDate < today).length;

  const byStage = Object.entries(projects.reduce((acc, p) => {
    acc[p.stage] = (acc[p.stage] || 0) + 1; return acc;
  }, {})).sort((a,b)=>b[1]-a[1]);

  const byOwner = Object.entries(projects.reduce((acc, p) => {
    acc[p.owner] = (acc[p.owner] || 0) + 1; return acc;
  }, {})).sort((a,b)=>b[1]-a[1]);

  const focus = [...projects]
    .filter(p => p.status !== "Closed")
    .sort((a,b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
    .slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Open Projects"      value={open}      tone="navy" />
        <Stat label="High Priority"      value={high}      tone="red" />
        <Stat label="Needs Dates"        value={needsDate} tone="yellow" />
        <Stat label="In Recovery"        value={recovery}  tone="red" />
        <Stat label="Overdue Next Steps" value={overdue}   tone="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="By Stage">
          <ul className="space-y-2 text-sm">
            {byStage.map(([s,n]) => (
              <li key={s} className="flex justify-between"><span>{s}</span><Pill tone="navy">{n}</Pill></li>
            ))}
          </ul>
        </Card>
        <Card title="By Suggested Owner">
          <ul className="space-y-2 text-sm">
            {byOwner.map(([s,n]) => (
              <li key={s} className="flex justify-between"><span>{s}</span><Pill tone="slate">{n}</Pill></li>
            ))}
          </ul>
        </Card>
        <Card title="This Week's Focus">
          <ul className="space-y-3 text-sm">
            {focus.map(p => (
              <li key={p.id} className="border-l-4 border-sky-400 pl-3">
                <div className="font-medium">{p.client} — {p.workstream}</div>
                <div className="text-xs text-slate-500 flex gap-2 items-center mt-0.5">
                  <Pill tone={healthTone(p.health)}>{p.health}</Pill>
                  <Pill tone={priorityTone(p.priority)}>{p.priority}</Pill>
                  <span>Due {p.dueDate || "—"}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">{p.nextStep}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
