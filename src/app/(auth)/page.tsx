import { getTodosByUser } from "@/actions/todo";
import AddTodo from "@/components/shared/add-todo";
import Header from "@/components/shared/header";
import TodoCard from "@/components/shared/todo-card";

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
        <div className="grid grid-cols-3 gap-4">
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </>
  );
}
