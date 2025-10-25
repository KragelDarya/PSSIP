document.addEventListener('DOMContentLoaded', function () {

  // === Функции для ошибок ===
  function showError(input, message) {
    input.style.borderColor = 'red';
    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
      let errorElem = document.createElement('div');
      errorElem.className = 'error-message';
      errorElem.style.color = 'red';
      errorElem.style.fontSize = '12px';
      errorElem.style.marginTop = '4px';
      errorElem.textContent = message;
      input.parentNode.insertBefore(errorElem, input.nextSibling);
    }
  }

  function clearError(input) {
    input.style.borderColor = '#ddd';
    if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
      input.nextElementSibling.remove();
    }
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.error-message').forEach(e => e.remove());
    form.querySelectorAll('input').forEach(i => i.style.borderColor = '#ddd');
  }

  // === Маска телефона ===
  document.querySelectorAll('.form-box input[type="tel"]').forEach(phoneInput => {
    function maskPhone(event) {
      let keyCode = event.keyCode;
      let input = event.target,
          matrix = "+7 (___) ___-__-__",
          i = 0,
          val = input.value.replace(/\D/g, ""),
          newValue = matrix.replace(/[_\d]/g, a => i < val.length ? val.charAt(i++) : a);

      i = newValue.indexOf("_");
      if (i !== -1) newValue = newValue.slice(0, i);
      input.value = newValue;
      if (event.type === "blur" && input.value.length < 18) input.value = "";
    }
    phoneInput.addEventListener('input', maskPhone);
    phoneInput.addEventListener('focus', maskPhone);
    phoneInput.addEventListener('blur', maskPhone);
    phoneInput.addEventListener('keydown', maskPhone);
  });

  // === Маска email ===
  document.querySelectorAll('.form-box input[type="email"]').forEach(emailInput => {
    emailInput.addEventListener('input', function () {
      this.value = this.value.replace(/[а-яА-ЯёЁ\s]/g, '');
      clearError(this);
    });
  });

  // === Работа со всеми формами ===
  document.querySelectorAll('.form-box form, .form-box:not(:has(form))').forEach(box => {
    const button = box.querySelector('button.send');
    if (!button) return;

    button.addEventListener('click', function (e) {
      e.preventDefault();
      clearAllErrors(box);

      let isValid = true;
      const inputs = box.querySelectorAll('input');
      const formData = {};

      inputs.forEach(input => {
        const value = input.value.trim();

        if (!value) {
          showError(input, 'Поле обязательно для заполнения');
          isValid = false;
          return;
        }

        if (input.type === "text" && !/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(value)) {
          showError(input, 'Введите корректное имя');
          isValid = false;
        }

        if (input.type === "tel" && value.length !== 18) {
          showError(input, 'Введите полный номер телефона');
          isValid = false;
        }

        if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          showError(input, 'Введите корректный Email');
          isValid = false;
        }

        // === Ограничение длины пароля ===
        if (input.type === "password" && value.length > 30) {
          showError(input, 'Пароль не должен превышать 30 символов');
          isValid = false;
        }

        formData[input.placeholder] = value;
      });

      const pass = box.querySelector('input[type="password"]');
      const confirm = box.querySelector('input[placeholder="Подтвердите пароль"]');
      if (pass && confirm && pass.value !== confirm.value) {
        showError(confirm, 'Пароли не совпадают');
        isValid = false;
      }

      // === Если форма валидна ===
      if (isValid) {

        // --- Регистрация ---
        if (button.textContent.includes('Зарегистрироваться')) {
          const user = {
            name: box.querySelector('input[type="text"]').value.trim(),
            email: box.querySelector('input[type="email"]').value.trim(),
            password: box.querySelector('input[type="password"]').value.trim()
          };

          const jsonUser = JSON.stringify(user);

          // ✅ Сохраняем в cookies (на 7 дней)
          document.cookie = `user=${encodeURIComponent(jsonUser)}; max-age=${60 * 60 * 24 * 7}; path=/; SameSite=Lax`;

          // ✅ Сохраняем в LocalStorage
          localStorage.setItem('user', jsonUser);

          console.log('✅ Данные сохранены в Cookies и LocalStorage:', jsonUser);
          alert(`✅ Регистрация успешна!\nИмя: ${user.name}\nEmail: ${user.email}`);

          inputs.forEach(i => i.value = '');
        }

        // --- Вход ---
        else if (button.textContent.includes('Войти')) {
          const email = box.querySelector('input[type="email"]').value.trim();
          const password = box.querySelector('input[type="password"]').value.trim();

          // Читаем из cookies
          const cookieUser = getCookie('user');
          const localUser = localStorage.getItem('user');
          const storedUser = cookieUser ? JSON.parse(decodeURIComponent(cookieUser)) : JSON.parse(localUser || '{}');

          if (storedUser.email === email && storedUser.password === password) {
            alert(`👋 Добро пожаловать, ${storedUser.name}!`);
          } else {
            alert('❌ Пользователь не найден или пароль неверный.');
          }
        }

        // --- Отправка основной формы ---
        else {
          alert('✅ Форма успешно отправлена!');
          inputs.forEach(i => i.value = '');
        }
      }
    });
  });

  // === Получение cookie по имени ===
  function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? matches[1] : undefined;
  }

});
