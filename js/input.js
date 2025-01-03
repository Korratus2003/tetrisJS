function handleInput() {
    document.addEventListener('keydown', (event) => {
        if (gameOver) return;
        if (event.key === 'p' || event.key === 'P') {
            togglePause();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (isPaused) return;
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                render(); // Renderuj po ruchu
                break;
            case 'ArrowRight':
                moveRight();
                render(); // Renderuj po ruchu
                break;
            case 'ArrowDown':
                moveDown();
                render(); // Renderuj po ruchu
                break;
            case 'ArrowUp':
                rotateCurrentShape();
                render(); // Renderuj po obrocie
                break;
            case ' ':
                hardDrop(); // Twardy spadek
                render();
                break;
        }
    });
}

function moveLeft() {
    shapePosition.x -= 1;
    if (checkCollision(currentShape, shapePosition, board)) {
        shapePosition.x += 1; // Cofnij ruch w razie kolizji
    }
}

function moveRight() {
    shapePosition.x += 1;
    if (checkCollision(currentShape, shapePosition, board)) {
        shapePosition.x -= 1; // Cofnij ruch w razie kolizji
    }
}

function moveDown() {
    shapePosition.y += 1;
    if (checkCollision(currentShape, shapePosition, board)) {
        shapePosition.y -= 1; // Cofnij ruch w razie kolizji
        mergeShape(currentShape, shapePosition, board, currentColor); // Osadź kształt
        currentShape = nextShape; // Przypisz nowy kształt
        currentColor = nextColor; // Przypisz nowy kolor
        nextShape = getRandomShape(); // Wylosuj następny kształt
        nextColor = getRandomColor(); // Wylosuj następny kolor
        shapePosition = { x: Math.floor(cols / 2) - 1, y: 0 };

        renderNextShape(); // Odśwież podgląd na kolejne klocki
        if (checkGameOver(board)) {
            endGame();
        }
    }
}

function rotateCurrentShape() {
    const rotatedShape = rotateShape(currentShape);
    if (!checkCollision(rotatedShape, shapePosition, board)) {
        currentShape = rotatedShape; // Jeśli nie ma kolizji, obróć kształt
    }
}

function hardDrop() {
    while (!checkCollision(currentShape, { x: shapePosition.x, y: shapePosition.y + 1 }, board)) {
        shapePosition.y += 1;
    }
    mergeShape(currentShape, shapePosition, board, currentColor);
    currentShape = getRandomShape();
    currentColor = getRandomColor();
    shapePosition = { x: Math.floor(cols / 2) - 1, y: 0 };
    currentShape = nextShape; // Przypisz nowy kształt
    currentColor = nextColor; // Przypisz nowy kolor
    nextShape = getRandomShape(); // Wylosuj następny kształt
    nextColor = getRandomColor(); // Wylosuj następny kolor
    shapePosition = { x: Math.floor(cols / 2) - 1, y: 0 };

    renderNextShape(); // Odśwież podgląd na kolejne klocki
    if (checkGameOver(board)) {
        endGame();
    }
}
