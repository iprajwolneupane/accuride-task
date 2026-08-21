import { LOCALE } from "@/constant";
import { gql } from "@apollo/client";

const localeCodes = LOCALE.map((l) => l.code);

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

export const GET_TODO_BY_ID = gql`
  query GetTodoById($id: ID!) {
    todo(where: { id: $id }, locales: [${localeCodes}]) {
      id
      date
      isCompleted
      userEmail
      title
      description
      localizations {
        locale
        title
        description
      }
    }
  }
`;