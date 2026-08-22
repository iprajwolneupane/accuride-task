import { getTodosByUser } from "@/actions/todo";
import Header from "@/components/shared/header";
import TodoCalendar from "@/components/shared/todo-calendar";
import { startOfMonth, endOfMonth } from "date-fns";

interface CalendarPageProps {
    searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function Calendar({ searchParams }: CalendarPageProps) {
    const { from, to } = await searchParams;

    const fromDate = from ? new Date(from) : startOfMonth(new Date());
    const toDate = to ? new Date(to) : endOfMonth(new Date());

    const todos = await getTodosByUser(fromDate, toDate);

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