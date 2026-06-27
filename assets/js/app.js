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

const chapterConfig = {
  milestones: [
    {
      chapter: 1,
      target: 50,
      title: "GATOR WAKES UP",
      description: "The founding swamp community comes together."
    },
    {
      chapter: 2,
      target: 100,
      title: "SWAMP GETS LOUD",
      description: "Raids, original memes, replies, and daily momentum."
    },
    {
      chapter: 3,
      target: 250,
      title: "YAP SEASON",
      description: "Contests, meme battles, featured members, and new artwork."
    },
    {
      chapter: 4,
      target: 500,
      title: "GATOR STRONG",
      description: "New scenes, stories, community creations, and larger campaigns."
    },
    {
      chapter: 5,
      target: 1000,
      title: "CITY TAKEOVER",
      description: "The community votes on and launches a major promotion campaign."
    },
    {
      chapter: 6,
      target: 1500,
      title: "MAKE THE WAVE",
      description: "A milestone celebration and the next chapter chosen by the swamp."
    }
  ]
};

const roadmapConfig = {
  get chapterTargets() {
    return chapterConfig.milestones.map((milestone) => milestone.target);
  },
  milestones: chapterConfig.milestones
};

(() => {
  document.documentElement.classList.add("js");

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
  const safeText = (value, fallback = "") => (hasValue(value) ? value.trim() : fallback);
  const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
  let deferredInstallPrompt = null;
  let appInstalled = false;
  let telegramStatus = null;
  let roadmapEntranceStarted = false;
  let activeRoadmapAnimation = 0;
  let selectedRoadmapIndex = 0;
  let roadmapSelectionTouched = false;

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

  const updateInstallControls = () => {
    qsa("[data-install-app]").forEach((button) => {
      button.hidden = false;
      if (appInstalled || isStandaloneApp()) {
        button.textContent = "APP INSTALLED";
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
        return;
      }

      button.textContent = "GET THE APP";
      const unavailable = !deferredInstallPrompt;
      button.disabled = unavailable;
      button.setAttribute("aria-disabled", String(unavailable));
    });
  };

  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    if (isStandaloneApp()) {
      deferredInstallPrompt = null;
      appInstalled = true;
      updateInstallControls();
      return;
    }
    deferredInstallPrompt = event;
    updateInstallControls();
  };

  const handleAppInstalled = () => {
    deferredInstallPrompt = null;
    appInstalled = true;
    updateInstallControls();
  };

  const handleInstallApp = (event) => {
    event.preventDefault();
    document.dispatchEvent(new CustomEvent("yapgator:close-menu"));

    if (isStandaloneApp() || !deferredInstallPrompt) {
      deferredInstallPrompt = null;
      updateInstallControls();
      return;
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    updateInstallControls();
    try {
      promptEvent.prompt();
      if (promptEvent.userChoice && typeof promptEvent.userChoice.catch === "function") {
        promptEvent.userChoice.catch(() => {});
      }
    } catch (_error) {
      updateInstallControls();
    }
  };

  const initInstallApp = () => {
    const installButtons = qsa("[data-install-app]");
    if (!installButtons.length) return;

    installButtons.forEach((button) => {
      button.addEventListener("click", handleInstallApp);
    });
    updateInstallControls();
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

    const selectMarker = (index) => {
      selectedRoadmapIndex = Math.max(0, Math.min(roadmapConfig.milestones.length - 1, index));
      roadmapSelectionTouched = true;
      buttons.forEach((item) => {
        const markerIndex = Number(item.getAttribute("data-roadmap-marker"));
        item.setAttribute("aria-pressed", String(markerIndex === selectedRoadmapIndex));
      });
      renderRoadmapDetail(selectedRoadmapIndex);
    };

    buttons.forEach((button) => {
      const markerIndex = Number(button.getAttribute("data-roadmap-marker"));
      button.addEventListener("click", () => selectMarker(markerIndex));
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
        selectMarker(Number(buttons[nextIndex].getAttribute("data-roadmap-marker")));
      });
    });
  };

  const renderRoadmapMarkers = () => {
    qsa("[data-roadmap-marker]").forEach((marker) => {
      const index = Number(marker.getAttribute("data-roadmap-marker"));
      const milestone = roadmapConfig.milestones[index];
      if (!milestone) return;

      marker.dataset.target = String(milestone.target);
      marker.setAttribute("aria-label", `Chapter ${milestone.chapter}: ${milestone.title}. Target ${formatNumber(milestone.target)} Telegram members.`);
      const number = qs("span", marker);
      const title = qs("strong", marker);
      if (number) number.textContent = String(milestone.chapter);
      if (title) title.textContent = milestone.title;
    });
  };

  const getCurrentChapterIndex = (status = telegramStatus) => {
    if (!status) return 0;
    if (status.members >= roadmapConfig.chapterTargets[roadmapConfig.chapterTargets.length - 1]) {
      return roadmapConfig.chapterTargets.length - 1;
    }
    return Math.max(0, Math.min(roadmapConfig.chapterTargets.length - 1, status.currentChapter - 1));
  };

  const getChapterRouteProgress = (index) => {
    const stops = [0.08, 0.22, 0.39, 0.58, 0.75, 0.96];
    return stops[Math.max(0, Math.min(stops.length - 1, index))];
  };

  const getRouteProgress = (status = telegramStatus) => {
    if (!status) return getChapterRouteProgress(0);
    const targets = roadmapConfig.chapterTargets;
    const stops = targets.map((_target, index) => getChapterRouteProgress(index));

    if (status.members >= targets[targets.length - 1]) return stops[stops.length - 1];

    const activeIndex = Math.max(0, Math.min(targets.length - 1, status.currentChapter - 1));
    const lowerTarget = activeIndex === 0 ? 0 : targets[activeIndex - 1];
    const upperTarget = targets[activeIndex];
    const start = activeIndex === 0 ? 0.04 : stops[activeIndex - 1];
    const end = stops[activeIndex];
    const segmentProgress = Math.max(0, Math.min(1, (status.members - lowerTarget) / Math.max(upperTarget - lowerTarget, 1)));

    return start + (end - start) * segmentProgress;
  };

  const renderRoadmapDetail = (index = selectedRoadmapIndex) => {
    const milestone = roadmapConfig.milestones[index] || roadmapConfig.milestones[0];
    const detail = qs("[data-roadmap-detail]");
    if (!detail || !milestone) return;
    const chapter = qs("[data-roadmap-detail-chapter]", detail);
    const title = qs("[data-roadmap-detail-title]", detail);
    const target = qs("[data-roadmap-detail-target]", detail);
    const description = qs("[data-roadmap-detail-description]", detail);
    if (chapter) chapter.textContent = `CHAPTER ${milestone.chapter}`;
    if (title) title.textContent = milestone.title;
    if (target) target.textContent = `Target: ${formatNumber(milestone.target)} Telegram members`;
    if (description) description.textContent = milestone.description;
  };

  const validateTelegramStatus = (data) => {
    if (!data || typeof data !== "object") return null;
    const members = Number(data.members);
    const currentChapter = Number(data.currentChapter);
    const currentTarget = Number(data.currentTarget);
    const nextTarget = Number(data.nextTarget);
    const progressPercent = Number(data.progressPercent);

    if (!Number.isInteger(members) || members < 0) return null;
    if (!Number.isInteger(currentChapter) || currentChapter < 0 || currentChapter > roadmapConfig.chapterTargets.length) return null;
    if (!Number.isFinite(currentTarget) || currentTarget < 0) return null;
    if (!Number.isFinite(nextTarget) || nextTarget <= 0) return null;
    if (!Number.isFinite(progressPercent) || progressPercent < 0 || progressPercent > 100) return null;

    return { members, currentChapter, currentTarget, nextTarget, progressPercent };
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
    if (!route || !gator || typeof route.getTotalLength !== "function") return;

    const routeProgress = getRouteProgress(status);
    const length = route.getTotalLength();
    const point = route.getPointAtLength(length * routeProgress);
    route.style.setProperty("--route-complete", `${Math.max(0, length * routeProgress)}`);
    route.style.setProperty("--route-remaining", `${Math.max(0, length * (1 - routeProgress))}`);
    gator.style.transform = `translate(${point.x}px, ${point.y}px) scale(var(--route-gator-scale, 1))`;
    updateRoadmapMarkerStates(status, options.flashCurrent === true);
  };

  const animateRoadmapSwim = () => {
    const route = qs("[data-route-path]");
    const gator = qs("[data-route-gator]");
    if (!route || !gator || typeof route.getTotalLength !== "function") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetProgress = getRouteProgress();
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
      route.style.setProperty("--route-complete", `${Math.max(0, length * progress)}`);
      route.style.setProperty("--route-remaining", `${Math.max(0, length * (1 - progress))}`);
      gator.style.transform = `translate(${point.x}px, ${point.y}px) scale(var(--route-gator-scale, 1))`;

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
    const activeIndex = getCurrentChapterIndex(status);

    markers.forEach((marker, index) => {
      const milestone = roadmapConfig.milestones[index];
      const target = milestone ? milestone.target : Number(marker.getAttribute("data-target"));
      const complete = Boolean(status && Number.isFinite(target) && status.members >= target);
      const active = Boolean(status) && index === activeIndex;
      marker.classList.toggle("is-complete", complete);
      marker.classList.toggle("is-active", active);
      marker.classList.toggle("is-selected", index === selectedRoadmapIndex);
      marker.classList.toggle("is-locked", Boolean(status) && !complete && !active);
      marker.setAttribute("aria-pressed", String(index === selectedRoadmapIndex));
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

    renderRoadmapDetail(selectedRoadmapIndex);
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
    const members = qs("[data-swamp-members]", root);
    const chapter = qs("[data-swamp-chapter]", root);
    const nextTarget = qs("[data-swamp-next-target]", root);
    const progressText = qs("[data-swamp-progress-text]", root);
    const progressPercent = qs("[data-swamp-progress-percent]", root);
    const progressFill = qs("[data-swamp-progress-fill]", root);

    if (!status) {
      root.classList.remove("is-live");
      if (live) live.hidden = true;
      if (progress) progress.hidden = true;
      return;
    }

    root.classList.add("is-live");
    if (live) live.hidden = false;
    if (progress) progress.hidden = false;
    const chapterIndex = getCurrentChapterIndex(status);
    const milestone = roadmapConfig.milestones[chapterIndex];
    animateNumber(members, status.members);
    if (chapter) chapter.textContent = milestone ? `CHAPTER ${milestone.chapter} — ${milestone.title}` : `CHAPTER ${status.currentChapter}`;
    if (nextTarget) nextTarget.textContent = `NEXT UNLOCK: ${formatNumber(status.nextTarget)} GATORS`;
    if (progressText) progressText.textContent = `${formatNumber(status.members)} / ${formatNumber(status.nextTarget)}`;
    if (progressPercent) progressPercent.textContent = `${formatNumber(Math.round(status.progressPercent))}%`;
    if (progressFill) progressFill.style.setProperty("--swamp-progress", `${status.progressPercent}%`);
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
    if (telegramStatus && !roadmapSelectionTouched) {
      selectedRoadmapIndex = getCurrentChapterIndex(telegramStatus);
      renderRoadmapDetail(selectedRoadmapIndex);
    }
    if (roadmapEntranceStarted) {
      animateRoadmapSwim();
    } else {
      setRoadmapProgress(telegramStatus, { flashCurrent: true });
    }
  };

  const validateMarketData = (data) => {
    if (!data || typeof data !== "object") return null;
    const price = Number(data.price);
    const marketCap = Number(data.marketCap);
    const volume24h = Number(data.volume24h);
    const bondingCurveProgress = Number(data.bondingCurveProgress);

    return {
      price: Number.isFinite(price) && price > 0 ? price : null,
      marketCap: Number.isFinite(marketCap) && marketCap > 0 ? marketCap : null,
      volume24h: Number.isFinite(volume24h) && volume24h >= 0 ? volume24h : null,
      bondingCurveProgress: Number.isFinite(bondingCurveProgress) && bondingCurveProgress >= 0 && bondingCurveProgress <= 100 ? bondingCurveProgress : null
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

    if (values.price !== null && priceNode) priceNode.textContent = formatMoney(values.price);
    if (values.marketCap !== null && capNode) capNode.textContent = formatMoney(values.marketCap, { maximumFractionDigits: 0 });
    if (values.volume24h !== null && volumeNode) volumeNode.textContent = formatMoney(values.volume24h, { maximumFractionDigits: 0 });
    if (values.bondingCurveProgress !== null && progressNode) progressNode.textContent = `${formatNumber(values.bondingCurveProgress)}%`;

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

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

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
    renderRoadmapMarkers();
    initRoadmapMarkers();
    initRoadmapSwim();
    initReveal();
    initLightBloom();
    initTelegramStatus();
    initMarketFeed();
    initServiceWorker();
    window.requestAnimationFrame(() => setRoadmapProgress(telegramStatus));
  });
})();
