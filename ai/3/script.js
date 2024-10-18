const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createFirework(x, y) {
    const particles = 100; // Количество частиц
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    for (let i = 0; i < particles; i++) {
        const angle = Math.random() * 2 * Math.PI; // Случайный угол
        const radius = Math.random() * 100; // Случайный радиус
        const color = colors[Math.floor(Math.random() * colors.length)];

        const particleX = x + Math.cos(angle) * radius;
        const particleY = y + Math.sin(angle) * radius;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

canvas.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    createFirework(x, y);
});