import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarPlus,
  FolderPlus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import {
  BUCKETS,
  CLIENT_STATUSES,
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
  buttonClass,
  bucketTone,
  ghostButtonClass,
  healthTone,
  inputClass,
  labelClass,
  priorityTone,
  selectClass,
} from "./ui.jsx";

const clientInitials = (client) =>
  (client?.shortName || client?.name || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

const ClientLogo = ({ client, size = "md" }) => {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
  };

  return (
    <div
      className={`${sizes[size]} shrink-0 overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm`}
    >
      {client.logoUrl ? (
        <img
          src={client.logoUrl}
          alt={`${client.name} logo`}
          className="h-full w-full object-contain p-1.5"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-sky-100 font-bold text-sky-950">
          {clientInitials(client)}
        </div>
      )}
    </div>
  );
};

const clientStatusTone = (status) =>
  ({
    Active: "green",
    Prospect: "navy",
    Dormant: "slate",
    "At Risk": "yellow",
    Closed: "red",
  })[status] || "slate";

const VisualSelectField = ({ label, value, options, onChange, tone }) => (
  <label className="space-y-1">
    <div className={labelClass}>{label}</div>
    <div className="rounded-md border border-slate-300 bg-slate-50 p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Pill tone={tone(value)}>{value}</Pill>
      </div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectClass}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  </label>
);

