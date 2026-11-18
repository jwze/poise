import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlobScene } from "./blob-scene.js";
import { awards } from "./data.js";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const letters = (text) =>
  [...text]
    .map((character) =>
      character === " "
        ? '<span class="letter letter-space" aria-hidden="true">&nbsp;</span>'
        : `<span class="letter" aria-hidden="true">${character}</span>`,
    )
    .join("");

const words = (text) =>
  text
    .split(" ")
    .filter(Boolean)
    .map((word) => `<span class="word">${word}</span>`)
    .join("");

const awardMarkup = awards
  .map(
    ({ name, count, href }) => `
      <li class="award-item reveal-item" data-count="${count}">
        <a class="award-link" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${name}</a>
        <span class="award-count" aria-label="${count}">0</span>
      </li>`,
  )
  .join("");

document.querySelector("#app").innerHTML = `
  <canvas class="blob-canvas" id="blob-canvas" aria-hidden="true"></canvas>

  <header class="site-header">
    <a class="logo" href="#start" aria-label="回到顶部">
      <span class="logo-mark" aria-hidden="true">JVZ</span>
    </a>
  </header>

  <main id="start">
    <section class="chapter hero" data-theme="dark" data-shape="0" aria-labelledby="hero-title">
      <div class="content-shell hero-inner">
        <h1 id="hero-title" aria-label="Two benches">
          <span class="title-line">${letters("two")}</span>
          <span class="title-line">${letters("benches")}</span>
        </h1>
      </div>
      <p class="hero-note"><span>抖音工作台 · 小红书工作台。</span><br class="note-break" /><span>看得见的，才留得下。</span></p>
    </section>

    <section class="chapter manifesto" id="form" data-theme="light" data-shape="1" aria-label="Visual statement">
      <div class="content-shell manifesto-copy">
        <p class="word-reveal">${words("先看清， 再选择。")}</p>
        <p class="word-reveal">${words("一切， 都在 你 眼前。")}</p>
      </div>
    </section>

    <section class="chapter clients" id="type" data-theme="light" data-shape="1" aria-labelledby="clients-title">
      <div class="content-shell">
        <h2 class="section-label split-label" id="clients-title" aria-label="Index">${letters("INDEX")}</h2>
        <p class="statement word-reveal">${words("从主页 到作者， 都在 手边。")}</p>
      </div>
    </section>

    <section class="chapter recognitions" id="space" data-theme="dark" data-shape="2" aria-labelledby="awards-title">
      <div class="content-shell recognitions-inner">
        <h2 class="section-label split-label" id="awards-title" aria-label="Scale">${letters("SCALE")}</h2>
        <p class="award-message word-reveal">${words("少一点 步骤， 多一点 确定。")}</p>
        <ul class="award-grid">${awardMarkup}</ul>
      </div>
    </section>

    <section class="chapter services" id="rhythm" data-theme="light" data-shape="3" aria-labelledby="services-title">
      <div class="content-shell">
        <h2 class="section-label split-label" id="services-title" aria-label="System">${letters("SYSTEM")}</h2>
        <p class="statement word-reveal">${words("从识别 到保存， 都不出 本机。")}</p>
      </div>
    </section>

    <footer class="chapter footer" id="frame" data-theme="dark" data-shape="4" aria-labelledby="contact-title">
      <div class="content-shell footer-inner">
        <button class="footer-cta" id="contact-title" type="button" data-open-contact>
          <span aria-hidden="true"><span class="cta-word">${letters("compare")}</span></span>
          <span class="sr-only">打开两个工作台的对比</span>
        </button>
        <div class="footer-details">
          <section class="footer-col reveal-item" aria-label="工作台">
            <p class="footer-label">Workbench</p>
            <ul class="footer-list">
              <li><a href="#type">抖音工作台</a></li>
              <li><a href="#space">小红书工作台</a></li>
            </ul>
          </section>
          <section class="footer-col reveal-item" aria-label="流程">
            <p class="footer-label">Flow</p>
            <ul class="footer-list footer-flow">
              <li><span>01</span><a href="#rhythm" data-social="signal-a">看清</a></li>
              <li><span>02</span><a href="#space" data-social="signal-b">选择</a></li>
              <li><span>03</span><a href="#frame" data-social="signal-c">留下</a></li>
            </ul>
          </section>
        </div>
        <p class="footer-meta reveal-item">
          <span>Local · Desktop · Two Benches</span>
          <span>JVZ © 2026</span>
        </p>
      </div>
    </footer>
  </main>

  <button class="contact-orbit" type="button" data-open-contact aria-label="打开两个工作台的对比">
    <span class="contact-orbit-fill"></span>
    <img class="contact-ring contact-ring-light" src="/assets/text_white.png" alt="" />
    <img class="contact-ring contact-ring-dark" src="/assets/text_black.png" alt="" />
    <img class="contact-pencil contact-pencil-light" src="/assets/pencil_white.png" alt="" />
    <img class="contact-pencil contact-pencil-dark" src="/assets/pencil_black.png" alt="" />
  </button>

  <div class="contact-panel" id="contact-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" aria-hidden="true">
    <button class="contact-close" type="button" aria-label="关闭对比面板">×</button>
    <div class="contact-sheet">
      <h2 class="sheet-lede" id="panel-title">两个工作台，同一个<em>分寸</em>。</h2>
      <div class="bench-grid">
        <article class="bench-card">
          <h3>抖音工作台</h3>
          <p class="bench-desc">十一个页面，一个窗口。</p>
        </article>
        <article class="bench-card">
          <h3>小红书工作台</h3>
          <p class="bench-desc">一个页面，从头到尾。</p>
        </article>
      </div>
    </div>
  </div>

  <div class="cursor" aria-hidden="true"><span class="cursor-ring"></span><span class="cursor-dot"></span></div>
`;

