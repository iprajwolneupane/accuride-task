"use client";

import { createTodo, updateTodo } from "@/actions/todo";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { DEFAULT_LOCALE, LOCALE } from "@/constant";
import { TodoFormInput, TodoFormInterface, todoSchema } from "@/lib/schema";
import { FullTodo } from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface TodoFormProps {
  setOpen: (open: boolean) => void;
  data?: FullTodo;
}

export default function TodoForm({ setOpen, data }: TodoFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initialTranslations = useMemo(() => {
    return LOCALE.map(({ code }) => {
      if (code === DEFAULT_LOCALE) {
        return {
          locale: code,
          title: data?.title ?? "",
          description: data?.description ?? "",
        };
      }

      const saved = data?.localizations?.find((loc) => loc.locale === code);
      if (!saved) return null;

      return {
        locale: code,
        title: saved.title ?? "",
        description: saved.description ?? "",
      };
    }).filter(Boolean);
  }, [data]);

  const defaultValues: TodoFormInput = {
    date: data?.date ? new Date(data.date) : undefined,
    //@ts-expect-error 
    data: initialTranslations,
  };

  const form = useForm({
    //@ts-expect-error 
    resolver: zodResolver(todoSchema),
    defaultValues,
  });

  const { errors } = form.formState;

  const onSubmit = async (values: TodoFormInterface) => {
    setIsLoading(true);
    try {
      if (data) {
        await updateTodo(data.id, values);
        toast.add({
          title: "Todo updated",
          description: "Your task changes have been saved.",
          type: "success",
        });
      } else {
        await createTodo(values);
        toast.add({
          title: "Todo created",
          description: "New task has been added to your list.",
          type: "success",
        });
      }
      router.refresh();
      setOpen(false);
      form.reset();
    } catch (err) {
      console.error("Failed to save todo", { id: data?.id, err });
      toast.add({
        title: data ? "Couldn't update todo" : "Couldn't create todo",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDateSelect = useCallback(
    (field: { onChange: (val: Date) => void }) => (val: Date) => {
      field.onChange(val);
    },
    []
  );

  const localeErrorFlags = useMemo(
    () => LOCALE.map((_, idx) => Boolean(errors.data?.[idx])),
    [errors.data]
  );

  return (
    <DialogContent className="sm:min-w-2xl min-w-xs">
      <DialogHeader>
        <DialogTitle>{data ? t("todo.editTitle") : t("todo.addTitle")}</DialogTitle>
        <DialogDescription>
          {data
            ? t("todo.editDescription")
            : t("todo.addDescription")}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <p>{JSON.stringify(form.getValues())}</p>
          <Tabs defaultValue={DEFAULT_LOCALE}>
            <TabsList className="w-full">
              {LOCALE.map((locale, idx) => (
                <TabsTrigger value={locale.code} key={locale.code} className="relative">
                  {locale.name} {locale.isDefault && `(${t("todo.required")})`}
                  {localeErrorFlags[idx] && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-destructive inline-block" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {errors.data?.root?.message && (
              <p data-slot="form-message" className="text-destructive text-sm mt-2">
                {errors.data.root.message}
              </p>
            )}

            {LOCALE.map((locale, idx) => (
              <TabsContent className="space-y-4 mt-4" value={locale.code} key={locale.code}>
                <input
                  type="hidden"
                  {...form.register(`data.${idx}.locale`)}
                  value={locale.code}
                />

                <FormField
                  control={form.control}
                  name={`data.${idx}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("todo.fieldTitle")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder={t("todo.placeholderTitle")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`data.${idx}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("todo.fieldDescription")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          placeholder={t("todo.placeholderDescription")}
                        />
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
                <FormLabel>{t("todo.fieldDueDate")}</FormLabel>
                <FormControl>
                  <DatePicker
                    mode="single"
                    required
                    selected={field.value}
                    onSelect={onDateSelect(field)}
                    placeholder={t("todo.pickDueDate")}
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
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading
                ? data ? t("common.saving") : t("common.creating")
                : data ? t("common.saveChanges") : t("todo.add")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

