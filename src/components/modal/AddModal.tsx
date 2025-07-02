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
import dayjs from "dayjs";
import { useTheme as useNextTheme } from "next-themes";

import { useTaskForm } from "@/hooks/useTaskForm";
import { useTags } from "@/hooks/useTags";

const modalStyle = (mode: "light" | "dark") => ({
    position: "fixed" as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: "400px",
    maxWidth: "100%",
    bgcolor: mode === "dark" ? "#262525" : "#fff",
    color: mode === "dark" ? "#f1f1f1" : "#000",
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
    zIndex: 9999,
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    maxHeight: "100vh",
    overflowY: "auto",
});

type AddModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: (newTask: Task) => void;
    tagSuggestions?: string[];
};

export default function AddModal({
    open,
    onClose,
    onSave,
    tagSuggestions = [],
}: AddModalProps) {
    const { resolvedTheme } = useNextTheme();
    const [mounted, setMounted] = useState(false);

    const {
        title,
        setTitle,
        description,
        setDescription,
        tags,
        setTags,
        priority,
        setPriority,
        dueDate,
        setDueDate,
        errors,
        validate,
        resetFields,
        setErrors,
    } = useTaskForm();

    const {
        tagInput,
        setTagInput,
        error: tagError,
        addTag,
        removeTag,
        onTagInputChange,
        setError: setTagError,
        resetTagInput,
    } = useTags(tags, setTags);

    // Sync tags between hooks
    useEffect(() => {
        setTags(tags);
    }, [tags, setTags]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleAddTag = () => {
        addTag();
        if (errors.tags) setErrors((prev) => ({ ...prev, tags: undefined }));
        if (tagError) setTagError(undefined);
        resetTagInput();
    };

    const handleSave = () => {
        // Sync tags from useTags hook to useTaskForm before validate
        setTags(tags);

        if (!validate()) return;

        onSave({
            title: title.trim(),
            description: description.trim(),
            tags,
            priority,
            dueDate: dueDate ? dueDate.toISOString() : "",
            id: "",
            createdAt: "",
            completed: false,
            comments: [],
        });

        onClose();
        resetFields();
        setTagInput("");
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    ...modalStyle(resolvedTheme === "dark" ? "dark" : "light"),
                    transform: open ? "translateX(0)" : "translateX(100%)",
                }}
            >
                <Typography
                    variant="h6"
                    align="center"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: resolvedTheme === "dark" ? "#bb57de" : "#000",
                    }}
                >
                    Add Task
                </Typography>

                <TextField
                    fullWidth
                    label="Title"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => {
                        const input = e.target.value;
                        const capitalized =
                            input.charAt(0).toUpperCase() + input.slice(1);
                        setTitle(capitalized);
                        if (input.trim()) {
                            setErrors((prev) => ({
                                ...prev,
                                title: undefined,
                            }));
                        }
                    }}
                    margin="normal"
                    inputProps={{ maxLength: 40 }}
                    required
                    autoFocus
                    error={Boolean(errors.title)}
                    helperText={errors.title || `${title.length}/40 characters`}
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

                {/* Tags display */}
                {tags.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            mt: 2,
                        }}
                    >
                        {tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                onDelete={() => removeTag(tag)}
                                color="primary"
                                size="small"
                            />
                        ))}
                    </Box>
                )}

                {/* Tag input with add button */}
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Add Tags (press Enter)"
                        inputProps={{ maxLength: 15 }}
                        placeholder="urgent, work (15 characters/tag)"
                        value={tagInput}
                        onChange={(e) => {
                            onTagInputChange(e.target.value);
                            if (errors.tags)
                                setErrors((prev) => ({
                                    ...prev,
                                    tags: undefined,
                                }));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                        error={Boolean(errors.tags || tagError)}
                        helperText={errors.tags || tagError}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        sx={{
                            height: "56px",
                            "&:not(:disabled)": {
                                backgroundColor:
                                    resolvedTheme === "dark"
                                        ? "#bb57de"
                                        : "#9c28b1",
                                color: "#fff",
                            },
                        }}
                    >
                        Add
                    </Button>
                </Box>

                {/* Suggested tags */}
                {tagInput && (
                    <Box sx={{ mt: 1 }}>
                        {tagSuggestions
                            .filter(
                                (s) =>
                                    s
                                        .toLowerCase()
                                        .includes(tagInput.toLowerCase()) &&
                                    !tags.includes(s)
                            )
                            .map((suggestion) => (
                                <Chip
                                    key={suggestion}
                                    label={suggestion}
                                    size="small"
                                    sx={{
                                        mr: 1,
                                        mb: 1,
                                        cursor: "pointer",
                                        backgroundColor: "info.main",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "info.dark",
                                        },
                                    }}
                                    onClick={() => {
                                        setTags([...tags, suggestion]);
                                        resetTagInput();
                                        if (errors.tags)
                                            setErrors((prev) => ({
                                                ...prev,
                                                tags: undefined,
                                            }));
                                        if (tagError) setTagError(undefined);
                                    }}
                                />
                            ))}
                    </Box>
                )}

                {/* Priority Select */}
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

                {/* Due Date Picker */}
                <FormControl fullWidth margin="dense">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Due Date"
                            value={dueDate}
                            format="DD/MM/YYYY HH:mm"
                            disablePast
                            onChange={(newValue) => setDueDate(newValue)}
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

                {/* Actions */}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                    <Button
                        onClick={onClose}
                        sx={{
                            color:
                                resolvedTheme === "dark"
                                    ? "#f1f1f1"
                                    : "text.secondary",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSave}
                        sx={{
                            backgroundColor:
                                resolvedTheme === "dark"
                                    ? "#bb57de"
                                    : "#9c28b1",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor:
                                    resolvedTheme === "dark"
                                        ? "#a04ab8"
                                        : "#7b1fa2",
                            },
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
