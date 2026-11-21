
"use strict";

/* =================================
   VANTA STUDIO — INTERACTIONS
   Updated: Supabase Inquiry API
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
  } else if ("IntersectionObserver" in window) {
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
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  /* =================================
     2. MOBILE NAVIGATION
  ================================= */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!navMenu || !menuToggle) return;

    navMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navMenu) {
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
  }

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

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (header) {
      header.classList.toggle("scrolled", scrollTop > 30);
    }

    if (backTop) {
      backTop.classList.toggle("visible", scrollTop > 500);
    }
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  handleScroll();

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "instant" : "smooth"
      });
    });
  }

  /* =================================
     4. ACTIVE NAVIGATION
  ================================= */

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
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
  }

  /* =================================
     5. CUSTOM CURSOR GLOW
  ================================= */

  const cursorGlow = document.getElementById("cursorGlow");

  if (
    cursorGlow &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    let cursorFrame = null;

    document.addEventListener("mousemove", event => {
      if (cursorFrame) {
        cancelAnimationFrame(cursorFrame);
      }

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

  if ("IntersectionObserver" in window) {
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
  } else {
    counters.forEach(animateCounter);
  }

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

        if (shouldShow && !reduceMotion) {
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
  const testimonialContent = document.querySelector(".testimonial-content");

  function updateTestimonialContent(item) {
    if (testimonialText) testimonialText.textContent = item.text;
    if (testimonialName) testimonialName.textContent = item.name;
    if (testimonialRole) testimonialRole.textContent = item.role;
  }

  function showTestimonial(index) {
    currentSlide =
      (index + testimonials.length) % testimonials.length;

    const item = testimonials[currentSlide];

    if (testimonialContent && !reduceMotion) {
      testimonialContent.style.opacity = "0";
      testimonialContent.style.transform = "translateY(8px)";

      window.setTimeout(() => {
        updateTestimonialContent(item);
        testimonialContent.style.opacity = "1";
        testimonialContent.style.transform = "translateY(0)";
      }, 180);
    } else {
      updateTestimonialContent(item);
    }

    if (slideNumber) {
      slideNumber.textContent =
        `${String(currentSlide + 1).padStart(2, "0")} / ${String(testimonials.length).padStart(2, "0")}`;
    }
  }

  const prevTestimonial = document.getElementById("prevTestimonial");
  const nextTestimonial = document.getElementById("nextTestimonial");

  if (prevTestimonial) {
    prevTestimonial.addEventListener("click", () => {
      showTestimonial(currentSlide - 1);
    });
  }

  if (nextTestimonial) {
    nextTestimonial.addEventListener("click", () => {
      showTestimonial(currentSlide + 1);
    });
  }

  if (testimonialText || testimonialName || testimonialRole) {
    showTestimonial(0);
  }

  /* =================================
     9. FAQ ACCORDION
  ================================= */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach(other => {
        other.classList.remove("open");

        const otherQuestion =
          other.querySelector(".faq-question");

        if (otherQuestion) {
          otherQuestion.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =================================
     10. CONTACT FORM — SUPABASE API
  ================================= */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && formStatus) {
    const submitButton = contactForm.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    const originalButtonText = submitButton
      ? (submitButton.tagName === "INPUT"
          ? submitButton.value
          : submitButton.textContent)
      : "";

    contactForm.addEventListener("submit", async event => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const name = document.getElementById("contactName")?.value.trim();
      const email = document.getElementById("contactEmail")?.value.trim();
      const subject = document.getElementById("contactSubject")?.value.trim();
      const message = document.getElementById("contactMessage")?.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent =
          "Please complete all required fields.";
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;

        if (submitButton.tagName === "INPUT") {
          submitButton.value = "Sending...";
        } else {
          submitButton.textContent = "Sending...";
        }
      }

      formStatus.textContent = "Submitting your inquiry...";

      try {
        const response = await fetch("/api/inquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to submit your inquiry."
          );
        }

        formStatus.textContent =
          "Your inquiry has been submitted successfully. Thank you!";

        contactForm.reset();

      } catch (error) {
        console.error("Contact form submission error:", error);

        formStatus.textContent =
          error.message ||
          "Something went wrong. Please try again.";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;

          if (submitButton.tagName === "INPUT") {
            submitButton.value = originalButtonText;
          } else {
            submitButton.textContent = originalButtonText;
          }
        }
      }
    });
  }

  /* =================================
     11. CURRENT YEAR
  ================================= */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

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
