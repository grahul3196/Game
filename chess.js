function handleSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const position = String.fromCharCode(97 + col) + (8 - row);

    if (selectedPiece) {
        const move = chess.move({
            from: selectedPiece.dataset.position,
            to: position,
            promotion: 'q' // Always promote to a queen for simplicity
        });

        if (move) {
            updateBoard();
            switchTurn();
        }

        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    } else {
        if (chess.get(position) && chess.get(position).color === currentTurn[0]) {
            selectedPiece = square;
            selectedPiece.classList.add('selected');
        }
    }
}

function updateBoard() {
    const board = chess.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            const piece = board[i][j];
            square.textContent = piece ? pieceToUnicode(piece) : '';
        }
    }
}

function pieceToUnicode(piece) {
    const unicodePieces = {
        p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
        P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
    };
    return unicodePieces[piece.type];
}

function switchTurn() {
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    currentTurnDisplay.textContent = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1);
}
