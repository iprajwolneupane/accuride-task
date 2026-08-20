"use client"
import { createTodo } from "@/actions/todo";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { LOCALE } from "@/constant";
import { TodoFormInterface, todoSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function TodoForm({ setOpen }: { setOpen: (open: boolean) => void }) {

    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(todoSchema),
    })
    const [isLoading, setIsLoading] = useState(false);

    const { errors } = form.formState;

    const onSubmit = async (values: TodoFormInterface) => {
        setIsLoading(true);
        try {
            await createTodo(values);
            router.refresh();
            setOpen(false);
            form.reset();
            toast.add({
                title: "Operation successful!",
                description: "Todo created successfully.",
                type: "success",
            })
        } catch (e) {
            toast.add({
                title: "Operation failed!",
                description: "Could not create Todo, try again.",
                type: "error",
            })
        } finally {
            setIsLoading(false);
        }
    }

    const onDateSelect = useCallback((field: { onChange: (val: Date) => void }) => (val: Date) => {
        field.onChange(val);
    }, []);

    const localeErrorFlags = useMemo(
        () => LOCALE.map((_, index) => !!errors.data?.[index]),
        [errors.data]
    );

    return (
        <DialogContent className="min-w-2xl">
            <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
                <DialogDescription>
                    Create a new task and add it to your todo list. You can update or delete it later.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <Tabs>
                        <TabsList className="w-full">
                            {LOCALE.map((locale, index) => (
                                <TabsTrigger value={locale.code} key={locale.code} className="relative">
                                    {locale.name} {locale.isDefault && `(Required)`}
                                    {localeErrorFlags[index] && (
                                        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-destructive inline-block" />
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {errors.data?.root?.message && (
                            <p data-slot="form-message" className={cn('text-destructive text-sm')}>
                                {errors.data.root.message}
                            </p>
                        )}
                        {LOCALE.map((locale, index) => (
                            <TabsContent className={"space-y-4 mt-4"} value={locale.code} key={locale.code}>
                                <input
                                    type="hidden"
                                    {...form.register(`data.${index}.locale`)}
                                    value={locale.code}
                                />
                                <FormField
                                    control={form.control}
                                    name={`data.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value ?? ""} placeholder="e.g. Update your user documentation." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`data.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} value={field.value ?? ""} placeholder="Provide details about your todo." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        mode="single"
                                        required
                                        selected={field.value}
                                        onSelect={onDateSelect(field)}
                                        placeholder="Due Date"
                                        disabled={{ before: new Date() }}
                                        captionLayout="dropdown"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="destructive" size="lg">Cancel</Button>
                        <Button type="submit" disabled={isLoading} size={"lg"}>{isLoading ? "Creating..." : "Create Todo"}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}