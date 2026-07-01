import { Card, Pill } from "./ui.jsx";
import { FUNNEL_ROWS } from "../data/seed.js";

export default function Funnel({ projects }) {
  const total = (FUNNEL_ROWS[0].producers || 0) + (FUNNEL_ROWS[0].midstream || 0);
  const liveQuotes = projects.filter(p => p.stage === "Quoted" || p.stage === "Awaiting Response").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Structured funnel — from market analysis">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {["Stage","Producers","Midstream","Total","% of Market","Notes"].map(h =>
                  <th key={h} className="text-left font-medium px-2 py-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {FUNNEL_ROWS.map((r) => {
                const t = r.totalOverride ?? ((r.producers ?? 0) + (r.midstream ?? 0)) || null;
                const pct = t ? Math.round((t/total)*100) : null;
                return (
                  <tr key={r.stage} className="border-t border-slate-200">
                    <td className="px-2 py-2 font-medium">{r.stage}</td>
                    <td className="px-2 py-2">{r.producers ?? "—"}</td>
                    <td className="px-2 py-2">{r.midstream ?? "—"}</td>
                    <td className="px-2 py-2">{t ?? "—"}</td>
                    <td className="px-2 py-2">{pct ? `${pct}%` : "—"}</td>
                    <td className="px-2 py-2 text-slate-500">{r.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Management-range estimates (business model deck)">
          <ul className="text-sm space-y-2">
            <li className="flex justify-between"><span>In region</span><Pill tone="navy">~38</Pill></li>
            <li className="flex justify-between"><span>Can do work for</span><Pill tone="navy">~30–35</Pill></li>
            <li className="flex justify-between"><span>Spoken to</span><Pill tone="navy">~12–15</Pill></li>
            <li className="flex justify-between"><span>Quoted</span><Pill tone="navy">~5–7</Pill></li>
            <li className="flex justify-between"><span>Awaiting response</span><Pill tone="yellow">~3–4</Pill></li>
            <li className="flex justify-between"><span>Current customers</span><Pill tone="green">5</Pill></li>
          </ul>
        </Card>
      </div>

      <Card title="Live tracker view">
        <p className="text-sm text-slate-500 mb-3">Pulled from the Project Tracker right now.</p>
        <ul className="text-sm space-y-2">
          <li className="flex justify-between"><span>Quoted / Awaiting Response</span><Pill tone="navy">{liveQuotes}</Pill></li>
          <li className="flex justify-between"><span>Needs Dates</span><Pill tone="yellow">{projects.filter(p=>p.stage==="Needs Dates").length}</Pill></li>
          <li className="flex justify-between"><span>Recovery</span><Pill tone="red">{projects.filter(p=>p.stage==="Recovery").length}</Pill></li>
          <li className="flex justify-between"><span>Won / Active</span><Pill tone="green">{projects.filter(p=>p.stage==="Won / Active").length}</Pill></li>
        </ul>
      </Card>
    </div>
  );
}
