(function () {
  const FAVORITES_KEY = 'granss:favorites';

  const getFavs = () => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; }
    catch { return []; }
  };

  const setFavs = (arr) => localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));

  const isFav = (src) => getFavs().includes(src);

  const addFav = (src) => {
    const favs = getFavs();
    if (!favs.includes(src)) {
      favs.push(src);
      setFavs(favs);
    }
  };

  const removeFav = (src) => {
    const favs = getFavs().filter(s => s !== src);
    setFavs(favs);
  };

  // 1) Добавляем кнопку лайка ко всем карточкам .container4 .item
  function installLikeButtons() {
    const items = document.querySelectorAll('.container4 .item');
    items.forEach(item => {
      // уже стоит кнопка? пропускаем
      if (item.querySelector('.fav-btn')) return;

      const img = item.querySelector('img');
      if (!img) return;

      const btn = document.createElement('button');
      btn.className = 'fav-btn';
      if (isFav(img.src)) btn.classList.add('active');

      btn.title = isFav(img.src) ? 'Убрать из понравившихся' : 'Добавить в понравившиеся';

      // Клик по сердечку — не должен открывать полноэкранный просмотр
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const src = img.src;

        if (isFav(src)) {
          removeFav(src);
          btn.classList.remove('active');
          btn.title = 'Добавить в понравившиеся';
        } else {
          addFav(src);
          btn.classList.add('active');
          btn.title = 'Убрать из понравившихся';
        }
        // если открыт модал избранного — перерисуем
        if (document.getElementById('favorites-modal')?.classList.contains('show')) {
          renderFavorites();
        }
      });

      item.appendChild(btn);
    });
  }

  // 2) Модалка «Понравившиеся»
  const favModal = document.getElementById('favorites-modal');
  const favGrid  = document.getElementById('favoritesGrid');
  const favEmpty = document.getElementById('favoritesEmpty');

  function openFavorites() {
    renderFavorites();
    favModal.classList.add('show');
  }

  function closeFavorites() {
    favModal.classList.remove('show');
  }

  function renderFavorites() {
    const favs = getFavs();
    favGrid.innerHTML = '';

    if (!favs.length) {
      favEmpty.style.display = '';
      return;
    }
    favEmpty.style.display = 'none';

    favs.forEach(src => {
      const card = document.createElement('div');
      card.className = 'fav-card';

      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Понравившееся';

      const rm = document.createElement('button');
      rm.className = 'fav-card__remove';
      rm.textContent = 'Удалить';
      rm.addEventListener('click', () => {
        removeFav(src);
        // Обновим кнопки на сетке проектов
        syncButtonsWithState();
        renderFavorites();
      });

      card.appendChild(img);
      card.appendChild(rm);
      favGrid.appendChild(card);
    });
  }

  function syncButtonsWithState() {
    document.querySelectorAll('.container4 .item').forEach(item => {
      const img = item.querySelector('img');
      const btn = item.querySelector('.fav-btn');
      if (!img || !btn) return;

      if (isFav(img.src)) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  // 3) Клик по ссылке «Понравившееся» в меню
  function bindMenuLink() {
    // Сначала пытаемся по id
    let link = document.getElementById('favoritesLink');

    // Если нет id — найдём по тексту
    if (!link) {
      link = Array.from(document.querySelectorAll('.menu-panel a'))
        .find(a => a.textContent.trim().toLowerCase() === 'понравившееся');
    }

    if (link) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openFavorites();
      });
    }
  }

  // Закрытие модалки
  function bindModalClose() {
    const closeBtn = favModal.querySelector('.fav-modal__close');
    closeBtn.addEventListener('click', closeFavorites);
    favModal.addEventListener('click', (e) => {
      if (e.target === favModal) closeFavorites();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && favModal.classList.contains('show')) closeFavorites();
    });
  }

  // Инициализация
  function init() {
    if (!favModal || !favGrid) return;
    installLikeButtons();
    bindMenuLink();
    bindModalClose();

    // На случай динамических подгрузок/смены списка (если у вас есть "Загрузить ещё")
    const grid = document.getElementById('imageGrid');
    if (grid && 'MutationObserver' in window) {
      const mo = new MutationObserver(() => {
        installLikeButtons();
        syncButtonsWithState();
      });
      mo.observe(grid, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
