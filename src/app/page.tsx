"use client";
import { useState, useEffect } from "react";
import TaskList from "@/components/TaskList";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import EditModal from "@/components/modal/EditModal";
import AddModal from "@/components/modal/AddModal";
import Navbar from "@/components/common/Navbar";
import { useTasks } from "@/hooks/useTasks";
import PWAInstallPrompt from "@/components/common/PWAInstallPrompt";

export default function Home() {
    const {
        tasks,
        // setTasks,
        editingTask,
        setEditingTask,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        saveTask,
        addComment,
        // deleteComment,
        addSubTask,
        deleteSubTask,
        toggleSubTask,
    } = useTasks();

    const [search, setSearch] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [addOpen, setAddOpen] = useState(false);
    const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "dueDate">(
        "createdAt"
    );
    const [statusFilter, setStatusFilter] = useState<
        "all" | "completed" | "incomplete" | "overdue"
    >("all");

    // useEffect(() => {
    //     const stored = localStorage.getItem("tasks");
    //     if (stored) setTasks(JSON.parse(stored));
    // }, []);

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

    const completed = tasks.filter((t) => t.completed).length;
    // const incomplete = tasks.filter((t) => !t.completed).length;

    const total = tasks.length;

    const visibleStatusFilters = ["all", "completed", "incomplete", "overdue"];

    function deleteComment(taskId: string, commentIdx: number): void {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
        const updatedComments = task.comments.filter((_, idx) => idx !== commentIdx);
        const updatedTask = { ...task, comments: updatedComments };
        // Use setEditingTask or saveTask to update the task
        saveTask(updatedTask);
    }

    return (
        <>
            <Navbar />
            <PWAInstallPrompt />
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
                        <span className="font-semibold">Progress: </span>
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
                    availableStatusFilters={visibleStatusFilters}
                />
                <TaskList
                    tasks={sortedTasks}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onComment={addComment}
                    onCommentDelete={deleteComment}
                    onAddSubTask={addSubTask}
                    onDeleteSubTask={deleteSubTask}
                    onToggleSubTask={toggleSubTask}
                />
                {addOpen && (
                    <AddModal
                        open={addOpen}
                        onClose={() => setAddOpen(false)}
                        onSave={addTask}
                        tagSuggestions={uniqueTags}
                    />
                )}
                {editingTask && (
                    <EditModal
                        open={true}
                        onClose={() => setEditingTask(null)}
                        onSave={saveTask}
                        task={editingTask}
                        tagSuggestions={uniqueTags}
                    />
                )}
            </main>
        </>
    );
}
