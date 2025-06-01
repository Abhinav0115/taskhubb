export interface Comment {
    text: string;
    timestamp: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    tags: string[];
    priority: "Low" | "Medium" | "High";
    dueDate?: string;
    createdAt: string;
    completed: boolean;
    comments: Comment[];
}
