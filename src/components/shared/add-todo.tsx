"use client";
import TodoForm from "@/components/shared/todo-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AddTodo() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg">
            <PlusIcon className="h-4 w-4" />
            <span>{t("todo.add")}</span>
          </Button>
        }
      />
      <TodoForm setOpen={setOpen} />
    </Dialog>
  );
}
