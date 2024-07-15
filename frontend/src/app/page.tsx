// frontend/pages/index.js

import ChessBoard from "./components/ChessBoard/page";
import MessageComponent from "./components/MessageComponent/page";
import ChessBoard2 from "./components/chessBoard2/page";



export default function Home() {
  return (
    <div>
      <h1>Welcome to Chess</h1>
      <ChessBoard />
      {/* <MessageComponent/> */}
      {/* <ChessBoard2/> */}
    </div>
  );
}
