import z from "zod";

export const messageSchemaForm = z.object({
  message: z.string().min(1, "Email is required..."),
});

export type MessageForm = z.infer<typeof messageSchemaForm>;
