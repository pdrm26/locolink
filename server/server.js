import express from "express";
import { ExpressPeerServer } from "peer";

const connected = [];

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

peerServer.on("connection", function (client) {
  const clientID = client.getId();
  if (connected.indexOf(clientID) === -1) connected.push(clientID);
});

peerServer.on("disconnect", function (client) {
  const clientIdx = connected.indexOf(client.getId());
  if (clientIdx !== -1) connected.splice(clientIdx, 1);
});

app.get("/connected-people", function (req, res) {
  return res.json(connected);
});
