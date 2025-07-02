import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export type TaskFormErrors = {
    title?: string;
    dueDate?: string;
    tags?: string;
};

export function useTaskForm(initialTags: string[] = []) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>(initialTags);
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
    const [dueDate, setDueDate] = useState<Dayjs | null>(null);
    const [errors, setErrors] = useState<TaskFormErrors>({});

    const resetFields = () => {
        setTitle("");
        setDescription("");
        setTags([]);
        setPriority("Low");
        setDueDate(null);
        setErrors({});
    };

    const validate = () => {
        const newErrors: TaskFormErrors = {};

        if (!title.trim()) newErrors.title = "Title is required";
        if (title.trim().length > 40)
            newErrors.title = "Title cannot exceed 40 characters";

        if (tags.length === 0) newErrors.tags = "At least one tag is required";
        if (tags.some((tag) => tag.length > 15))
            newErrors.tags = "Tags cannot exceed 15 characters each";

        if (dueDate && dueDate.isBefore(dayjs()))
            newErrors.dueDate = "Due date cannot be in the past";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
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
    };
}
