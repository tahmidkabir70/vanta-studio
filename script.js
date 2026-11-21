
"use strict";

/* =================================
   VANTA STUDIO — INTERACTIONS
================================= */

document.addEventListener("DOMContentLoaded", () => {

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =================================
     1. SCROLL REVEAL ANIMATIONS
  ================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    revealElements.forEach(el => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* =================================
     2. MOBILE NAVIGATION
  ================================= */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
  });

  /* =================================
     3. HEADER SCROLL EFFECT
  ================================= */

  const header = document.getElementById("header");
  const scrollProgress = document.getElementById("scrollProgress");
  const backTop = document.getElementById("backTop");

  function handleScroll() {
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollHeight > 0
      ? (scrollTop / scrollHeight) * 100
      : 0;

    scrollProgress.style.width = `${progress}%`;

    header.classList.toggle("scrolled", scrollTop > 30);
    backTop.classList.toggle("visible", scrollTop > 500);
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  handleScroll();

  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "instant" : "smooth"
    });
  });

  /* =================================
     4. ACTIVE NAVIGATION
  ================================= */

  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px"
    }
  );

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  /* =================================
     5. CUSTOM CURSOR GLOW
  ================================= */

  const cursorGlow = document.getElementById("cursorGlow");

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let cursorFrame = null;

    document.addEventListener("mousemove", event => {
      if (cursorFrame) cancelAnimationFrame(cursorFrame);

      cursorFrame = requestAnimationFrame(() => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
      });
    });
  }

  /* =================================
     6. ANIMATED COUNTERS
  ================================= */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(element) {
    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      element.textContent = target;
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 4);

      element.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  /* =================================
     7. PROJECT FILTER
  ================================= */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => {
        btn.classList.toggle("active", btn === button);
      });

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const shouldShow =
          filter === "all" || category === filter;

        card.classList.toggle("filtered-out", !shouldShow);

        if (shouldShow) {
          card.style.animation = "none";
          void card.offsetWidth;
          card.style.animation = "projectEnter .4s ease both";
        }
      });
    });
  });

  /* =================================
     8. TESTIMONIAL SLIDER
  ================================= */

  const testimonials = [
    {
      text: "Great digital experiences don't happen by accident. They are built through curiosity, clarity and attention to detail.",
      name: "The VANTA Philosophy",
      role: "Our creative principles"
    },
    {
      text: "Design is not just about what people see. It is about how a product works, feels and creates value.",
      name: "Design First",
      role: "Our design approach"
    },
    {
      text: "Technology becomes meaningful when it solves real problems and makes everyday experiences better.",
      name: "Purposeful Technology",
      role: "Our development mindset"
    }
  ];

  let currentSlide = 0;

  const testimonialText = document.getElementById("testimonialText");
  const testimonialName = document.getElementById("testimonialName");
  const testimonialRole = document.getElementById("testimonialRole");
  const slideNumber = document.getElementById("slideNumber");

  function showTestimonial(index) {
    currentSlide =
      (index + testimonials.length) % testimonials.length;

    const item = testimonials[currentSlide];

    const content = document.querySelector(".testimonial-content");

    if (!reduceMotion) {
      content.style.opacity = "0";
      content.style.transform = "translateY(8px)";

      setTimeout(() => {
        updateContent(item);
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
      }, 180);
    } else {
      updateContent(item);
    }

    slideNumber.textContent =
      `${String(currentSlide + 1).padStart(2, "0")} / ${String(testimonials.length).padStart(2, "0")}`;
  }

  function updateContent(item) {
    testimonialText.textContent = item.text;
    testimonialName.textContent = item.name;
    testimonialRole.textContent = item.role;
  }

  document.getElementById("prevTestimonial")
    .addEventListener("click", () => {
      showTestimonial(currentSlide - 1);
    });

  document.getElementById("nextTestimonial")
    .addEventListener("click", () => {
      showTestimonial(currentSlide + 1);
    });

  showTestimonial(0);

  /* =================================
     9. FAQ ACCORDION
  ================================= */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close other answers
      faqItems.forEach(other => {
        other.classList.remove("open");
        other.querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
      });

      // Toggle selected answer
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =================================
     10. CONTACT FORM
  ================================= */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // Replace with a verified business email before launch.
  const BUSINESS_EMAIL = "hello@vantastudio.com";

  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please complete all required fields.";
      return;
    }

    const emailSubject = encodeURIComponent(
      subject || "New project inquiry from VANTA website"
    );

    const emailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nProject details:\n${message}`
    );

    const mailtoLink =
      `mailto:${BUSINESS_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

    formStatus.textContent =
      "Opening your email application to prepare the message...";

    window.location.href = mailtoLink;
  });

  /* =================================
     11. CURRENT YEAR
  ================================= */

  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  /* =================================
     12. INITIALIZATION
  ================================= */

  console.log(
    "%cVANTA STUDIO",
    "color:#a78bfa;font-size:24px;font-weight:bold;"
  );

  console.log(
    "Digital experiences. Built with intention."
  );

});
