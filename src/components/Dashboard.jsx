import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GripVertical,
} from "lucide-react";
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

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const startOfWeek = (date) => addDays(startOfDay(date), -date.getDay());

const startOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const dateKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const sameDate = (a, b) => dateKey(a) === dateKey(b);

const calendarTitle = (date, mode) => {
  if (mode === "month") {
    return date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }

  const weekStart = startOfWeek(date);
  const weekEnd = addDays(weekStart, 6);
  return `${weekStart.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} - ${weekEnd.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const calendarDays = (date, mode) => {
  if (mode === "week") {
    const weekStart = startOfWeek(date);
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = addDays(startOfWeek(monthEnd), 6);
  const days = [];

  for (let day = gridStart; day <= gridEnd; day = addDays(day, 1)) {
    days.push(day);
  }

  return days;
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
  const [calendarMode, setCalendarMode] = useState("week");
  const [calendarDate, setCalendarDate] = useState(() => startOfDay(new Date()));
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const openTasks = tasks
    .filter((task) => task.status !== "Done")
    .map((task) => ({ ...task, project: projectById.get(task.projectId) }))
    .filter((task) => task.project)
    .sort(sortByDueDate);

  const scheduledTasks = openTasks.filter((task) => task.dueDate);
  const unscheduledTasks = openTasks.filter((task) => !task.dueDate);
  const tasksByDate = scheduledTasks.reduce((groups, task) => {
    const group = groups.get(task.dueDate) || [];
    group.push(task);
    groups.set(task.dueDate, group);
    return groups;
  }, new Map());
  const visibleCalendarDays = calendarDays(calendarDate, calendarMode);
  const today = startOfDay(new Date());

  const moveCalendar = (direction) => {
    if (calendarMode === "week") {
      setCalendarDate((currentDate) => addDays(currentDate, direction * 7));
      return;
    }

    setCalendarDate(
      (currentDate) =>
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + direction,
          1
        )
    );
  };

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

      <Card
        title={
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-sky-800" />
            Calendar
          </div>
        }
        right={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex overflow-hidden rounded-md border border-slate-400">
              {["week", "month"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalendarMode(mode)}
                  className={`px-2.5 py-1 text-xs font-semibold capitalize ${
                    calendarMode === mode
                      ? "bg-navy text-white"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveCalendar(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-400 bg-white text-slate-800 hover:bg-slate-100"
                title="Previous"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setCalendarDate(today)}
                className="rounded-md border border-slate-400 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                Today
              </button>
              <button
                onClick={() => moveCalendar(1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-400 bg-white text-slate-800 hover:bg-slate-100"
                title="Next"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        }
      >
        <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-base font-bold text-slate-950">
              {calendarTitle(calendarDate, calendarMode)}
            </div>
            <div className="text-xs font-medium text-slate-600">
              {scheduledTasks.length} scheduled tasks
              {unscheduledTasks.length
                ? ` / ${unscheduledTasks.length} unscheduled`
                : ""}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="min-w-[46rem]">
            <div className="grid grid-cols-7 rounded-md border border-slate-300 bg-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="border-r border-slate-300 px-2 py-1.5 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 rounded-md border border-slate-300 bg-slate-200">
              {visibleCalendarDays.map((day, index) => {
                const key = dateKey(day);
                const dayTasks = tasksByDate.get(key) || [];
                const isToday = sameDate(day, today);
                const isCurrentMonth = day.getMonth() === calendarDate.getMonth();
                const visibleTaskLimit = calendarMode === "week" ? 6 : 3;

                return (
                  <div
                    key={key}
                    className={`min-h-28 border-r border-t border-slate-300 bg-white p-1.5 ${
                      index < 7 ? "border-t-0" : ""
                    } ${(index + 1) % 7 === 0 ? "border-r-0" : ""} ${
                      calendarMode === "week" ? "min-h-44" : ""
                    } ${
                      isCurrentMonth || calendarMode === "week"
                        ? ""
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-1">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isToday ? "bg-navy text-white" : "text-slate-700"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, visibleTaskLimit).map((task) => (
                        <button
                          key={task.id}
                          onClick={() => onProjectSelect(task.projectId)}
                          className="w-full rounded border border-slate-300 bg-sky-50 px-1.5 py-1 text-left text-[11px] leading-4 text-slate-950 hover:border-sky-600 hover:bg-sky-100"
                        >
                          <div className="truncate font-semibold">{task.title}</div>
                          <div className="truncate text-slate-600">
                            {task.project.clientName}
                          </div>
                        </button>
                      ))}
                      {dayTasks.length > visibleTaskLimit && (
                        <div className="text-[11px] font-semibold text-slate-500">
                          +{dayTasks.length - visibleTaskLimit} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {unscheduledTasks.length > 0 && (
          <div className="mt-3 rounded-md border border-slate-300 bg-slate-50 p-2.5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Unscheduled
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {unscheduledTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onProjectSelect(task.projectId)}
                  className="rounded-md border border-slate-300 bg-white p-2 text-left text-sm shadow-sm hover:border-sky-500"
                >
                  <div className="line-clamp-2 font-semibold text-slate-950">
                    {task.title}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-600">
                    {task.project.clientName} / {task.project.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
