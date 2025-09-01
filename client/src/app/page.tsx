"use client";

import Peer from "peerjs";
import { useEffect, useState } from "react";

export default function Home() {
  const [peer, setPeer] = useState<Peer>();
  const [message, setMessage] = useState<string>();
  const [dstPeer, setDstPeer] = useState<string>();

  useEffect(() => {
    const peerID = Math.floor(Math.random() * 2 ** 18)
      .toString(36)
      .padStart(4, "0");
    const newPeer = new Peer(peerID, {
      host: location.hostname,
      port: 9000,
      path: "/",
      debug: 3,
    });

    newPeer.on("open", function (id) {
      console.log("My peer ID is ===> " + id);
    });

    setPeer(newPeer);

    return () => newPeer.destroy();
  }, []);

  function sendMessageToPeer() {
    if (!peer || !dstPeer) return;
    const conn = peer.connect(dstPeer);

    conn.on("open", function () {
      console.log("+++++++++++++++++++++++++++++++hi");
      conn.send(message);
    });
    conn.on("data", function (data) {
      console.log("DATA::::::::::", data);
    });
    conn.on("error", function (err) {
      console.log("THE ERROR IS-------------------------", err);
    });
  }

  return (
    <>
      <input
        type="text"
        name="message"
        id="message"
        placeholder="message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <br />
      <input
        type="text"
        name="peerId"
        id="peerId"
        placeholder="peerId"
        onChange={(e) => setDstPeer(e.target.value)}
      />
      <br />
      <button onClick={sendMessageToPeer}>send</button>
    </>
  );
}
