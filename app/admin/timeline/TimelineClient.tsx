"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KanbanSquare,
  ListTodo,
  CalendarDays,
  TableProperties,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  PlusCircle,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Task, OCMember } from "@prisma/client";
import { updateTaskStatus, createTask } from "@/app/actions/tasks";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type TaskWithAssignee = Task & { assignedTo: OCMember | null };

interface TimelineClientProps {
  initialTasks: TaskWithAssignee[];
  members: OCMember[];
}

export default function TimelineClient({ initialTasks, members }: TimelineClientProps) {
  const [view, setView] = useState<"kanban" | "timeline" | "calendar" | "table">("kanban");

  // Local task state — enables optimistic DnD updates
  const [tasks, setTasks] = useState<TaskWithAssignee[]>(initialTasks);

  // Filters
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [prioFilter, setPrioFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  // Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<Task["status"] | null>(null);

  // New task form modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("UNASSIGNED");
  const [newDeadline, setNewDeadline] = useState(new Date().toISOString().split("T")[0]);
  const [newPriority, setNewPriority] = useState<Task["priority"]>("MEDIUM");
  const [newDept, setNewDept] = useState<Task["department"]>("GENERAL");

  const { execute: executeUpdateStatus } = useAction(updateTaskStatus, {
    onError: (err) => {
      toast.error(err.error?.serverError || "Failed to update task status");
      // Revert optimistic update on error
      setTasks(initialTasks);
    },
  });

  const { execute: executeCreateTask, status: createStatus } = useAction(createTask, {
    onSuccess: () => {
      toast.success("Task created successfully");
      setModalOpen(false);
      setNewTitle("");
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to create task"),
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    executeCreateTask({
      title: newTitle.trim(),
      deadline: newDeadline,
      department: newDept,
      priority: newPriority,
      assignedToId: newOwnerId,
    });
  };

  const handleStatusChange = (taskId: string, nextStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    executeUpdateStatus({ id: taskId, status: nextStatus });
  };

  // ── Drag handlers ──────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStatus(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the column entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverStatus(null);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) {
      setDraggingId(null);
      setDragOverStatus(null);
      return;
    }
    handleStatusChange(taskId, status);
    setDraggingId(null);
    setDragOverStatus(null);
  };

  // Filtering logic
  const filteredTasks = useMemo(() => {
    setCurrentPage(1); // Reset page on filter change
    return tasks.filter((t) => {
      const deptMatch = deptFilter === "ALL" || t.department === deptFilter;
      const prioMatch = prioFilter === "ALL" || t.priority === prioFilter;
      return deptMatch && prioMatch;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, deptFilter, prioFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getPriorityColor = (p: Task["priority"]) => {
    switch (p) {
      case "URGENT": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "HIGH": return "text-accent-pink bg-accent-pink/10 border-accent-pink/20";
      case "MEDIUM": return "text-accent-purple bg-accent-purple/10 border-accent-purple/20";
      case "LOW": return "text-accent-teal bg-accent-teal/10 border-accent-teal/20";
    }
  };

  const getStatusIcon = (s: Task["status"]) => {
    switch (s) {
      case "COMPLETED": return <CheckCircle className="text-accent-teal" size={16} />;
      case "IN_PROGRESS": return <Clock className="text-accent-purple animate-pulse" size={16} />;
      case "DELAYED": return <AlertTriangle className="text-red-400" size={16} />;
      case "PENDING": return <Clock className="text-text-muted" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Operations
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Operational Timeline & Tasks
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Centrally track and allocate all conference logistics and milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Create Task
          </Button>
        </div>
      </div>

      {/* FILTER BAR & VIEW TOGGLE */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-1/40 p-4 border border-white/5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-text-muted" />
            <span className="text-xs text-text-secondary font-medium">Dept:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-surface-2 text-text-primary text-xs px-2.5 py-1.5 outline-none border border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition font-medium"
            >
              <option value="ALL">All Departments</option>
              <option value="LOGISTICS">Logistics</option>
              <option value="FINANCE">Finance</option>
              <option value="MARKETING">Marketing</option>
              <option value="EXPERIENCE">Experience</option>
              <option value="PROGRAM">Program</option>
              <option value="GENERAL">General</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">Priority:</span>
            <select
              value={prioFilter}
              onChange={(e) => setPrioFilter(e.target.value)}
              className="bg-surface-2 text-text-primary text-xs px-2.5 py-1.5 outline-none border border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* View Segment switcher */}
        <div className="flex items-center bg-surface-2/60 p-1 border border-white/5 rounded-xl">
          {[
            { id: "kanban", label: "Kanban Board", icon: KanbanSquare },
            { id: "timeline", label: "Timeline", icon: ListTodo },
            { id: "calendar", label: "Calendar", icon: CalendarDays },
            { id: "table", label: "Task List", icon: TableProperties },
          ].map((v) => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  active
                    ? "bg-gradient-cta text-white shadow-glow-purple"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER ACTIVE VIEW */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* ────────────────── KANBAN BOARD VIEW ────────────────── */}
          {view === "kanban" && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid gap-6 md:grid-cols-4"
            >
              {(["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED"] as Task["status"][]).map((status) => {
                const columnTasks = filteredTasks.filter(t => t.status === status);
                return (
                  <div key={status} className="space-y-4">
                    <div className="flex justify-between items-center bg-surface-1/40 px-4 py-2.5 border border-white/5 rounded-xl">
                      <span className="text-xs uppercase font-bold tracking-wider text-text-primary">
                        {status.replace("_", " ")}
                      </span>
                      <Badge variant={status === "COMPLETED" ? "teal" : status === "DELAYED" ? "pink" : "purple"}>
                        {columnTasks.length}
                      </Badge>
                    </div>

                    <div
                      className={`space-y-3 min-h-[400px] p-2 rounded-2xl border border-dashed transition-colors duration-150 ${
                        dragOverStatus === status
                          ? "bg-accent-purple/5 border-accent-purple/40"
                          : "bg-surface-1/10 border-white/5"
                      }`}
                      onDragOver={(e) => handleColumnDragOver(e, status)}
                      onDragLeave={handleColumnDragLeave}
                      onDrop={(e) => handleColumnDrop(e, status)}
                    >
                      {columnTasks.map((t) => (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onDragEnd={handleDragEnd}
                          className={`transition-opacity duration-150 ${draggingId === t.id ? "opacity-40" : "opacity-100"}`}
                        >
                        <Card
                          className="glass-card border border-white/10 hover:border-white/20 p-4 space-y-3 cursor-grab active:cursor-grabbing bg-surface-1/30"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-medium text-text-primary leading-snug line-clamp-2">
                              {t.title}
                            </span>
                            <Badge className={`text-3xs uppercase tracking-widest shrink-0 border ${getPriorityColor(t.priority)}`}>
                              {t.priority}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-3xs text-text-muted">
                            <User size={12} />
                            <span>{t.assignedTo ? t.assignedTo.fullName : "Unassigned"}</span>
                          </div>

                          <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-4xs font-mono uppercase text-text-muted">
                            <span>{t.department}</span>
                            <span className="text-text-secondary font-semibold">{new Date(t.deadline).toLocaleDateString()}</span>
                          </div>

                          {/* Action quick toggle */}
                          <div className="flex justify-end gap-1.5 pt-1">
                            {status !== "IN_PROGRESS" && status !== "COMPLETED" && (
                              <button
                                onClick={() => handleStatusChange(t.id, "IN_PROGRESS")}
                                className="text-[10px] text-accent-purple hover:underline"
                                title="Move to progress"
                              >
                                Progress
                              </button>
                            )}
                            {status !== "COMPLETED" && (
                              <button
                                onClick={() => handleStatusChange(t.id, "COMPLETED")}
                                className="text-[10px] text-accent-teal hover:underline"
                                title="Complete"
                              >
                                Complete
                              </button>
                            )}
                            {status === "COMPLETED" && (
                              <button
                                onClick={() => handleStatusChange(t.id, "PENDING")}
                                className="text-[10px] text-accent-teal hover:underline"
                                title="Reopen"
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </Card>
                        </div>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted text-xs">
                          <span>Empty Column</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* ────────────────── TIMELINE GANTT VIEW ────────────────── */}
          {view === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card border border-white/10 p-6 bg-surface-1/30 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-display font-semibold text-text-primary">Operations Roadmap</span>
                <span className="text-2xs text-text-muted">Gantt bar distribution by deadline</span>
              </div>

              <div className="space-y-4">
                {filteredTasks.length === 0 && (
                  <div className="text-center text-text-muted text-xs p-4">No tasks to display</div>
                )}
                {filteredTasks.map((t, idx) => {
                  // Basic rendering for timeline offset
                  const offset = Math.min(100, Math.max(0, idx * 5)); // Just a visual offset since dates vary
                  
                  return (
                    <div key={t.id} className="grid grid-cols-4 items-center gap-4 text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary truncate">{t.title}</span>
                        <span className="text-[10px] text-text-muted mt-0.5">{t.assignedTo?.fullName || "Unassigned"}</span>
                      </div>
                      
                      {/* Gantt Bar Row */}
                      <div className="col-span-3 h-7 bg-white/5 rounded-xl border border-white/5 relative flex items-center px-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(10, 80 - offset)}%`, x: `${offset}%` }}
                          transition={{ delay: idx * 0.05, duration: 0.6 }}
                          className={`h-4.5 rounded-lg bg-gradient-to-r from-accent-purple/50 to-accent-teal/80 border border-accent-purple/30 relative flex items-center px-2 text-4xs font-mono font-bold text-white shadow-glow-purple/20`}
                        >
                          <span className="truncate">{new Date(t.deadline).toISOString().split("T")[0]}</span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ────────────────── SLEEK CALENDAR VIEW ────────────────── */}
          {view === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card border border-white/10 p-6 bg-surface-1/30 space-y-4"
            >
              {/* Calendar Grid (Simulated layout representing standard June calendar) */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-display font-semibold text-text-primary text-sm uppercase">June 2026 Operations</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-text-muted border-b border-white/5 pb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* Pad first 4 days for offset */}
                {Array.from({ length: 4 }).map((_, i) => <div key={`pad-${i}`} className="h-20 bg-white/1 rounded-xl opacity-30 border border-white/10 border-dashed" />)}
                
                {Array.from({ length: 14 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayString = `2026-06-${String(dayNum).padStart(2, "0")}`;
                  // Matching dates is complex in mock, just rendering UI for demo purposes here
                  const dayTasks = filteredTasks.filter(t => new Date(t.deadline).toISOString().split("T")[0] === dayString);

                  return (
                    <div key={dayNum} className="h-20 bg-surface-2/30 border border-white/5 rounded-xl p-2 flex flex-col justify-between hover:bg-surface-2/50 transition">
                      <span className="text-3xs font-semibold font-mono text-text-muted">{dayNum}</span>
                      <div className="space-y-1 overflow-hidden">
                        {dayTasks.map(t => (
                          <div key={t.id} className="bg-accent-purple/20 border border-accent-purple/40 text-[8px] px-1 py-0.5 rounded truncate font-medium text-white">
                            {t.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ────────────────── TABLE LIST VIEW ────────────────── */}
          {view === "table" && (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card border border-white/10 bg-surface-1/30 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-surface-2/50 text-text-muted font-semibold">
                      <th className="p-4">Status</th>
                      <th className="p-4">Task Detail</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTasks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-text-muted text-xs">No tasks found.</td>
                      </tr>
                    )}
                    {paginatedTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-white/10 transition">
                        <td className="p-4">{getStatusIcon(t.status)}</td>
                        <td className="p-4 font-semibold text-text-primary">{t.title}</td>
                        <td className="p-4 text-text-secondary">{t.assignedTo?.fullName || "Unassigned"}</td>
                        <td className="p-4 text-text-secondary font-mono">{new Date(t.deadline).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Badge className={`uppercase tracking-widest text-3xs border ${getPriorityColor(t.priority)}`}>
                            {t.priority}
                          </Badge>
                        </td>
                        <td className="p-4 text-text-muted font-mono uppercase">{t.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredTasks.length > PAGE_SIZE && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                  <span className="text-xs text-text-muted">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredTasks.length)} of {filteredTasks.length} tasks
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/10 bg-surface-2 text-text-secondary hover:border-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-text-secondary font-mono">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/10 bg-surface-2 text-text-secondary hover:border-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CREATE TASK MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-card border border-white/10 bg-surface-1 p-6 space-y-4 shadow-2xl rounded-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-display font-semibold text-text-primary text-base">Create Project Task</h3>
                <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary font-medium">Task Headline</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Confirm VIP airport arrival times"
                    className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Owner</label>
                    <select
                      value={newOwnerId}
                      onChange={(e) => setNewOwnerId(e.target.value)}
                      className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                    >
                      <option value="UNASSIGNED">Unassigned</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Deadline</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="bg-surface-2 text-text-secondary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Department</label>
                    <select
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value as any)}
                      className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                    >
                      <option value="LOGISTICS">Logistics</option>
                      <option value="FINANCE">Finance</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="DXP">Delegate Experience</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary font-medium">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" disabled={createStatus === "executing"} className="w-full justify-center gap-2 h-10 mt-2">
                  <PlusCircle size={16} />
                  {createStatus === "executing" ? "Adding..." : "Add Task to Board"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
