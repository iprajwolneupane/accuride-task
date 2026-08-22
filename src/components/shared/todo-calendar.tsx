"use client";
import { Todo } from "@/lib/type";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, Locale, startOfMonth, endOfMonth } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, TriangleAlert } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { DEFAULT_LOCALE } from "@/constant";
import { CompleteTodo, DeleteTodo, EditTodo } from "@/components/shared/todo-card";
import TodoForm from "@/components/shared/todo-form";
import { useRouter } from "next/navigation";

const DATE_FNS_LOCALES: Record<string, Locale> = {
    en: enUS,
    fr: fr,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: DATE_FNS_LOCALES,
});

export default function TodoCalendar({ todos }: { todos: Todo[] }) {
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState<View>("month");
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const router = useRouter();

    const currentLocale = Cookies.get("locale") ?? DEFAULT_LOCALE;
    const calendarCulture = currentLocale.split("_")[0];

    const events = useMemo(() => todos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        start: new Date(todo.date),
        end: new Date(todo.date),
        resource: todo,
    })), [todos]);

    const eventPropGetter = useCallback((event: typeof events[0]) => {
        const isOverdue = new Date(event.resource.date).getTime() < Date.now() && !event.resource.isCompleted;
        const isCompleted = event.resource.isCompleted;

        return {
            style: {
                backgroundColor: isOverdue ? "#ef4444" : "#86efac",
                color: "#1e293b",
                textDecoration: isCompleted ? "line-through" : "none",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                opacity: isCompleted ? 0.8 : 1,
            },
        };
    }, []);

    const handleSelectEvent = useCallback((event: typeof events[0]) => {
        setSelectedTodo(event.resource);
    }, []);

    const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
        setSelectedDate(start);
    }, []);


    const handleNavigate = useCallback((newDate: Date) => {
        setDate(newDate);
        const from = startOfMonth(newDate).toISOString();
        const to = endOfMonth(newDate).toISOString();
        router.push(`?from=${from}&to=${to}`);
    }, []);

    const isOverdue = useMemo(
        () => selectedTodo ? new Date(selectedTodo.date).getTime() < Date.now() && !selectedTodo.isCompleted : false,
        [selectedTodo]
    );

    return (
        <>
            <div className="h-[calc(100vh-100px)] w-full">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    date={date}
                    view={view}
                    culture={calendarCulture}
                    onView={setView}
                    views={["month", "day"]}
                    onNavigate={handleNavigate}
                    eventPropGetter={eventPropGetter}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                />
            </div>

            {/* Todo Detail Dialog */}
            <Dialog open={!!selectedTodo} onOpenChange={() => setSelectedTodo(null)}>
                <DialogContent className="min-w-2xl">
                    <DialogHeader>
                        <DialogTitle className={cn(selectedTodo?.isCompleted && "line-through")}>
                            {selectedTodo?.title}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedTodo?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        <div className="h-px w-full bg-border" />
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-sm text-gray-600">
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                {selectedTodo?.date && formatDate(selectedTodo.date)}
                            </Badge>
                            {isOverdue && (
                                <Badge variant="destructive" className="rounded-sm">
                                    <TriangleAlert className="mr-1 h-3 w-3" />
                                    Overdue
                                </Badge>
                            )}
                            {selectedTodo?.isCompleted && (
                                <Badge className="rounded-sm bg-green-300 text-slate-800">
                                    Completed
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="h-px w-full bg-border" />
                    {selectedTodo && (
                        <div className="flex justify-end items-center gap-3">
                            <CompleteTodo todo={selectedTodo} />
                            <EditTodo todo={selectedTodo} />
                            <DeleteTodo todo={selectedTodo} onDelete={() => setSelectedTodo(null)} />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
                <TodoForm setOpen={(val) => !val && setSelectedDate(null)} />
            </Dialog>
        </>
    );
}