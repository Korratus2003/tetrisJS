function getRandomShape() {
    const shapes = [
        [[1, 1, 1, 1]], // I
        [[1, 1], [1, 1]], // O
        [[0, 1, 0], [1, 1, 1]], // T
        [[1, 1, 0], [0, 1, 1]], // Z
        [[0, 1, 1], [1, 1, 0]], // S
        [[1, 0, 0], [1, 1, 1]], // L
        [[0, 0, 1], [1, 1, 1]], // J
    ];
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
}
