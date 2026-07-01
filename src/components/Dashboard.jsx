import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, GripVertical } from "lucide-react";
import { STAGES } from "../data/seed.js";
import { Card, Pill, priorityTone } from "./ui.jsx";

const formatDate = (value) => {
  if (!value) return "Unscheduled";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const sortByDueDate = (a, b) => {
  if (!a.dueDate && !b.dueDate) return a.title.localeCompare(b.title);
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate);
};

const ProjectCard = ({
  project,
  onProjectSelect,
  onDragStart,
  onDragEnd,
  isDragging,
}) => (
  <button
    onClick={() => onProjectSelect(project.id)}
    draggable
    onDragStart={(event) => onDragStart(event, project.id)}
    onDragEnd={onDragEnd}
    className={`w-full cursor-grab rounded-md border border-slate-300 bg-white p-2.5 text-left shadow-sm transition hover:border-sky-500 active:cursor-grabbing ${
      isDragging ? "opacity-50 ring-2 ring-sky-300" : ""
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {project.clientName}
        </div>
        <div className="mt-0.5 truncate text-sm font-semibold text-slate-950">{project.name}</div>
      </div>
      <GripVertical className="shrink-0 text-slate-400" size={16} />
    </div>
    <div className="mt-2 flex flex-wrap gap-1.5">
      <Pill tone={priorityTone(project.priority)}>{project.priority}</Pill>
    </div>
    {project.currentAsk && (
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-700">{project.currentAsk}</p>
    )}
    <div className="mt-2 text-xs font-medium text-slate-600">{project.owner}</div>
  </button>
);

export default function Dashboard({
  projects,
  tasks,
  onClientSelect,
  onProjectSelect,
  onProjectChange,
}) {
  const [draggedProjectId, setDraggedProjectId] = useState("");
  const [dragOverStage, setDragOverStage] = useState("");
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const openTasks = tasks
    .filter((task) => task.status !== "Done")
    .map((task) => ({ ...task, project: projectById.get(task.projectId) }))
    .filter((task) => task.project)
    .sort(sortByDueDate);

  const scheduledTasks = openTasks.filter((task) => task.dueDate);
  const unscheduledTasks = openTasks.filter((task) => !task.dueDate);
  const timelineGroups = [
    ...scheduledTasks.map((task) => ({
      id: task.id,
      label: formatDate(task.dueDate),
      tasks: [task],
    })),
    ...(unscheduledTasks.length
      ? [{ id: "unscheduled", label: "Unscheduled", tasks: unscheduledTasks }]
      : []),
  ];

  const handleProjectDragStart = (event, projectId) => {
    setDraggedProjectId(projectId);
    if (!event) return;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", projectId);
  };

  const handleProjectDragEnd = () => {
    setDraggedProjectId("");
    setDragOverStage("");
  };

  const handleStageDrop = (event, stage) => {
    event.preventDefault();
    const projectId =
      event.dataTransfer.getData("text/plain") || draggedProjectId;
    const project = projects.find((candidate) => candidate.id === projectId);

    setDraggedProjectId("");
    setDragOverStage("");

    if (!project || project.stage === stage) return;
    onProjectChange(project.id, "stage", stage);
  };

  return (
    <div className="space-y-4">
      <Card title="By Stage">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {STAGES.map((stage) => {
            const stageProjects = projects.filter(
              (project) => project.stage === stage && project.status !== "Closed"
            );

            return (
              <section
                key={stage}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDragOverStage(stage);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setDragOverStage("");
                  }
                }}
                onDrop={(event) => handleStageDrop(event, stage)}
                className={`flex min-h-[16rem] w-64 shrink-0 flex-col rounded-md border bg-slate-100 transition ${
                  dragOverStage === stage
                    ? "border-sky-600 ring-2 ring-sky-200"
                    : "border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-300 px-3 py-2">
                  <h3 className="truncate text-sm font-semibold text-slate-950">{stage}</h3>
                  <Pill tone="slate">{stageProjects.length}</Pill>
                </div>
                <div className="flex-1 space-y-2 p-2.5">
                  {stageProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onProjectSelect={onProjectSelect}
                      onDragStart={handleProjectDragStart}
                      onDragEnd={handleProjectDragEnd}
                      isDragging={draggedProjectId === project.id}
                    />
                  ))}
                  {!stageProjects.length && (
                    <div className="rounded-md border border-dashed border-slate-400 bg-white p-3 text-sm font-medium text-slate-600">
                      No projects
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </Card>

      <Card title="Active Task List">
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {openTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onProjectSelect(task.projectId)}
              className="cursor-pointer rounded-md border border-slate-300 bg-white p-3 text-left shadow-sm transition hover:border-sky-500"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onProjectSelect(task.projectId);
                }
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="line-clamp-2 text-sm font-semibold text-slate-950">{task.title}</div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onClientSelect(task.project.clientId);
                    }}
                    className="mt-1 text-xs font-semibold text-sky-800 hover:text-sky-950"
                  >
                    {task.project.clientName}
                  </button>
                </div>
                <Pill tone={task.status === "In Progress" ? "navy" : "slate"}>
                  {task.status}
                </Pill>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs font-medium text-slate-600">
                <span className="truncate">{task.project.name}</span>
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          ))}
          {!openTasks.length && (
            <div className="rounded-md border border-dashed border-slate-400 bg-white p-4 text-sm font-medium text-slate-600">
              No active tasks
            </div>
          )}
        </div>
      </Card>

      <Card title="Timeline">
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max items-start gap-3">
            {timelineGroups.map((group, index) => (
              <div key={group.id} className="w-56 shrink-0">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {index === timelineGroups.length - 1 &&
                  group.id === "unscheduled" ? (
                    <CalendarDays size={15} />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}
                  {group.label}
                </div>
                <div className="mt-2 border-t-2 border-sky-300 pt-2">
                  <div className="space-y-2">
                    {group.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => onProjectSelect(task.projectId)}
                        className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-left text-sm shadow-sm hover:border-sky-500"
                      >
                        <div className="line-clamp-2 font-semibold text-slate-950">{task.title}</div>
                        <div className="mt-1 text-xs font-medium text-slate-600">
                          {task.project.clientName} / {task.project.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!timelineGroups.length && (
              <div className="rounded-md border border-dashed border-slate-400 bg-white p-4 text-sm font-medium text-slate-600">
                No timeline items
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
