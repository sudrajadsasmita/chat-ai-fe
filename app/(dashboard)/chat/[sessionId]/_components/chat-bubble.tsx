"use client";

import ReactMarkdown from "react-markdown";

type ChatBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="relative max-w-xl px-2 py-1">
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser ? "bg-teal-500 text-white" : "bg-slate-800 text-white"
          }`}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc ml-5 mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-5 mb-2">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        <div
          className={`absolute bottom-0 w-3 h-3 ${
            isUser
              ? "right-0 translate-x-1/2 bg-teal-500"
              : "left-0 -translate-x-1/2 bg-slate-800"
          }`}
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
      </div>
    </div>
  );
}
