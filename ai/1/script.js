// Функция для обновления состояния игры
function updateGameState() {
    const gameStatus = document.getElementById('gameStatus');
    const currentTime = new Date().toLocaleTimeString();
    
    // Обновляем текст на странице
    gameStatus.innerText = `Игра активна - Последнее обновление: ${currentTime}`;
}

// Обработчик событий для движения мыши
function handleMouseMove() {
    updateGameState(); // Обновляем состояние игры при движении мыши
}

// Обработчик событий для нажатий клавиш
function handleKeyDown() {
    updateGameState(); // Обновляем состояние игры при нажатии клавиш
}

// Добавляем обработчики событий для мыши и клавиатуры
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('keydown', handleKeyDown);