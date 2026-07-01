import { SEED_CLIENTS } from "../data/seed.js";
import { isSupabaseConfigured, supabase } from "./supabaseClient.js";

export const STORE_KEY = "suresales_v2";
const LEGACY_STORE_KEY = "suresales_v1";

const CLIENTS_TABLE = "clients";
const PROJECTS_TABLE = "projects";
const TASKS_TABLE = "project_tasks";

const slugify = (value) =>
  String(value || "unknown")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";

const clientLookup = new Map(
  SEED_CLIENTS.flatMap((client) => [
    [client.name.toLowerCase(), client],
    [client.shortName.toLowerCase(), client],
  ])
);

const clientFromName = (name) => {
  const normalized = String(name || "").trim().toLowerCase();
  return clientLookup.get(normalized) || null;
};

const normalizeClient = (client) => ({
  id: client.id || slugify(client.name || client.shortName),
  name: client.name || client.shortName || "",
  shortName: client.shortName || client.name || "",
  status: client.status || "Prospect",
  category: client.category || "",
  region: client.region || "",
  services: client.services || "",
  health: client.health || "Stable",
  priority: client.priority || "Medium",
});

const normalizeProject = (project) => {
  const seedClient = clientFromName(project.clientName || project.client);
  const clientId = project.clientId || seedClient?.id || slugify(project.clientName || project.client);
  const clientName =
    project.clientName || seedClient?.name || project.client || "Unknown Client";

  return {
    id: project.id,
    clientId,
    clientName,
    name: project.name || project.workstream || "Untitled project",
    bucket: project.bucket || "Current",
    description: project.description || "",
    priority: project.priority || "Medium",
    stage:
      project.stage === "Qualification" ? "Lead / Qualification" : project.stage || "Lead / Qualification",
    status: project.status || "Open",
    health:
      project.health === "Green"
        ? "Healthy"
        : project.health === "Yellow"
          ? "Stable"
          : project.health === "Red"
            ? "At Risk"
            : project.health || "Stable",
    owner: project.owner || "Unassigned",
    currentAsk: project.currentAsk || project.ask || project.nextStep || "",
    notes: project.notes || "",
  };
};

const normalizeTask = (task) => ({
  id: task.id,
  projectId: task.projectId,
  title: task.title || "",
  status: task.status || "Open",
  owner: task.owner || "Unassigned",
  dueDate: task.dueDate || "",
  notes: task.notes || "",
});

const migrateLegacyData = (legacy, seedData) => {
  const projects = (legacy.projects || []).map(normalizeProject);
  const projectClients = projects.map((project) => ({
    id: project.clientId,
    name: project.clientName,
    shortName: project.clientName,
    status: "Active",
    category: "",
    region: "",
    services: "",
    health: project.health,
    priority: project.priority,
  }));

  const clientsById = new Map(
    [...seedData.clients, ...projectClients].map((client) => [
      normalizeClient(client).id,
      normalizeClient(client),
    ])
  );

  const tasks = (legacy.projects || [])
    .map((project, index) => {
      const normalizedProject = projects[index];
      const title = project.nextStep || project.ask || "";
      if (!title) return null;
      return normalizeTask({
        id: `M-${normalizedProject.id}`,
        projectId: normalizedProject.id,
        title,
        status: project.status === "Closed" ? "Done" : "Open",
        owner: project.owner,
        dueDate: project.dueDate || "",
        notes: "",
      });
    })
    .filter(Boolean);

  return {
    clients: [...clientsById.values()],
    projects,
    tasks,
  };
};

export const loadLocalData = (seedData) => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        clients: (parsed.clients || seedData.clients).map(normalizeClient),
        projects: (parsed.projects || seedData.projects).map(normalizeProject),
        tasks: (parsed.tasks || seedData.tasks).map(normalizeTask),
      };
    }

    const legacyRaw = localStorage.getItem(LEGACY_STORE_KEY);
    if (legacyRaw) {
      return migrateLegacyData(JSON.parse(legacyRaw), seedData);
    }

    return seedData;
  } catch {
    return seedData;
  }
};

export const saveLocalData = (data) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
};

const toClient = (row) => ({
  id: row.id,
  name: row.name || "",
  shortName: row.short_name || row.name || "",
  status: row.status || "Prospect",
  category: row.category || "",
  region: row.region || "",
  services: row.services || "",
  health: row.health || "Stable",
  priority: row.priority || "Medium",
});

const toClientRow = (client) => ({
  id: client.id,
  name: client.name,
  short_name: client.shortName,
  status: client.status,
  category: client.category,
  region: client.region,
  services: client.services,
  health: client.health,
  priority: client.priority,
});

