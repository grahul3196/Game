const chessboard = document.getElementById('chessboard');
const currentTurnDisplay = document.getElementById('current-turn');
const resetButton = document.getElementById('reset-game');

let currentTurn = 'white';
let selectedPiece = null;

const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

function createBoard() {
    chessboard.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = i;
            square.dataset.col = j;
            square.textContent = initialBoard[i][j];
            square.addEventListener('click', handleSquareClick);
            chessboard.appendChild(square);
        }
    }
}

function handleSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (selectedPiece) {
        // Move logic (simplified, not checking for valid moves)
        if (square.textContent === '' || isPieceOpponent(square.textContent)) {
            square.textContent = selectedPiece.textContent;
            selectedPiece.textContent = '';
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
            switchTurn();
        } else {
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        }
    } else if (isPieceCurrentTurn(square.textContent)) {
        selectedPiece = square;
        selectedPiece.classList.add('selected');
    }
}

function isPieceCurrentTurn(piece) {
    return (currentTurn === 'white' && piece.match(/[♙♖♘♗♕♔]/)) ||
           (currentTurn === 'black' && piece.match(/[♟♜♞♝♛♚]/));
}

function isPieceOpponent(piece) {
    return (currentTurn === 'white' && piece.match(/[♟♜♞♝♛♚]/)) ||
           (currentTurn === 'black' && piece.match(/[♙♖♘♗♕♔]/));
}

function switchTurn() {
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    currentTurnDisplay.textContent = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1);
}

resetButton.addEventListener('click', () => {
    createBoard();
    currentTurn = 'white';
    currentTurnDisplay.textContent = 'White';
});

createBoard();
