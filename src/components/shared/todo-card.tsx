"use client";
import { updateTodoStatus } from "@/actions/todo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { Todo } from "@/lib/type";
import { cn, formatDate } from "@/lib/utils";
import { Calendar, Edit2, Trash2, TriangleAlert } from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";

export default function TodoCard({ todo }: { todo: Todo }) {

    const [isPending, startTransition] = useTransition();
    const [optimisticCompleted, setOptimisticCompleted] = useState(todo.isCompleted);

    const isOverdue = useMemo(() => {
        return (new Date(todo.date).getTime() < Date.now()) && !optimisticCompleted
    }, [todo.date, optimisticCompleted])

    const updateComplete = useCallback(() => {
        const newValue = !optimisticCompleted;
        setOptimisticCompleted(newValue);
        startTransition(async () => {
            try {
                await updateTodoStatus(todo.id, !optimisticCompleted);
            } catch (error) {
                toast.add({
                    title: "Operation failed!",
                    description: "Could not update Todo, try again.",
                    type: "error",
                })
                setOptimisticCompleted(optimisticCompleted);
            }
        });
    }, [optimisticCompleted, todo.id]);

    return (
        <div className={cn("w-full border rounded-lg p-4 flex flex-col gap-2 justify-between group hover:shadow-sm", optimisticCompleted && "opacity-70 hover:opacity-90")}>
            <div className="flex gap-6 items-start justify-between">
                <h2 className={cn("font-semibold max-h-12 line-clamp-2", optimisticCompleted && "line-through")}>{todo.title}</h2>
                <div className=" group-hover:opacity-100 flex gap-1 opacity-0 transition-all duration-300 ease-in-out">
                    <Button size={"icon-lg"} className="rounded-md bg-primary-foreground text-primary/70 hover:bg-primary/20 hover:text-primary">
                        <Edit2 />
                    </Button>
                    <Button variant={"destructive"} size={"icon-lg"} className={"rounded-md"}>
                        <Trash2 />
                    </Button>
                </div>
            </div>
            <p className="text-sm max-h-21 text-gray-700 line-clamp-4">{todo.description}</p>
            <div className="h-px w-full bg-border" />
            <div className="flex gap-1 justify-between mt-1">
                <div className="space-x-1">
                    <Badge variant={"outline"} className="rounded-sm text-gray-600">
                        <Calendar className="mr-1" />
                        {formatDate(todo.date)}
                    </Badge>
                    {
                        isOverdue && <Badge variant={"destructive"} className="rounded-sm">
                            <TriangleAlert className="mr-1" />
                            Overdue
                        </Badge>
                    }
                </div>
                <div className="flex gap-1 items-center">
                    <Checkbox className="h-4.5 w-4.5" id={`box-${todo.id}`} checked={optimisticCompleted} onCheckedChange={updateComplete} disabled={isPending} />
                    <label htmlFor={`box-${todo.id}`} className="text-sm text-gray-600">{isPending ? "Updating..." : "Mark Done"}</label>
                </div>
            </div>
        </div>
    )
}