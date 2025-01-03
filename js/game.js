const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 20;
const cols = 10;
const board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ value: 0, color: '#111' })));
let score = 0;
let gameOver = false;
let speed = 500; // Początkowa prędkość opadania klocków
let isPaused = false;

let currentShape = getRandomShape();
let currentColor = getRandomColor();
let shapePosition = { x: Math.floor(cols / 2) - 1, y: 0 }; // Początkowa pozycja
let intervalId;

function startGame() {
    console.log('Gra rozpoczęta');
    renderNextShape(); // Pokaż początkowy podgląd
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
    shapePosition.y += 1;
    if (checkCollision(currentShape, shapePosition, board)) {
        shapePosition.y -= 1; // Cofnij ruch w razie kolizji
        mergeShape(currentShape, shapePosition, board, currentColor);
        if (checkGameOver(board)) {
            endGame();
        } else {
            currentShape = nextShape; // Ustaw obecny kształt jako wcześniej wylosowany
            currentColor = nextColor; // Ustaw obecny kolor
            nextShape = getRandomShape(); // Wylosuj nowy kształt
            nextColor = getRandomColor(); // Wylosuj nowy kolor
            shapePosition = { x: Math.floor(cols / 2) - 1, y: 0 };
            renderNextShape(); // Odśwież podgląd
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
    let linesToRemove = [];
    for (let row = 0; row < rows; row++) {
        if (board[row].every(cell => cell.value !== 0)) {
            linesToRemove.push(row);
        }
    }

    if (linesToRemove.length > 0) {
        linesToRemove.forEach(row => {
            board[row].forEach(cell => (cell.color = 'white')); // Migotanie
        });

        setTimeout(() => {
            linesToRemove.forEach(row => {
                board.splice(row, 1);
                board.unshift(Array.from({ length: cols }, () => ({ value: 0, color: '#111' })));
            });
            updateScore(linesToRemove.length);
            render();
        }, 200); // Opóźnienie przed usunięciem linii
    }
}

function updateScore(linesRemoved) {
    score += linesRemoved * 100;
    document.getElementById('score').innerText = `Score: ${score}`;

    const bestScore = localStorage.getItem('bestScore') || 0;
    if (score > bestScore) {
        localStorage.setItem('bestScore', score);
        document.getElementById('bestScore').innerText = `Best: ${score}`;
    }
}

function updateSpeed() {
    speed = Math.max(100, speed - 50); // Zwiększ prędkość, minimalna wartość to 100 ms
    startGameLoop(); // Zaktualizuj interwał
}

function checkGameOver(board) {
    return board[0].some(cell => cell.value !== 0);
}

function endGame() {
    gameOver = true;
    togglePause();
    document.querySelector("#pause div").textContent = "Koniec";
    clearInterval(intervalId); // Zatrzymaj pętlę gry
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        document.querySelector("#pause").style.backgroundColor = "#222";
        clearInterval(intervalId);
        document.getElementById('pause').style.display = "flex";
    } else {
        document.querySelector("#pause").style.backgroundColor = "transparent";
        startGameLoop();
        document.getElementById('pause').style.display = "none";
    }
}

function renderNextShape() {
    const nextCanvas = document.getElementById('nextPieceCanvas');
    const nextCtx = nextCanvas.getContext('2d');
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    const cellSize = 30;
    const offsetX = (nextCanvas.width - nextShape[0].length * cellSize) / 2;
    const offsetY = (nextCanvas.height - nextShape.length * cellSize) / 2;

    nextShape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextCtx.fillStyle = nextColor;
                nextCtx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
                nextCtx.strokeStyle = '#222';
                nextCtx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            }
        });
    });
}

window.startGame = startGame;
window.rotateShape = rotateShape; // Upewnij się, że rotateShape jest dostępna globalnie
