import { getTodosByUser } from "@/actions/todo";
import AddTodo from "@/components/shared/add-todo";
import Header from "@/components/shared/header";
import TodoCalendar from "@/components/shared/todo-calendar";
import dynamic from "next/dynamic";

export default async function Calendar() {
    const todos = await getTodosByUser();
    return (
        <>
            <Header>
                <h2 className="font-semibold">Calendar</h2>
                <p className="text-xs text-gray-600">View your calendar and tasks.</p>
            </Header>
            <div className="flex flex-col gap-4 p-4 w-full">
                <TodoCalendar todos={todos} />
            </div>
        </>
    );
}
