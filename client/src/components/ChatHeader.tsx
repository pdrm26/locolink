export function ChatHeader({
  isConnected,
  friendPeerID,
}: {
  isConnected: boolean;
  friendPeerID: string;
}) {
  return (
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
  );
}
