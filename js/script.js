const body = document.body;
const nav = document.querySelector(".main-nav");
const navPanel = document.querySelector(".nav-links");

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
