/* =======================
   4) Плавный скролл (ПК + мобильные)
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  // CSS-плавность для всех устройств
  document.documentElement.style.scrollBehavior = "smooth";

  // Дополнительно: плавный переход по якорям вручную (если нужно точнее)
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
   5) Скрытие/показ навигации при скролле
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  let lastScroll = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;

        // На мобильных: панель снизу, на ПК — сверху
        const isMobile = window.innerWidth <= 768;

        if (currentScroll > lastScroll + 10) {
          // Скроллим вниз → скрываем
          if (isMobile) {
            nav.style.transform = "translateY(100%)";
          } else {
            nav.style.transform = "translateY(-120%)";
            nav.style.opacity = "0";
          }
        } else if (currentScroll < lastScroll - 10) {
          // Скроллим вверх → показываем
          nav.style.transform = "translateY(0)";
          nav.style.opacity = "1";
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Устанавливаем плавность для анимации
  nav.style.transition = "transform 0.4s ease, opacity 0.4s ease";
});
/* =======================
   6) Анимация появления навигации при загрузке
   ======================= */
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const isMobile = window.innerWidth <= 768;

  // Начальная позиция — вне экрана
  nav.style.opacity = "0";
  nav.style.transform = isMobile ? "translateY(100%)" : "translateY(-100%)";

  // Плавное появление через 200 мс
  setTimeout(() => {
    nav.style.transition = "transform 0.6s ease, opacity 0.6s ease";
    nav.style.transform = "translateY(0)";
    nav.style.opacity = "1";
  }, 200);
});
// Фиксация навигационной панели при скролле
let lastScroll = 0;
let isPinned = false;

const nav = document.querySelector("nav");
const pinToggle = document.getElementById("pin-toggle");

// Звуки
const soundOn = new Audio("sounds/pin_on.mp3");
const soundOff = new Audio("sounds/pin_off.mp3");
soundOn.volume = 0.5;
soundOff.volume = 0.5;

// Плавный скролл для всех устройств
document.documentElement.style.scrollBehavior = "smooth";

// Логика скрытия/появления панели при скролле
window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) {
    // Только для мобильных
    if (isPinned) return; // если закреплена — не двигаем
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll) {
      nav.style.transform = "translateY(100%)"; // уходит вниз
    } else {
      nav.style.transform = "translateY(0)"; // возвращается
    }

    lastScroll = currentScroll;
  }
});

// Вибрация
function vibrate(duration = 50) {
  if ("vibrate" in navigator) {
    navigator.vibrate(duration);
  }
}

// При клике на кнопку 📌
pinToggle.addEventListener("click", () => {
  isPinned = !isPinned;

  if (isPinned) {
    nav.style.transform = "translateY(0)";
    nav.style.transition = "transform 0.3s ease";
    vibrate(80);
    soundOn.currentTime = 0;
    soundOn.play();
  } else {
    nav.style.transition = "transform 0.3s ease";
    vibrate(40);
    soundOff.currentTime = 0;
    soundOff.play();
  }

  pinToggle.style.color = isPinned ? "#00c8ff" : "white";
});

// === Тумблер фиксации панели ===
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const toggle = document.getElementById("fixToggle");
  let fixed = false;
  let lastScroll = 0;

  if (toggle) {
    toggle.addEventListener("change", () => {
      fixed = toggle.checked;

      if (fixed) {
        nav.style.transition = "none";
        nav.style.transform = "translateY(0)";
        nav.classList.add("fixed");
      } else {
        nav.classList.remove("fixed");
      }
    });
  }

  window.addEventListener("scroll", () => {
    if (!fixed && window.innerWidth <= 768) {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) {
        nav.style.transform = "translateY(100%)"; // скрыть вниз
      } else {
        nav.style.transform = "translateY(0)"; // показать вверх
      }
      lastScroll = currentScroll;
    }
  });
});

// Показываем тумблер только на мобильных устройствах
document.addEventListener("DOMContentLoaded", () => {
  const toggleContainer = document.querySelector(".toggle-container");
  if (toggleContainer) {
    if (window.innerWidth <= 768) {
      toggleContainer.style.display = "block";
    } else {
      toggleContainer.style.display = "none";
    }

    // При изменении ориентации/размера окна
    window.addEventListener("resize", () => {
      toggleContainer.style.display = window.innerWidth <= 768 ? "block" : "none";
    });
  }
});