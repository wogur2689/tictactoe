import {useState} from 'react';
import './styles.css';

//바둑판의 한칸
function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

//바둑판.
function Board({xIsNext, squares, onPlay}) {
  function handleChick(i) {
    if(squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //9개의 null요소를 가진 배열을 초기값으로 지정
  const winner = calculateWinner(squares);
  let status;
  if(winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row"> {/*JSX요소 [표시하려는 항목을 설명하는 HTML태그와 JS코드의 조합*/}
        <Square value={squares[0]} onSquareClick={() => handleChick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleChick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleChick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleChick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleChick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleChick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleChick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleChick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleChick(8)}/>
      </div>
    </>
  ); 
}

export default function Game() {
  //이동기록 추적을 위해 상태값 저장.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); //사용자가 현재 보고있는 단계를 추적하는 요소
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  //이동기록 표시
  const moves = history.map((squares, move) => {
    let description;
    if(move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}