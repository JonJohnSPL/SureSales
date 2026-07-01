import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import AuthGate from "./components/AuthGate.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProjectTracker from "./components/ProjectTracker.jsx";
import Funnel from "./components/Funnel.jsx";
import TargetAccounts from "./components/TargetAccounts.jsx";
import { SEED_PROJECTS, SEED_TARGETS } from "./data/seed.js";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient.js";
import {
  deleteProject,
  loadLocalData,
  loadSureSalesData,
  saveLocalData,
  saveProject,
  saveTarget,
} from "./lib/suresalesRepository.js";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [targets, setTargets] = useState(SEED_TARGETS);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [dataLoading, setDataLoading] = useState(true);
  const [storageSource, setStorageSource] = useState(
    isSupabaseConfigured ? "supabase" : "local"
  );
  const [syncState, setSyncState] = useState("idle");
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user || null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured && !user) {
      setDataLoading(false);
      return undefined;
    }

    let active = true;

    const loadData = async () => {
      setDataLoading(true);
      try {
        const data = await loadSureSalesData({
          projects: SEED_PROJECTS,
          targets: SEED_TARGETS,
        });

        if (!active) return;
        setProjects(data.projects);
        setTargets(data.targets);
        setStorageSource(data.source);
        setSyncState("saved");
        setSyncError("");
      } catch (error) {
        const localData = loadLocalData({
          projects: SEED_PROJECTS,
          targets: SEED_TARGETS,
        });

        if (!active) return;
        setProjects(localData.projects);
        setTargets(localData.targets);
        setStorageSource("local");
        setSyncState("error");
        setSyncError(error.message || "Could not load Supabase data.");
      } finally {
        if (active) setDataLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!dataLoading) saveLocalData({ projects, targets });
  }, [dataLoading, projects, targets]);

  const persistRemote = async (operation) => {
    if (!isSupabaseConfigured || !user) return;

    setSyncState("saving");
    setSyncError("");

    try {
      await operation();
      setStorageSource("supabase");
      setSyncState("saved");
    } catch (error) {
      setStorageSource("local");
      setSyncState("error");
      setSyncError(error.message || "Could not save to Supabase.");
    }
  };

  const handleProjectChange = (id, field, value) => {
    const nextProjects = projects.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    const changedProject = nextProjects.find((project) => project.id === id);

    setProjects(nextProjects);
    persistRemote(() => saveProject(changedProject));
  };

  const handleProjectAdd = (project) => {
    setProjects([...projects, project]);
    persistRemote(() => saveProject(project));
  };

  const handleProjectRemove = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
    persistRemote(() => deleteProject(id));
  };

  const handleTargetChange = (index, field, value) => {
    const nextTargets = targets.map((target, targetIndex) =>
      targetIndex === index ? { ...target, [field]: value } : target
    );

    setTargets(nextTargets);
    persistRemote(() => saveTarget(nextTargets[index], index));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ projects, targets }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "suresales-export.json";
    a.click();
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const storageLabel = dataLoading
    ? "Loading data"
    : syncState === "saving"
      ? "Saving to Supabase"
      : syncState === "error"
        ? "Supabase error - saved locally"
        : storageSource === "supabase"
          ? "Saved to Supabase"
          : "Saved locally";

  if (isSupabaseConfigured && (authLoading || !user)) {
    return <AuthGate loading={authLoading} />;
  }

  return (
    <div className="flex h-full">
      <Sidebar
        active={view}
        onChange={setView}
        onExport={exportJSON}
        user={user}
        onSignOut={isSupabaseConfigured ? signOut : null}
      />
      <main className="flex-1 overflow-auto">
        <header className="px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              {view === "projects"
                ? "Project Tracker"
                : view === "targets"
                  ? "Target Accounts"
                  : view}
            </h1>
            <p className="text-sm text-slate-500">
              SPL Pittsburgh - Appalachia 2026
            </p>
            {syncError && (
              <p className="text-xs text-rose-600 mt-1">{syncError}</p>
            )}
          </div>
          <div className="text-xs text-slate-400">
            {storageLabel} - {projects.length} projects
          </div>
        </header>
        <section className="p-8 space-y-6">
          {view === "dashboard" && <Dashboard projects={projects} />}
          {view === "projects" && (
            <ProjectTracker
              projects={projects}
              onProjectAdd={handleProjectAdd}
              onProjectChange={handleProjectChange}
              onProjectRemove={handleProjectRemove}
            />
          )}
          {view === "funnel" && <Funnel projects={projects} />}
          {view === "targets" && (
            <TargetAccounts
              targets={targets}
              onTargetChange={handleTargetChange}
            />
          )}
        </section>
      </main>
    </div>
  );
}
