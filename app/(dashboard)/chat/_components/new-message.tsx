"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SendHorizonal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "@/types/auth";

export default function NewMessage({ token }: { token: string }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_APP_URL}chat-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: null,
            message: input,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed create session");

      const result = await res.json();
      const newChat = result.data;
      const currentStateUser = useAuthStore.getState().user;
      const newChatSession = [
        newChat,
        ...(currentStateUser?.chat_sessions ?? []),
      ];
      const newStateUser = {
        ...currentStateUser,
        chat_sessions: newChatSession,
      } as User;

      useAuthStore.getState().setUser(newStateUser);
      router.push(`/chat/${result.data.id}`);
    } catch (err: any) {
      toast.error("Gagal", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Halo ada yang bisa saya bantu?
        </h1>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Send a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full resize-none rounded-2xl border border-slate-600 px-4 py-3 pr-12 text-sm"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-teal-500 text-white"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <SendHorizonal size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
