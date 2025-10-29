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
let lastScrollY = window.scrollY;
let nav = document.querySelector("nav");
let isFixed = false;
const SCROLL_THRESHOLD = 15;

if (nav) {
  nav.style.transition = "transform 0.4s ease, opacity 0.4s ease";
}

window.addEventListener("scroll", () => {
  if (!nav || isFixed) return; // если закреплено — не двигаем

  const currentScrollY = window.scrollY;
  const diff = currentScrollY - lastScrollY;

  if (Math.abs(diff) < SCROLL_THRESHOLD) return;

  if (currentScrollY > lastScrollY) {
    // скролл вниз
    nav.style.transform = window.innerWidth <= 768 ? "translateY(100%)" : "translateY(-120%)";
    nav.style.opacity = "0";
  } else {
    // скролл вверх
    nav.style.transform = "translateY(0)";
    nav.style.opacity = "1";
  }

  lastScrollY = currentScrollY;
});

/* =======================
   4) Тумблер фиксации панели (только мобильные)
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggleContainer = document.querySelector(".toggle-container");
  const toggle = document.getElementById("fixToggle");

  if (!toggle || !nav) return;

  let lastScroll = 0;

  // Показываем тумблер только на мобильных
  const updateToggleVisibility = () => {
    toggleContainer.style.display = window.innerWidth <= 768 ? "block" : "none";
  };
  updateToggleVisibility();
  window.addEventListener("resize", updateToggleVisibility);

  // Вибрация
  function vibrate(duration = 50) {
    if ("vibrate" in navigator) navigator.vibrate(duration);
  }

  // Звуки
  const soundOn = new Audio("sounds/pin_on.mp3");
  const soundOff = new Audio("sounds/pin_off.mp3");
  soundOn.volume = 0.5;
  soundOff.volume = 0.5;

  // Изменение состояния тумблера
  toggle.addEventListener("change", () => {
    isFixed = toggle.checked;

    if (isFixed) {
      // Панель зафиксирована — всегда видна
      nav.style.transition = "none";
      nav.style.transform = "translateY(0)";
      nav.style.opacity = "1";
      nav.classList.add("fixed");
      vibrate(80);
      soundOn.currentTime = 0;
      soundOn.play();
    } else {
      // Панель откреплена — возвращаем скролл-поведение
      nav.classList.remove("fixed");
      nav.style.transition = "transform 0.4s ease, opacity 0.4s ease";
      vibrate(40);
      soundOff.currentTime = 0;
      soundOff.play();
    }
  });

  // Поведение панели при скролле (если не закреплена)
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) {
      if (!isFixed) {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScroll + 10) {
          nav.style.transform = "translateY(100%)"; // скрыть вниз
          nav.style.opacity = "0";
        } else if (currentScroll < lastScroll - 10) {
          nav.style.transform = "translateY(0)"; // показать вверх
          nav.style.opacity = "1";
        }
        lastScroll = currentScroll;
      } else {
        // если закреплено — панель всегда видна
        nav.style.transform = "translateY(0)";
        nav.style.opacity = "1";
      }
    }
  });
});
