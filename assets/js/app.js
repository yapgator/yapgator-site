"use strict";

const launchConfig = {
  // Future launch values go here. Leave empty strings to keep Coming Soon states active.
  launched: false,
  launchDate: "",
  xUrl: "https://x.com/YAPGAT0R",
  telegramGroupUrl: "",
  telegramBotUrl: "https://t.me/YapgatorOfficialBot",
  pumpFunUrl: "",
  contractAddress: "",
  chartUrl: "",
  network: "Solana",
  platform: "Pump.fun",
  totalSupply: "1,000,000,000",
  decimals: "6",
  graduation: "PumpSwap"
};

(() => {
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
  const safeText = (value, fallback = "") => (hasValue(value) ? value.trim() : fallback);

  const setDisabledLink = (link, label) => {
    if (!link) return;
    link.textContent = label;
    link.setAttribute("aria-disabled", "true");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("href", "#");
  };

  const setActiveLink = (link, label, url) => {
    if (!link || !hasValue(url)) return;
    link.textContent = label;
    link.setAttribute("href", url.trim());
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.removeAttribute("aria-disabled");
  };

  const applyLaunchConfig = () => {
    qsa("[data-config-text]").forEach((node) => {
      const key = node.getAttribute("data-config-text");
      if (key && Object.prototype.hasOwnProperty.call(launchConfig, key)) {
        node.textContent = safeText(String(launchConfig[key]));
      }
    });

    qsa("[data-config-link]").forEach((node) => {
      const key = node.getAttribute("data-config-link");
      const url = key ? launchConfig[key] : "";
      if (hasValue(url)) {
        node.setAttribute("href", url.trim());
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });

    qsa("[data-launch-status]").forEach((node) => {
      node.textContent = launchConfig.launched ? "THE SWAMP IS LIVE" : "PREPARING TO ENTER THE SWAMP";
    });

    qsa("[data-token-status]").forEach((node) => {
      node.textContent = launchConfig.launched ? "Live" : "Coming Soon";
    });

    qsa("[data-launch-date]").forEach((node) => {
      node.textContent = hasValue(launchConfig.launchDate) ? `Launch Date: ${launchConfig.launchDate.trim()}` : "Launch Date: TBA";
    });

    qsa("[data-contract-text]").forEach((node) => {
      node.textContent = hasValue(launchConfig.contractAddress) ? launchConfig.contractAddress.trim() : "Coming Soon";
    });

    qsa("[data-telegram-community-text]").forEach((node) => {
      node.textContent = hasValue(launchConfig.telegramGroupUrl) ? launchConfig.telegramGroupUrl.trim() : "Coming Soon";
    });

    qsa("[data-telegram-group-link]").forEach((link) => {
      if (hasValue(launchConfig.telegramGroupUrl)) {
        setActiveLink(link, "Enter the Swamp", launchConfig.telegramGroupUrl);
      } else {
        setDisabledLink(link, "Telegram Coming Soon");
      }
    });

    qsa("[data-buy-link]").forEach((link) => {
      if (hasValue(launchConfig.pumpFunUrl)) {
        setActiveLink(link, "Buy $YAPGATOR", launchConfig.pumpFunUrl);
      } else {
        setDisabledLink(link, link.classList.contains("nav-buy") ? "Buy Coming Soon" : "Buy Coming Soon");
      }
    });

    qsa("[data-chart-link]").forEach((link) => {
      if (hasValue(launchConfig.chartUrl)) {
        setActiveLink(link, "View Chart", launchConfig.chartUrl);
      } else {
        setDisabledLink(link, "Chart Coming Soon");
      }
    });

    qsa("[data-copy-contract]").forEach((button) => {
      if (hasValue(launchConfig.contractAddress)) {
        button.disabled = false;
        button.textContent = "Copy Contract";
      } else {
        button.disabled = true;
        button.textContent = "Copy Contract Coming Soon";
      }
    });
  };

  const initIntro = () => {
    const overlay = qs("[data-intro-overlay]");
    const closeButton = qs("[data-intro-close]");
    if (!overlay) return;

    const hide = () => {
      overlay.classList.add("is-hidden");
      sessionStorage.setItem("yapgatorIntroSeen", "true");
    };

    if (sessionStorage.getItem("yapgatorIntroSeen") === "true") {
      overlay.classList.add("is-hidden");
      return;
    }

    closeButton?.addEventListener("click", hide);
    window.setTimeout(hide, 2600);
  };

  const initMenu = () => {
    const toggle = qs("[data-menu-toggle]");
    const panel = qs("[data-nav-panel]");
    if (!toggle || !panel) return;

    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
      panel.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    const open = () => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
      panel.classList.add("is-open");
      document.body.classList.add("menu-open");
    };

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? close() : open();
    });

    qsa("a", panel).forEach((link) => {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) close();
    });
  };

  const initFaq = () => {
    qsa(".faq-item button").forEach((button) => {
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
      });
    });
  };

  const initCopyContract = () => {
    qsa("[data-copy-contract]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!hasValue(launchConfig.contractAddress)) return;
        const contract = launchConfig.contractAddress.trim();
        try {
          await navigator.clipboard.writeText(contract);
          button.textContent = "Copied";
        } catch (_error) {
          const textArea = document.createElement("textarea");
          textArea.value = contract;
          textArea.setAttribute("readonly", "");
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
          button.textContent = "Copied";
        }
        window.setTimeout(() => {
          button.textContent = "Copy Contract";
        }, 1600);
      });
    });
  };

  const initReveal = () => {
    const elements = qsa(".reveal");
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    elements.forEach((element) => observer.observe(element));
  };

  const guardDisabledLinks = () => {
    qsa('a[aria-disabled="true"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        if (link.getAttribute("aria-disabled") === "true") {
          event.preventDefault();
        }
      });
    });
  };

  const initYear = () => {
    qsa("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyLaunchConfig();
    initYear();
    initIntro();
    initMenu();
    initFaq();
    initCopyContract();
    initReveal();
    guardDisabledLinks();
  });
})();
