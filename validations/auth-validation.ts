import z from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchemaForm = z.object({
  email: z
    .string()
    .min(1, "Email is required...")
    .regex(emailRegex, "Please enter a valid email address"),
  password: z.string().min(1, "Password is required..."),
});

export const registerSchemaForm = z.object({
  email: z
    .string()
    .min(1, "Email is required...")
    .regex(emailRegex, "Please enter a valid email address"),
  password: z.string().min(1, "Password is required..."),
  name: z.string().min(1, "Email is required..."),
});

export type RegisterForm = z.infer<typeof registerSchemaForm>;

export type LoginForm = z.infer<typeof loginSchemaForm>;
