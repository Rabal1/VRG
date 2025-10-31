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
   2) Плавное появление навигации при загрузке (без подпрыгивания)
   ======================= */
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const isMobile = window.innerWidth <= 768;

  // Начальные стили
  nav.style.opacity = "0";
  nav.style.transform = isMobile ? "translateY(80px)" : "translateY(-40px)";
  nav.style.transition = "none";

  // Плавное появление без подскока
  setTimeout(() => {
    nav.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    nav.style.opacity = "1";
    nav.style.transform = "translateY(0)";
  }, 200);
});

/* =======================
   3) Логика тумблера фиксации панели (только мобильные)
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggleContainer = document.querySelector(".toggle-container");
  const toggle = document.getElementById("fixToggle");
  const nav = document.querySelector("nav");

  if (!toggleContainer || !toggle || !nav) return;

  let isFixed = false;
  let soundsReady = false;

  // ====== Звуки ======
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
    if (window.innerWidth <= 768) {
      toggleContainer.style.display = "flex";
      toggleContainer.style.justifyContent = "center";
      toggleContainer.style.alignItems = "center";
    } else {
      toggleContainer.style.display = "none"; // Полностью скрыт на ПК
      toggle.checked = false; // Сбрасываем состояние при переходе на ПК
    }
  };
  updateToggleVisibility();
  window.addEventListener("resize", updateToggleVisibility);

  // ====== Поведение при изменении тумблера ======
  toggle.addEventListener("change", () => {
    isFixed = toggle.checked;

    if (isFixed) {
      // ВКЛЮЧЕН — плавно показываем панель
      nav.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      nav.style.opacity = "1";
      nav.style.transform = "translateY(0)";
      nav.style.pointerEvents = "auto";
      nav.classList.add("fixed");
      vibrate(80);
      if (soundsReady) {
        soundOn.currentTime = 0;
        soundOn.play();
      }
    } else {
      // ВЫКЛЮЧЕН — плавно скрываем панель
      nav.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      nav.style.opacity = "0";
      nav.style.transform = "translateY(80px)";
      nav.style.pointerEvents = "none";
      nav.classList.remove("fixed");
      vibrate(40);
      if (soundsReady) {
        soundOff.currentTime = 0;
        soundOff.play();
      }
    }
  });

  // ====== Стабильность при скролле ======
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) {
      if (!isFixed) {
        nav.style.opacity = "0";
        nav.style.transform = "translateY(80px)";
        nav.style.pointerEvents = "none";
      } else {
        nav.style.opacity = "1";
        nav.style.transform = "translateY(0)";
        nav.style.pointerEvents = "auto";
      }
    }
  });
});
/* =======================
   Плавный скролл с easing
   ======================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const targetId = this.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      smoothScrollTo(target.offsetTop, 800); // 800ms длительность
    }
  });
});

// Функция плавного скролла с easeInOutCubic
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    if (elapsed < duration) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
