// Вывод на страницу
function log(message) {
  document.getElementById("output").textContent += message + "\n";
}
function clearLog() {
  document.getElementById("output").textContent = "";
}

// Объект управления пользователями
let userManager = {
  users: [
    { name: "Иван", age: 22 },
    { name: "Мария", age: 19 }
  ],

  addUser(name, age) {
    this.users.push({ name: name, age: age });
    log(`Пользователь ${name} (${age} лет) добавлен`);
  },

  removeUser(name) {
    let index = this.users.findIndex(user => user.name === name);
    if (index !== -1) {
      let removed = this.users.splice(index, 1)[0];
      log(`Пользователь ${removed.name} (${removed.age} лет) удалён`);
    } else {
      log(`Пользователь ${name} не найден`);
    }
  },

  listUsers() {
    if (this.users.length === 0) {
      log("Список пуст");
      return;
    }
    log("Текущие пользователи:");
    for (let user of this.users) {
      log(`- ${user.name}, возраст: ${user.age}`);
    }
  },

  findUserByAge(age) {
    let results = this.users.filter(user => user.hasOwnProperty("age") && user.age === age);

    if (results.length > 0) {
        log("Найдены пользователи с возрастом " + age + ":");
        results.forEach(u => log(`- ${u.name}, возраст: ${u.age}`));
    } else {
        log("Пользователи с возрастом " + age + " не найдены");
    }
  }

};

// Функции для кнопок
function addUser() {
  clearLog();
  let name = document.getElementById("userName").value.trim();
  let age = parseInt(document.getElementById("userAge").value);

  if (name && age) {
    userManager.addUser(name, age);
    userManager.listUsers();
  } else {
    log("Введите имя и возраст!");
  }
}

function removeUser() {
  clearLog();
  let name = document.getElementById("userName").value.trim();

  if (name) {
    userManager.removeUser(name);
    userManager.listUsers();
  } else {
    log("Введите имя!");
  }
}

function listUsers() {
  clearLog();
  userManager.listUsers();
}

function findUserByAge() {
  clearLog();
  let age = parseInt(document.getElementById("searchAge").value);

  if (!isNaN(age)) {
    userManager.findUserByAge(age);
  } else {
    log("Введите возраст для поиска!");
  }
}
