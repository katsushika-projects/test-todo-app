export type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export type CreateTodoRequest = {
    title: string;
};

export type UpdateTodoRequest = {
    id: number;
    completed: boolean;
};
