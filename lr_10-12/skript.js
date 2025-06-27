function calculateY(x) {
  // Проверка на число
  if (isNaN(x)) {
    alert("Ошибка: введено не число");
    return "Ошибка";
  }

  // Вычисляем знаменатель
  const denominator = x * x + 3 * x + 4;

  // Проверка на деление на 0
  if (denominator === 0) {
    alert("Ошибка: деление на ноль");
    return "Ошибка";
  }

  // Формула y = (3 - x) / (x² + 3x + 4)
  const y = (3 - x) / denominator;

  // Проверка на недопустимые значения
  if (!isFinite(y)) {
    alert("Ошибка: результат не является конечным числом");
    return "Ошибка";
  }

  return y.toFixed(3); // округление до 3 знаков
}
