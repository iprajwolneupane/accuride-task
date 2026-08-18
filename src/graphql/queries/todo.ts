import { gql } from "@apollo/client";

export const GET_ALL_TODOS = gql`
  query GetAllTodos {
    todos {
      id
      title
      description
      date
      isCompleted
      userEmail
    }
  }
`;
