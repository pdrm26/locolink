"use client";

import Peer, { DataConnection } from "peerjs";
import { useRef, useState } from "react";

export default function Home() {
  const [peer, setPeer] = useState<Peer>();
  const [connection, setConnection] = useState<DataConnection | undefined>();
  const [messages, setMessages] = useState<string[]>([]);

  const peerRef = useRef(null);
  const fpeerRef = useRef(null);
  const msgRef = useRef(null);

  function join() {
    console.log("connecting...");

    const peerID = Math.floor(Math.random() * 2 ** 18)
      .toString(36)
      .padStart(4, "0");
    const peer = new Peer(peerID, {
      host: "localhost",
      port: 9000,
      path: "/",
      // debug: 3,
    });
    setPeer(peer);

    // when connected is created, handle the event
    peer.on("open", function (id) {
      console.log("Connected to Signaling Server ID : " + id);
      peerRef.current.value = id;
    });

    peer.on("connection", function (c) {
      const conn = c;
      console.log("New connection established");
      // set the friend peer id we just got
      fpeerRef.current.value = c.peer;
      conn.on("open", function () {
        // Receive messages - receiver side
        conn.on("data", function (data) {
          console.log("Received in connection: ", data);
          setMessages((prev) => [...prev, data as string]);
        });
      });
    });
  }

  function connect() {
    const fpeerID = fpeerRef.current.value;
    const conn = peer?.connect(fpeerID);

    setConnection(conn);

    // open event called when connection gets created
    conn?.on("open", function () {
      console.log("Connected");

      // Receive messages - sender side
      conn.on("data", function (data) {
        console.log("Received in connect: ", data);
        setMessages((prev) => [...prev, data as string]);
      });
    });
  }

  function sendMessage() {
    const msg = msgRef.current.value;
    console.log("sending message: ", msg);

    if (connection && connection.open) {
      connection.send(msg);
    }
  }

  return (
    <>
      <input id="peerid" placeholder="My ID" ref={peerRef} />
      <button onClick={join}>Join</button>
      <br />

      <input type="text" id="fpeerid" placeholder="Peer ID" ref={fpeerRef} />
      <button id="connect" onClick={connect}>
        Connect
      </button>
      <br />

      <input type="text" id="msg" placeholder="Message.." ref={msgRef} />
      <button id="send" onClick={sendMessage}>
        Send
      </button>
      <br />

      <ul id="messages">
        {messages?.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </>
  );
}
