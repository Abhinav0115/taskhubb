"use client";
import { useState, useEffect, useCallback } from "react";
import TaskList from "@/components/TaskList";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";
import EditModal from "@/components/EditModal";
import AddModal from "@/components/AddModal";
import { toast } from "react-toastify";
import Navbar from "@/components/common/Navbar";

export default function Home() {
    const [search, setSearch] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "dueDate">(
        "createdAt"
    );
    const [statusFilter, setStatusFilter] = useState<
        "all" | "completed" | "incomplete" | "overdue"
    >("all");
    // const [tasks, setTasks] = useState<Task[]>([]);

    const [tasks, setTasks] = useState<Task[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("tasks");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });

    // useEffect(() => {
    //     const stored = localStorage.getItem("tasks");
    //     if (stored) setTasks(JSON.parse(stored));
    // }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        if (search) setSelectedTags([]);
    }, [search]);

    const filteredTasks = tasks.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.tags.some((tag) =>
                tag.toLowerCase().includes(search.toLowerCase())
            );
        const matchesTags =
            selectedTags.length > 0
                ? selectedTags.some((tag) => t.tags.includes(tag))
                : true;

        const now = new Date().toISOString();

        const matchesStatus =
            statusFilter === "all"
                ? true
                : statusFilter === "completed"
                ? t.completed
                : statusFilter === "incomplete"
                ? !t.completed
                : statusFilter === "overdue"
                ? !t.completed && t.dueDate && t.dueDate < now
                : true;

        return matchesSearch && matchesTags && matchesStatus;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === "priority") {
            const order = { High: 3, Medium: 2, Low: 1, None: 0 };
            return order[b.priority] - order[a.priority];
        }
        if (sortBy === "dueDate") {
            return (
                (a.dueDate ? new Date(a.dueDate).getTime() : 0) -
                (b.dueDate ? new Date(b.dueDate).getTime() : 0)
            );
        }
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    const uniqueTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

    const handleAdd = (task: Omit<Task, "id" | "createdAt">) => {
        setTasks((prevTasks) => [
            ...prevTasks,
            { ...task, id: uuidv4(), createdAt: new Date().toISOString() },
        ]);
        toast.success("Task created!");
    };
    const handleToggle = useCallback((id: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    }, []);

    const handleDelete = useCallback((id: string) => {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
        toast.info("Task deleted.");
    }, []);

    const handleEdit = useCallback(
        (id: string) => {
            const task = tasks.find((t) => t.id === id);
            if (task) setEditingTask(task);
        },
        [tasks]
    );
    const handleComment = useCallback((id: string, text: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          comments: [
                              ...task.comments,
                              {
                                  text,
                                  timestamp: new Date().toISOString(),
                              },
                          ],
                      }
                    : task
            )
        );
        toast.success("Comment added!");
    }, []);

    const handleCommentDelete = useCallback(
        (taskId: string, commentIdx: number) => {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId
                        ? {
                              ...task,
                              comments: task.comments.filter(
                                  (_c, idx) => idx !== commentIdx
                              ),
                          }
                        : task
                )
            );
            toast.info("Comment deleted.");
        },
        []
    );

    const handleSave = (updated: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === updated.id ? updated : t))
        );
        setEditingTask(null);
        toast.success("Task updated!");
    };

    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;

    return (
        <>
            <Navbar />
            <main className="max-w-2xl mx-auto p-4">
                <div className="flex justify-between mb-4 gap-4">
                    <SearchBar search={search} onSearch={setSearch} />
                    <button
                        className="bg-purple-900 h-11 text-white text-nowrap px-5 py-2 rounded hover:bg-purple-800 transition-colors cursor-pointer"
                        aria-label="Add new task"
                        aria-details="Opens a modal to add a new task"
                        aria-pressed={addOpen}
                        aria-expanded={addOpen}
                        onClick={() => setAddOpen(true)}
                    >
                        Add New
                    </button>
                </div>
                <div className="mb-3 flex justify-between items-center text-sm text-gray-600">
                    <div>
                        <label className="mr-2 font-semibold">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                                setSortBy(
                                    e.target.value as
                                        | "createdAt"
                                        | "priority"
                                        | "dueDate"
                                )
                            }
                            className=" rounded border py-1.5 px-1 hover:bg-gray-200 transition-colors"
                            aria-label="Sort tasks"
                            aria-details="Select how to sort the tasks"
                            aria-expanded={sortBy !== "createdAt"}
                        >
                            <option value="createdAt" className="bg-gray-200">
                                Created At
                            </option>
                            <option value="priority" className="bg-gray-200">
                                Priority
                            </option>
                            <option value="dueDate" className="bg-gray-200">
                                Due Date
                            </option>
                        </select>
                    </div>
                    <div
                        className="text-sm text-gray-600"
                        aria-label="Task completion progress"
                        aria-details="Displays the number of completed tasks out of total tasks"
                        aria-description="Shows how many tasks have been completed."
                    >
                        <span className="font-semibold">Progress:</span>
                        {completed} / {total} completed
                    </div>
                </div>
                <TagFilter
                    tags={uniqueTags}
                    selected={selectedTags}
                    onSelect={setSelectedTags}
                    status={statusFilter}
                    onStatusChange={(status: string) =>
                        setStatusFilter(
                            status as
                                | "all"
                                | "completed"
                                | "incomplete"
                                | "overdue"
                        )
                    }
                />
                <TaskList
                    tasks={sortedTasks}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onComment={handleComment}
                    onCommentDelete={handleCommentDelete}
                />
                {addOpen && (
                    <AddModal
                        open={addOpen}
                        onClose={() => setAddOpen(false)}
                        onSave={handleAdd}
                        tagSuggestions={uniqueTags}
                    />
                )}
                {editingTask && (
                    <EditModal
                        open={true}
                        onClose={() => setEditingTask(null)}
                        onSave={handleSave}
                        task={editingTask}
                        tagSuggestions={uniqueTags}
                    />
                )}
            </main>
        </>
    );
}
