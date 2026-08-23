"use client";

import AddTodo from "@/components/shared/add-todo";
import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NoTodo() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-3 w-full h-[calc(100vh-180px)] items-center justify-center text-center px-4">
            <div className="rounded-full bg-muted p-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold text-lg">{t("todo.noTitle")}</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    {t("todo.noDescription")}
                </p>
            </div>
            <div className="mt-2">
                <AddTodo />
            </div>
        </div>
    );
}