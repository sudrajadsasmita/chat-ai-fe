"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import ChatBubble from "./chat-bubble";
import { SendHorizonal } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

const getChatSession = async (
  sessionId: string,
  token: string,
): Promise<ChatSession> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_APP_URL}chat-session/show/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch");

  const json = await res.json();
  return json.data;
};

const sendMessage = async ({
  sessionId,
  content,
  token,
}: {
  sessionId: string;
  content: string;
  token: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_APP_URL}chat-message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        content,
      }),
    },
  );

  if (!res.ok) throw new Error("Failed to send");

  return res.json();
};

export default function MessageSession({ token }: { token: string }) {
  const params = useParams<{ sessionId: string }>();
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chat-session", params.sessionId],
    queryFn: () => getChatSession(params.sessionId, token),
    enabled: !!params.sessionId,
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      startStream();
    },
  });

  // ✅ FIX 1: SAFE STREAM (ANTI DOUBLE + AUTH)
  const startStream = () => {
    if (isStreaming) return;

    setStreamText("");
    setIsStreaming(true);

    const url = `${process.env.NEXT_PUBLIC_CHAT_APP_URL}chat-message/${params.sessionId}/stream?token=${token}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      if (event.data === "[DONE]") {
        es.close();
        setIsStreaming(false);

        queryClient.invalidateQueries({
          queryKey: ["chat-session", params.sessionId],
        });

        return;
      }

      setStreamText((prev) => prev + event.data);
    };

    es.onerror = () => {
      es.close();
      setIsStreaming(false);
    };
  };

  // ✅ FIX 2: HANDLE SEND (OPTIMISTIC + SAFE)
  const handleSend = () => {
    if (!input.trim() || isStreaming) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    queryClient.setQueryData(
      ["chat-session", params.sessionId],
      (oldData: ChatSession | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          messages: [...oldData.messages, newMessage],
        };
      },
    );

    mutation.mutate({
      sessionId: params.sessionId,
      content: input,
      token,
    });

    setInput("");
  };

  // ✅ FIX 3: AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, streamText]);

  // ✅ FIX 4: CLEANUP (WAJIB)
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const startedRef = useRef(false);

  useEffect(() => {
    if (!data?.messages?.length) return;

    const lastMessage = data.messages[data.messages.length - 1];

    // ✅ hanya jalan kalau terakhir user (belum ada jawaban AI)
    if (lastMessage.role !== "user") return;

    // ✅ cegah double stream
    if (startedRef.current) return;

    startedRef.current = true;

    startStream();
  }, [data]);

  if (isLoading || !data) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b border-slate-700 px-4 py-3">
        <h1 className="font-semibold">{data.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {data.messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}

        {isStreaming && <ChatBubble role="assistant" content={streamText} />}

        {/* ✅ anchor scroll */}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-700 p-4">
        <div className="relative max-w-2xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
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
            disabled={isStreaming || mutation.isPending}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-teal-500 text-white"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
