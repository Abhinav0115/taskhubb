// hooks/useTasks.ts

import { useCallback, useEffect, useState } from "react";
import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("tasks");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });

    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (task: Omit<Task, "id" | "createdAt">) => {
        setTasks((prev) => [
            ...prev,
            { ...task, id: uuidv4(), createdAt: new Date().toISOString() },
        ]);
        toast.success("Task created!");
    };

    const toggleTask = useCallback((id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        toast.info("Task deleted.");
    }, []);

    const editTask = useCallback(
        (id: string) => {
            const task = tasks.find((task) => task.id === id);
            if (task) setEditingTask(task);
        },
        [tasks]
    );

    const saveTask = (updated: Task) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === updated.id ? updated : task))
        );
        setEditingTask(null);
        toast.success("Task updated!");
    };

    const addComment = useCallback((id: string, text: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          comments: [
                              ...task.comments,
                              { text, timestamp: new Date().toISOString() },
                          ],
                      }
                    : task
            )
        );
        toast.success("Comment added!");
    }, []);

    const deleteComment = useCallback((taskId: string, commentIdx: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          comments: task.comments.filter(
                              (_, idx) => idx !== commentIdx
                          ),
                      }
                    : task
            )
        );
        toast.info("Comment deleted.");
    }, []);

    const addSubTask = useCallback(
        (taskId: string, subtaskTitle: string, subtaskDueDate?: string | null) => {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId
                        ? {
                              ...task,
                              subtasks: [
                                  ...(task.subtasks || []),
                                  {
                                      id: uuidv4(),
                                      title: subtaskTitle,
                                      createdAt: new Date().toISOString(),
                                      dueDate: subtaskDueDate ?? undefined,
                                      completed: false,
                                  },
                              ],
                          }
                        : task
                )
            );
            toast.success("Sub-task added!");
        },
        []
    );

    const deleteSubTask = useCallback((taskId: string, subtaskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          subtasks:
                              task.subtasks?.filter(
                                  (st) => st.id !== subtaskId
                              ) || [],
                      }
                    : task
            )
        );
        toast.info("Sub-task deleted.");
    }, []);

    const toggleSubTask = useCallback((taskId: string, subtaskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          subtasks: task.subtasks?.map((st) =>
                              st.id === subtaskId
                                  ? { ...st, completed: !st.completed }
                                  : st
                          ),
                      }
                    : task
            )
        );
    }, []);

    return {
        tasks,
        setTasks,
        editingTask,
        setEditingTask,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        saveTask,
        addComment,
        deleteComment,
        addSubTask,
        deleteSubTask,
        toggleSubTask,
    };
}
