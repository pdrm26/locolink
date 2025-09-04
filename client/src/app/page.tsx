"use client";

import { DataConnection } from "peerjs";
import { useRef, useState } from "react";
import { Instructions } from "@/components/Instructions";
import { Header } from "@/components/Header";
import { Chat } from "@/components/Chat";
import { Connection } from "@/components/Connection";

export default function Home() {
  const [connection, setConnection] = useState<DataConnection | undefined>();
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [friendPeerID, setFriendPeerID] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        <div className="grid lg:grid-cols-3 gap-6">
          <Connection
            setFriendPeerID={setFriendPeerID}
            friendPeerID={friendPeerID}
            setConnection={setConnection}
            setIsConnected={setIsConnected}
            isConnected={isConnected}
            setMessages={setMessages}
            messagesEndRef={messagesEndRef}
          />
          <Chat
            isConnected={isConnected}
            friendPeerID={friendPeerID}
            messagesEndRef={messagesEndRef}
            messages={messages}
            connection={connection}
            setMessages={setMessages}
          />
        </div>
        <Instructions />
      </div>
    </div>
  );
}
