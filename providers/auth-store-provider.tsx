"use client";
import { environment } from "@/configs/environment";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "@/types/auth";
import { ReactNode, useEffect } from "react";

export default function AuthStoreProvider({
  children,
  user,
  token,
}: {
  children: ReactNode;
  user: User;
  token: string;
}) {
  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_CHAT_APP_URL}user/show/${user.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (!res.ok) {
            // ❗ handle error dari server
            console.error("Failed fetch user:", res.status);

            // optional: logout / reset state
            useAuthStore.getState().setUser(null);

            return;
          }

          const result = await res.json();
          const sortedSessions = result.data.chat_sessions.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );

          const newUser = {
            ...result.data,
            chat_sessions: sortedSessions,
          };
          console.log(newUser);
          useAuthStore.getState().setUser(result.data);
        } catch (error) {
          // ❗ handle network error
          console.error("Network error:", error);

          // optional: reset user
          useAuthStore.getState().setUser(null);
        }
      };

      fetchUser();
    }
  }, []);

  return <>{children}</>;
}
