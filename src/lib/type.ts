export type Todo = {
  id: string;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  userEmail: string;
};

export type TodoLocalization = {
  locale: string;
  title: string;
  description: string;
  __typename?: string;
};

export type FullTodo = {
  id: string;
  date: string;
  isCompleted: boolean;
  userEmail: string;
  title: string;
  description: string;
  localizations: TodoLocalization[];
  __typename?: string;
};

export type TodoWhereInput = {
  userEmail: string;
  date_gte?: Date;
  date_lte?: Date;
};