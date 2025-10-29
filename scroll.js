/* =======================
   1) Плавный скролл (ПК + мобильные)
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.style.scrollBehavior = "smooth";

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});

/* =======================
   2) Анимация появления навигации при загрузке
   ======================= */
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const isMobile = window.innerWidth <= 768;
  nav.style.opacity = "0";
  nav.style.transform = isMobile ? "translateY(100%)" : "translateY(-100%)";

  setTimeout(() => {
    nav.style.transition = "transform 0.6s ease, opacity 0.6s ease";
    nav.style.transform = "translateY(0)";
    nav.style.opacity = "1";
  }, 200);
});

/* =======================
   3) Основное поведение панели при скролле
   ======================= */
let nav = document.querySelector("nav");
let isFixed = false;
const SCROLL_THRESHOLD = 15;

if (nav) {
  nav.style.transition = "opacity 0.4s ease";
}

/* =======================
   4) Тумблер фиксации панели (только мобильные)
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggleContainer = document.querySelector(".toggle-container");
  const toggle = document.getElementById("fixToggle");
  const nav = document.querySelector("nav");

  if (!toggle || !nav) return;

  let soundsReady = false;

  // ====== Разрешение на звук и вибрацию ======
  const soundOn = new Audio("sounds/pin_on.mp3");
  const soundOff = new Audio("sounds/pin_off.mp3");
  soundOn.volume = 0.5;
  soundOff.volume = 0.5;

  function vibrate(duration = 50) {
    if ("vibrate" in navigator) navigator.vibrate(duration);
  }

  // Разрешаем звуки и вибрацию после первого взаимодействия
  document.addEventListener(
    "touchstart",
    () => {
      if (!soundsReady) {
        soundOn.play().catch(() => {});
        soundOff.play().catch(() => {});
        soundsReady = true;
      }
    },
    { once: true }
  );

  // ====== Отображение тумблера ======
  const updateToggleVisibility = () => {
    toggleContainer.style.display = window.innerWidth <= 768 ? "block" : "none";
  };
  updateToggleVisibility();
  window.addEventListener("resize", updateToggleVisibility);

  // ====== Поведение при изменении тумблера ======
  toggle.addEventListener("change", () => {
    isFixed = toggle.checked;

    if (isFixed) {
      // ВКЛЮЧЕН — показываем панель
      nav.style.opacity = "1";
      nav.style.pointerEvents = "auto";
      nav.classList.add("fixed");
      vibrate(80);
      if (soundsReady) {
        soundOn.currentTime = 0;
        soundOn.play();
      }
    } else {
      // ВЫКЛЮЧЕН — скрываем панель
      nav.style.opacity = "0";
      nav.style.pointerEvents = "none";
      nav.classList.remove("fixed");
      vibrate(40);
      if (soundsReady) {
        soundOff.currentTime = 0;
        soundOff.play();
      }
    }
  });

  // ====== Обработка скролла ======
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) {
      if (!isFixed) {
        // Панель скрыта — ничего не делаем
        nav.style.opacity = "0";
        nav.style.pointerEvents = "none";
      } else {
        // Панель закреплена — всегда видна
        nav.style.opacity = "1";
        nav.style.pointerEvents = "auto";
      }
    }
  });
});
