import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";

const app = express();
const PORT = 3000;
const server = createServer(app);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/index.html"));
});

app.use(express.static(join(__dirname, "public")));

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

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
