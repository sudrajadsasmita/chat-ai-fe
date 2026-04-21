"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookiesStore = await cookies();
  try {
    cookiesStore.delete("user_profile");
    revalidatePath("/", "layout");
  } catch (e) {
    console.error("Error signing out:", e);
  }
  redirect("/login");
}
