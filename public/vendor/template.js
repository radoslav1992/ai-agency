function initAvatarAnimation() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  const avatars = document.querySelectorAll("[data-opai-avatar]");
  if (!avatars.length) return;
  const trigger = avatars[0].parentElement || avatars[0];
  avatars.forEach((el) => {
    const delay = Number(el.dataset.avatarDelay || 0);
    const direction = el.dataset.avatarDirection || "left";
    const scale = Number(el.dataset.avatarScale ?? 0);
    const offset = Number(el.dataset.avatarOffset || 20);
    const from = {
      opacity: 0,
      scale,
      filter: "blur(6px)",
      duration: 0.85,
      delay,
      ease: "back.out(1.6)",
      scrollTrigger: {
        trigger,
        start: "top 88%",
        once: true
      }
    };
    switch (direction) {
      case "right":
        from.x = offset;
        break;
      case "down":
        from.y = offset;
        break;
      case "up":
        from.y = -offset;
        break;
      case "left":
      default:
        from.x = -offset;
        break;
    }
    gsap.from(el, from);
  });
}
document.addEventListener("DOMContentLoaded", initAvatarAnimation);
const borderExpand = {
  init() {
    const lengthElements = document.querySelectorAll("[data-opai-border-expand]");
    lengthElements.forEach((element) => {
      const ElementFinalWidth = element.offsetWidth;
      const delay = element.getAttribute("data-delay") ? parseFloat(element.getAttribute("data-delay")) : 0;
      const top = element.getAttribute("data-top") ? element.getAttribute("data-top") : "top 100%";
      const markerId = element.getAttribute("data-marker-id") ? element.getAttribute("data-marker-id") : false;
      const duration = element.getAttribute("data-duration") ? parseFloat(element.getAttribute("data-duration")) : 0.6;
      gsap.set(element, {
        width: 0
      });
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: top,
          end: "top 100%",
          toggleActions: "play none none none",
          markers: markerId ? true : false,
          id: markerId && markerId
        },
        width: ElementFinalWidth,
        duration,
        ease: "power3.out",
        delay
      });
    });
  }
};
document.addEventListener("DOMContentLoaded", () => {
  borderExpand.init();
});
const DEFAULT_BASE = "./images/icons/";
function canRun() {
  return typeof gsap !== "undefined";
}
function prefersReducedMotion() {
  return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function currentIconFile(img) {
  const src = img.getAttribute("src") || "";
  const name = src.split("/").pop() || "";
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}
function pickRandomDifferent(currentFile, iconPool) {
  const pool = iconPool.filter((c) => c.file !== currentFile);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
function applyIcon(img, icon, basePath) {
  img.src = `${basePath}${icon.file}`;
  img.alt = icon.alt;
}
function runOneFlip(img, iconPool, basePath, slideDuration, onDone) {
  gsap.to(img, {
    yPercent: -100,
    duration: slideDuration,
    ease: "power2.in",
    onComplete: () => {
      const next = pickRandomDifferent(currentIconFile(img), iconPool);
      if (!next) {
        onDone == null ? void 0 : onDone();
        return;
      }
      applyIcon(img, next, basePath);
      gsap.set(img, { yPercent: 100 });
      gsap.to(img, {
        yPercent: 0,
        duration: slideDuration,
        ease: "power2.out",
        onComplete: onDone
      });
    }
  });
}
function loopOneAtATime(imgs, iconPool, basePath, pauseBetween, slideDuration) {
  const img = imgs[Math.floor(Math.random() * imgs.length)];
  runOneFlip(img, iconPool, basePath, slideDuration, () => {
    gsap.delayedCall(pauseBetween, loopOneAtATime, [
      imgs,
      iconPool,
      basePath,
      pauseBetween,
      slideDuration
    ]);
  });
}
function resolveBasePath(root, firstImg) {
  const fromData = root.dataset.clientIconsBase;
  if (fromData) return fromData.endsWith("/") ? fromData : `${fromData}/`;
  const src = (firstImg == null ? void 0 : firstImg.getAttribute("src")) || "";
  const idx = src.lastIndexOf("/");
  if (idx === -1) return DEFAULT_BASE;
  return src.slice(0, idx + 1);
}
function buildIconPool(imgs) {
  const map = /* @__PURE__ */ new Map();
  imgs.forEach((img) => {
    const file = currentIconFile(img);
    if (!file) return;
    if (!map.has(file)) {
      map.set(file, { file, alt: img.alt || "" });
    }
  });
  return [...map.values()];
}
function initClientReveal() {
  if (!canRun() || prefersReducedMotion()) return;
  const roots = document.querySelectorAll("[data-client-reveal]");
  if (!roots.length) return;
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  roots.forEach((root) => {
    if (root.dataset.clientRevealInit === "1") return;
    const slots = root.querySelectorAll("[data-client-slot]");
    if (!slots.length) return;
    const firstImg = slots[0].querySelector("img");
    const basePath = resolveBasePath(root, firstImg);
    const pauseBetween = Number.parseFloat(root.dataset.clientInterval || "3.2", 10);
    const slideDuration = Number.parseFloat(root.dataset.clientSlideDuration || "1.0", 10);
    const introDelay = Number.parseFloat(root.dataset.clientIntroDelay || "0.4", 10);
    const firstJitter = Number.parseFloat(root.dataset.clientFirstJitter || "1", 10);
    const start = () => {
      root.dataset.clientRevealInit = "1";
      const imgs = [...slots].map((slot) => slot.querySelector("img")).filter(Boolean);
      const iconPool = buildIconPool(imgs);
      if (iconPool.length < 2) return;
      imgs.forEach((img) => gsap.set(img, { yPercent: 0 }));
      const kickoff = introDelay + Math.random() * firstJitter;
      gsap.delayedCall(kickoff, loopOneAtATime, [
        imgs,
        iconPool,
        basePath,
        pauseBetween,
        slideDuration
      ]);
    };
    if (typeof ScrollTrigger === "undefined") {
      start();
      return;
    }
    ScrollTrigger.create({
      trigger: root,
      start: root.dataset.clientScrollStart || "top 90%",
      once: true,
      onEnter: start
    });
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClientReveal);
} else {
  initClientReveal();
}
function dividerExpand(divider) {
  gsap.to(divider, {
    scrollTrigger: {
      trigger: divider,
      start: "top 100%",
      end: "top 50%",
      toggleActions: "play none none none"
    },
    width: "50%",
    duration: 1,
    delay: 0.7,
    ease: "power2.out"
  });
}
const commonAnimation = {
  init() {
    gsap.registerPlugin(ScrollTrigger);
    const footerDivider = document.querySelectorAll(".footer-divider");
    const imagesLoadingReveal = document.querySelectorAll(".image-loading-reveal img");
    const progressContainer = document.querySelector(".progress-container");
    const progressLine = document.querySelectorAll(".progress-line");
    const stepLine = document.querySelectorAll(".step-line");
    const progressBars = document.querySelectorAll(
      ".progress-bar-blue, .progress-bar-black, .progress-bar-lemon, .progress-bar-cyan"
    );
    const blogCards = document.querySelectorAll(".blog-card");
    const partnerShipCards = document.querySelectorAll(".partner-ship-card");
    const videoGeneratorCtaImages = document.querySelectorAll(".video-generator-cta-image");
    if (footerDivider) {
      dividerExpand(footerDivider);
    }
    if (stepLine.length > 0) {
      gsap.set(stepLine, { height: "0px" });
      const firstStepLine = stepLine[0];
      const triggerElement = firstStepLine.closest(".step-line-container") || firstStepLine.parentElement || firstStepLine;
      const stepTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 79%",
          end: "top 15%",
          toggleActions: "play none none"
        }
      });
      stepLine.forEach((line, index) => {
        stepTimeline.to(
          line,
          {
            height: "100%",
            duration: 1.4,
            ease: "power3.out"
          },
          index * 0.7
          // Each animation with 0.7s delay duration)
        );
      });
    }
    if (progressBars.length > 0) {
      gsap.set(progressBars, { height: "0px" });
      const progressTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".progress-bar-blue",
          start: "top 88%",
          end: "bottom 20%",
          toggleActions: "play none none "
        }
      });
      progressTimeline.to(
        ".progress-bar-blue",
        {
          height: "30%",
          duration: 1.2,
          ease: "power2.out"
        },
        "-=0.3"
      ).to(
        ".progress-bar-black",
        {
          height: "65%",
          duration: 1.2,
          ease: "power2.out"
        },
        "-=0.3"
      ).to(
        ".progress-bar-lemon",
        {
          height: "45%",
          duration: 1.2,
          ease: "power2.out"
        },
        "-=0.8"
      ).to(
        ".progress-bar-cyan",
        {
          height: "30%",
          duration: 1.2,
          ease: "power2.out"
        },
        "-=0.9"
      );
    }
    if (progressLine.length > 0) {
      gsap.set(progressLine, { width: "0%" });
      const progressTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: progressContainer,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none"
        }
      });
      progressLine.forEach((line, index) => {
        progressTimeline.to(
          line,
          {
            width: "100%",
            duration: 1.2,
            ease: "power2.inOut"
          },
          index * 1
          // Each animation starts after the previous one completes (2 seconds duration)
        );
      });
    }
    if (imagesLoadingReveal.length > 0) {
      imagesLoadingReveal.forEach((img) => {
        const triggerEl = img.closest(".image-loading-reveal") || img;
        gsap.set(img, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          opacity: 0,
          scale: 0.9
        });
        gsap.fromTo(
          img,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            opacity: 0,
            scale: 0.9
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            opacity: 1,
            scale: 1,
            ease: "back.in",
            duration: 0.9,
            scrollTrigger: {
              trigger: triggerEl,
              start: "top 94%",
              end: "bottom 58%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }
    if (blogCards.length > 0) {
      blogCards[0].classList.add("active-card");
      blogCards.forEach((card) => {
        card.addEventListener("mouseenter", function() {
          blogCards.forEach((c) => c.classList.remove("active-card"));
          this.classList.add("active-card");
        });
      });
    }
    if (partnerShipCards.length > 0) {
      partnerShipCards.forEach((card) => {
        card.addEventListener("mouseenter", function() {
          partnerShipCards.forEach((c) => c.classList.remove("active-partner-ship-card"));
          this.classList.add("active-partner-ship-card");
        });
      });
    }
    if (videoGeneratorCtaImages.length > 0) {
      videoGeneratorCtaImages.forEach((image, index) => {
        gsap.from(image, {
          duration: 0.5,
          ease: "sine.inOut",
          y: 140,
          opacity: 0,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: image,
            start: "top 94%",
            end: "bottom 20%",
            toggleActions: "play none none"
          }
        });
      });
    }
  }
};
const updateFooterYear = () => {
  const footerYearElements = document.querySelectorAll("[data-footer-year]");
  if (footerYearElements.length > 0) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    footerYearElements.forEach((element) => {
      element.textContent = currentYear;
    });
  }
};
if (typeof window !== "undefined") {
  commonAnimation.init();
  updateFooterYear();
}
const initCounterNumberOnScroll = () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  const counterTriggers = document.querySelectorAll("[data-counter-trigger]");
  counterTriggers.forEach((counterTrigger) => {
    const counterFlow = counterTrigger.querySelector("[data-counter-number]");
    const counterValue = Number(counterTrigger.dataset.counterValue) || 0;
    const counterDuration = Number(counterTrigger.dataset.counterDuration) || 1.8;
    const counterFractionDigits = Number(counterTrigger.dataset.counterFractionDigits) || 0;
    if (!counterFlow || typeof counterFlow.update !== "function") return;
    counterFlow.trend = 0;
    counterFlow.format = {
      useGrouping: true,
      maximumFractionDigits: counterFractionDigits,
      minimumFractionDigits: counterFractionDigits
    };
    counterFlow.update(0);
    ScrollTrigger.create({
      trigger: counterTrigger,
      start: "top 90%",
      once: true,
      onEnter: () => {
        counterFlow.transformTiming = { duration: counterDuration * 1e3, easing: "ease-out" };
        counterFlow.spinTiming = { duration: counterDuration * 1e3, easing: "ease-out" };
        counterFlow.opacityTiming = {
          duration: Math.max(250, counterDuration * 450),
          easing: "ease-out"
        };
        counterFlow.update(counterValue);
      }
    });
  });
};
document.addEventListener("DOMContentLoaded", () => {
  initCounterNumberOnScroll();
});
const ctaAnimation = {
  initFallingStarAnimation() {
    const parent = document.getElementById("cta-v7-falling-star-wrapper");
    if (!parent) return;
    const NUM_STARS = 200;
    let { width, height } = parent.getBoundingClientRect();
    window.addEventListener("resize", () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    });
    function createStar() {
      const star = document.createElement("span");
      star.className = "falling-star";
      parent.appendChild(star);
      return star;
    }
    function animateStar(star, isFirst = false) {
      const duration = gsap.utils.random(15, 25);
      const opacity = gsap.utils.random(0.3, 1);
      const startX = gsap.utils.random(0, width);
      const endX = startX + gsap.utils.random(-100, 100);
      gsap.set(star, {
        y: -10,
        x: startX,
        opacity,
        scale: gsap.utils.random(0.5, 1.2)
      });
      gsap.to(star, {
        y: height + 200,
        x: endX,
        duration: isFirst ? 40 : duration,
        delay: isFirst ? 0 : gsap.utils.random(0, 0.1),
        ease: "none",
        onComplete: animateStar,
        onCompleteParams: [star, false]
      });
    }
    for (let i = 0; i < NUM_STARS; i++) {
      setTimeout(() => {
        const star = createStar();
        animateStar(star, i === 0);
      }, i * 50);
    }
  }
};
document.addEventListener("DOMContentLoaded", () => {
  ctaAnimation.initFallingStarAnimation();
});
const footerTextShuffle = {
  init() {
    const elements = document.querySelectorAll(".footer-title, .footer-title-2");
    if (!elements.length) return;
    elements.forEach((element) => {
      var _a;
      element.style.whiteSpace = "nowrap";
      const spanElement = element.querySelector("span");
      const textNode = spanElement || element;
      const originalText = ((_a = textNode.textContent) == null ? void 0 : _a.trim()) || "OPTIM AI";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const duration = 2e3;
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const revealed = Math.floor(progress * originalText.length);
        const animatedText = originalText.split("").map((char, i) => {
          if (char === " ") return " ";
          return i < revealed ? originalText[i] : chars[Math.floor(Math.random() * 26)];
        }).join("");
        if (spanElement) {
          spanElement.textContent = animatedText;
        } else {
          element.textContent = animatedText;
        }
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (spanElement) {
            spanElement.textContent = originalText;
          } else {
            element.textContent = originalText;
          }
        }
      };
      const shuffle = () => {
        startTime = null;
        requestAnimationFrame(animate);
      };
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
          trigger: element,
          start: "top 100%",
          onEnter: shuffle,
          once: true
        });
      } else {
        shuffle();
      }
    });
  }
};
document.addEventListener("DOMContentLoaded", () => footerTextShuffle.init());
const CLOSE_DELAY = 120;
const MENU_DURATION = 0.5;
const ITEM_STAGGER = 0.025;
function initHeaderMenus() {
  const header = document.querySelector("header");
  const nav = header == null ? void 0 : header.querySelector("nav");
  const root = nav == null ? void 0 : nav.querySelector("[data-dropdown-root]");
  const container = root == null ? void 0 : root.querySelector("[data-dropdown-container]");
  if (!header || !nav || !root || !container) return;
  const triggers = Array.from(nav.querySelectorAll("[data-menu]"));
  const sectionEls = Array.from(container.querySelectorAll("[data-dropdown-section]"));
  if (!triggers.length || !sectionEls.length) return;
  const sections = /* @__PURE__ */ new Map();
  sectionEls.forEach((section) => {
    const name = section.dataset.dropdownSection;
    if (!name) return;
    sections.set(name, { section });
  });
  let activeName = null;
  let activeTrigger = null;
  let activeTween = null;
  let closeTimer = null;
  const gsap2 = globalThis.gsap;
  const getMenuLayout = (trigger, section) => {
    const navRect = nav.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const triggerCenter = triggerRect.left + triggerRect.width / 2 - navRect.left;
    const width = section.offsetWidth;
    return {
      left: triggerCenter - width / 2,
      width,
      height: section.offsetHeight
    };
  };
  const setMenu = (name, trigger) => {
    const target = sections.get(name);
    if (!target) return;
    const layout = getMenuLayout(trigger, target.section);
    root.style.left = `${layout.left}px`;
    root.style.width = `${layout.width}px`;
    container.style.width = `${layout.width}px`;
    container.style.height = `${layout.height}px`;
    sections.forEach((entry, key) => {
      const isActive = key === name;
      entry.section.classList.toggle("opacity-100", isActive);
      entry.section.classList.toggle("opacity-0", !isActive);
      entry.section.classList.toggle("pointer-events-auto", isActive);
      entry.section.classList.toggle("pointer-events-none", !isActive);
    });
  };
  const animateMenu = (name, trigger, shouldAnimateItems, wasClosed) => {
    const target = sections.get(name);
    if (!target) return;
    if (!gsap2) {
      setMenu(name, trigger);
      return;
    }
    const layout = getMenuLayout(trigger, target.section);
    const items = target.section.querySelectorAll("a");
    const inactiveSections = sectionEls.filter((section) => section !== target.section);
    if (activeTween) activeTween.kill();
    gsap2.killTweensOf([root, container, target.section, ...inactiveSections, ...items]);
    if (wasClosed) {
      gsap2.set(root, { left: layout.left, width: layout.width, opacity: 0, y: -4 });
      gsap2.set(container, { width: layout.width, height: layout.height });
    }
    if (items.length) {
      gsap2.set(items, { transition: "none", willChange: "transform, opacity" });
    }
    root.classList.remove("opacity-0");
    target.section.classList.remove("opacity-0", "pointer-events-none");
    target.section.classList.add("opacity-100", "pointer-events-auto");
    inactiveSections.forEach((section) => {
      section.classList.remove("opacity-100", "pointer-events-auto");
      section.classList.add("opacity-0", "pointer-events-none");
    });
    activeTween = gsap2.timeline({ defaults: { ease: "power3.out", force3D: true } });
    activeTween.to(
      root,
      { left: layout.left, width: layout.width, opacity: 1, y: 0, duration: MENU_DURATION },
      0
    );
    activeTween.to(
      container,
      { width: layout.width, height: layout.height, duration: MENU_DURATION },
      0
    );
    activeTween.to(inactiveSections, { opacity: 0, duration: 0.12, overwrite: "auto" }, 0);
    activeTween.set(target.section, { opacity: 1 }, 0);
    if (items.length) {
      activeTween.fromTo(
        items,
        { x: 14, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: ITEM_STAGGER,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
          onComplete: () => gsap2.set(items, { clearProps: "transition,willChange,transform" })
        },
        0.05
      );
    }
  };
  const openMenu = (trigger) => {
    const name = trigger.dataset.menu;
    if (!sections.has(name)) return;
    if (activeName === name) {
      activeTrigger = trigger;
      return;
    }
    const wasClosed = !activeName;
    activeName = name;
    activeTrigger = trigger;
    root.classList.remove("pointer-events-none", "opacity-0");
    root.classList.add("pointer-events-auto", "opacity-100");
    animateMenu(name, trigger, true, wasClosed);
  };
  const closeMenu = () => {
    if (!activeName) return;
    activeName = null;
    activeTrigger = null;
    if (activeTween) activeTween.kill();
    const finishClose = () => {
      root.classList.remove("pointer-events-auto", "opacity-100");
      root.classList.add("pointer-events-none", "opacity-0");
      sections.forEach((entry) => {
        entry.section.classList.remove("opacity-100", "pointer-events-auto");
        entry.section.classList.add("opacity-0", "pointer-events-none");
      });
    };
    if (!gsap2) {
      finishClose();
      return;
    }
    activeTween = gsap2.to(root, {
      opacity: 0,
      duration: 0.16,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: finishClose
    });
  };
  const stopClose = () => {
    globalThis.clearTimeout(closeTimer);
  };
  const startClose = () => {
    stopClose();
    closeTimer = globalThis.setTimeout(closeMenu, CLOSE_DELAY);
  };
  triggers.forEach((trigger) => {
    const name = trigger.dataset.menu;
    if (!sections.has(name)) return;
    trigger.addEventListener("mouseenter", () => {
      stopClose();
      openMenu(trigger);
    });
    trigger.addEventListener("mouseleave", startClose);
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (activeTrigger === trigger) {
        closeMenu();
      } else {
        openMenu(trigger);
      }
    });
  });
  root.addEventListener("mouseenter", stopClose);
  root.addEventListener("mouseleave", startClose);
  document.addEventListener("click", (event) => {
    if (!activeName || header.contains(event.target)) return;
    closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  globalThis.addEventListener("resize", () => {
    if (!activeName || !activeTrigger) return;
    setMenu(activeName, activeTrigger);
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeaderMenus);
} else {
  initHeaderMenus();
}
const headerAnimation = {
  headerOne() {
    const header = document.querySelector(".header-scroll");
    if (header) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
          header.style.transition = "all 0.5s ease-in-out";
          header.classList.add("scroll-header");
        } else {
          header.classList.remove("scroll-header");
        }
      });
    }
  }
};
if (globalThis.window !== void 0) {
  headerAnimation.headerOne();
}
function initHeroImgReveal() {
  var _a;
  const baseTargets = [...document.querySelectorAll("[data-hero-img-reveal]")];
  if (!baseTargets.length || typeof gsap === "undefined") return;
  const targets = [...baseTargets].sort((a, b) => {
    const aOrder = Number(a.dataset.heroImgRevealOrder || 999);
    const bOrder = Number(b.dataset.heroImgRevealOrder || 999);
    return aOrder - bOrder;
  });
  const runReveal = () => {
    gsap.set(targets, {
      scale: 0,
      transformOrigin: "50% 50%"
    });
    gsap.to(targets, {
      scale: 1,
      duration: 0.9,
      ease: "back.out(1.6)",
      stagger: {
        each: 0.08,
        from: "start"
      }
    });
  };
  const useScroll = targets[0].closest('[data-hero-img-reveal-mode="scroll"]');
  if (useScroll && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: useScroll,
      start: "top 88%",
      once: true,
      onEnter: runReveal
    });
  } else {
    runReveal();
  }
  const heroSection = (_a = targets[0]) == null ? void 0 : _a.closest("section");
  if (heroSection && typeof ScrollTrigger !== "undefined") {
    gsap.to(targets, {
      y: -90,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.6
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initHeroImgReveal();
});
const PRICE_BY_PERIOD = {
  starter: { monthly: 99, yearly: 140 },
  professional: { monthly: 199, yearly: 1990 },
  enterprise: { monthly: 299, yearly: 2990 }
};
const FLOW_TIMING = { duration: 400, easing: "ease-out" };
function layoutIndicator(container, activeTab) {
  const fs = container.getBoundingClientRect();
  const lb = activeTab.getBoundingClientRect();
  return {
    x: lb.left - fs.left,
    y: lb.top - fs.top,
    width: lb.width,
    height: lb.height
  };
}
function syncPrices(scope, period) {
  const suffix = period === "monthly" ? "mo" : "yr";
  const periodLabel = period === "monthly" ? "month" : "year";
  scope.querySelectorAll("[data-pricing-tier]").forEach((card) => {
    var _a;
    const tier = card.dataset.pricingTier;
    const price = (_a = PRICE_BY_PERIOD[tier]) == null ? void 0 : _a[period];
    const flow = card.querySelector("[data-pricing-price]");
    const suffixEl = card.querySelector("[data-pricing-suffix]");
    const ariaEl = card.querySelector("[data-pricing-aria]");
    if (price === void 0 || !flow || typeof flow.update !== "function") return;
    flow.format = { maximumFractionDigits: 0, minimumFractionDigits: 0 };
    flow.transformTiming = FLOW_TIMING;
    flow.update(price);
    if (suffixEl) suffixEl.textContent = suffix;
    if (ariaEl) ariaEl.setAttribute("aria-label", `${price} dollars per ${periodLabel}`);
  });
}
function runWhenNumberFlowReady(fn) {
  if (customElements.get("number-flow")) {
    fn();
  } else {
    customElements.whenDefined("number-flow").then(fn);
  }
}
function initPricingTabs() {
  if (typeof gsap === "undefined") return;
  document.querySelectorAll("[data-pricing-tabs]").forEach((tabsRoot) => {
    const scope = tabsRoot.closest(".price-scope") ?? tabsRoot.closest("section") ?? document;
    const tablist = tabsRoot.querySelector('[role="tablist"]');
    const indicator = tabsRoot.querySelector("[data-pricing-tab-indicator]");
    const tabs = tabsRoot.querySelectorAll("[data-pricing-tab]");
    if (!tablist || !indicator || !tabs.length) return;
    const getActiveTab = () => tabsRoot.querySelector('[data-pricing-tab][aria-selected="true"]');
    const setTabState = () => {
      tabs.forEach((tab) => {
        tab.dataset.active = tab.getAttribute("aria-selected") === "true" ? "true" : "false";
      });
    };
    setTabState();
    const moveIndicator = (instant) => {
      const activeTab = getActiveTab();
      if (!activeTab) return;
      const { x, y, width, height } = layoutIndicator(tablist, activeTab);
      if (instant) {
        gsap.set(indicator, { x, y, width, height });
      } else {
        gsap.to(indicator, { x, y, width, height, duration: 0.4, ease: "power3.out" });
      }
    };
    const apply = () => {
      moveIndicator(false);
      setTabState();
      const activeTab = getActiveTab();
      if (!activeTab) return;
      runWhenNumberFlowReady(() => syncPrices(scope, activeTab.dataset.pricingPeriod));
    };
    const selectTab = (tab) => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
    };
    const onResize = () => moveIndicator(true);
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.getAttribute("aria-selected") === "true") return;
        selectTab(tab);
        apply();
      });
    });
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => {
      moveIndicator(true);
      setTabState();
      const activeTab = getActiveTab();
      if (activeTab) runWhenNumberFlowReady(() => syncPrices(scope, activeTab.dataset.pricingPeriod));
    });
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPricingTabs);
} else {
  initPricingTabs();
}
const animation = {
  init() {
    const elements = document.querySelectorAll("[data-opai-animate]");
    const Springer = window.Springer.default;
    elements.forEach((elem) => {
      const duration = elem.getAttribute("data-duration") ? parseFloat(elem.getAttribute("data-duration")) : 0.6;
      const blur = elem.getAttribute("data-blur") ? parseFloat(elem.getAttribute("data-blur")) : 0;
      const delay = elem.getAttribute("data-delay") ? parseFloat(elem.getAttribute("data-delay")) : 0;
      const offset = elem.getAttribute("data-offset") ? parseFloat(elem.getAttribute("data-offset")) : 60;
      const instant = elem.hasAttribute("data-instant") && elem.getAttribute("data-instant") !== "false";
      const start = elem.getAttribute("data-start") || "top 90%";
      const end = elem.getAttribute("data-end") || "top 50%";
      const direction = elem.getAttribute("data-direction") || "down";
      const useSpring = elem.hasAttribute("data-spring");
      const spring = useSpring ? Springer(0.2, 0.8) : null;
      const rotation = elem.getAttribute("data-rotation") ? parseFloat(elem.getAttribute("data-rotation")) : 0;
      const scale = elem.getAttribute("data-scale") ? parseFloat(elem.getAttribute("data-scale")) : 1;
      const animationType = elem.getAttribute("data-animation-type") || "from";
      elem.style.opacity = "1";
      elem.style.filter = `blur(${blur}px)`;
      let animationProps;
      if (animationType === "to") {
        animationProps = {
          opacity: 1,
          filter: "blur(0)",
          duration,
          delay,
          ease: useSpring ? spring : "power2.out",
          scale
        };
        if (rotation !== 0) {
          animationProps.rotation = rotation;
        }
      } else {
        animationProps = {
          opacity: 0,
          filter: "blur(16px)",
          duration,
          delay,
          ease: useSpring ? spring : "power2.out"
        };
        if (rotation !== 0) {
          animationProps.rotation = rotation;
        }
      }
      if (!instant) {
        animationProps.scrollTrigger = {
          trigger: elem,
          start,
          end,
          scrub: false
        };
      }
      switch (direction) {
        case "left":
          animationProps.x = -offset;
          break;
        case "right":
          animationProps.x = offset;
          break;
        case "down":
          animationProps.y = offset;
          break;
        case "up":
        default:
          animationProps.y = -offset;
          break;
      }
      if (animationType === "to") {
        gsap.to(elem, animationProps);
      } else {
        gsap.from(elem, animationProps);
      }
    });
  }
};
document.addEventListener("DOMContentLoaded", () => {
  animation.init();
});
let lenis;
const smoothScrolling = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768 || "ontouchstart" in window;
  if (!isMobile) {
    lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true
    });
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => {
      lenis.raf(time * 1e3);
    });
    gsap.ticker.lagSmoothing(0);
  }
};
const resetTocItems = (sidebarList) => {
  const allListItems = sidebarList.querySelectorAll("li");
  allListItems.forEach((item) => {
    const icon = item.querySelector("span:last-child");
    const text = item.querySelector("span:first-child, a span");
    if (icon) icon.classList.add("invisible");
    if (text) {
      text.classList.remove("font-medium", "text-secondary", "dark:text-accent");
      text.classList.add("font-normal", "text-secondary/60", "dark:text-accent/60");
    }
  });
};
const activateTocItem = (item) => {
  const icon = item.querySelector("span:last-child");
  const text = item.querySelector("span:first-child, a span");
  if (icon) icon.classList.remove("invisible");
  if (text) {
    text.classList.remove("font-normal", "text-secondary/60", "dark:text-accent/60");
    text.classList.add("font-medium", "text-secondary", "dark:text-accent");
  }
};
const handleTocItemClick = (clickedItem, sidebarList) => {
  resetTocItems(sidebarList);
  activateTocItem(clickedItem);
};
const lenisSmoothScrollLinks = () => {
  const lenisTargetElements = document.querySelectorAll(".lenis-scroll-to");
  const sidebarList = document.querySelector(".table-of-contents .table-of-list");
  lenisTargetElements.forEach((ele) => {
    ele.addEventListener("click", function(e) {
      e.preventDefault();
      const target = ele.getAttribute("href");
      if (sidebarList) {
        const clickedItem = ele.closest("li");
        if (clickedItem) {
          handleTocItemClick(clickedItem, sidebarList);
        }
      }
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, {
            offset: -100,
            duration: 1.7,
            easing: (t) => 1 - Math.pow(1 - t, 3)
          });
        } else {
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
            setTimeout(() => {
              window.scrollBy(0, -100);
            }, 100);
          }
        }
      }
    });
  });
};
const handleTocListClicks = () => {
  const sidebarList = document.querySelector(".table-of-contents .table-of-list");
  if (!sidebarList) return;
  const listItems = sidebarList.querySelectorAll("li");
  listItems.forEach((item) => {
    if (item.querySelector(".lenis-scroll-to")) {
      return;
    }
    item.addEventListener("click", function() {
      handleTocItemClick(item, sidebarList);
    });
  });
};
document.addEventListener("DOMContentLoaded", () => {
  smoothScrolling();
  lenisSmoothScrollLinks();
  handleTocListClicks();
});
const stackCardAnimation = {
  init() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const cardWrappers = gsap.utils.toArray("[data-stack-card-wrapper]");
    if (cardWrappers.length === 0) return;
    cardWrappers.forEach((wrapper) => {
      const cardItems = wrapper.querySelectorAll("[data-stack-card-item]");
      if (cardItems.length === 0) return;
      const markers = wrapper.dataset.stackCardMarkers || false;
      const stackStyle = wrapper.dataset.stackStyle || "scale";
      const scaleValue = Number.parseFloat(wrapper.dataset.scaleValue) || 0.9;
      cardItems.forEach((item, i) => {
        let animationProps = {};
        if (stackStyle === "rotate") {
          let rotation = 0;
          if (i % 2 === 1) {
            rotation = Math.floor(i / 2) % 2 === 0 ? 4 : -4;
          }
          animationProps = {
            rotation,
            transformOrigin: "top center"
          };
        } else {
          let scale = 1;
          if (i !== cardItems.length - 1) {
            scale = scaleValue + 0.025 * i;
          }
          animationProps = {
            scale,
            transformOrigin: "top center"
          };
        }
        gsap.to(item, {
          ...animationProps,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top " + (150 + 10 * i),
            end: "bottom 550",
            endTrigger: wrapper,
            scrub: 1,
            pin: item,
            pinSpacing: false,
            invalidateOnRefresh: true,
            markers: markers ? {
              indent: 100 * i,
              startColor: "#0ae448",
              endColor: "#fec5fb",
              fontSize: "14px"
            } : false,
            id: `stack-card-${i + 1}`
          }
        });
      });
    });
  }
};
document.addEventListener("DOMContentLoaded", () => {
  stackCardAnimation.init();
});
const stairsCardsAnimation = {
  init() {
    const containers = document.querySelectorAll("[data-stairs-wrapper]");
    if (containers.length === 0) return;
    containers.forEach((container) => {
      const cardSelector = container.getAttribute("data-stairs-wrapper");
      const cards = container.querySelectorAll(cardSelector);
      const baseOffset = container.getAttribute("data-base-offset") ? parseFloat(container.getAttribute("data-base-offset")) : 150;
      const stepOffset = container.getAttribute("data-step-offset") ? parseFloat(container.getAttribute("data-step-offset")) : 22;
      const duration = container.getAttribute("data-duration") ? parseFloat(container.getAttribute("data-duration")) : 1;
      const stagger = container.getAttribute("data-stagger") ? parseFloat(container.getAttribute("data-stagger")) : 0.1;
      const start = container.getAttribute("data-start") || "top 80%";
      const end = container.getAttribute("data-end") || "top 10%";
      const useScrub = container.hasAttribute("data-scrub") && container.getAttribute("data-scrub") !== "false";
      const once = container.hasAttribute("data-once") && container.getAttribute("data-once") !== "false";
      cards.forEach((card, index) => {
        const offsetY = baseOffset + index * stepOffset;
        gsap.set(card, {
          y: offsetY
        });
      });
      const animationProps = {
        y: 0,
        duration,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: container,
          start,
          end,
          once
        }
      };
      if (useScrub) {
        animationProps.scrollTrigger.scrub = true;
      }
      gsap.to(cards, animationProps);
    });
  }
};
document.addEventListener("DOMContentLoaded", () => {
  stairsCardsAnimation.init();
});
function initTextReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (typeof SplitText === "undefined") return;
  const elements = document.querySelectorAll("[data-text-reveal]");
  if (!elements.length) return;
  elements.forEach((element) => {
    if (!(element.textContent || "").trim()) return;
    const delay = Number(element.dataset.textRevealDelay || 0);
    const stagger = Number(element.dataset.textRevealStagger || 0.023);
    const duration = Number(element.dataset.textRevealDuration || 0.8);
    let revealed = false;
    let tl = null;
    const split = new SplitText(element, {
      type: "lines,words,chars",
      autoSplit: true,
      mask: "chars",
      onSplit: (self) => {
        const { chars } = self;
        if (!chars.length) return;
        gsap.killTweensOf(chars);
        if (tl) tl.kill();
        gsap.set(chars, { yPercent: revealed ? 0 : 100 });
        if (revealed) return;
        tl = gsap.timeline({ paused: true }).set(element, { opacity: 1 }).to(chars, {
          yPercent: 0,
          duration,
          ease: "power3.out",
          stagger: {
            each: stagger,
            from: "start"
          }
        });
      }
    });
    if (!split.chars.length) return;
    ScrollTrigger.create({
      trigger: element,
      start: "top 88%",
      once: true,
      onEnter: () => {
        const play = () => {
          revealed = true;
          tl == null ? void 0 : tl.play();
        };
        if (delay > 0) {
          gsap.delayedCall(delay, play);
        } else {
          play();
        }
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", initTextReveal);
const typewriterAnimation = {
  init() {
    if (typeof gsap === "undefined") {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const container = document.querySelectorAll("[data-typewriter]");
    if (container.length === 0) return;
    container.forEach((container2) => {
      const typewriterElement = container2.querySelector("[data-typewriter-text]");
      if (!typewriterElement || !container2) {
        return;
      }
      const duration = Number.parseFloat(container2.dataset.duration) || 3;
      const isFormElementWithPlaceholder = (typewriterElement.tagName === "INPUT" || typewriterElement.tagName === "TEXTAREA") && typewriterElement.placeholder;
      if (isFormElementWithPlaceholder) {
        this.animatePlaceholder(typewriterElement, container2, duration);
      } else if (typeof SplitText !== "undefined") {
        this.animateTextContent(typewriterElement, container2, duration);
      }
    });
  },
  animatePlaceholder(formElement, container, duration = 3) {
    const originalPlaceholder = formElement.placeholder;
    const placeholderText = originalPlaceholder;
    formElement.placeholder = "";
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true
      }
    });
    const typingDuration = duration;
    const charDelay = typingDuration / placeholderText.length;
    placeholderText.split("").forEach((char, index) => {
      tl.call(
        () => {
          formElement.placeholder += char;
        },
        null,
        index * charDelay
      );
    });
  },
  animateTextContent(typewriterElement, container, duration = 3) {
    const split = new SplitText(typewriterElement, {
      type: "chars",
      tag: "span"
    });
    gsap.set(split.chars, { opacity: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true
      }
    });
    const typingDuration = duration;
    const charDelay = typingDuration / split.chars.length;
    split.chars.forEach((char, index) => {
      tl.to(char, { opacity: 1, duration: 0.01 }, index * charDelay);
    });
  }
};
document.addEventListener("DOMContentLoaded", () => {
  typewriterAnimation.init();
});
document.addEventListener("DOMContentLoaded", function() {
  if (typeof InfiniteMarquee === "undefined") {
    console.error("InfiniteMarquee is not loaded.");
    return;
  }
  const animation2 = {
    infiniteLeft() {
      if (document.querySelector(".logos-marquee-container")) {
        new InfiniteMarquee({
          element: ".logos-marquee-container",
          speed: 55e3,
          smoothEdges: true,
          direction: "left",
          gap: "32px",
          duplicateCount: 1,
          mobileSettings: {
            direction: "top",
            speed: 5e4
          },
          on: {
            beforeInit: () => console.log("Not Yet Initialized"),
            afterInit: () => console.log("Initialized")
          }
        });
      }
    },
    infiniteRight() {
      if (document.querySelector(".logos-right-marquee-container")) {
        new InfiniteMarquee({
          element: ".logos-right-marquee-container",
          speed: 55e3,
          smoothEdges: true,
          direction: "right",
          gap: "32px",
          duplicateCount: 1,
          mobileSettings: {
            direction: "right",
            speed: 5e4
          },
          on: {
            beforeInit: () => console.log("Not Yet Initialized"),
            afterInit: () => console.log("Initialized")
          }
        });
      }
    },
    initHover() {
      if (document.querySelector(".cards-marquee-container")) {
        new InfiniteMarquee({
          element: ".cards-marquee-container",
          speed: 14e4,
          smoothEdges: true,
          direction: "left",
          gap: "32px",
          pauseOnHover: true,
          on: {
            beforeInit: () => console.log("Not Yet Initialized"),
            afterInit: () => console.log("Initialized")
          }
        });
      }
    },
    initHoverRight() {
      if (document.querySelector(".cards-right-marquee-container")) {
        new InfiniteMarquee({
          element: ".cards-right-marquee-container",
          speed: 14e4,
          smoothEdges: true,
          direction: "right",
          gap: "32px",
          pauseOnHover: true,
          on: {
            beforeInit: () => console.log("Not Yet Initialized"),
            afterInit: () => console.log("Initialized")
          }
        });
      }
    },
    infiniteTop() {
      if (document.querySelector(".top-marquee-container")) {
        new InfiniteMarquee({
          element: ".top-marquee-container",
          speed: 4e4,
          smoothEdges: true,
          direction: "top",
          gap: "32px",
          pauseOnHover: true,
          duplicateCount: 0,
          mobileSettings: {
            direction: "top",
            speed: 5e4
          },
          on: {
            beforeInit: () => {
            },
            afterInit: () => {
            }
          }
        });
      }
    },
    infiniteBottom() {
      if (document.querySelector(".bottom-marquee-container")) {
        new InfiniteMarquee({
          element: ".bottom-marquee-container",
          speed: 4e4,
          smoothEdges: true,
          direction: "bottom",
          pauseOnHover: true,
          gap: "32px",
          duplicateCount: 0,
          mobileSettings: {
            direction: "bottom",
            speed: 5e4
          },
          on: {
            beforeInit: () => {
            },
            afterInit: () => {
            }
          }
        });
      }
    }
  };
  animation2.infiniteLeft();
  animation2.infiniteRight();
  animation2.initHover();
  animation2.initHoverRight();
  animation2.infiniteTop();
  animation2.infiniteBottom();
});
class MobileMenuAccordion {
  constructor(options = {}) {
    this.defaultOpenMenu = options.defaultOpenMenu || "company-menu";
    this.toggleButtons = null;
    this.submenus = null;
    this.arrows = null;
    this.init();
  }
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.bindEvents());
    } else {
      this.bindEvents();
    }
  }
  bindEvents() {
    this.toggleButtons = document.querySelectorAll(".mobile-menu-toggle[data-menu]");
    if (this.toggleButtons.length === 0) {
      return;
    }
    this.submenus = document.querySelectorAll(".mobile-submenu[data-submenu]");
    this.arrows = document.querySelectorAll(".mobile-menu-toggle .menu-arrow");
    this.setDefaultState();
    this.toggleButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const menuId = button.dataset.menu;
        if (!menuId) return;
        this.toggleMenu(menuId);
      });
    });
  }
  setDefaultState() {
    this.submenus.forEach((submenu) => {
      submenu.classList.add("hidden");
      submenu.classList.remove("block");
    });
    this.arrows.forEach((arrow) => {
      arrow.classList.remove("rotate-90");
    });
    if (this.defaultOpenMenu) {
      const defaultSubmenu = document.querySelector(
        `.mobile-submenu[data-submenu="${this.defaultOpenMenu}"]`
      );
      const defaultButton = document.querySelector(
        `.mobile-menu-toggle[data-menu="${this.defaultOpenMenu}"]`
      );
      const defaultArrow = defaultButton == null ? void 0 : defaultButton.querySelector(".menu-arrow");
      if (defaultSubmenu) {
        defaultSubmenu.classList.remove("hidden");
        defaultSubmenu.classList.add("block");
      }
      if (defaultArrow) {
        defaultArrow.classList.add("rotate-90");
      }
    }
  }
  toggleMenu(menuId) {
    const submenu = document.querySelector(`.mobile-submenu[data-submenu="${menuId}"]`);
    const button = document.querySelector(`.mobile-menu-toggle[data-menu="${menuId}"]`);
    const arrow = button == null ? void 0 : button.querySelector(".menu-arrow");
    if (!submenu || !button) {
      return;
    }
    const isCurrentlyOpen = submenu.classList.contains("block") && !submenu.classList.contains("hidden");
    this.closeAllMenus();
    if (isCurrentlyOpen) {
      submenu.classList.add("hidden");
      submenu.classList.remove("block");
      if (arrow) {
        arrow.classList.remove("rotate-90");
      }
    } else {
      submenu.classList.remove("hidden");
      submenu.classList.add("block");
      if (arrow) {
        arrow.classList.add("rotate-90");
      }
    }
  }
  closeAllMenus() {
    this.submenus.forEach((submenu) => {
      submenu.classList.add("hidden");
      submenu.classList.remove("block");
    });
    this.arrows.forEach((arrow) => {
      arrow.classList.remove("rotate-90");
    });
  }
}
function initMobileSidebar() {
  const openBtn = document.querySelector("header .nav-hamburger");
  const sidebar = document.getElementById("mobile-sidebar");
  const closeBtn = sidebar == null ? void 0 : sidebar.querySelector(".nav-hamburger-close");
  if (!openBtn || !sidebar) return;
  let isOpen = false;
  const open = () => {
    isOpen = true;
    sidebar.classList.remove("translate-x-full");
    sidebar.classList.add("translate-x-0");
    openBtn.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("overflow-hidden");
  };
  const close = () => {
    isOpen = false;
    sidebar.classList.add("translate-x-full");
    sidebar.classList.remove("translate-x-0");
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("overflow-hidden");
  };
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) close();
    else open();
  });
  closeBtn == null ? void 0 : closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  });
  document.addEventListener("click", (e) => {
    if (!isOpen) return;
    const t = e.target;
    if (sidebar.contains(t) || openBtn.contains(t)) return;
    close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) close();
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initMobileSidebar();
  if (document.querySelector(".mobile-menu-toggle[data-menu]")) {
    globalThis.mobileMenuAccordion = new MobileMenuAccordion({
      defaultOpenMenu: "company-menu"
    });
  }
});
const swiperAnimation = {
  instances: {},
  init() {
    if (typeof Swiper === "undefined") {
      return;
    }
    this.instances.aiCreativeStudioTestimonial = new Swiper(
      ".ai-creative-studio-testimonial-swiper",
      {
        initialSlide: 2,
        speed: 2e3,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        allowTouchMove: true,
        autoplay: {
          delay: 3e3,
          disableOnInteraction: true
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 0
          }
        },
        navigation: {
          nextEl: ".ai-creative-studio-testimonial-next",
          prevEl: ".ai-creative-studio-testimonial-prev"
        },
        on: {
          init: function() {
            const slides = this.slides;
            const activeIndex = this.activeIndex;
            const slidesPerView = Math.ceil(this.params.slidesPerView);
            slides.forEach((slide, index) => {
              slide.style.transition = "opacity 0.4s ease-out, filter 0.4s ease-out";
              let offset = index - activeIndex;
              if (offset < 0) offset += slides.length;
              if (offset >= 0 && offset < slidesPerView) {
                slide.style.opacity = "1";
                slide.style.filter = "blur(0px)";
              } else {
                slide.style.opacity = "0.5";
                slide.style.filter = "blur(2px)";
              }
            });
          },
          slideChangeTransitionStart: function() {
            const slides = this.slides;
            const activeIndex = this.activeIndex;
            const slidesPerView = Math.ceil(this.params.slidesPerView);
            slides.forEach((slide, index) => {
              slide.style.transition = "opacity 0.4s ease-out, filter 0.4s ease-out";
              let offset = index - activeIndex;
              if (offset < 0) offset += slides.length;
              if (offset >= 0 && offset < slidesPerView) {
                slide.style.opacity = "1";
                slide.style.filter = "blur(0px)";
              } else {
                slide.style.opacity = "0.5";
                slide.style.filter = "blur(2px)";
              }
            });
          }
        }
      }
    );
    this.instances.aiCreativeStudioBlog = new Swiper(".ai-creative-studio-blog-swiper", {
      initialSlide: 1,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 1400,
      loop: true,
      autoplay: {
        delay: 3e3,
        disableOnInteraction: true
      },
      allowTouchMove: true,
      effect: "creative",
      creativeEffect: {
        prev: {
          translate: ["-130%", 0, -400],
          opacity: 0
        },
        next: {
          translate: ["130%", 0, -400],
          opacity: 0
        }
      },
      pagination: {
        el: ".ai-creative-studio-blog-pagination",
        clickable: true,
        bulletClass: "ai-creative-studio-blog-pagination-bullet",
        bulletActiveClass: "ai-creative-studio-blog-pagination-bullet-active"
      }
    });
  }
};
document.addEventListener("DOMContentLoaded", () => {
  swiperAnimation.init();
});
