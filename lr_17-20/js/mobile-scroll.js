document.addEventListener("DOMContentLoaded", function () {
    const imageGrid = document.getElementById("imageGrid");
    const extraItems = document.querySelectorAll('.item.extra');
    const toggleContainer = document.getElementById("toggleContainer");

    function enableMobileScroll() {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
            // Показ всех элементов для мобильного
            extraItems.forEach(item => item.style.display = "block");

            // Включаем горизонтальную прокрутку
            imageGrid.style.display = "flex";
            imageGrid.style.flexWrap = "nowrap";
            imageGrid.style.overflowX = "auto";
            imageGrid.style.gap = "10px";
            imageGrid.style.paddingBottom = "10px";
            imageGrid.style.webkitOverflowScrolling = "touch";

            const items = imageGrid.querySelectorAll('.item');
            items.forEach(item => {
                item.style.flex = "0 0 auto";
                item.style.width = "200px"; // можно подогнать под макет
            });

            // Скрываем кнопку "Загрузить еще" для мобильной полосы
            if (toggleContainer) toggleContainer.style.display = "none";

        } else {
            // Возвращаем всё в изначальное состояние для десктопа
            imageGrid.style.display = "";
            imageGrid.style.flexWrap = "";
            imageGrid.style.overflowX = "";
            imageGrid.style.gap = "";
            imageGrid.style.paddingBottom = "";
            imageGrid.style.webkitOverflowScrolling = "";

            extraItems.forEach(item => item.style.display = "block"); // показываем все для десктопа
            if (toggleContainer) toggleContainer.style.display = "block";
        }
    }

    enableMobileScroll();
    window.addEventListener("resize", enableMobileScroll);
});
