  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".image-container").forEach(container => {
      const topImage = container.querySelector(".image-top");

      container.addEventListener("click", function () {
        topImage.style.opacity = (topImage.style.opacity === "0") ? "1" : "0";
      });
    });
  });