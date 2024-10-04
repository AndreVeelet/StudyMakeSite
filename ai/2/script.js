// Функция для обновления состояния игры
function updateGameState() {
    const gameStatus = document.getElementById('gameStatus');
    const currentTime = new Date().toLocaleTimeString();
    
    // Обновляем текст на странице
    gameStatus.innerText = `Игра активна - Последнее обновление: ${currentTime}`;
}

// Функция, которая будет вызываться перед каждым перерисовыванием экрана
function keepAwake() {
    updateGameState(); // Обновляем состояние игры
    requestAnimationFrame(keepAwake); // Запрашиваем следующий кадр
}

// Запускаем функцию
keepAwake();