document.addEventListener("DOMContentLoaded", () => {
    const cashSection = document.querySelector(".cash-section");
    const container = document.querySelector(".container1");

    if (!cashSection || !container) return;

    let offsetX = 0, offsetY = 0;
    let isDragging = false;

    cashSection.addEventListener("mousedown", (e) => {
        isDragging = true;
        const rect = cashSection.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        cashSection.style.cursor = "grabbing";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const containerRect = container.getBoundingClientRect();
        const cashRect = cashSection.getBoundingClientRect();

        let left = e.clientX - containerRect.left - offsetX;
        let top = e.clientY - containerRect.top - offsetY;

        // Ограничение движения внутри контейнера
        left = Math.max(0, Math.min(left, containerRect.width - cashRect.width));
        top = Math.max(0, Math.min(top, containerRect.height - cashRect.height));

        cashSection.style.left = left + "px";
        cashSection.style.top = top + "px";
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            cashSection.style.cursor = "grab";
        }
    });
});