const toProject = (row) => ({
  id: row.id,
  clientId:
    row.client_id ||
    clientFromName(row.client_name || row.client)?.id ||
    slugify(row.client_name || row.client),
  clientName: row.client_name || row.client || "",
  name: row.name || row.workstream || "",
  bucket: row.bucket || "Current",
  description: row.description || "",
  priority: row.priority || "Medium",
  stage:
    row.stage === "Qualification" ? "Lead / Qualification" : row.stage || "Lead / Qualification",
  status: row.status || "Open",
  health:
    row.health === "Green"
      ? "Healthy"
      : row.health === "Yellow"
        ? "Stable"
        : row.health === "Red"
          ? "At Risk"
          : row.health || "Stable",
  owner: row.owner || "Unassigned",
  currentAsk: row.current_ask || row.ask || row.next_step || "",
  notes: row.notes || "",
  legacyDueDate: row.due_date || "",
});

const toProjectRow = (project) => ({
  id: project.id,
  client_id: project.clientId,
  client_name: project.clientName,
  name: project.name,
  bucket: project.bucket,
  description: project.description,
  priority: project.priority,
  stage: project.stage,
  status: project.status,
  health: project.health,
  owner: project.owner,
  current_ask: project.currentAsk,
  notes: project.notes,
});

const toTask = (row) => ({
  id: row.id,
  projectId: row.project_id,
  title: row.title || "",
  status: row.status || "Open",
  owner: row.owner || "Unassigned",
  dueDate: row.due_date || "",
  notes: row.notes || "",
});

const toTaskRow = (task) => ({
  id: task.id,
  project_id: task.projectId,
  title: task.title,
  status: task.status,
  owner: task.owner,
  due_date: task.dueDate || null,
  notes: task.notes,
});

const clientsFromProjects = (seedClients, projects) => {
  const clientsById = new Map(seedClients.map((client) => [client.id, client]));
  projects.forEach((project) => {
    if (!clientsById.has(project.clientId)) {
      clientsById.set(
        project.clientId,
        normalizeClient({
          id: project.clientId,
          name: project.clientName,
          shortName: project.clientName,
          status: "Active",
          category: "",
          health: project.health,
          priority: project.priority,
        })
      );
    }
  });
  return [...clientsById.values()];
};

const tasksFromProjects = (projects) =>
  projects
    .filter((project) => project.currentAsk)
    .map((project) =>
      normalizeTask({
        id: `T-${project.id}`,
        projectId: project.id,
        title: project.currentAsk,
        status: project.status === "Closed" ? "Done" : "Open",
        owner: project.owner,
        dueDate: project.legacyDueDate || "",
        notes: "",
      })
    );

const seedRemoteData = async ({ clients, projects, tasks }) => {
  const { error: clientsError } = await supabase
    .from(CLIENTS_TABLE)
    .upsert(clients.map(toClientRow), { onConflict: "id" });

  if (clientsError) throw clientsError;

  const { error: projectsError } = await supabase
    .from(PROJECTS_TABLE)
    .upsert(projects.map(toProjectRow), { onConflict: "id" });

  if (projectsError) throw projectsError;

  const { error: tasksError } = await supabase
    .from(TASKS_TABLE)
    .upsert(tasks.map(toTaskRow), { onConflict: "id" });

  if (tasksError) throw tasksError;
};

export const loadSureSalesData = async (seedData) => {
  const localData = loadLocalData(seedData);

  if (!isSupabaseConfigured) {
    return { ...localData, source: "local" };
  }

  const [clientsResult, projectsResult, tasksResult] = await Promise.all([
    supabase.from(CLIENTS_TABLE).select("*").order("name", { ascending: true }),
    supabase.from(PROJECTS_TABLE).select("*").order("id", { ascending: true }),
    supabase.from(TASKS_TABLE).select("*").order("due_date", {
      ascending: true,
      nullsFirst: false,
    }),
  ]);

  if (clientsResult.error) throw clientsResult.error;
  if (projectsResult.error) throw projectsResult.error;
  if (tasksResult.error) throw tasksResult.error;

  if (
    !clientsResult.data.length &&
    !projectsResult.data.length &&
    !tasksResult.data.length
  ) {
    await seedRemoteData(localData);
    return { ...localData, source: "supabase" };
  }

  const data = {
    clients: clientsResult.data.map(toClient),
    projects: projectsResult.data.map(toProject),
    tasks: tasksResult.data.map(toTask),
  };

  if (!data.clients.length) {
    data.clients = clientsFromProjects(seedData.clients, data.projects);
  }

  if (!data.tasks.length) {
    data.tasks = tasksFromProjects(data.projects);
  }

  if (!clientsResult.data.length || !tasksResult.data.length) {
    await seedRemoteData(data);
  }

  saveLocalData(data);
  return { ...data, source: "supabase" };
};

export const saveClient = async (client) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from(CLIENTS_TABLE)
    .upsert(toClientRow(client), { onConflict: "id" });

  if (error) throw error;
};

export const saveProject = async (project) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from(PROJECTS_TABLE)
    .upsert(toProjectRow(project), { onConflict: "id" });

  if (error) throw error;
};

export const deleteProject = async (id) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.from(PROJECTS_TABLE).delete().eq("id", id);
  if (error) throw error;
};

export const saveTask = async (task) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from(TASKS_TABLE)
    .upsert(toTaskRow(task), { onConflict: "id" });

  if (error) throw error;
};

export const deleteTask = async (id) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.from(TASKS_TABLE).delete().eq("id", id);
  if (error) throw error;
};
