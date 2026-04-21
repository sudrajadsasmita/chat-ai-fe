import { User } from "@/types/auth";

export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_MESSAGE_FORM = {
  message: "",
};

export const INITIAL_STATE_LOGIN_FORM = {
  status: "idle",
  message: "",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

export const INITIAL_STATE_NEW_MESSAGE_FORM = {
  status: "idle",
  message: "",
  errors: {
    message: [],
    _form: [],
  },
};

export const INITIAL_STATE_USER: User = {
  id: "",
  name: "",
  email: "",
  chat_sessions: [],
};

export const INITIAL_CREATE_USER_FORM = {
  email: "",
  password: "",
  name: "",
  role: "",
  avatar_url: "",
};

export const INITIAL_STATE_CREATE_USER_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    name: [],
    role: [],
    avatar_url: [],
    _form: [],
  },
};
