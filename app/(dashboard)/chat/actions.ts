"use server";

import { environment } from "@/configs/environment";
import { INITIAL_STATE_NEW_MESSAGE_FORM } from "@/constants/auth-constant";
import { NewMessageState } from "@/types/message";
import { messageSchemaForm } from "@/validations/new-chat-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function sendNewMessage(
  prevState: NewMessageState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_NEW_MESSAGE_FORM;
  }
  const validateFields = messageSchemaForm.safeParse({
    message: formData.get("message"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }
  const cookieStore = await cookies();
  const value = cookieStore.get("user_profile")?.value;
  const credential = JSON.parse(String(value));
  const token = credential.access_token;
  const response = await fetch(`${environment.CHAT_APP_URL}chat-session`, {
    method: "POST",
    body: JSON.stringify({
      title: null,
      message: formData.get("message"),
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [data.message],
      },
    };
  }

  const result = await response.json();
  revalidatePath("/", "layout");
  redirect(`/chat/${result.data.id}`);
}
