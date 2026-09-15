(() => {
  const carousel = document.querySelector("#phoneCarousel");
  const stage = document.querySelector("#carouselStage");
  const dots = document.querySelector("#carouselDots");
  const slideNumber = document.querySelector("#slideNumber");
  const modal = document.querySelector("#screenModal");
  const modalScreen = document.querySelector("#modalScreen");
  const modalCaption = document.querySelector("#modalCaption");

  const appScreens = [
    {
      kicker: "Good morning, Mia",
      title: "Your daily\nedit.",
      glow: "#f2c2cf",
      activePill: "For you",
      image: "stylish-app-screen-1.png",
    },
    {
      kicker: "Trending now",
      title: "Made to\nmove.",
      glow: "#c9d8f8",
      activePill: "New in",
      image: "stylish-app-screen-2.png",
    },
    {
      kicker: "Your saved list",
      title: "Pieces\nyou love.",
      glow: "#ded0e9",
      activePill: "Saved",
      image: "stylish-app-screen-3.png",
    },
    {
      kicker: "Fast delivery",
      title: "At your\ndoor.",
      glow: "#f3dfb8",
      activePill: "Nearby",
      image: "stylish-app-screen-4.png",
    },
  ];

  let currentSlide = 0;
  let startX = 0;
  let dragging = false;
  let moved = false;
  let cards = [];
  let dotButtons = [];
  const mobileMode = window.matchMedia("(max-width: 699px)");

  function screenMarkup(screen, index) {
    if (screen.image) {
      return `
        <div class="app-screen screenshot-screen">
          <img src="${screen.image}" alt="Stylish shopping app screen" decoding="async" />
        </div>
      `;
    }

    const products = [
      ["Silk Bias Dress", "$120", "fashion-image"],
      ["Soft Structure", "$89", "fashion-image blue-fashion"],
      ["The Daily Knit", "$78", "fashion-image black-fashion"],
      ["Sunday Trousers", "$96", "fashion-image yellow-fashion"],
    ];

    const first = products[index];
    const second = products[(index + 1) % products.length];
    const title = screen.title.replace("\n", "<br />");

    return `
      <div class="app-screen" style="--screen-glow: ${screen.glow}">
        <div class="app-topbar">
          <span>9:41</span>
          <span>▴ )))</span>
        </div>
        <div class="app-kicker">${screen.kicker}</div>
        <div class="app-title">${title}</div>
        <div class="app-pill-row">
          <span class="app-pill ${screen.activePill === "For you" ? "active" : ""}">For you</span>
          <span class="app-pill ${screen.activePill === "New in" ? "active" : ""}">New in</span>
          <span class="app-pill ${screen.activePill === "Saved" ? "active" : ""}">Saved</span>
        </div>
        <div class="app-fashion-grid">
          <div class="app-fashion-item">
            <div class="${first[2]}"></div>
            <p>${first[0]}</p>
            <small>${first[1]}</small>
          </div>
          <div class="app-fashion-item">
            <div class="${second[2]}"></div>
            <p>${second[0]}</p>
            <small>${second[1]}</small>
          </div>
        </div>
      </div>
    `;
  }

  function createCarousel() {
    appScreens.forEach((screen, index) => {
      const card = document.createElement("article");
      card.className = "phone-card";
      card.dataset.index = index;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open Stylish app screen ${index + 1}`);
      card.innerHTML = screenMarkup(screen, index);

      card.addEventListener("click", () => {
        if (!moved) openModal(index);
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(index);
        }
      });

      carousel.appendChild(card);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show app screen ${index + 1}`);
      dot.addEventListener("click", () => setCurrentSlide(index));
      dots.appendChild(dot);
    });

    cards = [...carousel.querySelectorAll(".phone-card")];
    dotButtons = [...dots.children];
  }

  function renderCarousel() {
    cards.forEach((card, index) => {
      let offset = index - currentSlide;

      if (offset > 2) offset -= 4;
      if (offset < -2) offset += 4;

      const distance = Math.abs(offset);
      const scale = offset === 0 ? 1 : 0.82;
      const isMobile = mobileMode.matches;

      card.classList.toggle("active", offset === 0);
      card.style.zIndex = String(10 - distance);
      card.style.opacity = isMobile
        ? offset === 0
          ? "1"
          : "0"
        : distance > 1
          ? "0.24"
          : "1";
      card.style.filter = "none";
      card.style.visibility = isMobile && offset !== 0 ? "hidden" : "visible";
      card.style.pointerEvents = isMobile && offset !== 0 ? "none" : "auto";
      card.style.transform = isMobile
        ? `translateX(-50%) scale(${offset === 0 ? 1 : 0.96})`
        : `translateX(calc(-50% + ${offset * 116}px)) translateZ(${-distance * 120}px) rotateY(${offset * -34}deg) scale(${scale})`;
    });

    dotButtons.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });

    slideNumber.textContent = String(currentSlide + 1).padStart(2, "0");
  }

  function setCurrentSlide(index) {
    currentSlide = (index + appScreens.length) % appScreens.length;
    renderCarousel();
  }

  function nextSlide() {
    setCurrentSlide(currentSlide + 1);
  }

  function previousSlide() {
    setCurrentSlide(currentSlide - 1);
  }

  function startDrag(clientX) {
    startX = clientX;
    dragging = true;
    moved = false;
  }

  function endDrag(clientX) {
    if (!dragging) return;

    const distance = clientX - startX;
    moved = Math.abs(distance) > 8;

    if (Math.abs(distance) > 35) {
      distance < 0 ? nextSlide() : previousSlide();
    }

    dragging = false;
    window.setTimeout(() => {
      moved = false;
    }, 50);
  }

  function openModal(index) {
    const preview = document.createElement("article");
    preview.className = "phone-card active";
    preview.innerHTML = screenMarkup(appScreens[index], index);
    modalScreen.replaceChildren(preview);
    modalCaption.textContent = `Stylish app preview · screen ${String(index + 1).padStart(2, "0")}`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateCountdowns() {
    document.querySelectorAll("[data-countdown]").forEach((timer) => {
      let remaining = Number(timer.dataset.countdown);
      remaining = remaining <= 0 ? 3599 : remaining - 1;
      timer.dataset.countdown = remaining;

      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      timer.querySelector(".hours").textContent = String(hours).padStart(
        2,
        "0",
      );
      timer.querySelector(".minutes").textContent = String(minutes).padStart(
        2,
        "0",
      );
      timer.querySelector(".seconds").textContent = String(seconds).padStart(
        2,
        "0",
      );
    });
  }

  createCarousel();
  renderCarousel();
  if (!mobileMode.matches) {
    window.setInterval(nextSlide, 4200);
  }
  window.setInterval(updateCountdowns, 1000);

  document
    .querySelector(".carousel-arrow.next")
    .addEventListener("click", nextSlide);
  document
    .querySelector(".carousel-arrow.previous")
    .addEventListener("click", previousSlide);

  stage.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary) return;
    startDrag(event.clientX);
    stage.setPointerCapture?.(event.pointerId);
  });
  stage.addEventListener("pointerup", (event) => endDrag(event.clientX));
  stage.addEventListener("pointercancel", () => {
    dragging = false;
  });
  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
})();
