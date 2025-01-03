function handleInput() {
    document.addEventListener('keydown', (event) => {
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
        mergeShape(currentShape, shapePosition, board);
        currentShape = getRandomShape();
        shapePosition = { x: 3, y: 0 };
    }
}

function rotateCurrentShape() {
    const rotatedShape = rotateShape(currentShape);
    if (!checkCollision(rotatedShape, shapePosition, board)) {
        currentShape = rotatedShape; // Jeśli nie ma kolizji, obróć kształt
    }
}
