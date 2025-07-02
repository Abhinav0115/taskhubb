"use client";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    InputLabel,
    FormControl,
    Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useTags } from "@/hooks/useTags";

const modalStyle = {
    position: "fixed" as const,
    top: 0,
    right: 0,
    bottom: 0,
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    width: "400px",
    maxWidth: "100%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
    zIndex: 9999,
    maxHeight: "100vh",
    overflowY: "auto",
};

type EditModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
    task: Task | null;
    tagSuggestions?: string[];
};

export default function EditModal({
    open,
    onClose,
    onSave,
    task,
    tagSuggestions = [],
}: EditModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [errors, setErrors] = useState<{
        title?: string;
        dueDate?: string;
        tags?: string;
    }>({});
    const [tags, setTags] = useState<string[]>([]);

    const {
        tagInput,
        error: tagError,
        addTag,
        removeTag,
        onTagInputChange,
        resetTagInput,
        setError: setTagError,
    } = useTags(tags, setTags);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || "");
            setPriority(task.priority || "Medium");
            setDueDate(task.dueDate ? dayjs(task.dueDate) : null);
            setTags((prevTags) => {
                const prev = [...prevTags].sort().join(",");
                const next = [...(task.tags || [])].sort().join(",");
                return prev !== next ? task.tags || [] : prevTags;
            });
            setErrors({});
            setTagError(undefined);
            resetTagInput();
        }
    }, [task, setTags]);

    const handleSave = () => {
        const newErrors: {
            title?: string;
            dueDate?: string;
            tags?: string;
        } = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        if (title.trim().length > 40) {
            newErrors.title = "Title cannot exceed 40 characters";
        }

        if (tags.length === 0) {
            newErrors.tags = "At least one tag is required";
        }

        if (dueDate && dueDate.isBefore(dayjs())) {
            newErrors.dueDate = "Due date cannot be in the past";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // If valid, clear errors
        setErrors({});
        if (task) {
            onSave({
                ...task,
                title,
                description,
                tags,
                priority,
                dueDate: dueDate ? dueDate.toISOString() : "",
            });
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    ...modalStyle,
                    transform: open ? "translateX(0)" : "translateX(100%)",
                }}
            >
                <Typography
                    variant="h6"
                    align="center"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        marginBottom: 1.8,
                    }}
                >
                    Edit Task
                </Typography>

                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => {
                        const input = e.target.value;
                        const capitalized =
                            input.charAt(0).toUpperCase() + input.slice(1);
                        setTitle(capitalized);
                        setErrors((prev) => ({
                            ...prev,
                            title: !capitalized.trim()
                                ? "Title is required"
                                : capitalized.length > 40
                                ? "Title cannot exceed 40 characters"
                                : undefined,
                        }));
                    }}
                    margin="dense"
                    inputProps={{ maxLength: 40 }}
                    error={Boolean(errors.title)}
                    helperText={errors.title || `${title.length}/40 characters`}
                    // slotProps={{
                    //     formHelperText: {
                    //         sx: {
                    //             position: "absolute",
                    //             right: "-0.4rem",
                    //         },
                    //     },
                    // }}
                />

                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="dense"
                    multiline
                    rows={3}
                />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.2 }}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={`${tag}`}
                            onDelete={() => removeTag(tag)}
                            color="secondary"
                            size="small"
                        />
                    ))}
                </Box>

                {/* <TextField
                    fullWidth
                    label="Add Tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => {
                        setTagInput(e.target.value);
                        if (errors.tags) {
                            setErrors((prev) => ({
                                ...prev,
                                tags: undefined,
                            }));
                        }
                    }}
                    onKeyDown={handleTagKeyDown}
                    margin="dense"
                    error={Boolean(errors.tags)}
                    helperText={errors.tags}
                /> */}

                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        label="Add Tags (press Enter)"
                        inputProps={{ maxLength: 15 }}
                        placeholder="max 15 characters/tag"
                        value={tagInput}
                        onChange={(e) => {
                            onTagInputChange(e.target.value);
                            if (errors.tags) {
                                setErrors((prev) => ({
                                    ...prev,
                                    tags: undefined,
                                }));
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                                if (errors.tags)
                                    setErrors((prev) => ({
                                        ...prev,
                                        tags: undefined,
                                    }));
                                if (tagError) setTagError(undefined);
                            }
                        }}
                        margin="dense"
                        error={Boolean(errors.tags)}
                        helperText={errors.tags}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => {
                            if (tagInput.trim()) {
                                addTag();
                                if (errors.tags) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        tags: undefined,
                                    }));
                                }
                            }
                        }}
                        disabled={!tagInput.trim()}
                        sx={{
                            height: "56px",
                            mt: "8px", // aligns with TextField
                        }}
                    >
                        Add
                    </Button>
                </Box>

                {tagInput && (
                    <Box sx={{ mt: 1 }}>
                        {tagSuggestions
                            .filter(
                                (suggestion) =>
                                    suggestion
                                        .toLowerCase()
                                        .includes(tagInput.toLowerCase()) &&
                                    !tags.includes(suggestion)
                            )
                            .map((suggestion) => (
                                <Chip
                                    key={suggestion}
                                    label={`${suggestion}`}
                                    size="small"
                                    sx={{ mr: 1, mb: 1, cursor: "pointer" }}
                                    onClick={() => {
                                        setTags([...tags, suggestion]);
                                        resetTagInput();
                                        if (errors.tags) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                tags: undefined,
                                            }));
                                        }
                                    }}
                                />
                            ))}
                    </Box>
                )}

                <FormControl fullWidth margin="normal">
                    <InputLabel id="priority-label">Priority Level</InputLabel>
                    <Select
                        labelId="priority-label"
                        value={priority}
                        label="Priority Level"
                        onChange={(e) =>
                            setPriority(
                                e.target.value as "Low" | "Medium" | "High"
                            )
                        }
                    >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Due Date"
                            value={dueDate}
                            format="DD/MM/YYYY HH:mm"
                            onChange={(newValue) => {
                                setDueDate(newValue);
                                if (newValue && newValue.isAfter(dayjs())) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        dueDate: undefined,
                                    }));
                                }
                            }}
                            minDateTime={dayjs()}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: Boolean(errors.dueDate),
                                    helperText: errors.dueDate,
                                },
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>

                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
