// keyboardScroll.js
document.addEventListener("DOMContentLoaded", function () {
    const scrollStep = 100; // Сколько пикселей листаем за один шаг

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") {
            // Листаем вниз
            window.scrollBy({
                top: scrollStep,
                left: 0,
                behavior: "smooth"
            });
        } else if (e.key === "ArrowUp") {
            // Листаем вверх
            window.scrollBy({
                top: -scrollStep,
                left: 0,
                behavior: "smooth"
            });
        }
    });
});
