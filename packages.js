
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const services = {
    web: {
      number: "01",
      kicker: "SERVICE 01 / DEVELOPMENT",
      title: "Web Development",
      description: "Responsive, accessible and performance-conscious websites built around your business goals.",
      symbol: "⌘",
      packages: [
        {
          tier: "STARTER",
          name: "Essential",
          description: "For individuals and small online identities.",
          features: ["Up to 3 core pages", "Responsive layout", "Basic contact section", "Essential SEO setup", "Launch support"]
        },
        {
          tier: "PROFESSIONAL",
          name: "Business",
          description: "For businesses that need a stronger online presence.",
          featured: true,
          features: ["Up to 7 core pages", "Custom UI implementation", "Contact form integration", "SEO-friendly structure", "Performance optimization", "Basic analytics setup"]
        },
        {
          tier: "PREMIUM",
          name: "Advanced",
          description: "For larger websites with more complex requirements.",
          features: ["Custom page structure", "Advanced interactions", "CMS or API integration if scoped", "Advanced optimization", "Technical documentation", "Extended launch support"]
        }
      ]
    },

    uiux: {
      number: "02",
      kicker: "SERVICE 02 / USER EXPERIENCE",
      title: "UI / UX Design",
      description: "User-focused interfaces, clear information architecture and thoughtful product experiences.",
      symbol: "◈",
      packages: [
        {
          tier: "STARTER",
          name: "Wireframe",
          description: "For early ideas that need a clear structure.",
          features: ["Project discovery", "Basic user flow", "Low-fidelity wireframes", "Core screen planning", "Design handoff notes"]
        },
        {
          tier: "PROFESSIONAL",
          name: "Interface",
          description: "For products ready for a complete visual direction.",
          featured: true,
          features: ["User flow mapping", "High-fidelity UI screens", "Responsive screen concepts", "Reusable design components", "Interactive prototype", "Developer handoff"]
        },
        {
          tier: "PREMIUM",
          name: "Product Experience",
          description: "For more complex digital products.",
          features: ["Detailed UX planning", "Expanded screen coverage", "Advanced design system", "Interactive prototype", "Usability review plan", "Complete design documentation"]
        }
      ]
    },

    brand: {
      number: "03",
      kicker: "SERVICE 03 / VISUAL IDENTITY",
      title: "Brand Identity",
      description: "Distinctive visual systems that help a brand communicate consistently and clearly.",
      symbol: "✳",
      packages: [
        {
          tier: "STARTER",
          name: "Brand Basics",
          description: "For a new identity that needs a clear starting point.",
          features: ["Creative direction", "Primary logo concept", "Basic color palette", "Typography selection", "Basic logo files"]
        },
        {
          tier: "PROFESSIONAL",
          name: "Brand System",
          description: "For businesses building a consistent identity.",
          featured: true,
          features: ["Logo variations", "Color and typography system", "Brand visual elements", "Social profile graphics", "Mini brand guidelines", "Export-ready assets"]
        },
        {
          tier: "PREMIUM",
          name: "Complete Identity",
          description: "For brands requiring a broader identity system.",
          features: ["Expanded logo system", "Detailed brand guidelines", "Visual language development", "Stationery concepts", "Social media templates", "Brand asset library"]
        }
      ]
    },

    strategy: {
      number: "04",
      kicker: "SERVICE 04 / DIGITAL DIRECTION",
      title: "Digital Strategy",
      description: "Structured planning to align digital goals, audience needs and practical execution.",
      symbol: "↗",
      packages: [
        {
          tier: "STARTER",
          name: "Direction",
          description: "For understanding the current situation.",
          features: ["Initial discovery", "Goal clarification", "Basic digital audit", "Priority recommendations", "Action summary"]
        },
        {
          tier: "PROFESSIONAL",
          name: "Growth Plan",
          description: "For a more structured digital roadmap.",
          featured: true,
          features: ["Audience overview", "Competitor review", "Channel recommendations", "Content direction", "90-day action roadmap", "Success metrics proposal"]
        },
        {
          tier: "PREMIUM",
          name: "Digital Roadmap",
          description: "For multi-stage digital initiatives.",
          features: ["Expanded digital audit", "Market and competitor research", "Customer journey planning", "Channel strategy", "Long-term roadmap", "Measurement framework"]
        }
      ]
    },

    commerce: {
      number: "05",
      kicker: "SERVICE 05 / ONLINE COMMERCE",
      title: "E-Commerce",
      description: "Online shopping experiences designed around product discovery, usability and customer trust.",
      symbol: "◇",
      packages: [
        {
          tier: "STARTER",
          name: "Storefront",
          description: "For a small product catalogue.",
          features: ["Basic storefront structure", "Product listing layout", "Product detail template", "Mobile-friendly interface", "Contact or inquiry flow"]
        },
        {
          tier: "PROFESSIONAL",
          name: "Online Store",
          description: "For businesses ready for a fuller store experience.",
          featured: true,
          features: ["Expanded product catalogue", "Category and search layout", "Cart interface", "Checkout flow planning", "Payment integration if supported", "Order inquiry workflow"]
        },
        {
          tier: "PREMIUM",
          name: "Commerce Plus",
          description: "For stores with more advanced requirements.",
          features: ["Custom storefront experience", "Advanced catalogue structure", "Inventory workflow planning", "Third-party integrations if scoped", "Analytics planning", "Technical handover"]
        }
      ]
    },

    creative: {
      number: "06",
      kicker: "SERVICE 06 / CUSTOM SOLUTIONS",
      title: "Creative Solutions",
      description: "Purpose-built digital experiences for unique ideas, workflows and business challenges.",
      symbol: "◎",
      packages: [
        {
          tier: "STARTER",
          name: "Concept",
          description: "For validating a focused digital idea.",
          features: ["Idea discovery", "Feature outline", "Basic interface concept", "Scope recommendation", "Next-step proposal"]
        },
        {
          tier: "PROFESSIONAL",
          name: "Custom Build",
          description: "For a defined digital solution.",
          featured: true,
          features: ["Requirements planning", "Custom interface", "Core feature implementation", "Responsive experience", "Testing and refinement", "Project documentation"]
        },
        {
          tier: "PREMIUM",
          name: "Advanced Solution",
          description: "For larger or more involved digital projects.",
          features: ["Detailed requirements", "Custom architecture planning", "Multiple feature modules", "Integration planning", "Expanded testing", "Technical documentation"]
        }
      ]
    }
  };

  const tabs = document.querySelectorAll(".service-tab");
  const grid = document.getElementById("packageGrid");
  const title = document.getElementById("serviceTitle");
  const description = document.getElementById("serviceDescription");
  const kicker = document.getElementById("serviceKicker");
  const symbol = document.getElementById("serviceSymbol");

  function renderPackages(serviceKey) {
    const service = services[serviceKey];

    if (!service) return;

    title.textContent = service.title;
    description.textContent = service.description;
    kicker.textContent = service.kicker;
    symbol.textContent = service.symbol;

    grid.innerHTML = service.packages.map((item, index) => {
      const features = item.features.map(feature =>
        `<li>${escapeHTML(feature)}</li>`
      ).join("");

      return `
        <article class="package-card ${item.featured ? "featured" : ""}">
          ${item.featured ? '<span class="package-badge">RECOMMENDED</span>' : ""}
          <span class="package-tier">${escapeHTML(item.tier)}</span>
          <h4>${escapeHTML(item.name)}</h4>
          <p class="package-description">${escapeHTML(item.description)}</p>

          <div class="package-price">
            Custom Quote
            <small>Final price based on project scope</small>
          </div>

          <div class="package-divider"></div>

          <ul class="package-includes">${features}</ul>

          <a class="package-action"
             href="index.html#contact"
             aria-label="Discuss ${escapeHTML(item.name)} package for ${escapeHTML(service.title)}">
            Discuss This Package ↗
          </a>
        </article>
      `;
    }).join("");
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const serviceKey = tab.dataset.service;

      tabs.forEach(button => {
        const selected = button === tab;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-selected", String(selected));
      });

      renderPackages(serviceKey);
    });
  });

  document.getElementById("year").textContent =
    new Date().getFullYear();

  renderPackages("web");
});
