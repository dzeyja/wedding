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

document.addEventListener("DOMContentLoaded", () => {
  setupRevealOnScroll();
  setupCountdown();
  setupRSVP();
  setupMapLink();
});

