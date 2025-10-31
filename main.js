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
