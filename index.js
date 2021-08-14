const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("drawingData", (data) =>
    socket.broadcast.emit("drawingData", data)
  );
});

server.listen(8000, () => {
  console.log("started");
});
