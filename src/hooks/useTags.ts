"use client";
import { useState } from "react";

export function useTags(
    externalTags: string[],
    setExternalTags: (tags: string[]) => void
) {
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);

    const addTag = () => {
        const newTag = tagInput.trim().toLowerCase();
        if (!newTag) return;

        if (externalTags.includes(newTag)) {
            setError("Tag already added");
            return;
        }

        if (newTag.length > 15) {
            setError("Tag cannot exceed 15 characters");
            return;
        }

        setExternalTags([...externalTags, newTag]);
        setTagInput("");
        setError(undefined);
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = externalTags.filter((tag) => tag !== tagToRemove);
        setExternalTags(updatedTags);

        if (updatedTags.length === 0) {
            setError("At least one tag is required");
        } else {
            setError(undefined);
        }
    };

    const onTagInputChange = (input: string) => {
        setTagInput(input.toLowerCase());
        if (error) setError(undefined);
    };

    const resetTagInput = () => setTagInput("");

    return {
        tagInput,
        setTagInput,
        error,
        addTag,
        removeTag,
        onTagInputChange,
        setError,
        resetTagInput,
    };
}
