import React, { useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface ChessBoard2Props {
  boardState: string;
  onMove: (from: string, to: string) => void;
}

const ChessBoard2: React.FC<ChessBoard2Props> = ({ boardState, onMove }) => {
  const verticalAxis = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const pieces: { [key: string]: string } = {
    'p': '/img/bp.svg',
    'r': '/img/br.svg',
    'n': '/img/bn.svg',
    'b': '/img/bb.svg',
    'q': '/img/bq.svg',
    'k': '/img/bk.svg',
    'P': '/img/wp.svg',
    'R': '/img/wr.svg',
    'N': '/img/wn.svg',
    'B': '/img/wb.svg',
    'Q': '/img/wq.svg',
    'K': '/img/wk.svg'
  };

  const Square: React.FC<{ position: string, piece: string }> = ({ position, piece }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: 'piece',
      drop: (item: { id: string }) => onMove(item.id, position),
    });

    drop(ref);

    return (
      <div
        ref={ref}
        className={`w-12 h-12 flex items-center justify-center ${
          (verticalAxis.indexOf(position[1]) + horizontalAxis.indexOf(position[0])) % 2 === 0 ? 'bg-gray-700' : 'bg-gray-300'
        }`}
      >
        {piece && <Piece id={position} piece={piece} />}
      </div>
    );
  };

  const Piece: React.FC<{ id: string, piece: string }> = ({ id, piece }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: 'piece',
      item: { id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    drag(ref);

    return (
      <div
        ref={ref}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <img src={piece} alt="chess piece" className="w-full h-full" />
      </div>
    );
  };

  const generateBoard = (): JSX.Element[] => {
    if (!boardState) return [];

    const board: JSX.Element[] = [];
    const rows = boardState.split(' ')[0].split('/');

    for (let row = 0; row < rows.length; row++) {
      let col = 0;
      for (const char of rows[row]) {
        if (isNaN(parseInt(char))) {
          board.push(
            <Square key={`${verticalAxis[row]}${horizontalAxis[col]}`} position={`${horizontalAxis[col]}${verticalAxis[row]}`} piece={pieces[char]} />
          );
          col++;
        } else {
          const emptySquares = parseInt(char);
          for (let i = 0; i < emptySquares; i++) {
            board.push(
              <Square key={`${horizontalAxis[col]}${verticalAxis[row]}`} position={`${horizontalAxis[col]}${verticalAxis[row]}`} piece="" />
            );
            col++;
          }
        }
      }
    }

    return board;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-8 grid-rows-8 w-96 h-96 bg-blue-500">
        {generateBoard()}
      </div>
    </DndProvider>
  );
};

export default ChessBoard2;
