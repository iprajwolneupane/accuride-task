import { gql } from "@apollo/client";

export const PUBLISH_TODO = gql`
  mutation PublishTodo($id: ID!, $locales: [Locale!]) {
    publishTodo(where: { id: $id }, locales: $locales) {
      id
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo(
    $date: DateTime!
    $userEmail: String!
    $title: String!
    $description: String!
    $localizations: [TodoCreateLocalizationInput!]
  ) {
    createTodo(
      data: {
        date: $date
        userEmail: $userEmail
        isCompleted: false
        title: $title
        description: $description
        localizations: { create: $localizations }
      }
    ) {
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

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
    }
  }
`;

export const UNPUBLISH_TODO = gql`
  mutation UnpublishTodo($id: ID!) {
    unpublishTodo(where: { id: $id }) {
      id
    }
  }
`;