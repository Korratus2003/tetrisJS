function rotateShape(shape) {
    // Utwórz nową macierz, która będzie obrotem klocka
    const rotatedShape = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    return rotatedShape;
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

