import { isSupabaseConfigured, supabase } from "./supabaseClient.js";

export const STORE_KEY = "suresales_v1";

const PROJECTS_TABLE = "projects";
const TARGETS_TABLE = "target_accounts";

export const loadLocalData = ({ projects, targets }) => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { projects, targets };

    const parsed = JSON.parse(raw);
    return {
      projects: parsed.projects || projects,
      targets: parsed.targets || targets,
    };
  } catch {
    return { projects, targets };
  }
};

export const saveLocalData = (data) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
};

const toProject = (row) => ({
  id: row.id,
  client: row.client || "",
  workstream: row.workstream || "",
  bucket: row.bucket || "",
  duration: row.duration || "",
  ask: row.ask || "",
  owner: row.owner || "Unassigned",
  priority: row.priority || "Medium",
  stage: row.stage || "Qualification",
  status: row.status || "Open",
  health: row.health || "Yellow",
  nextStep: row.next_step || "",
  dueDate: row.due_date || "",
  hardDate: Boolean(row.hard_date),
  recurring: Boolean(row.recurring),
  notes: row.notes || "",
});

const toProjectRow = (project) => ({
  id: project.id,
  client: project.client,
  workstream: project.workstream,
  bucket: project.bucket,
  duration: project.duration,
  ask: project.ask,
  owner: project.owner,
  priority: project.priority,
  stage: project.stage,
  status: project.status,
  health: project.health,
  next_step: project.nextStep,
  due_date: project.dueDate || null,
  hard_date: Boolean(project.hardDate),
  recurring: Boolean(project.recurring),
  notes: project.notes,
});

const toTarget = (row) => ({
  client: row.client,
  nextMove: row.next_move || "",
  wedge: row.wedge || "",
  status: row.status || "",
  type: row.type || "Prospect",
});

const toTargetRow = (target, sortOrder = 0) => ({
  client: target.client,
  next_move: target.nextMove,
  wedge: target.wedge,
  status: target.status,
  type: target.type,
  sort_order: sortOrder,
});

const seedRemoteData = async ({ projects, targets }) => {
  const { error: projectsError } = await supabase
    .from(PROJECTS_TABLE)
    .upsert(projects.map(toProjectRow), { onConflict: "id" });

  if (projectsError) throw projectsError;

  const { error: targetsError } = await supabase
    .from(TARGETS_TABLE)
    .upsert(targets.map((target, index) => toTargetRow(target, index)), {
      onConflict: "client",
    });

  if (targetsError) throw targetsError;
};

export const loadSureSalesData = async (seedData) => {
  const localData = loadLocalData(seedData);

  if (!isSupabaseConfigured) {
    return { ...localData, source: "local" };
  }

  const [projectsResult, targetsResult] = await Promise.all([
    supabase.from(PROJECTS_TABLE).select("*").order("id", { ascending: true }),
    supabase
      .from(TARGETS_TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("client", { ascending: true }),
  ]);

  if (projectsResult.error) throw projectsResult.error;
  if (targetsResult.error) throw targetsResult.error;

  if (!projectsResult.data.length && !targetsResult.data.length) {
    await seedRemoteData(localData);
    return { ...localData, source: "supabase" };
  }

  const data = {
    projects: projectsResult.data.map(toProject),
    targets: targetsResult.data.map(toTarget),
  };

  saveLocalData(data);
  return { ...data, source: "supabase" };
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

export const saveTarget = async (target, sortOrder) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from(TARGETS_TABLE)
    .upsert(toTargetRow(target, sortOrder), { onConflict: "client" });

  if (error) throw error;
};
