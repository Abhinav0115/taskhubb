"use client";

interface Props {
    tags: string[];
    selected: string[];
    onSelect: (tags: string[]) => void;
}

export default function TagFilter({ tags, selected, onSelect }: Props) {
    const toggleTag = (tag: string) => {
        if (selected.includes(tag)) {
            onSelect(selected.filter((t) => t !== tag));
        } else {
            onSelect([...selected, tag]);
        }
    };

    return (
        <div
            className="flex gap-2 mb-4 overflow-x-auto "
            aria-label="Tag filter"
            aria-description="Use the buttons below to filter tasks by tags. Click a tag to toggle its selection."
        >
            <button
                onClick={() => onSelect([])}
                className={`px-3 py-0.5 border hover:bg-purple-800 hover:text-white transition-colors duration-200 cursor-pointer rounded ${
                    selected.length === 0 ? "bg-purple-800 text-white" : ""
                }`}
                aria-label="Select all tags"
                aria-pressed={selected.length === 0}
                aria-details="Selects all tags to filter tasks"
            >
                All
            </button>
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-0.5 border cursor-pointer hover:bg-purple-800 hover:text-white transition-colors duration-200
             rounded ${
                 selected.includes(tag) ? "bg-purple-700 text-white" : ""
             }`}
                    aria-label={`Filter by tag: ${tag}`}
                    aria-pressed={selected.includes(tag)}
                    aria-details={`Filters tasks by the tag: ${tag}`}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
}
