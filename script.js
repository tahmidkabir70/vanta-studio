
"use strict";

/* =================================
   VANTA STUDIO — INTERACTIONS
================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* 1. SCROLL REVEAL */

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

  /* 2. MOBILE NAVIGATION */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

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

  /* 3. HEADER AND SCROLL PROGRESS */

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

  /* 4. ACTIVE NAVIGATION */

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

  /* 5. CUSTOM CURSOR GLOW */

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

  /* 6. ANIMATED COUNTERS */

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

  /* 7. PROJECT FILTER */

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

  /* 8. PHILOSOPHY SLIDER */

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

  function showTestimonial(index) {
    currentSlide =
      (index + testimonials.length) % testimonials.length;

    const item = testimonials[currentSlide];

    function updateContent() {
      if (testimonialText) testimonialText.textContent = item.text;
      if (testimonialName) testimonialName.textContent = item.name;
      if (testimonialRole) testimonialRole.textContent = item.role;

      if (testimonialContent) {
        testimonialContent.style.opacity = "1";
        testimonialContent.style.transform = "translateY(0)";
      }
    }

    if (!reduceMotion && testimonialContent) {
      testimonialContent.style.opacity = "0";
      testimonialContent.style.transform = "translateY(8px)";
      setTimeout(updateContent, 180);
    } else {
      updateContent();
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

  showTestimonial(0);

  /* 9. FAQ ACCORDION */

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

  /* 10. PROJECT INQUIRY SYSTEM */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    const existingMessage =
      document.getElementById("contactMessage");

    /*
      Add structured project fields to the existing
      contact form without changing index.html.
    */

    const inquiryFields = document.createElement("div");
    inquiryFields.className = "inquiry-fields";

    inquiryFields.innerHTML = `
      <div class="form-row inquiry-row">
        <div class="inquiry-field">
          <label for="projectService">Service required</label>
          <select id="projectService" required>
            <option value="">Choose a service</option>
            <option value="Web Development">Web Development</option>
            <option value="UI / UX Design">UI / UX Design</option>
            <option value="Brand Identity">Brand Identity</option>
            <option value="Digital Strategy">Digital Strategy</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="Creative Solutions">Creative Solutions</option>
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>

        <div class="inquiry-field">
          <label for="projectType">Project type</label>
          <select id="projectType" required>
            <option value="">Choose project type</option>
            <option value="New project">New project</option>
            <option value="Redesign">Website / product redesign</option>
            <option value="Improvement">Existing project improvement</option>
            <option value="Consultation">Consultation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div class="form-row inquiry-row">
        <div class="inquiry-field">
          <label for="projectBudget">Estimated budget</label>
          <select id="projectBudget" required>
            <option value="">Select a budget range</option>
            <option value="Not decided yet">Not decided yet</option>
            <option value="Under $100">Under $100</option>
            <option value="$100 – $300">$100 – $300</option>
            <option value="$300 – $700">$300 – $700</option>
            <option value="$700 – $1500">$700 – $1500</option>
            <option value="$1500+">$1500+</option>
            <option value="Discuss first">Discuss first</option>
          </select>
        </div>

        <div class="inquiry-field">
          <label for="projectTimeline">Preferred timeline</label>
          <select id="projectTimeline" required>
            <option value="">Select a timeline</option>
            <option value="As soon as possible">As soon as possible</option>
            <option value="Within 2 weeks">Within 2 weeks</option>
            <option value="Within 1 month">Within 1 month</option>
            <option value="Within 2–3 months">Within 2–3 months</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>
    `;

    if (existingMessage) {
      existingMessage.parentNode.insertBefore(
        inquiryFields,
        existingMessage
      );
    }

    const inquiryOutput = document.createElement("div");
    inquiryOutput.className = "inquiry-output";
    inquiryOutput.hidden = true;

    inquiryOutput.innerHTML = `
      <div class="inquiry-output-heading">
        <strong>YOUR INQUIRY SUMMARY</strong>
        <span>Review and copy your details</span>
      </div>

      <textarea
        id="inquirySummary"
        rows="12"
        readonly
        aria-label="Generated project inquiry summary"
      ></textarea>

      <button
        type="button"
        class="button button-outline"
        id="copyInquiry"
      >
        Copy Inquiry Details
      </button>

      <p class="inquiry-disclaimer">
        This prototype does not send or store your inquiry.
        Copy the summary and share it through a verified contact channel.
      </p>
    `;

    contactForm.appendChild(inquiryOutput);

    const submitButton =
      contactForm.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.innerHTML =
        'Generate Inquiry Summary <span>↗</span>';
    }

    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const name =
        document.getElementById("contactName")?.value.trim() || "";

      const email =
        document.getElementById("contactEmail")?.value.trim() || "";

      const subject =
        document.getElementById("contactSubject")?.value.trim() || "";

      const message =
        document.getElementById("contactMessage")?.value.trim() || "";

      const service =
        document.getElementById("projectService")?.value || "";

      const projectType =
        document.getElementById("projectType")?.value || "";

      const budget =
        document.getElementById("projectBudget")?.value || "";

      const timeline =
        document.getElementById("projectTimeline")?.value || "";

      if (
        !name ||
        !email ||
        !message ||
        !service ||
        !projectType ||
        !budget ||
        !timeline
      ) {
        if (formStatus) {
          formStatus.textContent =
            "Please complete all required fields.";
        }
        return;
      }

      const summary = [
        "VANTA STUDIO — PROJECT INQUIRY",
        "================================",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject || "Not specified"}`,
        "",
        `Service: ${service}`,
        `Project Type: ${projectType}`,
        `Estimated Budget: ${budget}`,
        `Preferred Timeline: ${timeline}`,
        "",
        "PROJECT DESCRIPTION",
        "-------------------",
        message,
        "",
        "Generated from the VANTA Studio website."
      ].join("\n");

      const summaryField =
        document.getElementById("inquirySummary");

      summaryField.value = summary;
      inquiryOutput.hidden = false;

      if (formStatus) {
        formStatus.textContent =
          "Inquiry summary generated. Review and copy your details below.";
      }

      inquiryOutput.scrollIntoView({
        behavior: reduceMotion ? "instant" : "smooth",
        block: "nearest"
      });
    });

    const copyButton =
      document.getElementById("copyInquiry");

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const summaryField =
          document.getElementById("inquirySummary");

        try {
          await navigator.clipboard.writeText(summaryField.value);

          if (formStatus) {
            formStatus.textContent =
              "Inquiry details copied successfully.";
          }
        } catch (error) {
          summaryField.focus();
          summaryField.select();

          if (formStatus) {
            formStatus.textContent =
              "Automatic copy unavailable. Select and copy the summary manually.";
          }
        }
      });
    }
  }

  /* 11. CURRENT YEAR */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  console.log(
    "%cVANTA STUDIO",
    "color:#a78bfa;font-size:24px;font-weight:bold;"
  );

  console.log(
    "Digital experiences. Built with intention."
  );
});
