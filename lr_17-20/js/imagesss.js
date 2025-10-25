document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("img-modal");
    const modalImg = document.getElementById("img-modal-content");
    const closeBtn = document.querySelector(".img-modal__close");

    document.querySelectorAll("#imageGrid .item img").forEach(img => {
        img.addEventListener("click", function () {
            modalImg.src = this.src;
            modalImg.alt = this.alt || "";
            modal.classList.add("show");
        });
    });

    function closeModal() {
        modal.classList.remove("show");
        // Очистим src после небольшой задержки для плавности (если нужно)
        setTimeout(() => {
            modalImg.src = "";
            modalImg.alt = "";
        }, 300);
    }

    closeBtn.onclick = closeModal;

    window.onclick = function (e) {
        if (e.target === modal) {
            closeModal();
        }
    }
});