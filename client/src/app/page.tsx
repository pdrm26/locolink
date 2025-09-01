"use client";

import Peer from "peerjs";
import { useEffect, useState } from "react";

export default function Home() {
  const [peer, setPeer] = useState<Peer>();

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

    const conn = newPeer.connect("");

    conn.on("open", function () {
      console.log("+++++++++++++++++++++++++++++++hi");
    });
    conn.on("data", function (data) {
      console.log("DATA::::", data);
    });
    conn.on("error", function (err) {
      console.log("THE ERROR IS-------------------------", err);
    });

    setPeer(newPeer);

    return () => newPeer.destroy();
  }, []);

  return <div>client</div>;
}
