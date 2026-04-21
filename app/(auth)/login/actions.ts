"use server";

import { environment } from "@/configs/environment";
import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { AuthFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: AuthFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }
  const validateFields = loginSchemaForm.safeParse({
    email: formData?.get("email"),
    password: formData?.get("password"),
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
  const response = await fetch(`${environment.CHAT_APP_URL}auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
    headers: {
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

  const data = await response.json();

  if (data) {
    const cookieStore = await cookies();
    cookieStore.set("user_profile", JSON.stringify(data), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1,
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}
