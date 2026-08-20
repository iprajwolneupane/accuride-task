import { getTodosByUser } from "@/actions/todo";
import AddTodo from "@/components/shared/add-todo";
import Header from "@/components/shared/header";
import TodoCard from "@/components/shared/todo-card";
import { ClipboardList } from "lucide-react";

export default async function Home() {
  const todos = await getTodosByUser();
  return (
    <>
      <Header>
        <h2 className="font-semibold">Active Todos</h2>
        <p className="text-xs text-gray-600">Manage your pending tasks and todos.</p>
      </Header>
      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="flex w-full justify-between">
          <h2 className="font-semibold text-xl">Todo List ({todos.length})</h2>
          <div>
            <AddTodo />
          </div>
        </div>
        {
          todos.length > 0 ?
            <div className="grid grid-cols-3 gap-4">
              {todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
            </div>
            : <div className="flex flex-col gap-3 w-full h-[calc(100vh-150px)] items-center justify-center text-center px-4">
              <div className="rounded-full bg-muted p-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">No todos yet</h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  You&apos;re all caught up. Add your first task to get started.
                </p>
              </div>
              <div className="mt-2">
                <AddTodo />
              </div>
            </div>
        }
      </div>
    </>
  );
}
