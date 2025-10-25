let deadline = new Date("July 2, 2026 00:00:00").getTime(); // Дата окончания в миллисекундах

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = deadline - now;

    if (timeLeft <= 0) {
        document.getElementById("countdown").innerHTML = "Акция завершена";
        clearInterval(timerInterval);
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateCountdown(); // Первая инициализация
const timerInterval = setInterval(updateCountdown, 1000); // Обновляем каждую секунду