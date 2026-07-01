import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProjectTracker from "./components/ProjectTracker.jsx";
import Funnel from "./components/Funnel.jsx";
import TargetAccounts from "./components/TargetAccounts.jsx";
import { SEED_PROJECTS, SEED_TARGETS } from "./data/seed.js";

const STORE_KEY = "suresales_v1";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [targets, setTargets]   = useState(SEED_TARGETS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.targets)  setTargets(parsed.targets);
      }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ projects, targets }));
  }, [projects, targets]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ projects, targets }, null, 2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "suresales-export.json";
    a.click();
  };

  return (
    <div className="flex h-full">
      <Sidebar active={view} onChange={setView} onExport={exportJSON} />
      <main className="flex-1 overflow-auto">
        <header className="px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              {view === "projects" ? "Project Tracker" : view === "targets" ? "Target Accounts" : view}
            </h1>
            <p className="text-sm text-slate-500">SPL Pittsburgh · Appalachia 2026</p>
          </div>
          <div className="text-xs text-slate-400">Saved locally · {projects.length} projects</div>
        </header>
        <section className="p-8 space-y-6">
          {view === "dashboard" && <Dashboard projects={projects} />}
          {view === "projects"  && <ProjectTracker projects={projects} setProjects={setProjects} />}
          {view === "funnel"    && <Funnel projects={projects} />}
          {view === "targets"   && <TargetAccounts targets={targets} setTargets={setTargets} />}
        </section>
      </main>
    </div>
  );
}
