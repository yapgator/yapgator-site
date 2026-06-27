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
  chapterTargets: [50, 100, 250, 500, 1000, 1500],
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
  let telegramStatus = null;
  let roadmapEntranceStarted = false;
  let activeRoadmapAnimation = 0;

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

  const handleInstallApp = (event) => {
    event.preventDefault();
    document.dispatchEvent(new CustomEvent("yapgator:close-menu"));

    if (isStandaloneApp() || !deferredInstallPrompt) {
      deferredInstallPrompt = null;
      setInstallControlsHidden(true);
      return;
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    setInstallControlsHidden(true);
    try {
      promptEvent.prompt();
      if (promptEvent.userChoice && typeof promptEvent.userChoice.catch === "function") {
        promptEvent.userChoice.catch(() => {});
      }
    } catch (_error) {
      setInstallControlsHidden(true);
    }
  };

  const initInstallApp = () => {
    const installButtons = qsa("[data-install-app]");
    if (!installButtons.length) return;

    setInstallControlsHidden(true);

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      if (isStandaloneApp()) {
        deferredInstallPrompt = null;
        setInstallControlsHidden(true);
        return;
      }
      deferredInstallPrompt = event;
      setInstallControlsHidden(false);
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      setInstallControlsHidden(true);
    });

    installButtons.forEach((button) => {
      button.addEventListener("click", handleInstallApp);
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
        if (panel) {
          panel.hidden = !isTarget;
          panel.classList.toggle("is-open", isTarget);
        }
      });
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

  const validateTelegramStatus = (data) => {
    if (!data || typeof data !== "object") return null;
    const members = Number(data.members);
    const currentChapter = Number(data.currentChapter);
    const currentTarget = Number(data.currentTarget);
    const nextTarget = Number(data.nextTarget);
    const progressPercent = Number(data.progressPercent);
    const updatedAt = hasValue(data.updatedAt) ? data.updatedAt.trim() : "";

    if (!Number.isInteger(members) || members < 0) return null;
    if (!Number.isInteger(currentChapter) || currentChapter < 0 || currentChapter > roadmapConfig.chapterTargets.length) return null;
    if (!Number.isFinite(currentTarget) || currentTarget < 0) return null;
    if (!Number.isFinite(nextTarget) || nextTarget <= 0) return null;
    if (!Number.isFinite(progressPercent) || progressPercent < 0 || progressPercent > 100) return null;

    return { members, currentChapter, currentTarget, nextTarget, progressPercent, updatedAt };
  };

  const getChapterProgress = (status = telegramStatus) => {
    const targets = roadmapConfig.chapterTargets;
    if (!status) return 0;
    if (status.members >= targets[targets.length - 1]) return 1;

    const activeIndex = Math.max(0, Math.min(targets.length - 1, status.currentChapter - 1));
    const lowerTarget = activeIndex === 0 ? 0 : targets[activeIndex - 1];
    const upperTarget = targets[activeIndex];
    const segmentProgress = Math.max(0, Math.min(1, (status.members - lowerTarget) / Math.max(upperTarget - lowerTarget, 1)));
    return Math.max(0, Math.min(1, (activeIndex + segmentProgress) / targets.length));
  };

  const setRoadmapProgress = (status = telegramStatus, options = {}) => {
    const route = qs("[data-route-path]");
    const gator = qs("[data-route-gator]");
    const markers = qsa("[data-roadmap-marker]");
    if (!route || !gator || typeof route.getTotalLength !== "function") return;

    const routeProgress = 0.04 + getChapterProgress(status) * 0.92;
    const length = route.getTotalLength();
    const point = route.getPointAtLength(length * routeProgress);
    gator.style.transform = `translate(${point.x}px, ${point.y}px)`;
    updateRoadmapMarkerStates(status, options.flashCurrent === true);
  };

  const animateRoadmapSwim = () => {
    const route = qs("[data-route-path]");
    const gator = qs("[data-route-gator]");
    if (!route || !gator || typeof route.getTotalLength !== "function") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetProgress = 0.04 + getChapterProgress() * 0.92;
    const length = route.getTotalLength();
    activeRoadmapAnimation += 1;
    const animationId = activeRoadmapAnimation;

    if (prefersReducedMotion) {
      setRoadmapProgress(telegramStatus, { flashCurrent: false });
      return;
    }

    const duration = 1900;
    const start = performance.now();
    const ease = (value) => 1 - Math.pow(1 - value, 3);

    const frame = (now) => {
      if (animationId !== activeRoadmapAnimation) return;
      const elapsed = Math.min(1, (now - start) / duration);
      const progress = 0.04 + (targetProgress - 0.04) * ease(elapsed);
      const point = route.getPointAtLength(length * progress);
      gator.style.transform = `translate(${point.x}px, ${point.y}px)`;

      if (elapsed < 1) {
        window.requestAnimationFrame(frame);
        return;
      }
      updateRoadmapMarkerStates(telegramStatus, true);
    };

    window.requestAnimationFrame(frame);
  };

  const updateRoadmapMarkerStates = (status = telegramStatus, flashCurrent = false) => {
    const markers = qsa("[data-roadmap-marker]");
    const targets = roadmapConfig.chapterTargets;
    const activeIndex = status
      ? (status.members >= targets[targets.length - 1] ? targets.length - 1 : Math.max(0, status.currentChapter - 1))
      : 0;

    markers.forEach((marker, index) => {
      const target = Number(marker.getAttribute("data-target"));
      const complete = Boolean(status && Number.isFinite(target) && status.members >= target);
      const active = Boolean(status) && index === activeIndex;
      marker.classList.toggle("is-complete", complete);
      marker.classList.toggle("is-active", active);
      marker.classList.toggle("is-locked", Boolean(status) && !complete && !active);
      qs("[data-current-label]", marker)?.toggleAttribute("hidden", !active);
      if (flashCurrent && active) {
        marker.classList.remove("is-pulse");
        void marker.offsetWidth;
        marker.classList.add("is-pulse");
      }
    });
  };

  const initRoadmapSwim = () => {
    const roadmap = qs("[data-roadmap]");
    const replay = qs("[data-replay-swim]");
    if (!roadmap) return;

    replay?.addEventListener("click", () => {
      animateRoadmapSwim();
    });

    setRoadmapProgress(telegramStatus, { flashCurrent: false });

    if (!("IntersectionObserver" in window)) {
      roadmapEntranceStarted = true;
      animateRoadmapSwim();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || roadmapEntranceStarted) return;
        roadmapEntranceStarted = true;
        animateRoadmapSwim();
        observer.unobserve(roadmap);
      });
    }, { threshold: 0.28 });

    observer.observe(roadmap);
  };

  const animateNumber = (node, nextValue) => {
    if (!node) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const formatter = new Intl.NumberFormat("en-US");
    if (prefersReducedMotion) {
      node.textContent = formatter.format(nextValue);
      return;
    }

    const previous = Number(node.dataset.value || "0");
    const start = performance.now();
    const duration = 720;
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(previous + (nextValue - previous) * eased);
      node.textContent = formatter.format(value);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    node.dataset.value = String(nextValue);
    window.requestAnimationFrame(step);
  };

  const renderTelegramStatus = (status) => {
    const root = qs("[data-swamp-status]");
    if (!root) return;
    const live = qs("[data-swamp-status-live]", root);
    const progress = qs("[data-swamp-progress]", root);
    const message = qs("[data-swamp-status-message]", root);
    const members = qs("[data-swamp-members]", root);
    const chapter = qs("[data-swamp-chapter]", root);
    const nextTarget = qs("[data-swamp-next-target]", root);
    const progressText = qs("[data-swamp-progress-text]", root);
    const progressPercent = qs("[data-swamp-progress-percent]", root);
    const progressFill = qs("[data-swamp-progress-fill]", root);
    const updated = qs("[data-swamp-updated]", root);

    if (!status) {
      root.classList.remove("is-live");
      if (message) message.textContent = "Swamp signal updating";
      if (live) live.hidden = true;
      if (progress) progress.hidden = true;
      if (updated) updated.textContent = "";
      return;
    }

    root.classList.add("is-live");
    if (message) message.textContent = "Live Telegram signal locked";
    if (live) live.hidden = false;
    if (progress) progress.hidden = false;
    animateNumber(members, status.members);
    if (chapter) chapter.textContent = `Chapter ${status.currentChapter}`;
    if (nextTarget) nextTarget.textContent = `${formatNumber(status.nextTarget)} members`;
    if (progressText) progressText.textContent = `${formatNumber(status.members)} / ${formatNumber(status.nextTarget)} members`;
    if (progressPercent) progressPercent.textContent = `${formatNumber(Math.round(status.progressPercent))}%`;
    if (progressFill) progressFill.style.setProperty("--swamp-progress", `${status.progressPercent}%`);
    if (updated) {
      const date = new Date(status.updatedAt);
      updated.textContent = Number.isNaN(date.getTime()) ? "Last updated just now" : `Last updated ${date.toLocaleString()}`;
    }
  };

  const initTelegramStatus = async () => {
    try {
      const response = await fetch(`data/telegram-status.json?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("status fetch failed");
      telegramStatus = validateTelegramStatus(await response.json());
    } catch (_error) {
      telegramStatus = null;
    }

    renderTelegramStatus(telegramStatus);
    setRoadmapProgress(telegramStatus, { flashCurrent: true });
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

  const initGatorSound = () => {
    const button = qs("[data-gator-sound]");
    if (!button) return;

    button.addEventListener("click", () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const context = new AudioContext();
      const duration = 0.85;
      const now = context.currentTime;
      const output = context.createGain();
      const filter = context.createBiquadFilter();
      const oscillator = context.createOscillator();
      const noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * duration), context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);

      for (let index = 0; index < noiseData.length; index += 1) {
        noiseData[index] = (Math.random() * 2 - 1) * (1 - index / noiseData.length);
      }

      const noise = context.createBufferSource();
      noise.buffer = noiseBuffer;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + duration);
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(74, now);
      oscillator.frequency.exponentialRampToValueAtTime(38, now + duration);
      output.gain.setValueAtTime(0.0001, now);
      output.gain.exponentialRampToValueAtTime(0.16, now + 0.04);
      output.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(output);
      oscillator.connect(output);
      output.connect(context.destination);
      noise.start(now);
      oscillator.start(now);
      noise.stop(now + duration);
      oscillator.stop(now + duration);
      window.setTimeout(() => context.close().catch(() => {}), Math.ceil((duration + 0.1) * 1000));

      if (!prefersReducedMotion) {
        button.classList.remove("is-growling");
        void button.offsetWidth;
        button.classList.add("is-growling");
        window.setTimeout(() => button.classList.remove("is-growling"), 760);
      }
    });
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
    initRoadmapSwim();
    initReveal();
    initLightBloom();
    initGatorSound();
    initTelegramStatus();
    initMarketFeed();
    initServiceWorker();
    window.requestAnimationFrame(() => setRoadmapProgress(telegramStatus));
  });
})();
