"use client";

import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function TaskList({
    tasks,
    onToggle,
    onDelete,
    onEdit,
    onComment,
    onCommentDelete,
}: {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onComment: (id: string, comment: string) => void;
    onCommentDelete: (taskId: string, commentIdx: number) => void;
}) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
        <div>
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-red-400">
                    <Image
                        src="/noTask.png"
                        alt="No tasks"
                        width={310}
                        height={310}
                        className={`mb-4 ${
                            theme === "dark" ? "opacity-100" : "opacity-30"
                        } `}
                        loading="lazy"
                        aria-label="No tasks"
                        aria-details="No tasks available"
                        aria-description="A sad face indicating no tasks are available."
                        aria-hidden="true"
                    />
                </div>
            ) : (
                tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => onToggle(task.id)}
                        onDelete={() => onDelete(task.id)}
                        onEdit={() => onEdit(task.id)}
                        onComment={(id, comment) => {
                            onComment(id, comment);
                        }}
                        onCommentDelete={onCommentDelete}
                    />
                ))
            )}
        </div>
    );
}
