import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import AuthGate from "./components/AuthGate.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProjectTracker from "./components/ProjectTracker.jsx";
import { SEED_CLIENTS, SEED_PROJECTS, SEED_TASKS } from "./data/seed.js";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient.js";
import {
  deleteProject,
  deleteTask,
  loadLocalData,
  loadSureSalesData,
  saveClient,
  saveLocalData,
  saveProject,
  saveTask,
} from "./lib/suresalesRepository.js";

const LOGO_BUCKET = "client-logos";
const LOGO_MAX_BYTES = 5 * 1024 * 1024;
const LOGO_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const seedData = {
  clients: SEED_CLIENTS,
  projects: SEED_PROJECTS,
  tasks: SEED_TASKS,
};

const nextId = (items, prefix) => {
  const nextNumber =
    Math.max(
      0,
      ...items.map((item) => Number(item.id?.replace(`${prefix}-`, "")) || 0)
    ) + 1;
  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
};

export default function App() {
  const [route, setRoute] = useState({ name: "dashboard" });
  const [clients, setClients] = useState(SEED_CLIENTS);
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [tasks, setTasks] = useState(SEED_TASKS);
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
        const data = await loadSureSalesData(seedData);

        if (!active) return;
        setClients(data.clients);
        setProjects(data.projects);
        setTasks(data.tasks);
        setStorageSource(data.source);
        setSyncState("saved");
        setSyncError("");
      } catch (error) {
        const localData = loadLocalData(seedData);

        if (!active) return;
        setClients(localData.clients);
        setProjects(localData.projects);
        setTasks(localData.tasks);
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
    if (!dataLoading) saveLocalData({ clients, projects, tasks });
  }, [clients, dataLoading, projects, tasks]);

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

  const handleClientChange = (id, field, value) => {
    const nextClients = clients.map((client) =>
      client.id === id ? { ...client, [field]: value } : client
    );
    const changedClient = nextClients.find((client) => client.id === id);

    setClients(nextClients);
    persistRemote(() => saveClient(changedClient));
  };

  const handleClientLogoUpload = async (id, file) => {
    if (!file) return;

    const client = clients.find((candidate) => candidate.id === id);
    if (!client) return;

    if (!LOGO_MIME_TYPES.includes(file.type)) {
      setSyncState("error");
      setSyncError("Logo must be a PNG, JPEG, WebP, or GIF image.");
      return;
    }

    if (file.size > LOGO_MAX_BYTES) {
      setSyncState("error");
      setSyncError("Logo must be 5 MB or smaller.");
      return;
    }

    const updateLogo = (logoUrl) => {
      const changedClient = { ...client, logoUrl };
      setClients((currentClients) =>
        currentClients.map((candidate) =>
          candidate.id === id ? changedClient : candidate
        )
      );
      persistRemote(() => saveClient(changedClient));
    };

    if (!isSupabaseConfigured || !user) {
      const reader = new FileReader();
      reader.onload = () => updateLogo(reader.result || "");
      reader.readAsDataURL(file);
      return;
    }

    setSyncState("saving");
    setSyncError("");

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "png";
      const safeName = `${Date.now()}.${extension}`;
      const path = `${id}/${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(LOGO_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type || "image/png",
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path);
      updateLogo(data.publicUrl);
    } catch (error) {
      setStorageSource("local");
      setSyncState("error");
      setSyncError(error.message || "Could not upload client logo.");
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

  const handleProjectAdd = (clientId) => {
    const client = clients.find((candidate) => candidate.id === clientId);
    const project = {
      id: nextId(projects, "P"),
      clientId,
      clientName: client?.name || "Unknown Client",
      name: "New project",
      bucket: "New",
      description: "",
      priority: "Medium",
      stage: "Lead / Qualification",
      status: "Open",
      health: client?.health || "Stable",
      owner: "Unassigned",
      currentAsk: "",
      notes: "",
    };

    setProjects([...projects, project]);
    setRoute({ name: "project", projectId: project.id });
    persistRemote(() => saveProject(project));
  };

  const handleProjectRemove = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
    setTasks(tasks.filter((task) => task.projectId !== id));
    if (route.projectId === id) setRoute({ name: "projects" });
    persistRemote(() => deleteProject(id));
  };

  const handleTaskAdd = (projectId) => {
    const project = projects.find((candidate) => candidate.id === projectId);
    const task = {
      id: nextId(tasks, "T"),
      projectId,
      title: "New task",
      status: "Open",
      owner: project?.owner || "Unassigned",
      dueDate: "",
      notes: "",
    };

    setTasks([...tasks, task]);
    persistRemote(() => saveTask(task));
  };

  const handleTaskChange = (id, field, value) => {
    const nextTasks = tasks.map((task) =>
      task.id === id ? { ...task, [field]: value } : task
    );
    const changedTask = nextTasks.find((task) => task.id === id);

    setTasks(nextTasks);
    persistRemote(() => saveTask(changedTask));
  };

  const handleTaskRemove = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    persistRemote(() => deleteTask(id));
  };

  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ clients, projects, tasks }, null, 2)],
      {
        type: "application/json",
      }
    );
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

  const headerTitle =
    route.name === "dashboard"
      ? "Dashboard"
      : route.name === "client"
        ? "Client Detail"
        : route.name === "project"
          ? "Project Detail"
          : "Project Tracker";

  if (isSupabaseConfigured && (authLoading || !user)) {
    return <AuthGate loading={authLoading} />;
  }

  return (
    <div className="flex h-full">
      <Sidebar
        active={route.name === "dashboard" ? "dashboard" : "projects"}
        onChange={(name) => setRoute({ name })}
        onExport={exportJSON}
        user={user}
        onSignOut={isSupabaseConfigured ? signOut : null}
      />
      <main className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{headerTitle}</h1>
            <p className="text-sm text-slate-500">
              SPL Pittsburgh - Appalachia 2026
            </p>
            {syncError && (
              <p className="mt-1 text-xs text-rose-600">{syncError}</p>
            )}
          </div>
          <div className="text-xs text-slate-400">
            {storageLabel} - {projects.length} projects - {tasks.length} tasks
          </div>
        </header>
        <section className="space-y-6 p-8">
          {route.name === "dashboard" && (
            <Dashboard
              clients={clients}
              projects={projects}
              tasks={tasks}
              onClientSelect={(clientId) => setRoute({ name: "client", clientId })}
              onProjectSelect={(projectId) =>
                setRoute({ name: "project", projectId })
              }
            />
          )}
          {route.name !== "dashboard" && (
            <ProjectTracker
              clients={clients}
              projects={projects}
              tasks={tasks}
              route={route}
              onNavigate={setRoute}
              onClientChange={handleClientChange}
              onClientLogoUpload={handleClientLogoUpload}
              onProjectAdd={handleProjectAdd}
              onProjectChange={handleProjectChange}
              onProjectRemove={handleProjectRemove}
              onTaskAdd={handleTaskAdd}
              onTaskChange={handleTaskChange}
              onTaskRemove={handleTaskRemove}
            />
          )}
        </section>
      </main>
    </div>
  );
}
