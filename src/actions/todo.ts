"use server";
import { PUBLISH_TODO, UPDATE_TODO_STATUS } from "@/graphql/mutations/todo";
import { GET_TODO_BY_USER } from "@/graphql/queries/todo";
import client from "@/lib/apollo";
import { Todo } from "@/lib/type";
import { currentUser } from "@clerk/nextjs/server";

export async function getTodosByUser(): Promise<Todo[]> {
    const user = await currentUser();

    if (!user) return [];

    const userEmail = user.emailAddresses[0]?.emailAddress;

    const { data } = await client.query<{ todos: Todo[] }>({
        query: GET_TODO_BY_USER,
        variables: { userEmail },
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