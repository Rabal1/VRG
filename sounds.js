// script.js — объединённый скрипт: click sound, depth parallax, robust startup sound

/* =======================
   Конфигурация
   ======================= */
const CLICK_PATH = "sounds/click.wav";
const STARTUP_PATH = "sounds/startsounds1.wav";
const CLICK_VOLUME = 0.4;
const STARTUP_VOLUME = 0.35;

/* =======================
   1) Звук клика (простая реализация через Audio)
   ======================= */
const clickSound = new Audio(CLICK_PATH);
clickSound.volume = CLICK_VOLUME;

function playClick() {
  try {
    clickSound.currentTime = 0;
    // play() возвращает промис — ловим ошибку, если автоплей/взаимодействие заблокировано для звука
    clickSound.play().catch(() => {
      // игнорируем — клик выполняется, но звук не разрешили
    });
  } catch (e) {
    // безопасный заглуш
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Навешиваем на все кликабельные элементы
  const clickable = document.querySelectorAll("a, button");
  clickable.forEach(el => {
    el.addEventListener("click", playClick);
  });
});

/* =======================
   2) Параллакс фона (плавный) — только для ПК (ширина > 768)
   ======================= */
let mouseX = 0, mouseY = 0;
let targetX = 50, targetY = 50;
let currentX = 50, currentY = 50;
let isMoving = false;

document.addEventListener("mousemove", (e) => {
  if (window.innerWidth > 768) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 10;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 10;
    targetX = 50 + mouseX;
    targetY = 50 + mouseY;
    isMoving = true;
  }
});

// Плавное обновление позиции фона с интервалом (можно заменить rAF, но интервал даёт стабильное поведение)
setInterval(() => {
  if (window.innerWidth > 768) {
    if (!isMoving) {
      targetX = 50;
      targetY = 50;
    } else {
      isMoving = false;
    }

    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    document.body.style.backgroundPosition = `${currentX}% ${currentY}%`;
  }
}, 30);

/* =======================
   3) Надёжный стартовый звук (WebAudio + interaction unlock)
   ======================= */

let audioCtx = null;
let startupBuffer = null;
let startupUnlocked = sessionStorage.getItem('vrg_startup_unlocked') === 'true';
let startupLoadAttempted = false;

// Загрузить и декодировать аудио в AudioBuffer
async function loadStartupBuffer(path) {
  try {
    // fetch с no-cache — гарантирует свежесть
    const resp = await fetch(path, { cache: 'no-cache' });
    if (!resp.ok) throw new Error('Fetch error ' + resp.status);
    const arrayBuffer = await resp.arrayBuffer();
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // decodeAudioData иногда даёт колбэки или промисы — используем промис-обёртку
    return await audioCtx.decodeAudioData(arrayBuffer.slice(0));
  } catch (err) {
    console.warn('Не удалось загрузить или декодировать стартовый звук:', err);
    return null;
  }
}

// Воспроизвести AudioBuffer один раз
function playStartupBufferOnce(buffer, volume = STARTUP_VOLUME) {
  if (!buffer) return Promise.reject('Startup buffer отсутствует');
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(audioCtx.destination);
  src.start(0);
  return Promise.resolve();
}

// Попытка автоплей (с асинхронной загрузкой, если нужно)
async function tryStartupAutoPlay() {
  if (!startupBuffer && !startupLoadAttempted) {
    startupLoadAttempted = true;
    startupBuffer = await loadStartupBuffer(STARTUP_PATH);
  }
  if (!startupBuffer) return false;

  // если контекст suspended — пробуем resume
  if (audioCtx && audioCtx.state === 'suspended') {
    try { await audioCtx.resume(); } catch (e) { /* ignore */ }
  }

  try {
    await playStartupBufferOnce(startupBuffer, STARTUP_VOLUME);
    sessionStorage.setItem('vrg_startup_unlocked', 'true');
    startupUnlocked = true;
    return true;
  } catch (err) {
    return false;
  }
}

// Функция разблокировки и воспроизведения при первом взаимодействии
async function unlockStartupAndPlay() {
  if (startupUnlocked) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') {
      try { await audioCtx.resume(); } catch (e) { /* ignore */ }
    }
    if (!startupBuffer) startupBuffer = await loadStartupBuffer(STARTUP_PATH);
    if (startupBuffer) {
      await playStartupBufferOnce(startupBuffer, STARTUP_VOLUME);
      sessionStorage.setItem('vrg_startup_unlocked', 'true');
      startupUnlocked = true;
    } else {
      // fallback: пробуем через HTMLAudio как запасной вариант
      try {
        const fallback = new Audio(STARTUP_PATH);
        fallback.volume = STARTUP_VOLUME;
        await fallback.play().catch(() => {});
        sessionStorage.setItem('vrg_startup_unlocked', 'true');
        startupUnlocked = true;
      } catch (e) {
        // ничего
      }
    }
  } catch (err) {
    console.warn('unlockStartupAndPlay failed:', err);
  } finally {
    // слушатели настроены с { once: true }, они снимутся автоматически
  }
}

// Добавляем слушатели взаимодействий (однократно) для "разблокировки" звука
function addStartupInteractionListeners() {
  const events = ['click', 'touchstart', 'keydown', 'focus'];
  events.forEach(ev => {
    document.addEventListener(ev, unlockStartupAndPlay, { passive: true, capture: true, once: true });
  });
  document.addEventListener('visibilitychange', function onVis() {
    if (document.visibilityState === 'visible' && !startupUnlocked) {
      unlockStartupAndPlay();
    }
  }, { passive: true });
}

// Инициализация стартап-звука при загрузке
window.addEventListener('load', async () => {
  // preload buffer (необязательно, но ускоряет)
  try {
    startupBuffer = await loadStartupBuffer(STARTUP_PATH);
  } catch (e) {
    startupBuffer = null;
  }

  // Если уже ранее разблокировано в этой сессии — попробуем сразу воспроизвести
  if (startupUnlocked) {
    tryStartupAutoPlay().catch(() => {});
    return;
  }

  // 1) Попытка автоплея через небольшую задержку — иногда это срабатывает
  setTimeout(async () => {
    const ok = await tryStartupAutoPlay();
    if (!ok) {
      // 2) если не получилось — добавляем слушатели для разблокировки при взаимодействии
      addStartupInteractionListeners();
    }
  }, 300);

  // Гарантированно добавляем слушатели, чтобы реагировать на первое взаимодействие
  addStartupInteractionListeners();
});
