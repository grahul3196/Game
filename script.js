const chessboard = document.getElementById('chessboard');
const currentTurnDisplay = document.getElementById('current-turn');
const resetButton = document.getElementById('reset-game');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let currentTurn = 'white';
let chess = new Chess();
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let score = { white: 0, black: 0 };
let timer = { white: 600, black: 600 }; // 10 minutes in seconds
let interval;
let selectedPiece = null;

player1NameInput.addEventListener('input', () => {
    player1Name = player1NameInput.value || 'Player 1';
});

player2NameInput.addEventListener('input', () => {
    player2Name = player2NameInput.value || 'Player 2';
});

resetButton.addEventListener('click', resetGame);

function resetGame() {
    chess.reset();
    currentTurn = 'white';
    currentTurnDisplay.textContent = 'White';
    score = { white: 0, black: 0 };
    scoreDisplay.textContent = '0 - 0';
    timer = { white: 600, black: 600 };
    updateTimerDisplay();
    clearInterval(interval);
    startTimer();
    createBoard();
}

function startTimer() {
    interval = setInterval(() => {
        timer[currentTurn]--;
        updateTimerDisplay();
        if (timer[currentTurn] <= 0) {
            clearInterval(interval);
            alert(`${currentTurn === 'white' ? player2Name : player1Name} wins by time!`);
            updateScore(currentTurn === 'white' ? 'black' : 'white');
            resetGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const whiteMinutes = Math.floor(timer.white / 60);
    const whiteSeconds = timer.white % 60;
    const blackMinutes = Math.floor(timer.black / 60);
    const blackSeconds = timer.black % 60;
    timerDisplay.textContent = `${whiteMinutes}:${whiteSeconds < 10 ? '0' : ''}${whiteSeconds} - ${blackMinutes}:${blackSeconds < 10 ? '0' : ''}${blackSeconds}`;
}

function createBoard() {
    while (chessboard.firstChild) {
        chessboard.removeChild(chessboard.firstChild);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(640, 640);
    chessboard.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    const boardGeometry = new THREE.BoxGeometry(8, 0.1, 8);
    const boardMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    scene.add(board);

    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

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
            playMoveSound();
            if (chess.in_checkmate()) {
                alert(`${currentTurn === 'white' ? player2Name : player1Name} wins by checkmate!`);
                updateScore(currentTurn === 'white' ? 'black' : 'white');
                resetGame();
            } else if (chess.in_stalemate()) {
                alert('Stalemate!');
                resetGame();
            }
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

function updateScore(winner) {
    if (winner === 'white') {
        score.white++;
    } else {
        score.black++;
    }
    scoreDisplay.textContent = `${score.white} - ${score.black}`;
}

function playMoveSound() {
    const audio = new Audio('move_sound.mp3');
    audio.play();
}

createBoard();
startTimer();
