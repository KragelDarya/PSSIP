const ellipse = document.querySelector('.ellipse3');

ellipse.addEventListener('mouseenter', () => {
  ellipse.classList.add('shrink');
});

ellipse.addEventListener('mouseleave', () => {
  ellipse.classList.remove('shrink');
});