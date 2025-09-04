import { Dispatch, RefObject, SetStateAction } from "react";
import { ChatBody } from "./ChatBody";
import { ChatFooter } from "./ChatFooter";
import { ChatHeader } from "./ChatHeader";
import { DataConnection } from "peerjs";

type Props = {
  isConnected: boolean;
  friendPeerID: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  messages: string[];
  connection: DataConnection | undefined;
  setMessages: Dispatch<SetStateAction<string[]>>;
};

export function Chat({
  isConnected,
  friendPeerID,
  messagesEndRef,
  messages,
  connection,
  setMessages,
}: Props) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
        <ChatHeader isConnected={isConnected} friendPeerID={friendPeerID} />
        <ChatBody messages={messages} messagesEndRef={messagesEndRef} />
        <ChatFooter
          connection={connection}
          setMessages={setMessages}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}
