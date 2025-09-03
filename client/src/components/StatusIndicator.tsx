import { ConnectionStatus } from "@/types/connectionStatus";
import { Wifi, WifiOff } from "lucide-react";

export function StatusIndicator({
  connectionStatus,
}: {
  connectionStatus: ConnectionStatus;
}) {
  return (
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
  );
}
