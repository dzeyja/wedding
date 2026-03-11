const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function pad2(n) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function setupRevealOnScroll() {
  const revealEls = $$(".reveal");
  if (revealEls.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) ent.target.classList.add("is-in");
      }
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  for (const el of revealEls) io.observe(el);
}

function setupCountdown() {
  const daysEl = $('[data-cd="days"]');
  const hoursEl = $('[data-cd="hours"]');
  const minsEl = $('[data-cd="mins"]');
  const secsEl = $('[data-cd="secs"]');
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Wedding date: 15 August 2026, 19:00 (local time)
  const target = new Date(2026, 7, 15, 19, 0, 0);

  const tick = () => {
    const now = new Date();
    const diffMs = target - now;
    const total = Math.max(0, Math.floor(diffMs / 1000));

    const days = Math.floor(total / (24 * 3600));
    const hours = Math.floor((total % (24 * 3600)) / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    // In the reference days look like 3 digits
    daysEl.textContent = String(days).padStart(3, "0");
    hoursEl.textContent = pad2(hours);
    minsEl.textContent = pad2(mins);
    secsEl.textContent = pad2(secs);
  };

  tick();
  window.setInterval(tick, 1000);
}

function setupRSVP() {
  const form = $("#rsvpForm");
  const ok = $("#rsvpOk");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (ok) ok.hidden = false;
    form.reset();
  });
}

function setupMapLink() {
  const link = $("#mapLink");
  if (!link) return;

  // Replace with real map URL later.
  link.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Карта сілтемесін осында қойыңыз (2GIS/Google Maps).");
  });
}

function setupBubbles() {
  const host = $("#bubbleBg");
  if (!host) return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return;

  const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
  const page = $("#page");
  const rect = page ? page.getBoundingClientRect() : null;
  const w = Math.max(320, Math.round(rect?.width || window.innerWidth || 360));
  const h = Math.max(560, Math.round(rect?.height || window.innerHeight || 640));

  const count = Math.round(Math.min(34, Math.max(14, (w * h) / 30000)));
  const bubbles = [];

  const rand = (a, b) => a + Math.random() * (b - a);

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "bubble";

    const size = rand(22, 110);
    const x = rand(-6, 106);
    const a = rand(0.10, 0.34);
    const scale = rand(0.85, 1.15);
    const dur = rand(16, 38);
    const delay = rand(-dur, 0);
    const rise = rand(0, 220);
    const drift = rand(-60, 60);
    const sway = rand(-18, 18);
    const swayDur = rand(3.5, 7.5);

    el.style.setProperty("--size", String(size));
    el.style.setProperty("--x", String(x));
    el.style.setProperty("--a", String(a));
    el.style.setProperty("--scale", String(scale));
    el.style.setProperty("--dur", `${dur.toFixed(2)}s`);
    el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
    el.style.setProperty("--rise", String(rise.toFixed(0)));
    el.style.setProperty("--drift", String(drift.toFixed(1)));
    el.style.setProperty("--sway", String(sway.toFixed(1)));
    el.style.setProperty("--swayDur", `${swayDur.toFixed(2)}s`);
    el.style.setProperty("--mx", "0");

    host.appendChild(el);
    bubbles.push(el);
  }

  if (isCoarse) return;

  // Subtle parallax response to mouse movement (lightweight, throttled).
  let targetX = 0;
  let targetY = 0;
  let raf = 0;

  const apply = () => {
    raf = 0;
    const mx = targetX * 14;
    const my = targetY * 10;
    for (let i = 0; i < bubbles.length; i++) {
      const k = (i % 9) / 9; // varied depth
      bubbles[i].style.setProperty("--mx", String(mx * (0.18 + k * 0.22)));
      bubbles[i].style.transform = `translate3d(0, ${my * (0.06 + k * 0.10)}px, 0)`;
    }
  };

  window.addEventListener(
    "mousemove",
    (e) => {
      const r = page ? page.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      const cx = Math.min(Math.max(e.clientX - r.left, 0), r.width);
      const cy = Math.min(Math.max(e.clientY - r.top, 0), r.height);
      const nx = (cx / r.width) * 2 - 1;
      const ny = (cy / r.height) * 2 - 1;
      targetX = nx;
      targetY = ny;
      if (!raf) raf = window.requestAnimationFrame(apply);
    },
    { passive: true }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  setupBubbles();
  setupRevealOnScroll();
  setupCountdown();
  setupRSVP();
  setupMapLink();
});

