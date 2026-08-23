import { getTodosByUser } from "@/actions/todo";
import { CalendarPageHeader } from "@/components/shared/header";
import TodoCalendar from "@/components/shared/todo-calendar";
import { endOfMonth, startOfMonth } from "date-fns";

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
      <CalendarPageHeader />
      <div className="flex flex-col gap-4 p-4 w-full bg-background flex-1">
        <TodoCalendar todos={todos} />
      </div>
    </>
  );
}

