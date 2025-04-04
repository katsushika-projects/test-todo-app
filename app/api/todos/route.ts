import { getTodos, addTodo, updateTodo, deleteTodo } from "@/app/lib/db";

export async function GET() {
    const todos = await getTodos();
    return Response.json(todos);
}

export async function POST(request: Request) {
    const { title } = await request.json();
    const newTodo = await addTodo(title);
    return Response.json(newTodo);
}

export async function PUT(request: Request) {
    const { id, completed } = await request.json();
    const updatedTodo = await updateTodo(id, completed);
    if (updatedTodo) {
        return Response.json(updatedTodo);
    }
    return new Response("Todo not found", { status: 404 });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const deleted = await deleteTodo(id);
    if (deleted) {
        return new Response("Todo deleted", { status: 200 });
    }
    return new Response("Todo not found", { status: 404 });
}
