import { cookies } from "next/headers";
import NewMessage from "./_components/new-message";

export default async function NewMassagePage() {
  const cookieStore = await cookies();
  const value = cookieStore.get("user_profile")?.value;
  const credential = JSON.parse(String(value));
  const token = credential.access_token;
  return (
    <div className="w-full h-full flex items-center justify-center">
      <NewMessage token={token} />
    </div>
  );
}
