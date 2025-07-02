export function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} years ago`;
}

export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case "High":
            return "#FF8C00";
        case "Medium":
            return "#209688";
        case "Low":
            return "#4682B4";
        default:
            return "";
    }
};

export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDueDateColor = (
    dueDate: string | undefined,
    now: Date
): string => {
    if (!dueDate) return "";

    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    const TWO_DAY = 2 * 24 * 60 * 60 * 1000;
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;

    if (diff < TWELVE_HOURS) return "text-red-500 font-semibold";
    if (diff < TWO_DAY) return "text-yellow-500 font-medium";
    return "text-green-600";
};

export const formatDate = (
    date: string | Date,
    locale: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }
): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("en-GB", locale);
};

export function formatTimestamp(timestamp: string): string {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays > 2) {
        return commentDate.toLocaleString(); // or use a more readable format if needed
    } else {
        return timeAgo(timestamp); // Assuming timeAgo is already defined
    }
}