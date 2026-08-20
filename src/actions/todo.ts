"use server";
import { DEFAULT_LOCALE } from "@/constant";
import { CREATE_TODO, PUBLISH_TODO, UPDATE_TODO_STATUS } from "@/graphql/mutations/todo";
import { GET_TODO_BY_USER } from "@/graphql/queries/todo";
import client from "@/lib/apollo";
import { TodoFormInterface } from "@/lib/schema";
import { Todo } from "@/lib/type";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getTodosByUser(): Promise<Todo[]> {
    const user = await currentUser();

    if (!user) return [];

    const userEmail = user.emailAddresses[0]?.emailAddress;
    const cookieStore = await cookies();
    const locale = cookieStore.get("locale")?.value ?? DEFAULT_LOCALE;

    const { data } = await client.query<{ todos: Todo[] }>({
        query: GET_TODO_BY_USER,
        variables: { userEmail, locale: locale },
        fetchPolicy: "no-cache",
    });


    return data?.todos ?? [];
}

export async function updateTodoStatus(id: string, isCompleted: boolean) {
    await client.mutate({
        mutation: UPDATE_TODO_STATUS,
        variables: { id, isCompleted },
    });
    await client.mutate({
        mutation: PUBLISH_TODO,
        variables: { id },
    });
}

export async function createTodo(values: TodoFormInterface) {
    const user = await currentUser();

    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const baseLocale = values.data.find((item) => item.locale === DEFAULT_LOCALE);

    if (!baseLocale) throw new Error(`Missing required "${DEFAULT_LOCALE}" locale entry`);

    const localizations = values.data
        .filter((item) => item.locale !== DEFAULT_LOCALE)
        .map(({ title, description, locale }) => ({ data: { title, description }, locale }));

    const { data } = await client.mutate<{ createTodo: { id: string } }>({
        mutation: CREATE_TODO,
        variables: {
            date: values.date,
            userEmail,
            title: baseLocale.title,
            description: baseLocale.description,
            localizations,
        },
    });

    if (!data?.createTodo?.id) throw new Error("Failed to create todo");

    await client.mutate({
        mutation: PUBLISH_TODO,
        variables: { id: data.createTodo.id },
    });

    revalidatePath("/");
    client.clearStore();

    return data.createTodo;
}