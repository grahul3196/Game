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

// Three.js variables
let scene, camera, renderer, board;

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
    // Clear the chessboard
    while (chessboard.firstChild) {
        chessboard.removeChild(chessboard.firstChild);
    }

    // Initialize Three.js scene
    scene = new THREE.Scene();

    // Set up camera
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(640, 640);
    chessboard.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Create chessboard
    const boardGeometry = new THREE.BoxGeometry(8, 0.1, 8);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    board = new THREE.Mesh(boardGeometry, boardMaterial);
    scene.add(board);

    // Add chess pieces
    const pieceGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = chess.board()[i][j];
            if (piece) {
                const pieceMesh = new THREE.Mesh(pieceGeometry, piece.color === 'w' ? whiteMaterial : blackMaterial);
                pieceMesh.position.set(j - 3.5, 0.6, i - 3.5);
                scene.add(pieceMesh);
            }
        }
    }

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

createBoard();
startTimer();
