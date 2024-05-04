const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
var pty = require("node-pty");


console.log("xxx", process.env.INIT_CWD )
var ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD ,
  env: process.env,
});

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

io.attach(server);

io.on("connection", (socket) => {
  console.log(`socket connected`, socket.id);

  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });
});

ptyProcess.onData((data) => {
  // process.stdout.write(data);
  io.emit("terminal:data", data);
});

server.listen(9000, () => {
  console.log(`🐋 docker server running on port 9000!`);
});
