document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('score').style.display = 'block';
        startButton.style.display = 'none';
        startGame();
    });
});
