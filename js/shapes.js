function rotateShape(shape) {
    // Utwórz nową macierz, która będzie obrotem klocka
    const rotatedShape = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    return rotatedShape;
}

function drawShape(ctx, shape, pos) {
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillStyle = fillColor;
                ctx.fillRect((pos.x + x) * 30, (pos.y + y) * 30, 30, 30);
                ctx.strokeStyle = '#222';
                ctx.strokeRect((pos.x + x) * 30, (pos.y + y) * 30, 30, 30);
            }
        });
    });
}

function checkCollision(shape, position, board) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const newY = position.y + y;
                const newX = position.x + x;
                if (newX < 0 || newX >= board[0].length || newY >= board.length || board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

