import { useMemo, useState } from "react";
import { Card, Pill, healthTone, priorityTone } from "./ui.jsx";
import { STAGES, PRIORITIES, HEALTHS, OWNERS, STATUSES } from "../data/seed.js";
import { Plus, Trash2 } from "lucide-react";

export default function ProjectTracker({ projects, onProjectAdd, onProjectChange, onProjectRemove }) {
  const [q, setQ] = useState("");
  const [ownerF, setOwnerF] = useState("All");
  const [stageF, setStageF] = useState("All");

  const rows = useMemo(() => projects.filter(p => {
    const matchesQ = !q || [p.client, p.workstream, p.nextStep, p.notes].join(" ").toLowerCase().includes(q.toLowerCase());
    return matchesQ
      && (ownerF === "All" || p.owner === ownerF)
      && (stageF === "All" || p.stage === stageF);
  }), [projects, q, ownerF, stageF]);

  const update = (id, field, value) => onProjectChange(id, field, value);

  const add = () => {
    const nextNumber = Math.max(
      0,
      ...projects.map((project) => Number(project.id?.replace(/^P-/, "")) || 0)
    ) + 1;
    const id = `P-${String(nextNumber).padStart(3, "0")}`;
    onProjectAdd({
      id, client:"", workstream:"", bucket:"New", duration:"", ask:"",
      owner:"Unassigned", priority:"Medium", stage:"Qualification", status:"Open",
      health:"Yellow", nextStep:"", dueDate:"", hardDate:false, recurring:false, notes:""
    });
  };
  const remove = (id) => onProjectRemove(id);

  return (
    <Card
      title={`Projects (${rows.length})`}
      right={
        <div className="flex gap-2 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"
            className="text-sm border border-slate-300 rounded-md px-2 py-1" />
          <select value={ownerF} onChange={e=>setOwnerF(e.target.value)} className="text-sm border border-slate-300 rounded-md px-2 py-1">
            <option>All</option>{OWNERS.map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={stageF} onChange={e=>setStageF(e.target.value)} className="text-sm border border-slate-300 rounded-md px-2 py-1">
            <option>All</option>{STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={add} className="text-sm bg-navy text-white rounded-md px-3 py-1 flex items-center gap-1">
            <Plus size={14}/> New
          </button>
        </div>
      }>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {["Client","Workstream","Owner","Stage","Status","Priority","Health","Next Step","Due",""].map(h =>
                <th key={h} className="text-left font-medium px-2 py-2 whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id} className="border-t border-slate-200 align-top">
                <td className="px-2 py-2 font-medium">
                  <input value={p.client} onChange={e=>update(p.id,"client",e.target.value)}
                    className="w-28 bg-transparent border-b border-transparent focus:border-slate-300 outline-none"/>
                </td>
                <td className="px-2 py-2">
                  <input value={p.workstream} onChange={e=>update(p.id,"workstream",e.target.value)}
                    className="w-64 bg-transparent border-b border-transparent focus:border-slate-300 outline-none"/>
                </td>
                <td className="px-2 py-2">
                  <select value={p.owner} onChange={e=>update(p.id,"owner",e.target.value)} className="text-sm border border-slate-200 rounded px-1 py-0.5">
                    {OWNERS.map(o=> <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select value={p.stage} onChange={e=>update(p.id,"stage",e.target.value)} className="text-sm border border-slate-200 rounded px-1 py-0.5">
                    {STAGES.map(s=> <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select value={p.status} onChange={e=>update(p.id,"status",e.target.value)} className="text-sm border border-slate-200 rounded px-1 py-0.5">
                    {STATUSES.map(s=> <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select value={p.priority} onChange={e=>update(p.id,"priority",e.target.value)} className="text-sm border border-slate-200 rounded px-1 py-0.5">
                    {PRIORITIES.map(s=> <option key={s}>{s}</option>)}
                  </select>
                  <div className="mt-1"><Pill tone={priorityTone(p.priority)}>{p.priority}</Pill></div>
                </td>
                <td className="px-2 py-2">
                  <select value={p.health} onChange={e=>update(p.id,"health",e.target.value)} className="text-sm border border-slate-200 rounded px-1 py-0.5">
                    {HEALTHS.map(s=> <option key={s}>{s}</option>)}
                  </select>
                  <div className="mt-1"><Pill tone={healthTone(p.health)}>{p.health}</Pill></div>
                </td>
                <td className="px-2 py-2">
                  <input value={p.nextStep} onChange={e=>update(p.id,"nextStep",e.target.value)}
                    className="w-64 bg-transparent border-b border-transparent focus:border-slate-300 outline-none"/>
                </td>
                <td className="px-2 py-2">
                  <input type="date" value={p.dueDate} onChange={e=>update(p.id,"dueDate",e.target.value)}
                    className="text-sm border border-slate-200 rounded px-1 py-0.5"/>
                </td>
                <td className="px-2 py-2">
                  <button onClick={()=>remove(p.id)} className="text-rose-500 hover:text-rose-700"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
