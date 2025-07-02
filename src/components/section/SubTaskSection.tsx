"use client";
import React from "react";
import { Checkbox, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    capitalizeFirstLetter,
    formatDate,
    formatTimestamp,
} from "@/utils/taskUtils";
import { SubTask } from "@/types/task";
import SubTaskBox from "@/components/box/SubTaskBox";

//TODO: fix subtask overdue issue

interface SubTaskSectionProps {
    taskId: string;
    taskCompleted: boolean;
    subtasks: SubTask[];
    onToggleSubTask: (taskId: string, subtaskId: string) => void;
    onAddSubTask: (
        taskId: string,
        title: string,
        dueDate?: string | null
    ) => void;
    setSubtaskToDelete: (subtaskInfo: {
        taskId: string;
        subtaskId: string;
    }) => void;
    theme: string;
}

const SubTaskSection: React.FC<SubTaskSectionProps> = ({
    taskId,
    taskCompleted,
    subtasks,
    onToggleSubTask,
    onAddSubTask,
    setSubtaskToDelete,
    theme,
}) => {
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter((sub) => sub.completed).length;

    const hasOverdue = (sub: SubTask) => {
        if (!sub.dueDate) return false;
        const dueDate = new Date(sub.dueDate);
        return dueDate < new Date() && !sub.completed;
    };
    const hasAnyOverdue = subtasks.some(hasOverdue);

    console.log("hasAnyOverdue", hasAnyOverdue);

    return (
        <>
            <div className="mt-0.5 mb-1.5" onClick={(e) => e.stopPropagation()}>
                {/* <h1 className="font-semibold text-lg">Sub-Tasks</h1> */}
                <div className="mb-2">
                    {!taskCompleted ? (
                        <SubTaskBox
                            onAdd={(title, dueDate) => {
                                onAddSubTask(
                                    taskId,
                                    title,
                                    dueDate?.toISOString() || null
                                );
                            }}
                        />
                    ) : (
                        <div className="text-sm text-red-500 text-center border-2 border-red-200 py-0.5 mt-2 rounded bg-red-50">
                            New subtasks are disabled for completed task.
                        </div>
                    )}
                </div>
                {!taskCompleted && subtasks.length > 0 && (
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        className="flex justify-end gap-1 items-center"
                    >
                        <span className="font-semibold ml-2 ">
                            Sub-task progress:{" "}
                        </span>
                        {completedSubtasks} / {totalSubtasks} completed
                    </Typography>
                )}
                {subtasks.map((sub) => (
                    <div
                        key={sub.id}
                        className="flex items-center justify-between text-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex gap-2">
                            <Checkbox
                                checked={sub.completed}
                                onChange={() => onToggleSubTask(taskId, sub.id)}
                                size="small"
                                className="size-8"
                                sx={{
                                    color:
                                        hasOverdue(sub) && !sub.completed
                                            ? "red"
                                            : theme === "dark"
                                            ? "#969799"
                                            : "#000",
                                    "&.Mui-checked": {
                                        color: sub.completed
                                            ? "#6b46c1"
                                            : theme === "dark"
                                            ? "#969799"
                                            : "#000",
                                    },
                                }}
                            />
                            <div
                                className={`flex gap-1.5 flex-col md:flex-row md:items-center ${
                                    sub.completed || taskCompleted
                                        ? " text-gray-500"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`font-semibold ${
                                        sub.completed || taskCompleted
                                            ? " line-through"
                                            : ""
                                    }`}
                                >
                                    {capitalizeFirstLetter(sub.title)}
                                </span>
                                <div className="flex gap-4 flex-col md:flex-row">
                                    <span
                                        className={`text-xs text-gray-400 ml-2 ${
                                            sub.completed || taskCompleted
                                                ? " line-through"
                                                : ""
                                        } `}
                                    >
                                        {formatTimestamp(sub.createdAt)}
                                    </span>
                                    {sub.completed && (
                                        <span className="text-xs text-purple-400 font-semibold ml-2">
                                            Completed
                                        </span>
                                    )}
                                    {sub.dueDate &&
                                        !hasOverdue(sub) &&
                                        !sub.completed && (
                                            <span className="text-xs text-gray-400 ml-2">
                                                <strong>Due: </strong>
                                                {formatDate(sub.dueDate)}
                                            </span>
                                        )}
                                    {hasOverdue(sub) && (
                                        <span className="text-xs text-red-500">
                                            <strong>Overdue</strong>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!taskCompleted && (
                            <Tooltip title="Delete">
                                <IconButton
                                    aria-label="Delete task"
                                    aria-details={`Delete task with title "${sub.title}"`}
                                    aria-description={`Click to delete the task titled "${sub.title}"`}
                                    onClick={() =>
                                        setSubtaskToDelete({
                                            taskId,
                                            subtaskId: sub.id,
                                        })
                                    }
                                    size="small"
                                    sx={{
                                        paddingBottom: "2px",
                                    }}
                                >
                                    <DeleteIcon
                                        fontSize="small"
                                        className={` ${
                                            theme === "dark"
                                                ? taskCompleted
                                                    ? "text-gray-700 "
                                                    : "text-gray-300"
                                                : "text-gray-700"
                                        }`}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                ))}
            </div>
            <hr className="mt-1" />
        </>
    );
};

export default SubTaskSection;
