import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Chess } from 'chess.js';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST"]
  }
});

const chess = new Chess();

type MOVE = {
  from: string;
  to: string;
  promotion?: string;
};

type Players = {
  white?: string;
  black?: string;
};

let players: Players = {};

app.use(cors({
  origin: "*" // Allow requests from this origin
}));

app.get("/", (req, res) => {
  res.send("Welcome to Chess");
});

io.on('connection', (socket) => {
  console.log('A user connected');

    // Send the initial board state to the connected player
    socket.emit("boardState", chess.fen());

  if (!players.white) {
    players.white = socket.id;
    console.log("playe r back sae",players)
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  } else {
    socket.emit("spectatorRole","Spectator");
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (socket.id === players.white) {
      delete players.white;
    } else if (socket.id === players.black) {
      delete players.black;
    }
  });



  socket.on("move", (move: MOVE) => {
    console.log("backend ka mobve mae aagye",move)
    try {
      if (chess.turn() === "w" && socket.id !== players.white) return;
      if (chess.turn() === "b" && socket.id !== players.black) return;

      console.log(`Attempting move: ${JSON.stringify(move)}`);
      const result = chess.move(move);

      if (result) {
        io.emit("move", move);
        io.emit("boardState", chess.fen());
        console.log("Move successful:", move);
        console.log("Board state:", chess.fen());
      } else {
        console.log("Invalid move:", move);
        socket.emit("invalidMove", move);
      }
    } catch (error) {
      console.log("Error in move:", error);
      socket.emit("invalidMove", move);
    }
  });
});

server.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
