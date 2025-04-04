import { Todo } from "../types/todo";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { todosTable } from "@/src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export const getTodos = async (): Promise<Todo[]> => {
  const result = await db.select().from(todosTable);
  return result.map(row => ({
    ...row,
    completed: Boolean(row.completed), // number → boolean 変換（必要に応じて）
  }));
};

export const addTodo = async (title: string): Promise<Todo> => {
  const newTodo: typeof todosTable.$inferInsert = {
    title,
    completed: 0, // boolean型なら `false`
  };

  const inserted = await db
    .insert(todosTable)
    .values(newTodo)
    .returning(); // ← 挿入された行を返す

  return {
    ...inserted[0],
    completed: Boolean(inserted[0].completed),
  };
};

export const updateTodo = async (
  id: number,
  completed: boolean
): Promise<Todo | null> => {
  const result = await db
    .update(todosTable)
    .set({ completed: completed ? 1 : 0 }) // SQLiteなどでは数値で保存されている想定
    .where(eq(todosTable.id, id))
    .returning();

  if (result.length === 0) {
    return null;
  }

  return {
    ...result[0],
    completed: Boolean(result[0].completed), // number → boolean 変換
  };
};


export const deleteTodo = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(todosTable)
    .where(eq(todosTable.id, id))
    .returning();

  return result.length > 0; // 1件以上削除されたら true
};
