import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarPlus,
  FolderPlus,
  Search,
  Trash2,
} from "lucide-react";
import {
  BUCKETS,
  HEALTHS,
  OWNERS,
  PRIORITIES,
  PROJECT_STATUSES,
  STAGES,
  TASK_STATUSES,
} from "../data/seed.js";
import {
  Card,
  Pill,
  bucketTone,
  healthTone,
  inputClass,
  labelClass,
  priorityTone,
} from "./ui.jsx";

const selectClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100";

const TextField = ({ label, value, onChange, textarea = false }) => (
  <label className="space-y-1">
    <div className={labelClass}>{label}</div>
    {textarea ? (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className={inputClass}
      />
    ) : (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    )}
  </label>
);

const SelectField = ({ label, value, options, onChange }) => (
  <label className="space-y-1">
    <div className={labelClass}>{label}</div>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={selectClass}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </label>
);

const ProjectMiniCard = ({ project, onSelect, onRemove }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
    <button onClick={() => onSelect(project.id)} className="w-full text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">{project.name}</div>
          <div className="mt-1 text-xs text-slate-500">{project.owner}</div>
        </div>
        <Pill tone={bucketTone(project.bucket)}>{project.bucket}</Pill>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill tone={priorityTone(project.priority)}>{project.priority}</Pill>
        <Pill tone={healthTone(project.health)}>{project.health}</Pill>
        <Pill tone="slate">{project.stage}</Pill>
      </div>
      {project.currentAsk && (
        <p className="mt-3 text-sm leading-5 text-slate-600">{project.currentAsk}</p>
      )}
    </button>
    <div className="mt-3 flex justify-end">
      <button
        onClick={() => onRemove(project.id)}
        className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
        title="Delete project"
      >
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

const ClientStack = ({ client, projects, onClientSelect, onProjectSelect, onProjectAdd, onProjectRemove }) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <button
      onClick={() => onClientSelect(client.id)}
      className="w-full border-b border-slate-200 px-4 py-4 text-left hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-sky-700" />
            <h3 className="font-semibold text-slate-900">{client.name}</h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill tone={client.status === "Active" ? "green" : "navy"}>
              {client.status}
            </Pill>
            <Pill tone="slate">{client.category || "Uncategorized"}</Pill>
            <Pill tone={healthTone(client.health)}>{client.health}</Pill>
          </div>
        </div>
        <Pill tone="slate">{projects.length} projects</Pill>
      </div>
    </button>
    <div className="space-y-3 bg-slate-50 p-3">
      {projects.map((project) => (
        <ProjectMiniCard
          key={project.id}
          project={project}
          onSelect={onProjectSelect}
          onRemove={onProjectRemove}
        />
      ))}
      <button
        onClick={() => onProjectAdd(client.id)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-600 hover:border-sky-300 hover:text-sky-700"
      >
        <FolderPlus size={15} />
        Add project
      </button>
    </div>
  </section>
);

const ClientDetail = ({
  client,
  projects,
  onBack,
  onClientChange,
  onProjectSelect,
  onProjectAdd,
  onProjectRemove,
}) => (
  <div className="space-y-6">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      <ArrowLeft size={15} />
      Project Tracker
    </button>

    <Card
      title={client.name}
      right={
        <div className="flex gap-2">
          <Pill tone={healthTone(client.health)}>{client.health}</Pill>
          <Pill tone={priorityTone(client.priority)}>{client.priority}</Pill>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Client Name"
          value={client.name}
          onChange={(value) => onClientChange(client.id, "name", value)}
        />
        <TextField
          label="Short Name"
          value={client.shortName}
          onChange={(value) => onClientChange(client.id, "shortName", value)}
        />
        <TextField
          label="Client Status"
          value={client.status}
          onChange={(value) => onClientChange(client.id, "status", value)}
        />
        <TextField
          label="Category"
          value={client.category}
          onChange={(value) => onClientChange(client.id, "category", value)}
        />
        <SelectField
          label="Health"
          value={client.health}
          options={HEALTHS}
          onChange={(value) => onClientChange(client.id, "health", value)}
        />
        <SelectField
          label="Priority"
          value={client.priority}
          options={PRIORITIES}
          onChange={(value) => onClientChange(client.id, "priority", value)}
        />
        <TextField
          label="Region / Area"
          value={client.region}
          onChange={(value) => onClientChange(client.id, "region", value)}
        />
        <TextField
          label="Services Provided"
          value={client.services}
          onChange={(value) => onClientChange(client.id, "services", value)}
          textarea
        />
      </div>
    </Card>

    <Card
      title={`Projects (${projects.length})`}
      right={
        <button
          onClick={() => onProjectAdd(client.id)}
          className="inline-flex items-center gap-2 rounded-md bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <FolderPlus size={15} />
          New
        </button>
      }
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectMiniCard
            key={project.id}
            project={project}
            onSelect={onProjectSelect}
            onRemove={onProjectRemove}
          />
        ))}
      </div>
    </Card>
  </div>
);

