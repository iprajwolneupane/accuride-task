"use server";

import { DEFAULT_LOCALE } from "@/constant";
import {
  CREATE_TODO,
  DELETE_TODO,
  PUBLISH_TODO,
  UNPUBLISH_TODO,
  UPDATE_TODO,
  UPDATE_TODO_STATUS,
} from "@/graphql/mutations/todo";
import { GET_TODO_BY_ID, GET_TODO_BY_USER } from "@/graphql/queries/todo";
import client from "@/lib/apollo";
import { TodoFormInterface } from "@/lib/schema";
import { FullTodo, Todo, TodoWhereInput } from "@/lib/type";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


async function getAuthContext() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  return { user, email };
}

async function requireAuth() {
  const { user, email } = await getAuthContext();
  if (!user || !email) {
    throw new Error("Unauthorized: authentication required");
  }
  return { user, email };
}

export async function getTodosByUser(
  from?: Date,
  to?: Date,
  skip = 0,
  first = 12
): Promise<Todo[]> {
  const { email } = await getAuthContext();
  if (!email) return [];

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? DEFAULT_LOCALE;

  const hasDateRange = Boolean(from && to);
  const where: TodoWhereInput = { userEmail: email };

  if (hasDateRange) {
    where.date_gte = from;
    where.date_lte = to;
  }

  const { data } = await client.query<{ todos: Todo[] }>({
    query: GET_TODO_BY_USER,
    variables: {
      where,
      locale,
      first: hasDateRange ? 1000 : first,
      skip: hasDateRange ? 0 : skip,
    },
    fetchPolicy: "no-cache",
  });

  return data?.todos ?? [];
}

export async function getTodoById(id: string): Promise<FullTodo | null> {
  const { email } = await getAuthContext();
  if (!email) return null;

  try {
    const { data } = await client.query<{ todo: FullTodo | null }>({
      query: GET_TODO_BY_ID,
      variables: { id },
      fetchPolicy: "no-cache",
    });

    const todo = data?.todo;
    if (!todo || todo.userEmail !== email) {
      return null;
    }

    return todo;
  } catch (err) {
    console.error("Failed to load todo by id", { id, err });
    return null;
  }
}

export async function updateTodoStatus(id: string, isCompleted: boolean) {
  const { email } = await requireAuth();

  const existing = await getTodoById(id);
  if (!existing || existing.userEmail !== email) {
    throw new Error("Todo not found or unauthorized");
  }

  await client.mutate({
    mutation: UPDATE_TODO_STATUS,
    variables: { id, isCompleted },
  });

  await client.mutate({
    mutation: PUBLISH_TODO,
    variables: { id },
  });

  revalidatePath("/");
}

export async function createTodo(values: TodoFormInterface) {
  const { email } = await requireAuth();

  const baseLocale = values.data.find((item) => item.locale === DEFAULT_LOCALE);
  if (!baseLocale) {
    throw new Error(`Missing required "${DEFAULT_LOCALE}" locale entry`);
  }

  const localizations = values.data
    .filter((item) => item.locale !== DEFAULT_LOCALE)
    .map(({ title, description, locale }) => ({
      locale,
      data: { title, description },
    }));

  const { data } = await client.mutate<{ createTodo: { id: string } }>({
    mutation: CREATE_TODO,
    variables: {
      date: values.date,
      userEmail: email,
      title: baseLocale.title,
      description: baseLocale.description,
      localizations,
    },
  });

  const todoId = data?.createTodo?.id;
  if (!todoId) throw new Error("Failed to create todo");

  const locales = values.data.map((item) => item.locale);
  await client.mutate({
    mutation: PUBLISH_TODO,
    variables: { id: todoId, locales },
  });

  revalidatePath("/");
  return data.createTodo;
}

export async function updateTodo(id: string, values: TodoFormInterface) {
  const { email } = await requireAuth();

  const existing = await getTodoById(id);
  if (!existing || existing.userEmail !== email) {
    throw new Error("Todo not found or unauthorized");
  }

  const baseLocale = values.data.find((item) => item.locale === DEFAULT_LOCALE);
  if (!baseLocale) {
    throw new Error(`Missing required "${DEFAULT_LOCALE}" locale entry`);
  }

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

  const locales = values.data.map((item) => item.locale);
  await client.mutate({
    mutation: PUBLISH_TODO,
    variables: { id, locales },
  });

  revalidatePath("/");
  return data.updateTodo;
}

export async function deleteTodo(id: string) {
  const { email } = await requireAuth();

  const existing = await getTodoById(id);
  if (!existing || existing.userEmail !== email) {
    throw new Error("Todo not found or unauthorized");
  }

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
  } catch (err) {
    console.error("Failed to delete todo", { id, err });
    throw new Error("Failed to delete todo");
  }
}
