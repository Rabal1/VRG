// Загружаем звук клика
const clickSound = new Audio("sounds/click.wav");
clickSound.volume = 0.4; // громкость 40%

// Функция воспроизведения
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

// Применяем к ссылкам и кнопкам
document.addEventListener("DOMContentLoaded", () => {
  const clickable = document.querySelectorAll("a, button");
  clickable.forEach(el => {
    el.addEventListener("click", playClick);
  });
});
