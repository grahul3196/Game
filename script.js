const chessboard = document.getElementById('chessboard');
const currentTurnDisplay = document.getElementById('current-turn');
const resetButton = document.getElementById('reset-game');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const scoreDisplay = document.getElementById('score');

let currentTurn = 'white';
let chess = new Chess();
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let score = { white: 0, black: 0 };

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
    createBoard();
}

function createBoard() {
    // Clear the chessboard
    while (chessboard.firstChild) {
        chessboard.removeChild(chessboard.firstChild);
    }

    // Create the 3D chessboard
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

createBoard();

