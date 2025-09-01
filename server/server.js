import express from "express";
import { ExpressPeerServer } from "peer";

const app = express();
app.get("/", (req, res) => res.send("Hello world!"));
const port = 9000;
const server = app.listen(9000, () =>
  console.log(`server listening on http://localhost:${port}`)
);
const peerServer = ExpressPeerServer(server, {
  path: "/",
  allow_discovery: true,
});
app.use("/", peerServer);
