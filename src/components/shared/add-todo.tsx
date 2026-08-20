"use client";
import TodoForm from "@/components/shared/todo-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const AddTodo = () => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button size={"lg"}>
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Todo</span>
                </Button>
            } />
            <TodoForm setOpen={setOpen} />
        </Dialog>
    )
}

export default AddTodo;