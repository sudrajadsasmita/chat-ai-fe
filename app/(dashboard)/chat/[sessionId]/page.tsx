import { cookies } from "next/headers";
import MessageSession from "./_components/message-session";

export default async function MassageSessionPage() {
  const cookieStore = await cookies();
  const value = cookieStore.get("user_profile")?.value;
  const credential = JSON.parse(String(value));
  const token = credential.access_token;
  return <MessageSession token={token} />;
}
