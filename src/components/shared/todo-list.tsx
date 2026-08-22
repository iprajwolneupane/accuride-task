"use client";

import { getTodosByUser } from "@/actions/todo";
import TodoCard from "@/components/shared/todo-card";
import { Todo } from "@/lib/type";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [hasMore, setHasMore] = useState(initialTodos.length >= PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setTodos(initialTodos);
        setHasMore(initialTodos.length >= PAGE_SIZE);
    }, [initialTodos]);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const nextTodos = await getTodosByUser(undefined, undefined, todos.length, PAGE_SIZE);
            if (nextTodos.length < PAGE_SIZE) {
                setHasMore(false);
            }
            setTodos((prev) => [...prev, ...nextTodos]);
        } catch {
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, todos.length]);

    useEffect(() => {
        const target = observerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [loadMore, hasMore, isLoading]);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {todos.map((todo) => (
                    <TodoCard key={todo.id} todo={todo} />
                ))}
            </div>

            {hasMore && (
                <div ref={observerRef} className="flex justify-center items-center py-6 w-full">
                    {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
                </div>
            )}
        </div>
    );
}
