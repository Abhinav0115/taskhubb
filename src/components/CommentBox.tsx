"use client";
import { useState } from "react";

export default function CommentBox({
    onAdd,
}: {
    onAdd: (text: string) => void;
}) {
    const [text, setText] = useState("");

    const handleAddComment = () => {
        if (text) {
            onAdd(text.trim());
            setText("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAddComment();
    };

    return (
        <div className="flex gap-2 items-center">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border border-gray-700 rounded text-black px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add a comment..."
            />
            <button
                onClick={handleAddComment}
                className="bg-purple-900 text-white px-3 py-1 rounded hover:bg-purple-800 text-sm"
            >
                Add
            </button>
        </div>
    );
}
