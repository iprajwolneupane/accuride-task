"use client";

import { getTodosByUser } from "@/actions/todo";
import TodoCard from "@/components/shared/todo-card";
import { Button } from "@/components/ui/button";
import { Todo } from "@/lib/type";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [hasMore, setHasMore] = useState(initialTodos.length >= PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [prevInitialTodos, setPrevInitialTodos] = useState(initialTodos);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Sync state when server-side initial todos change (e.g. on navigation / filter)
  if (initialTodos !== prevInitialTodos) {
    setPrevInitialTodos(initialTodos);
    setTodos(initialTodos);
    setHasMore(initialTodos.length >= PAGE_SIZE);
    setHasLoadError(false);
  }

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setHasLoadError(false);

    try {
      const nextPage = await getTodosByUser(
        undefined,
        undefined,
        todos.length,
        PAGE_SIZE
      );

      setTodos((current) => [...current, ...nextPage]);
      setHasMore(nextPage.length === PAGE_SIZE);
    } catch (err) {
      console.error("Unable to load the next todo page", err);
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, todos.length]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading && !hasLoadError) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading, hasLoadError]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>

      {hasMore && !hasLoadError && (
        <div ref={observerRef} className="flex justify-center items-center py-6 w-full">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        </div>
      )}

      {hasLoadError && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-sm text-destructive">{t("todo.loadMoreError")}</p>
          <Button variant="outline" size="sm" onClick={loadMore}>
            {t("todo.retryLoading")}
          </Button>
        </div>
      )}
    </div>
  );
}

