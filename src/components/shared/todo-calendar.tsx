"use client";

import { CompleteTodo, DeleteTodo, EditTodo } from "@/components/shared/todo-card";
import TodoForm from "@/components/shared/todo-form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_LOCALE } from "@/constant";
import { Todo } from "@/lib/type";
import { cn, formatDate } from "@/lib/utils";
import { endOfMonth, format, getDay, Locale, parse, startOfMonth, startOfWeek } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import Cookies from "js-cookie";
import { Calendar as CalendarIcon, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";

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

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Todo;
};

export default function TodoCalendar({ todos }: { todos: Todo[] }) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  const currentLocale = Cookies.get("locale") ?? DEFAULT_LOCALE;
  const calendarCulture = currentLocale.split("_")[0];

  const events: CalendarEvent[] = useMemo(
    () =>
      todos.map((todo) => {
        const dateObj = new Date(todo.date);
        return {
          id: todo.id,
          title: todo.title,
          start: dateObj,
          end: dateObj,
          resource: todo,
        };
      }),
    [todos]
  );

  const [now] = useState(() => Date.now());

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const isCompleted = event.resource.isCompleted;
    const isOverdue = new Date(event.resource.date).getTime() < now && !isCompleted;

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
  }, [now]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedTodo(event.resource);
  }, []);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setSelectedDate(start);
  }, []);

  // Fetch full month range so navigating months doesn't trigger per-event fetches
  const handleNavigate = useCallback(
    (newDate: Date) => {
      setCurrentDate(newDate);
      const from = startOfMonth(newDate).toISOString();
      const to = endOfMonth(newDate).toISOString();
      router.push(`?from=${from}&to=${to}`);
    },
    [router]
  );

  const isOverdue = useMemo(() => {
    if (!selectedTodo) return false;
    return new Date(selectedTodo.date).getTime() < now && !selectedTodo.isCompleted;
  }, [selectedTodo, now]);

  return (
    <>
      <div className="h-[calc(100vh-100px)] w-full">
        <Calendar
          className="rounded-lg bg-card p-3 shadow-sm ring-1 ring-border"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          view={currentView}
          culture={calendarCulture}
          onView={setCurrentView}
          views={["month", "day"]}
          onNavigate={handleNavigate}
          eventPropGetter={eventPropGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>

      <Dialog open={Boolean(selectedTodo)} onOpenChange={() => setSelectedTodo(null)}>
        <DialogContent className="sm:min-w-2xl min-w-xs bg-card">
          <DialogHeader>
            <DialogTitle className={cn(selectedTodo?.isCompleted && "line-through")}>
              {selectedTodo?.title}
            </DialogTitle>
            <DialogDescription>{selectedTodo?.description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="h-px w-full bg-border" />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {selectedTodo?.date && formatDate(selectedTodo.date)}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="rounded-sm">
                  <TriangleAlert className="mr-1 h-3 w-3" />
                  {t("todo.overdue")}
                </Badge>
              )}
              {selectedTodo?.isCompleted && (
                <Badge className="rounded-sm bg-primary text-primary-foreground">
                  {t("todo.completed")}
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

      <Dialog open={Boolean(selectedDate)} onOpenChange={() => setSelectedDate(null)}>
        <TodoForm setOpen={(val) => !val && setSelectedDate(null)} />
      </Dialog>
    </>
  );
}

