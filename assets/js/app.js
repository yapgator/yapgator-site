"use strict";

const launchConfig = {
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

const artworkConfig = {
  hero: "assets/images/yapgator-hero.jpg",
  roadmap: "assets/images/yapgator-roadmap.png",
  market: "assets/images/yapgator-market.png",
  community: "assets/images/yapgator-community.png",
  install: "assets/images/yapgator-install.png"
};

const marketDataConfig = {
  enabled: false,
  endpoint: "",
  tokenMint: "",
  refreshIntervalMs: 30000
};

const roadmapConfig = {
  currentMarketCap: null,
  milestones: [
    {
      targetMarketCap: "",
      title: "GATOR WAKES UP",
      description: "The first yaps hit the timeline."
    },
    {
      targetMarketCap: "",
      title: "SWAMP GETS LOUD",
      description: "The community starts flooding the feed with original Yapgator memes."
    },
    {
      targetMarketCap: "",
      title: "YAP SEASON",
      description: "Community contests, meme battles, and new Gator artwork."
    },
    {
      targetMarketCap: "",
      title: "GATOR STRONG",
      description: "The Yapgator world expands with new scenes, stories, and community creations."
    },
    {
      targetMarketCap: "",
      title: "CITY TAKEOVER",
      description: "The community chooses the next major Yapgator campaign."
    },
    {
      targetMarketCap: "",
      title: "MAKE THE WAVE",
      description: "One Gator. One Fam. One Mission."
    }
  ]
};

(() => {
  document.documentElement.classList.add("js");

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
  const safeText = (value, fallback = "") => (hasValue(value) ? value.trim() : fallback);
  const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
  let deferredInstallPrompt = null;
  let installReturnFocus = null;

  const setHidden = (node, hidden) => {
    if (!node) return;
    node.hidden = hidden;
  };

  const setActiveLink = (link, label, url) => {
    if (!link || !hasValue(url)) return;
    link.textContent = label;
    link.setAttribute("href", url.trim());
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.removeAttribute("aria-disabled");
    setHidden(link, false);
  };

  const clearOptionalLink = (link) => {
    if (!link) return;
    link.removeAttribute("href");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.setAttribute("aria-disabled", "true");
    setHidden(link, true);
  };

  const formatNumber = (value) => {
    if (!isFiniteNumber(value)) return "";
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
  };

  const formatMoney = (value, options = {}) => {
    if (!isFiniteNumber(value)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: options.maximumFractionDigits ?? 6
    }).format(value);
  };

  const parseMarketCap = (value) => {
    if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
    if (!hasValue(value)) return null;
    const parsed = Number(value.replace(/[$,\s]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const applyArtworkConfig = () => {
    qsa("[data-artwork]").forEach((node) => {
      const key = node.getAttribute("data-artwork");
      const src = key ? artworkConfig[key] : "";
      if (hasValue(src)) node.setAttribute("src", src.trim());
    });
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

    qsa("[data-launch-date]").forEach((node) => {
      const value = safeText(launchConfig.launchDate);
      node.textContent = value;
      node.classList.toggle("empty-value", !hasValue(value));
      if (!hasValue(value)) node.innerHTML = '<span class="sr-only">Not configured</span>';
    });

    qsa("[data-contract-text]").forEach((node) => {
      const value = safeText(launchConfig.contractAddress);
      node.textContent = value;
      node.classList.toggle("empty-value", !hasValue(value));
      if (!hasValue(value)) node.innerHTML = '<span class="sr-only">Not configured</span>';
    });

    qsa("[data-telegram-group-link]").forEach((link) => {
      if (hasValue(launchConfig.telegramGroupUrl)) {
        setActiveLink(link, "Community Telegram", launchConfig.telegramGroupUrl);
      } else {
        clearOptionalLink(link);
      }
    });

    qsa("[data-buy-link]").forEach((link) => {
      if (hasValue(launchConfig.pumpFunUrl)) {
        setActiveLink(link, link.classList.contains("nav-buy") ? "Buy" : "Buy on Pump.fun", launchConfig.pumpFunUrl);
      } else {
        clearOptionalLink(link);
      }
    });

    qsa("[data-chart-link]").forEach((link) => {
      if (hasValue(launchConfig.chartUrl)) {
        setActiveLink(link, "View Chart", launchConfig.chartUrl);
      } else {
        clearOptionalLink(link);
      }
    });

    qsa("[data-copy-contract]").forEach((button) => {
      if (hasValue(launchConfig.contractAddress)) {
        button.disabled = false;
        button.textContent = "Copy Contract";
        setHidden(button, false);
      } else {
        button.disabled = true;
        setHidden(button, true);
      }
    });

    qsa("[data-footer-telegram]").forEach((link) => {
      const url = hasValue(launchConfig.telegramGroupUrl) ? launchConfig.telegramGroupUrl : launchConfig.telegramBotUrl;
      if (hasValue(url)) link.setAttribute("href", url.trim());
    });

    qsa("[data-pump-footer]").forEach((node) => {
      if (!hasValue(launchConfig.pumpFunUrl)) return;
      const link = document.createElement("a");
      link.className = node.className.replace("dock-inactive", "").trim();
      link.setAttribute("href", launchConfig.pumpFunUrl.trim());
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.setAttribute("aria-label", "Open YAPGATOR on Pump.fun");
      link.innerHTML = node.innerHTML;
      node.replaceWith(link);
    });
  };

  const initIntro = () => {
    const overlay = qs("[data-intro-overlay]");
    const closeButton = qs("[data-intro-close]");
    if (!overlay) return;

    const hide = () => {
      overlay.classList.add("is-hidden");
      try {
        sessionStorage.setItem("yapgatorIntroSeen", "true");
      } catch (_error) {
        return;
      }
    };

    try {
      if (sessionStorage.getItem("yapgatorIntroSeen") === "true") {
        overlay.classList.add("is-hidden");
        return;
      }
    } catch (_error) {
      overlay.classList.add("is-hidden");
      return;
    }

    closeButton?.addEventListener("click", hide);
    window.setTimeout(hide, 2200);
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

    qsa("a, button", panel).forEach((link) => {
      link.addEventListener("click", close);
    });

    document.addEventListener("yapgator:close-menu", close);

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
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    elements.forEach((element) => observer.observe(element));
  };

  const initLightBloom = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    qsa("[data-light-panel]").forEach((panel) => {
      panel.addEventListener("pointermove", (event) => {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        panel.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
      panel.addEventListener("pointerleave", () => {
        panel.style.removeProperty("--mx");
        panel.style.removeProperty("--my");
      });
    });
  };

  const isStandaloneApp = () => {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  };

  const setInstallControlsHidden = (hidden) => {
    qsa("[data-install-app]").forEach((button) => {
      button.hidden = hidden;
    });
  };

  const closeInstallDialog = () => {
    const dialog = qs("[data-install-dialog]");
    if (!dialog) return;
    dialog.hidden = true;
    document.removeEventListener("keydown", onInstallDialogKeydown);
    if (installReturnFocus && typeof installReturnFocus.focus === "function") {
      installReturnFocus.focus();
    }
    installReturnFocus = null;
  };

  function onInstallDialogKeydown(event) {
    if (event.key === "Escape") closeInstallDialog();
  }

  const openInstallDialog = (trigger) => {
    const dialog = qs("[data-install-dialog]");
    const copy = qs("[data-install-dialog-copy]", dialog || document);
    const closeButton = qs("[data-install-dialog-close]", dialog || document);
    if (!dialog || !copy) return;

    installReturnFocus = trigger;
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    copy.textContent = isIos
      ? "Open this page in Safari, tap Share, then choose \u201cAdd to Home Screen.\u201d"
      : "Open your browser menu and choose \u201cInstall app\u201d or \u201cAdd to Home screen.\u201d";
    dialog.hidden = false;
    closeButton?.focus();
    document.addEventListener("keydown", onInstallDialogKeydown);
  };

  const handleInstallApp = async (event) => {
    const trigger = event.currentTarget;
    document.dispatchEvent(new CustomEvent("yapgator:close-menu"));

    if (isStandaloneApp()) {
      setInstallControlsHidden(true);
      return;
    }

    if (!deferredInstallPrompt) {
      openInstallDialog(trigger);
      return;
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    try {
      promptEvent.prompt();
      await promptEvent.userChoice;
    } catch (_error) {
      openInstallDialog(trigger);
    }
  };

  const initInstallApp = () => {
    const installButtons = qsa("[data-install-app]");
    if (!installButtons.length) return;

    if (isStandaloneApp()) {
      setInstallControlsHidden(true);
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      if (!isStandaloneApp()) setInstallControlsHidden(false);
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      setInstallControlsHidden(true);
      closeInstallDialog();
    });

    installButtons.forEach((button) => {
      button.addEventListener("click", handleInstallApp);
    });

    qsa("[data-install-dialog-close]").forEach((button) => {
      button.addEventListener("click", closeInstallDialog);
    });
  };

  const initServiceWorker = () => {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  };

  const initOpeningImpact = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.body.classList.add("opening-impact");
    window.setTimeout(() => {
      document.body.classList.remove("opening-impact");
    }, 1700);
  };

  const initYear = () => {
    qsa("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  };

  const initRoadmapMarkers = () => {
    const buttons = qsa("[data-roadmap-marker]");
    if (!buttons.length) return;

    const openPanel = (button) => {
      const targetId = button.getAttribute("aria-controls");
      buttons.forEach((item) => {
        const panelId = item.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        const isTarget = item === button;
        item.setAttribute("aria-expanded", String(isTarget));
        if (panel) panel.hidden = !isTarget;
      });
      const targetPanel = targetId ? document.getElementById(targetId) : null;
      targetPanel?.classList.add("is-open");
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => openPanel(button));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const index = buttons.indexOf(button);
        const nextIndex = (() => {
          if (event.key === "Home") return 0;
          if (event.key === "End") return buttons.length - 1;
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") return Math.max(0, index - 1);
          return Math.min(buttons.length - 1, index + 1);
        })();
        buttons[nextIndex].focus();
        openPanel(buttons[nextIndex]);
      });
    });
  };

  const setRoadmapProgress = (marketCap) => {
    const route = qs("[data-route-path]");
    const gator = qs("[data-route-gator]");
    const markers = qsa("[data-roadmap-marker]");
    if (!route || !gator || typeof route.getTotalLength !== "function") return;

    const targets = roadmapConfig.milestones
      .map((milestone) => parseMarketCap(milestone.targetMarketCap))
      .filter((value) => value !== null)
      .sort((a, b) => a - b);

    let progress = 0.04;
    if (isFiniteNumber(marketCap) && targets.length) {
      const highestTarget = targets[targets.length - 1];
      const achieved = targets.filter((target) => marketCap >= target).length;
      const nextTarget = targets[achieved] ?? highestTarget;
      const previousTarget = targets[achieved - 1] ?? 0;
      const segmentRange = Math.max(nextTarget - previousTarget, 1);
      const segmentProgress = Math.max(0, Math.min(1, (marketCap - previousTarget) / segmentRange));
      progress = Math.min(0.96, ((achieved + segmentProgress) / targets.length) * 0.92 + 0.04);
    }

    const length = route.getTotalLength();
    const point = route.getPointAtLength(length * progress);
    gator.style.transform = `translate(${point.x}px, ${point.y}px)`;

    markers.forEach((marker, index) => {
      const target = parseMarketCap(roadmapConfig.milestones[index]?.targetMarketCap);
      marker.classList.toggle("is-complete", target !== null && isFiniteNumber(marketCap) && marketCap >= target);
    });
  };

  const validateMarketData = (data) => {
    if (!data || typeof data !== "object") return null;
    const price = Number(data.price);
    const marketCap = Number(data.marketCap);
    const volume24h = Number(data.volume24h);
    const bondingCurveProgress = Number(data.bondingCurveProgress);
    const lastUpdated = hasValue(data.lastUpdated) ? data.lastUpdated.trim() : new Date().toISOString();

    return {
      price: Number.isFinite(price) && price > 0 ? price : null,
      marketCap: Number.isFinite(marketCap) && marketCap > 0 ? marketCap : null,
      volume24h: Number.isFinite(volume24h) && volume24h >= 0 ? volume24h : null,
      bondingCurveProgress: Number.isFinite(bondingCurveProgress) && bondingCurveProgress >= 0 && bondingCurveProgress <= 100 ? bondingCurveProgress : null,
      lastUpdated
    };
  };

  window.updateMarketData = (data) => {
    const feed = qs("[data-market-feed]");
    if (!feed) return false;
    const values = validateMarketData(data);
    if (!values) return false;

    const priceNode = qs("[data-market-price]");
    const capNode = qs("[data-market-cap]");
    const volumeNode = qs("[data-market-volume]");
    const progressNode = qs("[data-market-progress]");
    const updatedNode = qs("[data-market-updated]");

    if (values.price !== null && priceNode) priceNode.textContent = formatMoney(values.price);
    if (values.marketCap !== null && capNode) capNode.textContent = formatMoney(values.marketCap, { maximumFractionDigits: 0 });
    if (values.volume24h !== null && volumeNode) volumeNode.textContent = formatMoney(values.volume24h, { maximumFractionDigits: 0 });
    if (values.bondingCurveProgress !== null && progressNode) progressNode.textContent = `${formatNumber(values.bondingCurveProgress)}%`;
    if (updatedNode) {
      const date = new Date(values.lastUpdated);
      updatedNode.textContent = Number.isNaN(date.getTime()) ? values.lastUpdated : date.toLocaleString();
    }

    if (values.marketCap !== null) {
      roadmapConfig.currentMarketCap = values.marketCap;
      setRoadmapProgress(values.marketCap);
    }

    feed.hidden = false;
    return true;
  };

  const initMarketFeed = () => {
    const feed = qs("[data-market-feed]");
    if (feed) feed.hidden = true;
    if (!marketDataConfig.enabled) return;
    if (!hasValue(marketDataConfig.endpoint)) return;

    // Future launch work: add the selected public market endpoint to marketDataConfig.endpoint.
    // If the provider requires a token identifier, add the public mint to marketDataConfig.tokenMint.
    const fetchMarketData = async () => {
      try {
        const url = new URL(marketDataConfig.endpoint);
        if (hasValue(marketDataConfig.tokenMint)) {
          url.searchParams.set("tokenMint", marketDataConfig.tokenMint.trim());
        }
        const response = await fetch(url.toString(), { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        window.updateMarketData(data);
      } catch (_error) {
        return;
      }
    };

    fetchMarketData();
    window.setInterval(fetchMarketData, Math.max(5000, marketDataConfig.refreshIntervalMs));
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyArtworkConfig();
    applyLaunchConfig();
    initYear();
    initIntro();
    initMenu();
    initOpeningImpact();
    initFaq();
    initCopyContract();
    initInstallApp();
    initRoadmapMarkers();
    initReveal();
    initLightBloom();
    initMarketFeed();
    initServiceWorker();
    window.requestAnimationFrame(() => setRoadmapProgress(roadmapConfig.currentMarketCap));
  });
})();