const ProjectDetail = ({
  project,
  client,
  tasks,
  onBack,
  onProjectChange,
  onTaskAdd,
  onTaskChange,
  onTaskRemove,
}) => (
  <div className="space-y-6">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      <ArrowLeft size={15} />
      {client?.name || "Client"}
    </button>

    <Card
      title={project.name}
      right={
        <div className="flex gap-2">
          <Pill tone={bucketTone(project.bucket)}>{project.bucket}</Pill>
          <Pill tone={priorityTone(project.priority)}>{project.priority}</Pill>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Project Name"
          value={project.name}
          onChange={(value) => onProjectChange(project.id, "name", value)}
        />
        <TextField
          label="Client"
          value={project.clientName}
          onChange={(value) => onProjectChange(project.id, "clientName", value)}
        />
        <SelectField
          label="Bucket"
          value={project.bucket}
          options={BUCKETS}
          onChange={(value) => onProjectChange(project.id, "bucket", value)}
        />
        <SelectField
          label="Stage"
          value={project.stage}
          options={STAGES}
          onChange={(value) => onProjectChange(project.id, "stage", value)}
        />
        <SelectField
          label="Status"
          value={project.status}
          options={PROJECT_STATUSES}
          onChange={(value) => onProjectChange(project.id, "status", value)}
        />
        <SelectField
          label="Priority"
          value={project.priority}
          options={PRIORITIES}
          onChange={(value) => onProjectChange(project.id, "priority", value)}
        />
        <SelectField
          label="Health"
          value={project.health}
          options={HEALTHS}
          onChange={(value) => onProjectChange(project.id, "health", value)}
        />
        <SelectField
          label="Owner"
          value={project.owner}
          options={OWNERS}
          onChange={(value) => onProjectChange(project.id, "owner", value)}
        />
        <TextField
          label="Current Ask / Blocker"
          value={project.currentAsk}
          onChange={(value) => onProjectChange(project.id, "currentAsk", value)}
          textarea
        />
        <TextField
          label="Project Description"
          value={project.description}
          onChange={(value) => onProjectChange(project.id, "description", value)}
          textarea
        />
        <div className="md:col-span-2">
          <TextField
            label="Notes"
            value={project.notes}
            onChange={(value) => onProjectChange(project.id, "notes", value)}
            textarea
          />
        </div>
      </div>
    </Card>

    <Card
      title={`Project Tasks (${tasks.length})`}
      right={
        <button
          onClick={() => onTaskAdd(project.id)}
          className="inline-flex items-center gap-2 rounded-md bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <CalendarPlus size={15} />
          New
        </button>
      }
    >
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-lg border border-slate-200 p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_10rem_10rem_9rem_auto]">
              <input
                value={task.title}
                onChange={(event) =>
                  onTaskChange(task.id, "title", event.target.value)
                }
                className={inputClass}
              />
              <select
                value={task.status}
                onChange={(event) =>
                  onTaskChange(task.id, "status", event.target.value)
                }
                className={selectClass}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select
                value={task.owner}
                onChange={(event) =>
                  onTaskChange(task.id, "owner", event.target.value)
                }
                className={selectClass}
              >
                {OWNERS.map((owner) => (
                  <option key={owner}>{owner}</option>
                ))}
              </select>
              <input
                type="date"
                value={task.dueDate}
                onChange={(event) =>
                  onTaskChange(task.id, "dueDate", event.target.value)
                }
                className={selectClass}
              />
              <button
                onClick={() => onTaskRemove(task.id)}
                className="rounded-md p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              value={task.notes}
              onChange={(event) =>
                onTaskChange(task.id, "notes", event.target.value)
              }
              rows={2}
              placeholder="Task notes"
              className={`${inputClass} mt-3`}
            />
          </div>
        ))}
        {!tasks.length && (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-400">
            No tasks
          </div>
        )}
      </div>
    </Card>
  </div>
);

