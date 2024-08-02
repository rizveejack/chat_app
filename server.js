import express from "express";
import { Server } from "socket.io";

const app = express();
const PORT = 4000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

app.use(express.static("public"));

const io = new Server(server);

const totalUser = new Set();

io.on("connection", socketConnected);

function socketConnected(socket) {
  socket.on("chat message", (message) => {
    socket.broadcast.emit("chat message", message);
  });

  socket.on("notification", (message) => {
    socket.broadcast.emit("notification", message);
  });

  totalUser.add(socket.id);

  socket.on("disconnect", () => {
    totalUser.delete(socket.id);
    io.emit("totalUser", totalUser.size);
  });

  io.emit("totalUser", totalUser.size);
}
