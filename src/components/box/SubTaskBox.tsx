"use client";
import { Box, TextField, useMediaQuery } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export default function SubTaskBox({
    onAdd,
}: {
    onAdd: (title: string, dueDate: Dayjs | null) => void;
}) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [titleError, setTitleError] = useState<string | null>(null);

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const handleAdd = () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setTitleError("Title is required");
            return;
        }

        setTitleError(null);
        onAdd(trimmedTitle, dueDate);
        setTitle("");
        setDueDate(null);
    };

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
                label="Subtask Title"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                    if (titleError && e.target.value.trim()) {
                        setTitleError(null);
                    }
                }}
                size="small"
                fullWidth
                sx={{
                    "& .MuiInputBase-root": {
                        height: 34,
                        // fontSize: 12,
                    },
                }}
                inputProps={{ maxLength: 40 }}
                required
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Due Date"
                    value={dueDate}
                    onChange={(date) => setDueDate(date)}
                    minDateTime={dayjs()}
                    format="DD/MM/YYYY HH:mm"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            inputRef: (ref: HTMLInputElement) => {
                                if (ref) {
                                    ref.scrollIntoView({
                                        block: "nearest",
                                        behavior: "instant",
                                    });
                                }
                            },
                            InputProps: {
                                sx: {
                                    height: 34,
                                },
                            },
                        },
                    }}
                />
            </LocalizationProvider>

            <button
                onClick={handleAdd}
                type="button"
                className="bg-purple-900 text-white px-3 py-1 rounded hover:bg-purple-800 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={!title.trim()}
                aria-label="Add comment"
                aria-details="Adds a new comment to the task"
                aria-pressed={Boolean(title.trim())}
                aria-expanded={Boolean(title.trim())}
            >
                Add
            </button>
        </Box>
    );
}
