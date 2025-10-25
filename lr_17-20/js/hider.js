document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById('toggleButton');
  const toggleContainer = document.getElementById('toggleContainer');
  const extraItems = document.querySelectorAll('.item.extra');
  const imageGrid = document.getElementById('imageGrid');
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    let expanded = false;

    toggleButton.addEventListener('click', function () {
      expanded = !expanded;

      extraItems.forEach(item => {
        item.style.display = expanded ? 'block' : 'none';
      });

      toggleButton.textContent = expanded ? 'Скрыть' : 'Загрузить еще';

      if (!expanded) {
        setTimeout(() => {
          imageGrid.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100); 
      }
    });
  } else {
    extraItems.forEach(item => item.style.display = 'block');
    toggleContainer.style.display = 'none';
  }
});