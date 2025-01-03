const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 20;
const cols = 10;
const board = Array.from({ length: rows }, () => Array(cols).fill(0));
let score = 0;
let gameOver = false;

let currentShape = getRandomShape();
let shapePosition = { x: 3, y: 0 }; // Początkowa pozycja

function startGame() {
    console.log('Gra rozpoczęta');
    handleInput();
    gameLoop();
}

function gameLoop() {
    setInterval(() => {
        if (!gameOver) {
            update();
            render();
        }
    }, 500); // Klocek opada co 500 ms
}

function update() {
    shapePosition.y += 1; // Klocek spada
    if (checkCollision(currentShape, shapePosition, board)) {
        shapePosition.y -= 1; // Cofnij ruch w razie kolizji
        mergeShape(currentShape, shapePosition, board);
        if (checkGameOver(board)) {
            endGame();
        } else {
            currentShape = getRandomShape();
            shapePosition = { x: 3, y: 0 };
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawShape(ctx, currentShape, shapePosition);
}

function drawBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 0) {
                ctx.fillStyle = '#111';
            } else {
                ctx.fillStyle = fillColor;
            }
            ctx.fillRect(col * 30, row * 30, 30, 30);
            ctx.strokeStyle = '#222';
            ctx.strokeRect(col * 30, row * 30, 30, 30);
        }
    }
}

function mergeShape(shape, position, board) {
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[position.y + y][position.x + x] = value;
            }
        });
    });

    const linesRemoved = removeFullLines();
    if (linesRemoved > 0) {
        updateScore(linesRemoved);
    }
}

function removeFullLines() {
    let linesRemoved = 0;

    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1); // Usuń pełną linię
            board.unshift(Array(cols).fill(0)); // Dodaj nową pustą linię na górze
            linesRemoved += 1;
            row++; // Sprawdź ponownie tę samą linię (która jest teraz inną linią)
        }
    }

    return linesRemoved;
}

function updateScore(linesRemoved) {
    score += linesRemoved * 100; // Dodaj 100 punktów za każdą usuniętą linię
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkGameOver(board) {
    // Jeśli jakakolwiek komórka w górnym rzędzie jest zapełniona, gra się kończy
    return board[0].some(cell => cell !== 0);
}

function endGame() {
    gameOver = true;
    alert('Game Over!');
}

window.startGame = startGame;
window.rotateShape = rotateShape; // Upewnij się, że rotateShape jest dostępna globalnie
