"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTimesCircle } from "react-icons/fa";
import { useTheme } from "next-themes";
interface Props {
    tags: string[];
    selected: string[];
    onSelect: (tags: string[]) => void;
    status: string;
    onStatusChange: (status: string) => void;
    availableStatusFilters?: string[];
}

export default function TagFilter({
    tags,
    selected,
    onSelect,
    status,
    onStatusChange,
    availableStatusFilters,
}: Props) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { theme } = useTheme();
    const isDarkMode =
        theme === "dark" ||
        (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    const toggleTag = (tag: string) => {
        if (selected.includes(tag)) {
            onSelect(selected.filter((t) => t !== tag));
        } else {
            onSelect([...selected, tag]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative mb-4">
            <div
                className="flex flex-wrap gap-2 mb-4 items-center justify-center md:justify-start"
                role="group"
                aria-label="Tag filter"
                aria-details="Select tags and status to filter tasks"
            >
                {/* <button
                    onClick={() => onSelect([])}
                    className={`px-3 py-0.5 border hover:bg-purple-800 hover:text-white transition-colors duration-200 cursor-pointer rounded ${
                        selected.length === 0 ? "bg-purple-800 text-white" : ""
                    }`}
                    aria-label="Select all tags"
                    aria-pressed={selected.length === 0}
                    aria-details="Selects all tags to filter tasks"
                >
                    All
                </button> */}
                {(
                    availableStatusFilters ?? [
                        "all",
                        "completed",
                        "incomplete",
                        "overdue",
                    ]
                ).map((filterButton) => (
                    <button
                        key={filterButton}
                        onClick={() => onStatusChange(filterButton)}
                        className={`px-2 py-1 border rounded capitalize transition-colors duration-200 hover:bg-purple-800 hover:text-white ${
                            status === filterButton &&
                            "bg-purple-700 text-white"
                        }`}
                    >
                        {filterButton}
                    </button>
                ))}
                <div className="">
                    {tags.length > 0 && (
                        <button
                            ref={buttonRef}
                            onClick={() => {
                                if (tags.length > 0) {
                                    setIsFilterOpen((prev) => !prev);
                                }
                            }}
                            className={`px-3 py-1 border rounded hover:bg-purple-800 hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1
                            ${isFilterOpen && "bg-purple-700 text-white"}
                            `}
                            aria-expanded={isFilterOpen}
                            aria-label="Toggle tag filter"
                        >
                            Filter by Tags
                            {isFilterOpen ? (
                                <FaChevronUp size={12} />
                            ) : (
                                <FaChevronDown size={12} />
                            )}
                        </button>
                    )}
                    {isFilterOpen && tags.length > 0 && (
                        <div
                            ref={dropdownRef}
                            className={`absolute right-0 z-10 p-3 mt-2 border rounded shadow-md grid gap-2 w-max max-w-full ${
                                isDarkMode
                                    ? "bg-gray-700 text-white border-gray-700"
                                    : "bg-white text-gray-900 border-gray-300"
                            }`}
                            style={{
                                gridTemplateColumns: `repeat(${Math.min(
                                    Math.ceil(tags.length / 4),
                                    6
                                )}, minmax(80px, 1fr))`,
                                maxWidth: "90vw",
                            }}
                            aria-label="Tag dropdown"
                            aria-description="Select tags from the grid below"
                        >
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-2 py-1 border text-sm rounded hover:bg-purple-800 min-w-14 hover:text-white transition-colors duration-200 ${
                                        selected.includes(tag)
                                            ? "bg-purple-700 text-white"
                                            : ""
                                    }`}
                                    aria-pressed={selected.includes(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {selected.length > 0 && (
                    <button
                        onClick={() => onSelect([])}
                        className="flex items-center gap-1 px-3 py-1 text-sm border rounded text-red-600 border-red-300 hover:bg-red-100 transition-colors duration-200"
                    >
                        <FaTimesCircle />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
