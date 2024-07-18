"use strict";
export const __esModule = true;
import { createServer } from "node:http";
import next from 'next';
import { Server } from "socket.io";
import { Chess } from "chess.js";
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below

const app = next({ dev, hostname, port });
var handler = app.getRequestHandler();
app.prepare().then(function () {
    var httpServer = (0, createServer)(handler);
    var io = new Server(httpServer);
    var chess = new Chess();
    var players = {};
    io.on('connection', function (socket) {
        console.log('A user connected');
        // Send the initial board state to the connected player
        socket.emit("boardState", chess.fen());
        if (!players.white) {
            players.white = socket.id;
            console.log("playe r back sae", players);
            socket.emit("playerRole", "w");
        }
        else if (!players.black) {
            players.black = socket.id;
            socket.emit("playerRole", "b");
        }
        else {
            socket.emit("spectatorRole", "Spectator");
        }
        socket.on('disconnect', function () {
            console.log('User disconnected');
            if (socket.id === players.white) {
                delete players.white;
            }
            else if (socket.id === players.black) {
                delete players.black;
            }
        });
        socket.on("move", function (move) {
            console.log("backend ka mobve mae aagye", move);
            try {
                if (chess.turn() === "w" && socket.id !== players.white)
                    return;
                if (chess.turn() === "b" && socket.id !== players.black)
                    return;
                console.log("Attempting move: ".concat(JSON.stringify(move)));
                var result = chess.move(move);
                if (result) {
                    io.emit("move", move);
                    io.emit("boardState", chess.fen());
                    console.log("Move successful:", move);
                    console.log("Board state:", chess.fen());
                }
                else {
                    console.log("Invalid move:", move);
                    socket.emit("invalidMove", move);
                }
            }
            catch (error) {
                console.log("Error in move:", error);
                socket.emit("invalidMove", move);
            }
        });
    });
    httpServer
        .once("error", function (err) {
        console.error(err);
        process.exit(1);
    })
        .listen(port, function () {
        console.log("> Ready on http://".concat(hostname, ":").concat(port));
    });
});
