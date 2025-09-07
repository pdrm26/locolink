import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Send } from "lucide-react";
import { DataConnection } from "peerjs";

type Props = {
  connection: DataConnection | undefined;
  setMessages: Dispatch<SetStateAction<string[]>>;
  isConnected: boolean;
};

export function ChatFooter({ connection, setMessages, isConnected }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
  function sendMessage() {
    if (!currentMessage.trim() || !connection || !connection.open) return;
    connection.send(currentMessage);
    setMessages((prev) => [...prev, `You: ${currentMessage}`]);
    setCurrentMessage("");
    setTimeout(scrollToBottom, 100);
  }
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex gap-3">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isConnected ? "Type your message..." : "Connect to start chatting"
          }
          disabled={!isConnected}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !currentMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
