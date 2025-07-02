"use client";
import React from "react";
import CommentBox from "@/components/box/CommentBox";
import { capitalizeFirstLetter, formatTimestamp } from "@/utils/taskUtils";
import { Comment } from "@/types/task";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";

interface CommentSectionProps {
    taskId: string;
    taskCompleted: boolean;
    comments: Comment[];
    showComments: boolean;
    setShowComments: (value: boolean) => void;
    onComment: (taskId: string, text: string) => void;
    onCommentDelete: (taskId: string, commentIdx: number) => void;
    setCommentToDelete: (index: number) => void;
    theme: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    taskId,
    taskCompleted,
    comments,
    showComments,
    // setShowComments,
    onComment,
    // onCommentDelete,
    setCommentToDelete,
    theme,
}) => {

    return (
        <>
            <div
                onClick={(e) => e.stopPropagation()}
                className="mt-2 cursor-default "
            >
                {!taskCompleted ? (
                    <CommentBox onAdd={(text) => onComment(taskId, text)} />
                ) : (
                    <div className="text-sm text-red-500 text-center border-2 border-red-200 py-0.5 rounded bg-red-50">
                        New comments are disabled for completed task.
                    </div>
                )}

                {/* {comments.length > 0 && (
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-sm text-white bg-indigo-900 hover:bg-indigo-800 p-1 px-2 rounded mt-2 cursor-pointer transition-colors duration-200"
                        aria-label="Toggle comments"
                        aria-pressed={showComments}
                        aria-expanded={showComments}
                        aria-details="Click to show or hide comments"
                    >
                        {showComments ? "Hide" : "Show"} Comments (
                        {comments.length})
                    </button>
                )} */}

                {showComments && (
                    <div className="mt-2">
                        {comments
                            .slice()
                            .reverse()
                            .map((comment, idx) => {
                                const originalIdx = comments.length - 1 - idx;
                                return (
                                    <div
                                        key={idx}
                                        className="text-sm flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span
                                                className={`font-medium mb-0.5 ${
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
                                            <span className="text-xs text-gray-400">
                                                {formatTimestamp(
                                                    comment.timestamp
                                                )}
                                            </span>
                                        </div>
                                        {!taskCompleted && (
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    aria-label="Delete task"
                                                    aria-details={`Delete task with title "${comment.text}"`}
                                                    aria-description={`Click to delete the task titled "${comment.text}"`}
                                                    onClick={() =>
                                                        setCommentToDelete(
                                                            originalIdx
                                                        )
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
                                                                    ? "text-gray-700"
                                                                    : "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </>
    );
};

export default CommentSection;
