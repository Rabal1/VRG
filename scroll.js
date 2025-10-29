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