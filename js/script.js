const body = document.body;
const nav = document.querySelector(".main-nav");
const navPanel = document.querySelector(".nav-links");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (body && !prefersReducedMotion.matches && !document.querySelector(".ambient-lights")) {
  const ambientLights = document.createElement("div");
  ambientLights.className = "ambient-lights";

  const lights = [
    { left: "8%", top: "18%", size: "8px", duration: "11s", delay: "-2s", drift: "18px", tone: "warm" },
    { left: "16%", top: "64%", size: "6px", duration: "14s", delay: "-7s", drift: "22px", tone: "cool" },
    { left: "26%", top: "34%", size: "10px", duration: "13s", delay: "-3s", drift: "26px", tone: "warm" },
    { left: "38%", top: "72%", size: "7px", duration: "12s", delay: "-5s", drift: "16px", tone: "warm" },
    { left: "48%", top: "14%", size: "5px", duration: "10s", delay: "-1s", drift: "20px", tone: "cool" },
    { left: "58%", top: "52%", size: "9px", duration: "15s", delay: "-6s", drift: "24px", tone: "warm" },
    { left: "68%", top: "22%", size: "7px", duration: "12s", delay: "-4s", drift: "18px", tone: "cool" },
    { left: "78%", top: "68%", size: "6px", duration: "14s", delay: "-8s", drift: "20px", tone: "warm" },
    { left: "86%", top: "30%", size: "11px", duration: "16s", delay: "-9s", drift: "28px", tone: "cool" },
    { left: "92%", top: "58%", size: "6px", duration: "13s", delay: "-2s", drift: "14px", tone: "warm" }
  ];

  lights.forEach((lightData) => {
    const light = document.createElement("span");
    light.className = `ambient-light ambient-light-${lightData.tone}`;
    light.style.setProperty("--light-left", lightData.left);
    light.style.setProperty("--light-top", lightData.top);
    light.style.setProperty("--light-size", lightData.size);
    light.style.setProperty("--light-duration", lightData.duration);
    light.style.setProperty("--light-delay", lightData.delay);
    light.style.setProperty("--light-drift", lightData.drift);
    ambientLights.appendChild(light);
  });

  body.prepend(ambientLights);
}

if (nav && navPanel && !document.querySelector(".main-nav .hamburger")) {
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.type = "button";
  hamburger.setAttribute("aria-label", "Open menu");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.innerHTML = "<span></span><span></span><span></span>";
  nav.appendChild(hamburger);

  const closeMenu = () => {
    nav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

const modalBtns = document.querySelectorAll(".open-modal");
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".close-modal");
const portfolioItems = document.querySelectorAll(".portfolio-item");

modals.forEach((modal) => {
  if (modal.querySelector(".modal-floating-close")) return;
  const floatingClose = document.createElement("button");
  floatingClose.className = "modal-floating-close";
  floatingClose.type = "button";
  floatingClose.setAttribute("aria-label", "Sluit venster");
  floatingClose.innerHTML = "&times;";
  floatingClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closeModal(modal);
  });
  modal.appendChild(floatingClose);
});

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  body.style.overflow = "hidden";

  const modalVideo = modal.querySelector("video");
  if (modalVideo) {
    modalVideo.currentTime = 0;
    const playPromise = modalVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  const modalEmbed = modal.querySelector("iframe[data-embed-src]");
  if (modalEmbed && !modalEmbed.getAttribute("src")) {
    modalEmbed.setAttribute("src", modalEmbed.dataset.embedSrc || "");
  }
}

function closeModal(modal) {
  if (!modal) return;
  const modalVideo = modal.querySelector("video");
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }
  const modalEmbed = modal.querySelector("iframe[data-embed-src]");
  if (modalEmbed) {
    modalEmbed.setAttribute("src", "");
  }
  modal.classList.remove("active");
  body.style.overflow = "";
}

portfolioItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (event.target.closest(".open-modal")) return;
    openModal(document.getElementById(item.getAttribute("data-modal")));
  });
});

modalBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    const parent = btn.closest(".portfolio-item");
    openModal(document.getElementById(parent?.getAttribute("data-modal")));
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal(btn.closest(".modal"));
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  modals.forEach((modal) => {
    if (modal.classList.contains("active")) closeModal(modal);
  });
});

const contactForm = document.getElementById("contact-form");
const contactModal = document.getElementById("contact-modal");
const bevestiging = document.getElementById("bevestiging");

if (contactForm && contactModal && bevestiging) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const naam = contactForm.naam.value;
    const datum = contactForm.datum.value;
    const tijd = contactForm.tijd.value;

    bevestiging.textContent = `Bedankt ${naam}. Je gesprek staat voorlopig op ${datum} om ${tijd}. Ik neem snel contact met je op via het ingevulde e-mailadres.`;
    openModal(contactModal);
    contactForm.reset();
  });
}

const exploreBtn = document.getElementById("explore-btn");
const portfolioSection = document.getElementById("portfolio");

if (exploreBtn && portfolioSection) {
  exploreBtn.addEventListener("click", (event) => {
    event.preventDefault();
    portfolioSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const hiddenProjects = document.querySelectorAll(".portfolio-item-hidden");
const portfolioToggle = document.getElementById("portfolio-toggle");
let archiveOpen = false;

if (portfolioToggle && hiddenProjects.length) {
  portfolioToggle.addEventListener("click", () => {
    archiveOpen = !archiveOpen;
    hiddenProjects.forEach((item) => {
      item.classList.toggle("is-visible", archiveOpen);
    });
    portfolioToggle.textContent = archiveOpen ? "Verberg archive projecten" : "Toon archive projecten";
  });
}

const portfolioFilters = document.querySelectorAll(".portfolio-filter");

if (portfolioFilters.length && portfolioItems.length) {
  portfolioFilters.forEach((filterBtn) => {
    filterBtn.addEventListener("click", () => {
      const filter = filterBtn.dataset.filter || "all";

      portfolioFilters.forEach((btn) => {
        btn.classList.toggle("is-active", btn === filterBtn);
      });

      portfolioItems.forEach((item) => {
        const categories = (item.dataset.category || "").split(/\s+/).filter(Boolean);
        const matches = filter === "all" || categories.includes(filter);
        item.classList.toggle("is-filter-hidden", !matches);
      });
    });
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id") || "";
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("is-active", isActive);
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);
