"use client";
export default function SearchBar({
    search,
    onSearch,
}: {
    search: string;
    onSearch: (s: string) => void;
}) {
    return (
        <input
            className="w-full p-2 border mb-4 h-11 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Search by title or tag..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
        />
    );
}
