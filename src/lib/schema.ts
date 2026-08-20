import { z } from "zod";

const todoItemSchema = z.object({
    title: z
        .string("Title is required.")
        .trim()
        .min(2, "Title must be at least 2 characters long.")
        .max(100, "Title must be at most 100 characters long."),

    description: z
        .string("Description is required.")
        .trim()
        .min(2, "Description must be at least 2 characters long.")
        .max(700, "Description must be at most 700 characters long."),

    locale: z.enum(["en", "fr_FR"], {
        error: "Locale is required.",
    }),
});

export const todoSchema = z.object({
    date: z.date({
        error: "Due date is required.",
    }),

    data: z
        .array(todoItemSchema.partial())
        .transform((items) =>
            items.filter((item) => {
                const title = item.title?.trim();
                const description = item.description?.trim();
                return !!title || !!description;
            })
        )
        .pipe(
            z
                .array(todoItemSchema)
                .min(1, "You must add at least one todo.")
        )
        .superRefine((items, ctx) => {
            const hasEnglish = items.some((item) => item.locale === "en");
            if (!hasEnglish) {
                ctx.addIssue({
                    code: "custom",
                    message: "English (en) is required.",
                    path: ["root"],
                });
            }
        }),
});

export type TodoFormInterface = z.infer<typeof todoSchema>;