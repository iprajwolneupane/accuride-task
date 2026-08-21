export type Todo = {
    id: string;
    title: string;
    description: string;
    date: string;
    isCompleted: boolean;
    userEmail: string;
};

export type FullTodo = {
    id: string
    date: string
    isCompleted: boolean
    userEmail: string
    title: string
    description: string
    localizations: {
        locale: string
        title: string
        description: string
        __typename: string
    }[]
    __typename: string
}