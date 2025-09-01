"use client";

import Peer, { DataConnection } from "peerjs";
import { useRef, useState } from "react";
import { Send, Users, Wifi, WifiOff, Copy, Check } from "lucide-react";

export default function Home() {
  const [peer, setPeer] = useState<Peer>();
  const [connection, setConnection] = useState<DataConnection | undefined>();
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [myPeerID, setMyPeerID] = useState("");
  const [friendPeerID, setFriendPeerID] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function join() {
    setConnectionStatus("connecting");

    const peerID = Math.floor(Math.random() * 2 ** 18)
      .toString(36)
      .padStart(4, "0");

    const newPeer = new Peer(peerID, {
      host: "localhost",
      port: 9000,
      path: "/",
    });
    setPeer(newPeer);

    // when connection is created, handle the event
    newPeer.on("open", function (id) {
      console.log("Connected to Signaling Server ID : " + id);
      setMyPeerID(id);
      setIsJoined(true);
      setConnectionStatus("connected");
    });

    newPeer.on("connection", function (c) {
      const conn = c;
      console.log("New connection established");
      setFriendPeerID(c.peer);
      setConnection(conn);
      setIsConnected(true);

      conn.on("open", function () {
        // Receive messages - receiver side
        conn.on("data", function (data) {
          console.log("Received in connection: ", data);
          setMessages((prev) => [...prev, `Friend: ${data}`]);
          setTimeout(scrollToBottom, 100);
        });
      });

      conn.on("close", function () {
        setIsConnected(false);
        setConnection(undefined);
      });
    });

    newPeer.on("error", function (err) {
      console.error("Peer error:", err);
      setConnectionStatus("disconnected");
    });
  }

  function connect() {
    if (!peer || !friendPeerID.trim()) return;

    setConnectionStatus("connecting");
    const conn = peer.connect(friendPeerID.trim());
    setConnection(conn);

    // open event called when connection gets created
    conn?.on("open", function () {
      setIsConnected(true);
      setConnectionStatus("connected");

      // Receive messages - sender side
      conn.on("data", function (data) {
        setMessages((prev) => [...prev, `Friend: ${data as string}`]);
        setTimeout(scrollToBottom, 100);
      });
    });

    conn?.on("close", function () {
      setIsConnected(false);
      setConnection(undefined);
      setConnectionStatus("disconnected");
    });

    conn?.on("error", function (err) {
      console.error("Connection error:", err);
      setConnectionStatus("disconnected");
    });
  }

  function sendMessage() {
    if (!currentMessage.trim() || !connection || !connection.open) return;
    connection.send(currentMessage);
    setMessages((prev) => [...prev, `You: ${currentMessage}`]);
    setCurrentMessage("");
    setTimeout(scrollToBottom, 100);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function copyPeerID() {
    navigator.clipboard.writeText(myPeerID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">WebRTC Chat</h1>
          <p className="text-gray-600">Peer-to-peer messaging with WebRTC</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Connection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {/* Status Indicator */}
              <div className="flex items-center justify-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    connectionStatus === "connected"
                      ? "bg-green-100 text-green-700"
                      : connectionStatus === "connecting"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {connectionStatus === "connected" ? (
                    <Wifi className="w-4 h-4" />
                  ) : (
                    <WifiOff className="w-4 h-4" />
                  )}
                  {connectionStatus === "connected"
                    ? "Connected"
                    : connectionStatus === "connecting"
                    ? "Connecting..."
                    : "Disconnected"}
                </div>
              </div>

              {/* Join Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Start Chat
                </h3>

                {!isJoined ? (
                  <button
                    onClick={join}
                    disabled={connectionStatus === "connecting"}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                  >
                    {connectionStatus === "connecting"
                      ? "Joining..."
                      : "Join Network"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your ID
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded-lg border">
                          {myPeerID}
                        </code>
                        <button
                          onClick={copyPeerID}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copy ID"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Friend&#39;s Peer ID
                      </label>
                      <input
                        type="text"
                        value={friendPeerID}
                        onChange={(e) => setFriendPeerID(e.target.value)}
                        placeholder="Enter friend's ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        onClick={connect}
                        disabled={
                          !friendPeerID.trim() ||
                          connectionStatus === "connecting"
                        }
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200"
                      >
                        Connect to Friend
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Connection Info */}
              {isConnected && (
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>Connected to:</strong> {friendPeerID}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isConnected ? `Chat with ${friendPeerID}` : "Chat"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isConnected
                    ? "Connected and ready to chat!"
                    : "Connect to start messaging"}
                </p>
              </div>

              {/* Messages Area */}
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

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      isConnected
                        ? "Type your message..."
                        : "Connect to start chatting"
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
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How to use:
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p>
                Click <strong>Join Network</strong> to get your unique ID
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p>Share your ID with a friend and get their ID</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p>
                Enter their ID and click <strong>Connect</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
