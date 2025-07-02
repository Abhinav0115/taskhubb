"use client";
import { TextField, Box, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export default function CommentBox({
    onAdd,
}: {
    onAdd: (text: string) => void;
}) {
    const [text, setText] = useState("");

    const handleAddComment = () => {
        if (!text.trim()) return;
        if (text) {
            onAdd(text.trim());
            setText("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAddComment();
    };

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isSmall ? "column" : "row",
                gap: 1,
                mt: 1,
            }}
        >
            <TextField
                label="Comment"
                value={text}
                onChange={(e) => {
                    setText(e.target.value.toLowerCase());
                }}
                onKeyDown={handleKeyDown}
                InputProps={{
                    "aria-label": "Comment input",
                    "aria-details":
                        "Input field for adding a comment to the task",
                    "aria-required": true,
                    "aria-invalid": !text.trim(),
                }}
                className="flex-1"
                variant="outlined"
                placeholder="Add a comment..."
                size="small"
                fullWidth
                sx={{
                    "& .MuiInputBase-root": {
                        height: 34,
                        // fontSize: 12,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6b46c1",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6b46c1",
                    },
                }}
                inputProps={{ maxLength: 60 }}
                required
            />
            <button
                onClick={handleAddComment}
                type="button"
                className="bg-purple-900 text-white px-3 py-1 rounded hover:bg-purple-800 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={!text.trim()}
                aria-label="Add comment"
                aria-details="Adds a new comment to the task"
                aria-pressed={Boolean(text.trim())}
                aria-expanded={Boolean(text.trim())}
            >
                Add
            </button>
        </Box>
    );
}
