import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { STAGES } from "../data/seed.js";
import { Card, Pill, bucketTone, healthTone, priorityTone } from "./ui.jsx";

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

const ProjectCard = ({ project, onProjectSelect }) => (
  <button
    onClick={() => onProjectSelect(project.id)}
    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-sky-300 hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-xs font-medium uppercase text-slate-500">
          {project.clientName}
        </div>
        <div className="mt-1 font-semibold text-slate-900">{project.name}</div>
      </div>
      <Pill tone={bucketTone(project.bucket)}>{project.bucket}</Pill>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      <Pill tone={priorityTone(project.priority)}>{project.priority}</Pill>
      <Pill tone={healthTone(project.health)}>{project.health}</Pill>
      <Pill tone="slate">{project.status}</Pill>
    </div>
    {project.currentAsk && (
      <p className="mt-3 text-sm leading-5 text-slate-600">{project.currentAsk}</p>
    )}
    <div className="mt-3 text-xs text-slate-500">{project.owner}</div>
  </button>
);

export default function Dashboard({
  projects,
  tasks,
  onClientSelect,
  onProjectSelect,
}) {
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

  return (
    <div className="space-y-6">
      <Card title="By Stage">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {STAGES.map((stage) => {
            const stageProjects = projects.filter(
              (project) => project.stage === stage && project.status !== "Closed"
            );

            return (
              <section
                key={stage}
                className="flex min-h-[18rem] w-72 shrink-0 flex-col rounded-lg border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3">
                  <h3 className="text-sm font-semibold text-slate-800">{stage}</h3>
                  <Pill tone="slate">{stageProjects.length}</Pill>
                </div>
                <div className="flex-1 space-y-3 p-3">
                  {stageProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onProjectSelect={onProjectSelect}
                    />
                  ))}
                  {!stageProjects.length && (
                    <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-400">
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
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {openTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onProjectSelect(task.projectId)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-sky-300 hover:shadow-sm"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onProjectSelect(task.projectId);
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{task.title}</div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onClientSelect(task.project.clientId);
                    }}
                    className="mt-1 text-xs font-medium text-sky-700 hover:text-sky-900"
                  >
                    {task.project.clientName}
                  </button>
                </div>
                <Pill tone={task.status === "In Progress" ? "navy" : "slate"}>
                  {task.status}
                </Pill>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>{task.project.name}</span>
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          ))}
          {!openTasks.length && (
            <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-400">
              No active tasks
            </div>
          )}
        </div>
      </Card>

      <Card title="Timeline">
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-start gap-4">
            {timelineGroups.map((group, index) => (
              <div key={group.id} className="w-64 shrink-0">
                <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
                  {index === timelineGroups.length - 1 &&
                  group.id === "unscheduled" ? (
                    <CalendarDays size={15} />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}
                  {group.label}
                </div>
                <div className="mt-3 border-t-2 border-sky-200 pt-3">
                  <div className="space-y-2">
                    {group.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => onProjectSelect(task.projectId)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left text-sm hover:border-sky-300"
                      >
                        <div className="font-medium text-slate-900">{task.title}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {task.project.clientName} / {task.project.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!timelineGroups.length && (
              <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-400">
                No timeline items
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