const TextField = ({ label, value, onChange, textarea = false }) => (
  <label className="space-y-1">
    <div className={labelClass}>{label}</div>
    {textarea ? (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
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
  <div className="rounded-md border border-slate-300 bg-white p-2.5 shadow-sm transition hover:border-sky-500">
    <button onClick={() => onSelect(project.id)} className="w-full text-left">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-950">{project.name}</div>
          <div className="mt-0.5 truncate text-xs font-medium text-slate-600">{project.owner}</div>
        </div>
        <Pill tone={bucketTone(project.bucket)}>{project.bucket}</Pill>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Pill tone={priorityTone(project.priority)}>{project.priority}</Pill>
        <Pill tone="slate">{project.stage}</Pill>
      </div>
      {project.currentAsk && (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-700">{project.currentAsk}</p>
      )}
    </button>
    <div className="mt-2 flex justify-end">
      <button
        onClick={() => onRemove(project.id)}
        className="rounded-md p-1.5 text-rose-700 hover:bg-rose-100 hover:text-rose-900"
        title="Delete project"
      >
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

const ClientStack = ({ client, projects, onClientSelect, onProjectSelect, onProjectAdd, onProjectRemove }) => (
  <section className="rounded-md border border-slate-300 bg-white shadow-sm">
    <button
      onClick={() => onClientSelect(client.id)}
      className="w-full border-b border-slate-300 px-3 py-3 text-left hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <ClientLogo client={client} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="shrink-0 text-sky-800" />
                <h3 className="truncate font-semibold text-slate-950">{client.name}</h3>
              </div>
              <div className="mt-0.5 text-xs font-medium text-slate-600">
                {client.shortName}
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill tone={clientStatusTone(client.status)}>{client.status}</Pill>
            <Pill tone="slate">{client.category || "Uncategorized"}</Pill>
            <Pill tone={healthTone(client.health)}>{client.health}</Pill>
            <Pill tone={priorityTone(client.priority)}>{client.priority}</Pill>
          </div>
        </div>
        <Pill tone="slate">{projects.length} projects</Pill>
      </div>
    </button>
    <div className="space-y-2 bg-slate-100 p-2.5">
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
        className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-slate-400 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-sky-600 hover:text-sky-900"
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
  onClientLogoUpload,
  onProjectSelect,
  onProjectAdd,
  onProjectRemove,
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <button onClick={onBack} className={ghostButtonClass}>
        <ArrowLeft size={15} />
        Project Tracker
      </button>
      <button onClick={() => onProjectAdd(client.id)} className={buttonClass}>
        <FolderPlus size={15} />
        New Project
      </button>
    </div>

    <section className="rounded-md border border-slate-300 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <ClientLogo client={client} size="lg" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold leading-6 text-slate-950">
              {client.name}
            </h2>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-600">
              <span>{client.shortName || "No short name"}</span>
              <span>{client.category || "Uncategorized"}</span>
              <span>{client.region || "No region"}</span>
              <span>{projects.length} projects</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Pill tone={clientStatusTone(client.status)}>{client.status}</Pill>
          <Pill tone={healthTone(client.health)}>{client.health}</Pill>
          <Pill tone={priorityTone(client.priority)}>{client.priority}</Pill>
        </div>
      </div>
    </section>

    <Card title="Client Fields">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
        <div className="space-y-1">
          <div className={labelClass}>Upload Logo</div>
          <div className="flex items-center gap-2 rounded-md border border-dashed border-slate-400 bg-slate-50 p-2">
            <ClientLogo client={client} size="sm" />
            <label className={`${buttonClass} cursor-pointer`}>
              <Upload size={15} />
              Upload
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.svg"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  onClientLogoUpload(client.id, file);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
        <SelectField
          label="Client Status"
          value={client.status}
          options={CLIENT_STATUSES}
          onChange={(value) => onClientChange(client.id, "status", value)}
        />
        <TextField
          label="Category"
          value={client.category}
          onChange={(value) => onClientChange(client.id, "category", value)}
        />
        <VisualSelectField
          label="Health"
          value={client.health}
          options={HEALTHS}
          onChange={(value) => onClientChange(client.id, "health", value)}
          tone={healthTone}
        />
        <VisualSelectField
          label="Priority"
          value={client.priority}
          options={PRIORITIES}
          onChange={(value) => onClientChange(client.id, "priority", value)}
          tone={priorityTone}
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
        <button onClick={() => onProjectAdd(client.id)} className={buttonClass}>
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
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <button onClick={onBack} className={ghostButtonClass}>
        <ArrowLeft size={15} />
        {client?.name || "Client"}
      </button>
      <button onClick={() => onTaskAdd(project.id)} className={buttonClass}>
        <CalendarPlus size={15} />
        New Task
      </button>
    </div>

    <section className="rounded-md border border-slate-300 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            <Pill tone={bucketTone(project.bucket)}>{project.bucket}</Pill>
            <Pill tone={priorityTone(project.priority)}>{project.priority}</Pill>
            <Pill tone={healthTone(project.health)}>{project.health}</Pill>
            <Pill tone="slate">{project.status}</Pill>
          </div>
          <h2 className="mt-2 truncate text-lg font-bold leading-6 text-slate-950">
            {project.name}
          </h2>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-600">
            <span>{project.stage}</span>
            <span>{project.owner}</span>
            <span>{tasks.length} tasks</span>
          </div>
        </div>
        {client && (
          <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-2 py-2">
            <ClientLogo client={client} size="sm" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-950">
                {client.name}
              </div>
              <div className="truncate text-xs font-medium text-slate-600">
                {client.status} / {client.category || "Uncategorized"}
              </div>
            </div>
          </div>
        )}
      </div>
      {project.currentAsk && (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-950">
          {project.currentAsk}
        </div>
      )}
    </section>

    <Card
      title="Project Fields"
      right={
        <div className="flex flex-wrap gap-1.5">
          <Pill tone={bucketTone(project.bucket)}>{project.bucket}</Pill>
          <Pill tone={priorityTone(project.priority)}>{project.priority}</Pill>
        </div>
      }
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <TextField
          label="Project Name"
          value={project.name}
          onChange={(value) => onProjectChange(project.id, "name", value)}
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
        <div className="xl:col-span-3">
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
        <button onClick={() => onTaskAdd(project.id)} className={buttonClass}>
          <CalendarPlus size={15} />
          New
        </button>
      }
    >
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-md border border-slate-300 bg-slate-50 p-2.5">
            <div className="grid gap-2 md:grid-cols-[minmax(12rem,1fr)_9rem_9rem_8.5rem_2.5rem]">
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
                className="flex h-8 w-8 items-center justify-center rounded-md text-rose-700 hover:bg-rose-100 hover:text-rose-950"
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
              className={`${inputClass} mt-2`}
            />
          </div>
        ))}
        {!tasks.length && (
          <div className="rounded-md border border-dashed border-slate-400 bg-slate-50 p-4 text-sm font-medium text-slate-600">
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
  onClientLogoUpload,
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
        onClientLogoUpload={onClientLogoUpload}
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
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-md border border-slate-300 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search
            size={16}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search"
            className={`${inputClass} py-1.5 pl-8`}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={bucketFilter}
            onChange={(event) => setBucketFilter(event.target.value)}
            className={`${selectClass} md:w-40`}
          >
            <option>All</option>
            {BUCKETS.map((bucket) => (
              <option key={bucket}>{bucket}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
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
