"use client";
import { Task } from "@/types/task";
import { useState, useEffect } from "react";
import { Checkbox, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommentBox from "./CommentBox";
import { timeAgo } from "@/lib/utils";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useTheme } from "next-themes";

const TaskItem = React.memo(function TaskItem({
    task,
    onToggle,
    onDelete,
    onEdit,
    onComment,
    onCommentDelete,
}: {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onComment: (id: string, comment: string) => void;
    onCommentDelete: (taskId: string, commentIdx: number) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [showComments, setShowComments] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "#FF8C00";
            case "Medium":
                return "#209688";
            case "Low":
                return "#4682B4";
            default:
                return "";
        }
    };

    const dateLocale = {
        month: "short" as const,
        day: "numeric" as const,
        year: "numeric" as const,
        hour: "2-digit" as const,
        minute: "2-digit" as const,
        hour12: true,
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const getDueDateColor = () => {
        if (!task.dueDate) return "";

        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const timeDiff = dueDate.getTime() - now.getTime();

        const TWO_DAY = 2 * 24 * 60 * 60 * 1000;
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;

        if (timeDiff < TWELVE_HOURS) return "text-red-500 font-semibold";
        if (timeDiff < TWO_DAY) return "text-yellow-500 font-medium";
        return "text-green-600";
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div
            className={`border p-4 py-2 rounded mb-4 shadow cursor-pointer hover:border-2 hover:shadow-lg  transition-colors duration-300
                ${task.completed && "bg-purple-50"} 
            ${theme === "dark" ? "bg-gray-600 text-white" : "text-black"}`}
            aria-label={`Task: ${task.title}`}
            aria-details={`Task details: ${
                task.description || "No description"
            }`}
            aria-description={`Task with title "${task.title}" and priority "${
                task.priority
            }". Due date: ${
                task.dueDate
                    ? new Date(task.dueDate).toLocaleString("en-GB", dateLocale)
                    : "No due date"
            }.`}
            style={{
                borderColor:
                    isOverdue && !task.completed
                        ? "#fb2c36"
                        : task.completed
                        ? "#ad46ff"
                        : getPriorityColor(task.priority),
            }}
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
        >
            {/* Collapsible Header */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={task.completed}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => onToggle(task.id)}
                        />
                        <h2
                            className={`font-semibold text-black text-lg cursor-default ${
                                task.completed
                                    ? "line-through text-gray-400"
                                    : ""
                            }`}
                        >
                            {task.title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            className={`text-sm font-semibold cursor-default p-2 py-1 rounded-lg`}
                            style={{
                                color: getPriorityColor(task.priority),
                            }}
                        >
                            {task.priority}
                        </span>

                        {!task.completed && (
                            <Tooltip title="Edit">
                                <IconButton
                                    aria-label="Edit task"
                                    aria-details={`Edit task with title "${task.title}"`}
                                    aria-description={`Click to edit the task titled "${task.title}".`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(task.id);
                                    }}
                                >
                                    <EditIcon
                                        className={`
                                ${
                                    theme === "dark"
                                        ? task.completed
                                            ? "text-gray-400"
                                            : "text-gray-300"
                                        : "text-gray-700"
                                }
                            `}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Delete">
                            <IconButton
                                aria-label="Delete task"
                                aria-details={`Delete task with title "${task.title}"`}
                                aria-description={`Click to delete the task titled "${task.title}".`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmOpen(true);
                                }}
                            >
                                <DeleteIcon
                                    className={`
                                ${
                                    theme === "dark"
                                        ? task.completed
                                            ? "text-gray-700"
                                            : "text-gray-300"
                                        : "text-gray-700"
                                }
                            `}
                                />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 justify-start pl-3 cursor-default">
                    <div className="flex items-center gap-2 flex-wrap">
                        {task.tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    {isOverdue && !task.completed && task.dueDate ? (
                        <span className="text-md text-center text-red-600 font-semibold mt-1">
                            ⚠️ Task is overdue!
                        </span>
                    ) : task.completed ? (
                        <span className="text-md text-center text-fuchsia-700 font-semibold mt-1">
                            ✅ Task is completed successfully!
                        </span>
                    ) : (
                        task.dueDate && (
                            <span
                                className={`text-xs ml-1 ${getDueDateColor()}`}
                            >
                                <span className="font-semibold">Due: </span>
                                {new Date(task.dueDate).toLocaleString(
                                    "en-GB",
                                    dateLocale
                                )}
                            </span>
                        )
                    )}
                </div>
            </div>
            {/* Collapsible Content */}
            {expanded && (
                <div className="ml-4">
                    <div
                        className={`mt-2 text-xs cursor-default
                        ${
                            theme === "dark"
                                ? task.completed
                                    ? "text-gray-600"
                                    : "text-gray-300"
                                : "text-gray-600"
                        }`}
                    >
                        <strong>Created: </strong>
                        {new Date(task.createdAt).toLocaleString(
                            "en-UK",
                            dateLocale
                        )}
                    </div>{" "}
                    {task.description && (
                        <p
                            className={`text-sm gap-1 flex cursor-default flex-row ${
                                theme === "dark"
                                    ? task.completed
                                        ? "text-gray-600"
                                        : "text-gray-300"
                                    : "text-gray-700"
                            }`}
                        >
                            <strong>Description:</strong>
                            <span className="">{task.description}</span>
                        </p>
                    )}
                    <div className=" mt-3" onClick={(e) => e.stopPropagation()}>
                        {!task.completed ? (
                            <CommentBox
                                onAdd={(text) => {
                                    onComment(task.id, text);
                                }}
                            />
                        ) : (
                            <div className="text-sm text-red-500 flex justify-center border-2 border-red-200 py-0.5 rounded bg-red-50">
                                New comments are disabled for completed task.
                            </div>
                        )}
                        {task.comments.length !== 0 && (
                            <div className="w-full flex justify-start cursor-default">
                                <button
                                    onClick={() =>
                                        setShowComments(!showComments)
                                    }
                                    className="text-sm text-white bg-indigo-900 hover:bg-indigo-800 outline-0 p-1 px-2 cursor-pointer rounded mt-2"
                                >
                                    {showComments ? "Hide" : "Show"} Comments (
                                    {task.comments.length})
                                </button>
                            </div>
                        )}
                        {showComments && (
                            <div className="mt-2 space-y-2 cursor-default">
                                {task.comments
                                    .slice()
                                    .reverse()
                                    .map((comment, idx) => {
                                        const commentIdx =
                                            task.comments.length - 1 - idx;
                                        return (
                                            <div
                                                key={idx}
                                                className="text-sm text-gray-700 flex justify-between gap-1"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`font-medium
                                                        ${
                                                            theme === "dark"
                                                                ? "text-gray-400"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        💬{" "}
                                                        {capitalizeFirstLetter(
                                                            comment.text
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {(() => {
                                                            const now =
                                                                new Date();
                                                            const commentDate =
                                                                new Date(
                                                                    comment.timestamp
                                                                );
                                                            const diffMs =
                                                                now.getTime() -
                                                                commentDate.getTime();
                                                            const diffDays =
                                                                diffMs /
                                                                (1000 *
                                                                    60 *
                                                                    60 *
                                                                    24);
                                                            if (diffDays > 2) {
                                                                return commentDate.toLocaleString();
                                                            } else {
                                                                return timeAgo(
                                                                    comment.timestamp
                                                                );
                                                            }
                                                        })()}
                                                    </span>
                                                </div>
                                                {!task.completed && (
                                                    <button
                                                        className="text-xs cursor-pointer text-red-500 hover:underline"
                                                        aria-label="Delete comment"
                                                        aria-details={`Delete comment with text "${comment.text}"`}
                                                        aria-description={`Click to delete the comment with text "${comment.text}".`}
                                                        onClick={() =>
                                                            setCommentToDelete(
                                                                commentIdx
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Confirm dialog for deleting task */}
            {confirmOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <Dialog
                        open={confirmOpen}
                        onClose={() => {
                            setConfirmOpen(false);
                        }}
                        aria-label="Confirm delete task"
                        aria-details={`Confirm deletion of task with title "${task.title}"`}
                        aria-description={`Click to confirm deletion of the task titled "${task.title}".`}
                        sx={{
                            zIndex: 1301,
                            "& .MuiDialog-paper": {
                                backgroundColor:
                                    theme === "dark" ? "#4a5666" : "white",
                                color: "black",
                                boxShadow: 24,
                                borderRadius: 1.5,
                            },
                        }}
                    >
                        <DialogTitle className="">
                            Are you sure you want to delete the task "
                            <span className="font-semibold">
                                {task.title.slice(0, 50)}
                                {task.title.length > 50 ? "..." : ""}
                            </span>
                            "?
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={() => setConfirmOpen(false)}
                                aria-label="Cancel delete task"
                                aria-details={`Cancel deletion of task with title "${task.title}"`}
                                aria-description={`Click to cancel deletion of the task titled "${task.title}".`}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    onDelete(task.id);
                                    setConfirmOpen(false);
                                }}
                                aria-label="Confirm delete task"
                                aria-details={`Confirm deletion of task with title "${task.title}"`}
                                aria-description={`Click to confirm deletion of the task titled "${task.title}".`}
                                color="error"
                                variant="contained"
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
            {/* Confirm dialog for deleting comment */}
            {commentToDelete !== null && (
                <div onClick={(e) => e.stopPropagation()}>
                    <Dialog
                        open={commentToDelete !== null}
                        onClose={() => setCommentToDelete(null)}
                        aria-label="Confirm delete comment"
                        aria-details={`Confirm deletion of comment with index ${commentToDelete} for task "${task.title}"`}
                        aria-description={`Click to confirm deletion of the comment with index ${commentToDelete} for the task titled "${task.title}".`}
                        sx={{
                            zIndex: 1301,
                            "& .MuiDialog-paper": {
                                backgroundColor:
                                    theme === "dark" ? "#4a5666" : "white",
                                color: "black",
                                boxShadow: 24,
                                borderRadius: 1.5,
                            },
                        }}
                    >
                        <DialogTitle>
                            Are you sure you want to delete this comment?
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={() => setCommentToDelete(null)}
                                aria-label="Cancel delete comment"
                                aria-details={`Cancel deletion of comment with index ${commentToDelete} for task "${task.title}"`}
                                aria-description={`Click to cancel deletion of the comment with index ${commentToDelete} for the task titled "${task.title}".`}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (commentToDelete !== null) {
                                        onCommentDelete(
                                            task.id,
                                            commentToDelete
                                        );
                                        setCommentToDelete(null);
                                    }
                                }}
                                color="error"
                                variant="contained"
                                aria-label="Confirm delete comment"
                                aria-details={`Confirm deletion of comment with index ${commentToDelete} for task "${task.title}"`}
                                aria-description={`Click to confirm deletion of the comment with index ${commentToDelete} for the task titled "${task.title}".`}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
            <div
                className="flex items-center justify-center cursor-pointer"
                aria-label={`Expand or collapse task details for "${task.title}"`}
                aria-details={`Expand or collapse the details of the task titled "${task.title}".`}
                aria-description={`Click to ${
                    expanded ? "collapse" : "expand"
                } the details of the task titled "${task.title}".`}
                onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((prev) => !prev);
                }}
            >
                <span
                    className={`ml-2 text-xs ${
                        task.completed ? "text-gray-400" : "text-gray-800"
                    }`}
                >
                    {expanded ? "▲" : "▼"}
                </span>
            </div>
        </div>
    );
});

export default TaskItem;
