"use client";
import { Task } from "@/types/task";
import React, { useState, useEffect } from "react";
import {
    Checkbox,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogTitle,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "next-themes";
import {
    getPriorityColor,
    getDueDateColor,
    formatDate,
} from "@/utils/taskUtils";
import SubTaskSection from "@/components/section/SubTaskSection";
import CommentSection from "@/components/section/CommentSection";

const TaskItem = React.memo(function TaskItem({
    task,
    onToggle,
    onDelete,
    onEdit,
    onComment,
    onCommentDelete,
    onAddSubTask,
    onDeleteSubTask,
    onToggleSubTask,
}: {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onComment: (id: string, comment: string) => void;
    onCommentDelete: (taskId: string, commentIdx: number) => void;
    onAddSubTask: (
        taskId: string,
        title: string,
        dueDate?: string | null
    ) => void;
    onDeleteSubTask: (taskId: string, subtaskId: string) => void;
    onToggleSubTask: (taskId: string, subtaskId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [subtasksExpanded, setSubtasksExpanded] = useState(true);
    const [commentsExpanded, setCommentsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(true);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState(new Date());
    const [subtaskToDelete, setSubtaskToDelete] = useState<{
        taskId: string;
        subtaskId: string;
    } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60 * 1000); // Update every 60 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isOverdue = task.dueDate && new Date(task.dueDate) < now;

    return (
        <div
            className={`border p-4 py-2 rounded mb-4 shadow cursor-pointer hover:border-2 hover:shadow-lg  transition-colors duration-300
                ${task.completed && "bg-purple-50"} ${
                isOverdue && !task.completed ? "" : ""
            }
            ${theme === "dark" ? "bg-gray-600 text-white" : "text-black"}`}
            aria-label={`Task: ${task.title}`}
            aria-details={`Task details: ${
                task.description || "No description"
            }`}
            aria-description={`Task with title "${task.title}" and priority "${
                task.priority
            }". Due date: ${
                task.dueDate ? formatDate(task.dueDate) : "No due date"
            }.`}
            style={{
                borderColor:
                    isOverdue && !task.completed
                        ? "#fb2c36"
                        : task.completed
                        ? "#ad46ff"
                        : getPriorityColor(task.priority),
            }}
            onClick={() => {
                setExpanded((prev) => !prev);
            }}
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
                            sx={{
                                color: getPriorityColor(task.priority),
                                "&.Mui-checked": {
                                    color: getPriorityColor(task.priority),
                                },
                            }}
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
                                ${
                                    theme === "dark" &&
                                    isOverdue &&
                                    !task.completed &&
                                    "text-gray-600"
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
                                    setDeleteConfirmOpen(true);
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
                                ${
                                    theme === "dark" &&
                                    isOverdue &&
                                    !task.completed &&
                                    "text-gray-600"
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
                                className={`text-xs ml-1 ${getDueDateColor(
                                    task.dueDate,
                                    now
                                )}`}
                            >
                                <span className="font-semibold">Due: </span>
                                {formatDate(task.dueDate)}
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
                        {formatDate(task.createdAt)}
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
                    {/* Sub-tasks Section */}
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="flex items-center gap-1 text-white bg-purple-800 hover:bg-purple-700 px-2 py-1 rounded cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSubtasksExpanded((prev) => !prev);
                            }}
                        >
                            <h1 className="text-center px-[1.5px] text-sm">Sub-Tasks</h1>
                            <span className="text-sm">
                                {subtasksExpanded ? "▲" : "▼"}
                            </span>
                        </button>
                        {subtasksExpanded && (
                            <SubTaskSection
                                taskId={task.id}
                                taskCompleted={task.completed}
                                subtasks={task.subtasks || []}
                                onToggleSubTask={onToggleSubTask}
                                onAddSubTask={onAddSubTask}
                                setSubtaskToDelete={setSubtaskToDelete}
                                theme={theme ?? "light"}
                            />
                        )}
                    </div>
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="flex items-center gap-1 text-white bg-purple-800 hover:bg-purple-700 px-2 py-1 rounded cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCommentsExpanded((prev) => !prev);
                            }}
                        >
                            <h1 className="text-center text-sm">Comments</h1>
                            <span className="text-sm">
                                {commentsExpanded ? "▲" : "▼"}
                            </span>
                        </button>

                        {commentsExpanded && (
                            <CommentSection
                                taskId={task.id}
                                taskCompleted={task.completed}
                                comments={task.comments}
                                showComments={showComments}
                                setShowComments={setShowComments}
                                onComment={onComment}
                                onCommentDelete={onCommentDelete}
                                setCommentToDelete={setCommentToDelete}
                                theme={theme ?? "light"}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Confirm dialog for deleting task */}
            {deleteConfirmOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <Dialog
                        open={deleteConfirmOpen}
                        onClose={() => {
                            setDeleteConfirmOpen(false);
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
                            Are you sure you want to delete the task &quot;
                            <span className="font-semibold">
                                {task.title.slice(0, 50)}
                                {task.title.length > 50 ? "..." : ""}
                            </span>
                            &quot;?
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={() => setDeleteConfirmOpen(false)}
                                aria-label="Cancel delete task"
                                aria-details={`Cancel deletion of task with title "${task.title}"`}
                                aria-description={`Click to cancel deletion of the task titled "${task.title}".`}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    onDelete(task.id);
                                    setDeleteConfirmOpen(false);
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
                            Are you sure you want to delete comment?
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={() => setCommentToDelete(null)}
                                aria-label="Cancel delete comment"
                                aria-details={`Cancel deletion of comment with index ${commentToDelete} for task "${task.title}"`}
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
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}

            {subtaskToDelete && (
                <div onClick={(e) => e.stopPropagation()}>
                    <Dialog
                        open={!!subtaskToDelete}
                        onClose={() => setSubtaskToDelete(null)}
                        aria-label="Confirm delete subtask"
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
                            Are you sure you want to delete sub-task?
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSubtaskToDelete(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (subtaskToDelete) {
                                        onDeleteSubTask(
                                            subtaskToDelete.taskId,
                                            subtaskToDelete.subtaskId
                                        );
                                        setSubtaskToDelete(null);
                                    }
                                }}
                                color="error"
                                variant="contained"
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
