import { getTodosByUser } from "@/actions/todo";
import AddTodo from "@/components/shared/add-todo";
import { TodoPageHeader } from "@/components/shared/header";
import LocaleText from "@/components/shared/locale-text";
import NoTodo from "@/components/shared/no-todo";
import TodoList from "@/components/shared/todo-list";

export default async function Home() {
  const todos = await getTodosByUser();

  return (
    <>
      <TodoPageHeader />
      <div className="flex flex-col gap-4 p-4 w-full bg-background flex-1">
        <div className="flex w-full justify-between items-center">
          <h2 className="font-semibold text-xl">
            <LocaleText tag="todo.title" />
          </h2>
          <AddTodo />
        </div>

        {todos.length > 0 ? (
          <TodoList initialTodos={todos} />
        ) : (
          <NoTodo />
        )}
      </div>
    </>
  );
}

