"use client";

import { deleteTodo, getTodoById, updateTodoStatus } from "@/actions/todo";
import TodoForm from "@/components/shared/todo-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { FullTodo, Todo } from "@/lib/type";
import { cn, formatDate } from "@/lib/utils";
import { Calendar, Edit2, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useMemo, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

export default function TodoCard({ todo }: { todo: Todo }) {
  const { t } = useTranslation();
  const isCompleted = todo.isCompleted;

  const isOverdue = useMemo(() => {
    return new Date(todo.date).getTime() < Date.now() && !isCompleted;
  }, [todo.date, isCompleted]);

  return (
    <div
      className={cn(
        "w-full border rounded-lg bg-card p-4 flex flex-col gap-2 justify-between group hover:shadow-sm dark:border-border/80 dark:hover:border-primary/40",
        isCompleted && "opacity-70 hover:opacity-90"
      )}
    >
      <div className="flex gap-6 items-start justify-between">
        <h2 className={cn("font-semibold max-h-12 line-clamp-2", isCompleted && "line-through")}>
          {todo.title}
        </h2>
        <div className="group-hover:opacity-100 flex gap-1 opacity-0 transition-all duration-300 ease-in-out">
          <EditTodo todo={todo} />
          <DeleteTodo todo={todo} />
        </div>
      </div>

      <p className="text-sm max-h-21 text-muted-foreground line-clamp-4">{todo.description}</p>
      <div className="h-px w-full bg-border" />

      <div className="flex gap-1 justify-between mt-1 items-center">
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="rounded-sm text-muted-foreground">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            {formatDate(todo.date)}
          </Badge>
          {isOverdue && (
            <Badge variant="destructive" className="rounded-sm">
              <TriangleAlert className="mr-1 h-3.5 w-3.5" />
              {t("todo.overdue")}
            </Badge>
          )}
        </div>
        <CompleteTodo todo={todo} />
      </div>
    </div>
  );
}

export const CompleteTodo = ({ todo }: { todo: Todo }) => {
  const { t } = useTranslation();
  const [isPending, startUpdateTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(todo.isCompleted);
  const router = useRouter();

  const toggleComplete = useCallback(() => {
    const prev = optimisticCompleted;
    const next = !prev;

    setOptimisticCompleted(next);

    startUpdateTransition(async () => {
      try {
        await updateTodoStatus(todo.id, next);
        toast.add({
          title: next ? "Todo completed" : "Todo reopened",
          description: next
            ? "Task marked as complete."
            : "Task moved back to active list.",
          type: "success",
        });
        router.refresh();
      } catch (err) {
        console.error("Failed to update todo status", { id: todo.id, err });
        setOptimisticCompleted(prev);
        toast.add({
          title: "Update failed",
          description: "Could not update task status. Try again.",
          type: "error",
        });
      }
    });
  }, [optimisticCompleted, todo.id, router]);

  return (
    <div className="flex gap-1.5 items-center">
      <Checkbox
        className="h-4.5 w-4.5"
        id={`box-${todo.id}`}
        checked={optimisticCompleted}
        onCheckedChange={toggleComplete}
        disabled={isPending}
      />
      <label htmlFor={`box-${todo.id}`} className="text-xs text-muted-foreground select-none cursor-pointer">
        {isPending ? t("common.saving") : t("todo.done")}
      </label>
    </div>
  );
};

export const EditTodo = ({ todo }: { todo: Todo }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullTodo, setFullTodo] = useState<FullTodo | null>(null);

  const handleOpen = useCallback(() => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const details = await getTodoById(todo.id);
        if (!details) {
          toast.add({
            title: "Failed to load todo",
            description: "Could not fetch details. Please try again.",
            type: "error",
          });
          return;
        }
        setFullTodo(details);
        setOpen(true);
      } catch (err) {
        console.error("Failed to fetch todo details", { id: todo.id, err });
        toast.add({
          title: "Failed to load todo",
          description: "Could not fetch details. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    });
  }, [todo.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            onClick={handleOpen}
            size="icon-lg"
            className="rounded-md bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        }
      />
      {isLoading ? (
        <DialogContent className="sm:min-w-2xl min-w-xs">
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("todo.loadingDetails")}</p>
          </div>
        </DialogContent>
      ) : (
        fullTodo && <TodoForm setOpen={setOpen} data={fullTodo} />
      )}
    </Dialog>
  );
};

export const DeleteTodo = ({
  todo,
  onDelete,
}: {
  todo: Todo;
  onDelete?: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = useCallback(() => {
    startDeleteTransition(async () => {
      try {
        await deleteTodo(todo.id);
        onDelete?.();
        router.refresh();
        toast.add({
          title: "Todo deleted",
          description: "The task was removed from your list.",
          type: "success",
        });
      } catch (err) {
        console.error("Failed to delete todo", { id: todo.id, err });
        toast.add({
          title: "Delete failed",
          description: "Could not delete todo. Please try again.",
          type: "error",
        });
      }
    });
  }, [todo.id, onDelete, router]);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="icon-lg" className="rounded-md">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("message.deleteConfirm")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("message.deleteConfirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.deleting") : t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

