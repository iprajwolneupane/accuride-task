"use server";
import { DEFAULT_LOCALE } from "@/constant";
import { CREATE_TODO, DELETE_TODO, PUBLISH_TODO, UNPUBLISH_TODO, UPDATE_TODO, UPDATE_TODO_STATUS } from "@/graphql/mutations/todo";
import { GET_TODO_BY_ID, GET_TODO_BY_USER } from "@/graphql/queries/todo";
import client from "@/lib/apollo";
import { TodoFormInterface } from "@/lib/schema";
import { FullTodo, Todo } from "@/lib/type";
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

export async function getTodoById(id: string): Promise<FullTodo | null> {
    const user = await currentUser();

    if (!user) return null;

    try {
        const { data } = await client.query<{ todo: FullTodo }>({
            query: GET_TODO_BY_ID,
            variables: { id },
            fetchPolicy: "no-cache",
        });

        return data?.todo ?? null;
    } catch (error: any) {
        console.error("Get todo error:", error.graphQLErrors ?? error.networkError?.result ?? error);
        return null;
    }
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

    const allLocales = values.data.map((item) => item.locale);

    await client.mutate({
        mutation: PUBLISH_TODO,
        variables: { id: data.createTodo.id, locales: allLocales },
    });

    revalidatePath("/");

    return data.createTodo;
}

export async function updateTodo(id: string, values: TodoFormInterface) {
    const baseLocale = values.data.find((item) => item.locale === DEFAULT_LOCALE);

    if (!baseLocale) throw new Error(`Missing required "${DEFAULT_LOCALE}" locale entry`);

    const localizations = values.data
        .filter((item) => item.locale !== DEFAULT_LOCALE)
        .map(({ title, description, locale }) => ({
            locale,
            update: { title, description },
            create: { title, description },
        }));

    const { data } = await client.mutate<{ updateTodo: { id: string } }>({
        mutation: UPDATE_TODO,
        variables: {
            id,
            date: values.date,
            title: baseLocale.title,
            description: baseLocale.description,
            localizations,
        },
    });

    if (!data?.updateTodo?.id) throw new Error("Failed to update todo");

    const allLocales = values.data.map((item) => item.locale);

    await client.mutate({
        mutation: PUBLISH_TODO,
        variables: { id, locales: allLocales },
    });

    revalidatePath("/");

    return data.updateTodo;
}

export async function deleteTodo(id: string) {
    try {
        await client.mutate({
            mutation: UNPUBLISH_TODO,
            variables: { id },
        });
        await client.mutate({
            mutation: DELETE_TODO,
            variables: { id },
        });
        revalidatePath("/");
    } catch (error: any) {
        console.error("Delete error:", error.graphQLErrors ?? error.networkError?.result ?? error);
        throw new Error("Failed to delete todo");
    }
}