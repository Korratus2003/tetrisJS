const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function startGame() {
    console.log('Gra rozpoczęta');
    handleInput();
    update();
    render();
}

function update() {
    // Tutaj zaktualizuj stan gry
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Tutaj renderuj grę
    requestAnimationFrame(render);
}

// Upewnij się, że te funkcje są dostępne globalnie
window.startGame = startGame;
