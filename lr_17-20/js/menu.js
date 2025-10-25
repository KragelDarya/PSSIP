function toggleMenu() {
    const panel = document.getElementById('menuPanel');
    const yellowIcons = document.getElementById("yellowIcons");
    const isVisible = panel.style.display === 'grid';
    panel.style.display = (panel.style.display === 'grid') ? 'none' : 'grid';
    yellowIcons.style.display = isVisible ? "none" : "flex";

    const menuTop = document.querySelector('.menu-top');
  const menuBottom = document.querySelector('.menu-bottom');

  if (menuTop.style.display === 'none') {
    menuTop.style.display = 'inline';
    menuBottom.style.display = 'none';
  } else {
    menuTop.style.display = 'none';
    menuBottom.style.display = 'inline';
  }
}
