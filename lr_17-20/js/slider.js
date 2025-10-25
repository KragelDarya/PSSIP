document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const nextButtons = document.querySelectorAll(".next");
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentSlide++;
            if (currentSlide < slides.length) {
                showSlide(currentSlide);
            } else {
                alert("Спасибо за ваши ответы!");
                currentSlide = 0; // Сброс на первый вопрос
                showSlide(currentSlide);
            }
        });
    });

    showSlide(currentSlide); // Показать первый слайд
});

let currentSlide = 1;
const totalSlides = 4;
function selectOption(element) {
    // Убираем класс selected у всех опций в текущем слайде
    const options = document.querySelectorAll(`#slide-${currentSlide} .option`);
    options.forEach(option => {
        option.classList.remove('selected');
    });
        
    // Добавляем класс selected к выбранной опции
        element.classList.add('selected');
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        document.getElementById(`slide-${currentSlide}`).style.display = 'none';
        currentSlide++;
        document.getElementById(`slide-${currentSlide}`).style.display = 'block';
    }
}

