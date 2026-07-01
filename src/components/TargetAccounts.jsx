import { Card, Pill } from "./ui.jsx";

export default function TargetAccounts({ targets, onTargetChange }) {
  const update = (idx, field, val) => onTargetChange(idx, field, val);

  return (
    <Card title={`2026 target accounts (${targets.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {["Target Client","Type","Next Move","Primary Wedge","Status"].map(h =>
                <th key={h} className="text-left font-medium px-2 py-2">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {targets.map((t,i) => (
              <tr key={t.client} className="border-t border-slate-200 align-top">
                <td className="px-2 py-2 font-medium">{t.client}</td>
                <td className="px-2 py-2">
                  <Pill tone={t.type === "Current Client" ? "green" : "navy"}>{t.type}</Pill>
                </td>
                <td className="px-2 py-2">
                  <input value={t.nextMove} onChange={e=>update(i,"nextMove",e.target.value)}
                    className="w-72 bg-transparent border-b border-transparent focus:border-slate-300 outline-none"/>
                </td>
                <td className="px-2 py-2">{t.wedge}</td>
                <td className="px-2 py-2">
                  <input value={t.status} onChange={e=>update(i,"status",e.target.value)}
                    className="w-72 bg-transparent border-b border-transparent focus:border-slate-300 outline-none"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
