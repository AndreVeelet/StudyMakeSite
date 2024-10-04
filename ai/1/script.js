let wakeLock = null; // Переменная для хранения блокировки экрана

// Функция для обновления состояния игры
function updateGameState() {
    const gameStatus = document.getElementById('gameStatus');
    const currentTime = new Date().toLocaleTimeString();
    
    // Обновляем текст на странице
    gameStatus.innerText = `Игра активна - Последнее обновление: ${currentTime}`;
}

// Функция для запроса блокировки экрана
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock активирован');
        updateGameState(); // Обновляем состояние при активации блокировки
        
        // Обновляем состояние каждые 5 секунд
        setInterval(updateGameState, 5000);
        
        // Освобождаем блокировку при закрытии вкладки
        window.addEventListener('unload', () => {
            if (wakeLock) {
                wakeLock.release();
                console.log('Wake Lock освобожден');
            }
        });
        
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

// Запрашиваем блокировку экрана при загрузке страницы
requestWakeLock();