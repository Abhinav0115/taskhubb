export interface Comment {
    text: string;
    timestamp: string;
}
export interface SubTask {
    id: string;
    title: string;
    createdAt: string;
    dueDate?: string;
    completed: boolean;
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
    subtasks?: SubTask[];
}
