const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const rows = 20;
const cols = 10;
const board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ value: 0, color: '#111' })));
let score = 0;
let gameOver = false;
let speed = 500; // Początkowa prędkość opadania klocków

let currentShape = getRandomShape();
let currentColor = getRandomColor();
let shapePosition = { x: Math.floor(cols / 2) - 1, y: 0 }; // Początkowa pozycja
let intervalId;

function startGame() {
    console.log('Gra rozpoczęta');
    handleInput();
    startGameLoop();
}

function startGameLoop() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    console.log(`Aktualna prędkość: ${speed} ms`);
    intervalId = setInterval(() => {
        if (!gameOver) {
            update();
            render();
        }
    }, speed);
}

function update() {
    shapePosition.y += 1; // Klocek spada
    if (checkCollision(currentShape, shapePosition, board)) {
        shapePosition.y -= 1; // Cofnij ruch w razie kolizji
        mergeShape(currentShape, shapePosition, board, currentColor);
        if (checkGameOver(board)) {
            endGame();
        } else {
            currentShape = getRandomShape();
            currentColor = getRandomColor();
            shapePosition = { x: Math.floor(cols / 2) - 1, y: 0 };
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawShape(ctx, currentShape, shapePosition, currentColor);
}

function drawBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = board[row][col].color;
            ctx.fillRect(col * 30, row * 30, 30, 30);
            ctx.strokeStyle = '#222';
            ctx.strokeRect(col * 30, row * 30, 30, 30);
        }
    }
}

function drawShape(ctx, shape, position, color) {
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillStyle = color;
                ctx.fillRect((position.x + x) * 30, (position.y + y) * 30, 30, 30);
                ctx.strokeStyle = '#222';
                ctx.strokeRect((position.x + x) * 30, (position.y + y) * 30, 30, 30);
            }
        });
    });
}

function checkCollision(shape, position, board) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const boardY = position.y + y;
                const boardX = position.x + x;
                if (boardX < 0 || boardX >= board[0].length || boardY >= board.length || boardY < 0 || board[boardY][boardX].value !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergeShape(shape, position, board, color) {
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const boardY = position.y + y;
                const boardX = position.x + x;
                if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
                    board[boardY][boardX] = { value, color }; // Przypisz wartość i kolor
                }
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
        if (board[row].every(cell => cell.value !== 0)) {
            board.splice(row, 1); // Usuń pełną linię
            board.unshift(Array.from({ length: cols }, () => ({ value: 0, color: '#111' }))); // Dodaj nową pustą linię na górze
            linesRemoved += 1;
            row++; // Sprawdź ponownie tę samą linię (która jest teraz inną linią)
        }
    }

    return linesRemoved;
}

function updateScore(linesRemoved) {
    score += linesRemoved * 100; // Dodaj 100 punktów za każdą usuniętą linię
    document.getElementById('score').innerText = `Score: ${score}`;
    if (score % 800 === 0) {
        updateSpeed();
    }
}

function updateSpeed() {
    speed = Math.max(100, speed - 50); // Zwiększ prędkość, minimalna wartość to 100 ms
    startGameLoop(); // Zaktualizuj interwał
}

function checkGameOver(board) {
    // Jeśli jakakolwiek komórka w górnym rzędzie jest zapełniona, gra się kończy
    return board[0].some(cell => cell.value !== 0);
}

function endGame() {
    gameOver = true;
    alert('Game Over!');
    clearInterval(intervalId); // Zatrzymaj pętlę gry
}

window.startGame = startGame;
window.rotateShape = rotateShape; // Upewnij się, że rotateShape jest dostępna globalnie
