export type AuthFormState = {
  status?: string;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    _form?: string[];
  };
};

export type ChatSession = {
  id: string;
  title: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  chat_sessions: ChatSession[];
};
