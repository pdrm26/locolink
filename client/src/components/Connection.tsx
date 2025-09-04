import { Users, Copy, Check } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { ConnectionStatus } from "@/types/connectionStatus";
import Peer, { DataConnection } from "peerjs";

type Props = {
  setFriendPeerID: Dispatch<SetStateAction<string>>;
  friendPeerID: string;
  setConnection: Dispatch<SetStateAction<DataConnection | undefined>>;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  isConnected: boolean;
  setMessages: Dispatch<SetStateAction<string[]>>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

export function Connection(props: Props) {
  const [peer, setPeer] = useState<Peer>();
  const [myPeerID, setMyPeerID] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    props.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      props.setFriendPeerID(c.peer);
      props.setConnection(conn);
      props.setIsConnected(true);

      conn.on("open", function () {
        // Receive messages - receiver side
        conn.on("data", function (data) {
          console.log("Received in connection: ", data);
          props.setMessages((prev) => [...prev, `Friend: ${data}`]);
          setTimeout(scrollToBottom, 100);
        });
      });

      conn.on("close", function () {
        props.setIsConnected(false);
        props.setConnection(undefined);
      });
    });

    newPeer.on("error", function (err) {
      console.error("Peer error:", err);
      setConnectionStatus("disconnected");
    });
  }

  function connect() {
    if (!peer || !props.friendPeerID.trim()) return;

    setConnectionStatus("connecting");
    const conn = peer.connect(props.friendPeerID.trim());
    props.setConnection(conn);

    // open event called when connection gets created
    conn?.on("open", function () {
      props.setIsConnected(true);
      setConnectionStatus("connected");

      // Receive messages - sender side
      conn.on("data", function (data) {
        props.setMessages((prev) => [...prev, `Friend: ${data as string}`]);
        setTimeout(scrollToBottom, 100);
      });
    });

    conn?.on("close", function () {
      props.setIsConnected(false);
      props.setConnection(undefined);
      setConnectionStatus("disconnected");
    });

    conn?.on("error", function (err) {
      console.error("Connection error:", err);
      setConnectionStatus("disconnected");
    });
  }

  function copyPeerID() {
    navigator.clipboard.writeText(myPeerID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <StatusIndicator connectionStatus={connectionStatus} />
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
                  value={props.friendPeerID}
                  onChange={(e) => props.setFriendPeerID(e.target.value)}
                  placeholder="Enter friend's ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={connect}
                  disabled={
                    !props.friendPeerID.trim() ||
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
        {props.isConnected && (
          <div className="p-3 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700">
              <strong>Connected to:</strong> {props.friendPeerID}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