export default function ProjectTracker({
  clients,
  projects,
  tasks,
  route,
  onNavigate,
  onClientChange,
  onProjectAdd,
  onProjectChange,
  onProjectRemove,
  onTaskAdd,
  onTaskChange,
  onTaskRemove,
}) {
  const [q, setQ] = useState("");
  const [bucketFilter, setBucketFilter] = useState("All");

  const clientsById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients]
  );
  const selectedClient = route.clientId ? clientsById.get(route.clientId) : null;
  const selectedProject = route.projectId
    ? projects.find((project) => project.id === route.projectId)
    : null;

  if (selectedProject) {
    const projectClient = clientsById.get(selectedProject.clientId);
    return (
      <ProjectDetail
        project={selectedProject}
        client={projectClient}
        tasks={tasks.filter((task) => task.projectId === selectedProject.id)}
        onBack={() =>
          onNavigate({ name: "client", clientId: selectedProject.clientId })
        }
        onProjectChange={onProjectChange}
        onTaskAdd={onTaskAdd}
        onTaskChange={onTaskChange}
        onTaskRemove={onTaskRemove}
      />
    );
  }

  if (selectedClient) {
    const clientProjects = projects.filter(
      (project) => project.clientId === selectedClient.id
    );
    return (
      <ClientDetail
        client={selectedClient}
        projects={clientProjects}
        onBack={() => onNavigate({ name: "projects" })}
        onClientChange={onClientChange}
        onProjectSelect={(projectId) => onNavigate({ name: "project", projectId })}
        onProjectAdd={onProjectAdd}
        onProjectRemove={onProjectRemove}
      />
    );
  }

  const filteredProjects = projects.filter((project) => {
    const haystack = [
      project.clientName,
      project.name,
      project.currentAsk,
      project.notes,
      project.owner,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!q || haystack.includes(q.toLowerCase())) &&
      (bucketFilter === "All" || project.bucket === bucketFilter)
    );
  });

  const groupedProjects = clients
    .map((client) => ({
      client,
      projects: filteredProjects.filter((project) => project.clientId === client.id),
    }))
    .filter(({ projects: clientProjects }) => clientProjects.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search"
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={bucketFilter}
            onChange={(event) => setBucketFilter(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option>All</option>
            {BUCKETS.map((bucket) => (
              <option key={bucket}>{bucket}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {groupedProjects.map(({ client, projects: clientProjects }) => (
          <ClientStack
            key={client.id}
            client={client}
            projects={clientProjects}
            onClientSelect={(clientId) => onNavigate({ name: "client", clientId })}
            onProjectSelect={(projectId) => onNavigate({ name: "project", projectId })}
            onProjectAdd={onProjectAdd}
            onProjectRemove={onProjectRemove}
          />
        ))}
      </div>
    </div>
  );
}
