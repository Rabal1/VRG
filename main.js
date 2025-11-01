document.addEventListener("DOMContentLoaded", () => {
  const toggleContainer = document.querySelector(".toggle-container");
  const toggle = document.getElementById("fixToggle");
  const nav = document.querySelector("nav");

  if (!toggleContainer || !toggle || !nav) return;

  let isFixed = true; // тумблер включён по умолчанию
  let soundsReady = false;

  const soundOn = new Audio("sounds/pin_on.mp3");
  const soundOff = new Audio("sounds/pin_off.mp3");
  soundOn.volume = 0.5;
  soundOff.volume = 0.5;

  function vibrate(duration = 50) {
    if ("vibrate" in navigator) navigator.vibrate(duration);
  }

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

  const updateToggleVisibility = () => {
    if (window.innerWidth <= 768) {
      toggleContainer.style.display = "flex";
      toggleContainer.style.justifyContent = "center";
      toggleContainer.style.alignItems = "center";
      toggle.checked = true;
      nav.style.opacity = "1";
      nav.style.transform = "translateY(0)";
      nav.style.pointerEvents = "auto";
    } else {
      toggleContainer.style.display = "none";
      toggle.checked = false;
      nav.style.opacity = "1";
      nav.style.transform = "translateY(0)";
      nav.style.pointerEvents = "auto";
    }
  };
  updateToggleVisibility();
  window.addEventListener("resize", updateToggleVisibility);

  toggle.addEventListener("change", () => {
    isFixed = toggle.checked;

    if (isFixed) {
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

// services.js — подключать после main.js (или вместо, но после DOM)
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // селекторы карточек
    const serviceCards = Array.from(document.querySelectorAll('.service-card'));
    const subscriptionCards = Array.from(document.querySelectorAll('.subscription-card'));

    // функция: применить видимость с поочерёдной задержкой
    function revealWithStagger(nodes, staggerMs = 120) {
      nodes.forEach((node, i) => {
        // если уже видимый — пропускаем
        if (node.classList.contains('visible')) return;
        // ставим задержку через setTimeout, чтобы избежать конфликтов с transition-delay
        setTimeout(() => node.classList.add('visible'), i * staggerMs);
      });
    }

    // общий observer создаваться только если поддерживается
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.12
      };

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const target = entry.target;

          // определяем набор: service-card или subscription-card
          if (target.classList.contains('service-card')) {
            // получаем все карточки в той же сетке (по месту в DOM)
            const group = serviceCards.filter(n => n.isConnected);
            revealWithStagger(group);
          } else if (target.classList.contains('subscription-card')) {
            const group = subscriptionCards.filter(n => n.isConnected);
            revealWithStagger(group);
          }

          // перестаём наблюдать контейнер (one-time)
          obs.unobserve(target);
        });
      }, observerOptions);

      // наблюдаем за первой карточкой в каждой группе (чтобы поймать момент входа секции)
      if (serviceCards.length) observer.observe(serviceCards[0]);
      if (subscriptionCards.length) observer.observe(subscriptionCards[0]);

    } else {
      // fallback: раскрываем всё при скролле/resize после небольшой задержки
      function fallbackReveal() {
        // простой вид: если элемент в viewport -> покажем
        const inViewport = (el) => {
          const r = el.getBoundingClientRect();
          return (r.top < window.innerHeight * 0.9) && (r.bottom > 0);
        };
        if (serviceCards.length) {
          revealWithStagger(serviceCards.filter(inViewport));
        }
        if (subscriptionCards.length) {
          revealWithStagger(subscriptionCards.filter(inViewport));
        }
      }
      // запуск и привязка
      fallbackReveal();
      window.addEventListener('scroll', throttle(fallbackReveal, 200));
      window.addEventListener('resize', throttle(fallbackReveal, 250));
    }

    // Простая throttle
    function throttle(fn, wait) {
      let t = null;
      return function (...args) {
        if (t) return;
        t = setTimeout(() => {
          fn.apply(this, args);
          t = null;
        }, wait);
      };
    }

    // Дополнительно: для кнопок "Подключить" — можно повешать простую заглушку
    document.querySelectorAll('.subscribe-btn, .service-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // здесь можно запустить модальное окно или переход на оплату
        // сейчас — быстрый UX-ответ:
        btn.disabled = true;
        btn.textContent = 'Готово';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = btn.classList.contains('subscribe-btn') ? 'Подключить' : 'Подробнее';
        }, 1200);
      });
    });
  });
})();
