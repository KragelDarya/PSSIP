document.addEventListener('DOMContentLoaded', function () {
  const logo = document.getElementById('footerLogo');

  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.classList.add('animate-logo');
    });

    logo.addEventListener('mouseleave', () => {
      logo.classList.remove('animate-logo');
    });
  }
});