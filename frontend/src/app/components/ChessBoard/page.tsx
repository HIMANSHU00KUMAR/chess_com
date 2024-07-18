"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ChessBoard2 } from '../chessBoard2/page';





const socket = io({autoConnect:false});

const ChessBoard: React.FC = () => {
  const [transport, setTransport] = useState("N/A");
  const [boardState, setBoardState] = useState<string>('');
  const [playerRole, setPlayerRole] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {

    socket.on('connect', () => {
      setConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    });


    socket.on('disconnect', () => {
      setTransport("N/A")
      setConnected(false);
    });

    socket.on("playerRole", (role: string) => {
      alert(`Player role: ${role}`);
      setPlayerRole(role);
    });

    socket.on("spectatorRole", (role: string) => {
      alert("You are a spectator");
      setPlayerRole(role);
    });

    socket.on('boardState', (fen: string) => {
      setBoardState(fen);
    });

    socket.on('move', (move: { from: string; to: string }) => {
      // alert(`Move successful: ${move.from} to ${move.to}`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('playerRole');
      socket.off('spectatorRole');
      socket.off('boardState');
      socket.off('move');
    };
  }, []);

  const handlePlay = () => {
    if (!connected) {
      socket.connect();
    }
  };

  const handleMove = (from: string, to: string) => {
    socket.emit('move', { from, to });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white p-4">
      <h2>transport is {transport}</h2>
      <h1 className="text-4xl font-bold mb-8">Play and Connect</h1>
      <button
        onClick={handlePlay}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${connected ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={connected}
      >
        {connected ? 'Connected' : 'Play'}
      </button>
      <h1 className="text-4xl font-bold mb-8">Chess Game</h1>
      <p className="text-lg mb-4">Player Role: {playerRole}</p>
      <ChessBoard2 boardState={boardState} onMove={handleMove} />
    </div>
  );
};

export default ChessBoard;
