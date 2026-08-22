import { LOCALE } from "@/constant";
import { gql } from "@apollo/client";

const localeCodes = LOCALE.map((l) => l.code);

export const GET_TODO_BY_USER = gql`
  query GetTodosByUser(
    $where: TodoWhereInput!
    $locale: Locale!
    $first: Int!
    $skip: Int
  ) {
    todos(
      where: $where
      locales: [$locale]
      first: $first
      skip: $skip
      orderBy: date_DESC
    ) {
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