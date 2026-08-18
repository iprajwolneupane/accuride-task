import { gql } from "@apollo/client";

export const PUBLISH_TODO = gql`
  mutation PublishTodo($id: ID!) {
    publishTodo(where: { id: $id }) {
      id
    }
  }
`;

export const UPDATE_TODO_STATUS = gql`
  mutation UpdateTodoStatus($id: ID!, $isCompleted: Boolean!) {
    updateTodo(
      where: { id: $id }
      data: { isCompleted: $isCompleted }
    ) {
      id
      isCompleted
    }
  }
`;
