export type NewMessageState = {
  status?: string;
  message?: string;
  errors?: {
    message?: string[];
    _form?: string[];
  };
};
