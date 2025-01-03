document.addEventListener('DOMContentLoaded', () => {
    // Wczytaj najlepszy wynik z localStorage
    const bestScore = localStorage.getItem('bestScore') || 0;
    document.getElementById('bestScore').innerText = `Best: ${bestScore}`;

    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById("restart");

    resetButton.addEventListener("click", () => {
        location.reload();
    });

    startButton.addEventListener('click', () => {
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('score').style.display = 'block';
        document.getElementById('nextPieceContainer').style.display = 'block';
        document.getElementById('bestScore').style.display = 'block';
        startButton.style.display = 'none';
        startGame();
    });
});

const nextCanvas = document.getElementById('nextPieceCanvas');
const nextCtx = nextCanvas.getContext('2d');
let nextShape = getRandomShape();
let nextColor = getRandomColor();

function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextShape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                nextCtx.fillStyle = nextColor;
                nextCtx.fillRect(x * 30, y * 30, 30, 30);
                nextCtx.strokeStyle = '#222';
                nextCtx.strokeRect(x * 30, y * 30, 30, 30);
            }
        });
    });
}

