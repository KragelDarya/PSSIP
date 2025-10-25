$(document).ready(function () {
  // Появление кнопки при прокрутке
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('#scrollTopBtn').fadeIn();
    } else {
      $('#scrollTopBtn').fadeOut();
    }
  });

  // Плавный скролл вверх
  $('#scrollTopBtn').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
    return false;
  });
});