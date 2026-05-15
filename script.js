const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

window.addEventListener("load", () => {
  $(".loader")?.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const cursor = $(".cursor-glow");
  window.addEventListener("pointermove", (event) => {
    if (!cursor) return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  $$(".reveal").forEach((element) => revealObserver.observe(element));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.8 });

  $$("[data-counter]").forEach((counter) => counterObserver.observe(counter));

  $(".theme-toggle")?.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const icon = document.body.classList.contains("light-mode") ? "sun" : "moon";
    $(".theme-toggle").innerHTML = `<i data-lucide="${icon}"></i>`;
    if (window.lucide) window.lucide.createIcons();
  });

  const comparison = $(".comparison");
  const range = $(".compare-range");
  const beforeLayer = $(".before-layer");
  const handle = $(".compare-handle");

  range?.addEventListener("input", () => {
    const value = `${range.value}%`;
    beforeLayer.style.width = value;
    handle.style.left = value;
  });

  const reviews = [
    {
      text: "The diagnostic report was sharper than anything I have seen from a dealership. Fast, clean, premium.",
      author: "Marco R. - Audi S5"
    },
    {
      text: "Booked on WhatsApp, approved the quote, and had my brakes transformed the next morning.",
      author: "Elena V. - Mercedes GLC"
    },
    {
      text: "AutoFix Garage X feels like a performance lab. My gearbox service was flawless.",
      author: "Davide P. - BMW M340i"
    }
  ];

  let reviewIndex = 0;
  const renderReview = () => {
    $(".review-text").textContent = `"${reviews[reviewIndex].text}"`;
    $(".review-author").textContent = reviews[reviewIndex].author;
  };

  $(".review-prev")?.addEventListener("click", () => {
    reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
    renderReview();
  });

  $(".review-next")?.addEventListener("click", () => {
    reviewIndex = (reviewIndex + 1) % reviews.length;
    renderReview();
  });

  renderReview();
  setInterval(() => {
    reviewIndex = (reviewIndex + 1) % reviews.length;
    renderReview();
  }, 6000);

  const backToTop = $(".back-to-top");
  window.addEventListener("scroll", () => {
    backToTop?.classList.toggle("visible", window.scrollY > 700);
  });
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  $(".booking-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    $(".form-status").textContent = "Booking request staged. We will confirm shortly by phone or WhatsApp.";
    event.currentTarget.reset();
  });

  $(".contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    alert("Message ready. AutoFix Garage X will respond soon.");
  });
});

function animateCounter(element) {
  const target = Number(element.dataset.counter || 0);
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
