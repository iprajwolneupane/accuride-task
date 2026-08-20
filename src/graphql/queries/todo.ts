import { gql } from "@apollo/client";

export const GET_TODO_BY_USER = gql`
 query GetTodosByUser($userEmail: String! $locale: Locale!) {
  todos(where:{userEmail:$userEmail}  locales: [$locale]) {
    id
    title
    description
    date
    isCompleted
    userEmail
  }
 }
`;