const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function createFirework(x, y) {
    const particles = 400; // Количество частиц
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    for (let i = 0; i < particles; i++) {
        const angle = Math.random() * 2 * Math.PI; // Случайный угол
        const radius = Math.random() * 200; // Случайный радиус

        const particleX = x + Math.cos(angle) * radius;
        const particleY = y + Math.sin(angle) * radius;

        // Добавляем частицы в массив с начальной скоростью и углом
        fireworks.push({
            x: particleX,
            y: particleY,
            speedX: Math.cos(angle) * 4,
            speedY: Math.sin(angle) * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 300 // Время жизни частицы
        });
    }
}

function updateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

    for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];

        // Обновляем позицию частицы
        firework.x += firework.speedX;
        firework.y += firework.speedY;

        // Уменьшаем скорость по вертикали, чтобы создать эффект падения
        firework.speedY += 0.1; // Гравитация

        firework.life--;

        // Рисуем частицу
        ctx.fillStyle = firework.color;
        ctx.beginPath();
        ctx.arc(firework.x, firework.y, 1, 0, Math.PI * 2);
        ctx.fill();

        // Удаляем частицы, которые "умерли"
        if (firework.life <= 0) {
            fireworks.splice(i, 1);
        }
    }

    requestAnimationFrame(updateFireworks); // Запускаем следующий кадр анимации
}

canvas.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    createFirework(x, y);
});

// Запускаем анимацию
updateFireworks();