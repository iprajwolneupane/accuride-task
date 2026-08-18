import { gql } from "@apollo/client";

export const GET_TODO_BY_USER = gql`
 query GetTodosByUser($userEmail: String!) {
  todos(where:{userEmail:$userEmail}) {
    id
    title
    description
    date
    isCompleted
    userEmail
  }
 }
`;