const body = document.body;
const blob = new BlobScene(document.querySelector("#blob-canvas"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeTheme = "dark";

function applyChapter(chapter) {
  const theme = chapter.dataset.theme;
  activeTheme = theme;
  body.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#000000" : "#ffffff";
  blob.setMode(Number(chapter.dataset.shape), theme === "dark");
}

document.querySelectorAll(".chapter").forEach((chapter) => {
  ScrollTrigger.create({
    trigger: chapter,
    start: "top center",
    end: "bottom center",
    onEnter: () => applyChapter(chapter),
    onEnterBack: () => applyChapter(chapter),
  });
});

const revealGroups = [
  [".word-reveal .word", 0.025, 0.7, "yPercent", 60],
  [".split-label .letter", 0.035, 0.55, "yPercent", 100],
  [".reveal-item", 0.08, 0.7, "y", 24],
];

revealGroups.forEach(([selector, stagger, duration, property, distance]) => {
  gsap.utils.toArray(selector).forEach((element) => {
    const trigger = element.closest(".chapter");
    gsap.fromTo(
      element,
      { autoAlpha: 0, [property]: distance },
      {
        autoAlpha: 1,
        [property]: 0,
        duration: reducedMotion ? 0 : duration,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger, start: "top 72%", once: true },
      },
    );
  });
});

gsap.fromTo(
  ".hero .letter",
  { autoAlpha: 0, yPercent: 90 },
  { autoAlpha: 1, yPercent: 0, duration: reducedMotion ? 0 : 0.75, stagger: 0.028, delay: 0.2, ease: "power3.out" },
);

let countersPlayed = false;
ScrollTrigger.create({
  trigger: ".recognitions",
  start: "top 55%",
  onEnter: () => {
    if (countersPlayed) return;
    countersPlayed = true;
    document.querySelectorAll(".award-item").forEach((item, index) => {
      const output = item.querySelector(".award-count");
      const target = Number(item.dataset.count);
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: reducedMotion ? 0 : 1.5 + index * 0.35,
        delay: index * 0.15,
        ease: "power2.out",
        onUpdate: () => { output.textContent = Math.round(state.value); },
      });
    });
  },
});

const cursor = document.querySelector(".cursor");
const cursorRing = cursor.querySelector(".cursor-ring");
const cursorDot = cursor.querySelector(".cursor-dot");
let pointerX = -100;
let pointerY = -100;
let ringX = -100;
let ringY = -100;
let cursorInitialized = false;
let previousFrameTime = performance.now();

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (!cursorInitialized) {
    ringX = pointerX;
    ringY = pointerY;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    cursorInitialized = true;
  }
  cursor.classList.add("is-active");
  cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
});

function animateCursor(time) {
  const deltaSeconds = Math.min((time - previousFrameTime) / 1000, 0.05);
  const follow = 1 - Math.exp(-32 * deltaSeconds);
  previousFrameTime = time;

  ringX += (pointerX - ringX) * follow;
  ringY += (pointerY - ringY) * follow;
  cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
  requestAnimationFrame(animateCursor);
}

if (!reducedMotion) requestAnimationFrame(animateCursor);

document.querySelectorAll("a, button, input, select").forEach((element) => {
  element.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
  element.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
});

const orbit = document.querySelector(".contact-orbit");
orbit.addEventListener("pointermove", (event) => {
  if (reducedMotion) return;
  const bounds = orbit.getBoundingClientRect();
  const x = event.clientX - bounds.left - bounds.width / 2;
  const y = event.clientY - bounds.top - bounds.height / 2;
  orbit.style.transform = `translate3d(${x * 0.32}px, ${y * 0.32}px, 0)`;
});
orbit.addEventListener("pointerleave", () => { orbit.style.transform = ""; });

const panel = document.querySelector("#contact-panel");
const closeButton = panel.querySelector(".contact-close");
let previouslyFocused;

function openContact() {
  previouslyFocused = document.activeElement;
  panel.setAttribute("aria-hidden", "false");
  panel.classList.add("is-open");
  body.classList.add("contact-open");
  window.setTimeout(() => closeButton.focus(), reducedMotion ? 0 : 450);
}

function closeContact() {
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  body.classList.remove("contact-open");
  previouslyFocused?.focus();
}

document.querySelectorAll("[data-open-contact]").forEach((button) => button.addEventListener("click", openContact));
closeButton.addEventListener("click", closeContact);
window.addEventListener("keydown", (event) => { if (event.key === "Escape" && panel.classList.contains("is-open")) closeContact(); });

panel.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [...panel.querySelectorAll("button, input, select, a")];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

document.querySelectorAll("[data-social]").forEach((link) => {
  link.addEventListener("pointerenter", () => { body.dataset.social = link.dataset.social; });
  link.addEventListener("pointerleave", () => { delete body.dataset.social; body.dataset.theme = activeTheme; });
});

applyChapter(document.querySelector(".hero"));
