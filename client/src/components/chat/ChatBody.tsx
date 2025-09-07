import { Users } from "lucide-react";
import { RefObject } from "react";

export function ChatBody({
  messages,
  messagesEndRef,
}: {
  messages: string[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isOwnMessage = msg.startsWith("You:");
          const messageText = msg.replace(/^(You:|Friend:)\s*/, "");

          return (
            <div
              key={index}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-200 text-gray-800 rounded-bl-md"
                }`}
              >
                <p className="text-sm">{messageText}</p>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
