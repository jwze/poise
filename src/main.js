import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlobScene } from "./blob-scene.js";
import { awards, clients, services } from "./data.js";
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
    .map((word) => `<span class="word">${word}</span>`)
    .join(" ");

const clientMarkup = clients
  .map(
    ([id, name]) => `
      <li class="client-item reveal-item">
        <img src="/assets/clients/client-${id}.png" alt="${name}" loading="lazy" />
      </li>`,
  )
  .join("");

const awardMarkup = awards
  .map(
    ({ name, image, count }) => `
      <li class="award-item reveal-item" data-count="${count}">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="/assets/awards/${image}-light.png" />
          <img class="award-logo award-logo-light" src="/assets/awards/${image}-light.png" alt="${name}" />
          <img class="award-logo award-logo-dark" src="/assets/awards/${image}-dark.png" alt="" aria-hidden="true" />
        </picture>
        <span class="award-count" aria-label="${count} premi">0</span>
      </li>`,
  )
  .join("");

const serviceMarkup = services
  .map(
    ({ title, items }) => `
      <article class="service reveal-item">
        <h3>${title}</h3>
        <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>`,
  )
  .join("");

document.querySelector("#app").innerHTML = `
  <canvas class="blob-canvas" id="blob-canvas" aria-hidden="true"></canvas>

  <header class="site-header">
    <a class="logo" href="#start" aria-label="ILAB, torna all'inizio">
      <img class="logo-light" src="/assets/logo-light.png" alt="ILAB" />
      <img class="logo-dark" src="/assets/logo-dark.png" alt="" aria-hidden="true" />
    </a>
  </header>

  <main id="start">
    <section class="chapter hero" data-theme="dark" data-shape="0" aria-labelledby="hero-title">
      <div class="content-shell hero-inner">
        <h1 id="hero-title" aria-label="digital creative studio">
          <span class="title-line">${letters("digital creative")}</span>
          <span class="title-line">${letters("studio")}</span>
        </h1>
      </div>
    </section>

    <section class="chapter manifesto" data-theme="light" data-shape="1" aria-label="Chi siamo">
      <div class="content-shell manifesto-copy">
        <p class="word-reveal">${words("Dal 2009, ILAB è un digital creative studio di origini partenopee specializzato in branding, web design e advertising.")}</p>
        <p class="word-reveal">${words("Un laboratorio che si dedica ai propri clienti con stile italiano, attenzione ai particolari e cura sartoriale.")}</p>
      </div>
    </section>

    <section class="chapter clients" data-theme="light" data-shape="1" aria-labelledby="clients-title">
      <div class="content-shell">
        <h2 class="section-label split-label" id="clients-title" aria-label="Clienti">${letters("Clienti")}</h2>
        <ul class="client-grid">${clientMarkup}</ul>
      </div>
    </section>

    <section class="chapter recognitions" data-theme="dark" data-shape="2" aria-labelledby="awards-title">
      <div class="content-shell recognitions-inner">
        <h2 class="section-label split-label" id="awards-title" aria-label="Premi e riconoscimenti">${letters("Premi e riconoscimenti")}</h2>
        <p class="award-message word-reveal">${words("Ogni lavoro rappresenta una sfida a cui non sappiamo rinunciare.")}</p>
        <ul class="award-grid">${awardMarkup}</ul>
      </div>
    </section>

    <section class="chapter services" data-theme="light" data-shape="3" aria-labelledby="services-title">
      <div class="content-shell service-layout">
        <h2 class="section-label split-label" id="services-title" aria-label="Servizi">${letters("Servizi")}</h2>
        <div class="service-grid">${serviceMarkup}</div>
      </div>
    </section>

    <footer class="chapter footer" data-theme="dark" data-shape="4" aria-labelledby="contact-title">
      <div class="content-shell footer-inner">
        <button class="footer-cta" id="contact-title" type="button" data-open-contact>
          <span aria-hidden="true"><span class="cta-word">${letters("start")}</span> <span class="cta-word">${letters("a")}</span> <span class="cta-word">${letters("project")}</span></span>
          <span class="sr-only">Start a project</span>
        </button>
        <div class="footer-details">
          <address class="reveal-item">
            ILAB di Giuseppe Manzavino<br />
            Via G. Mazzini, 6<br />
            84016 - Pagani, Salerno
          </address>
          <ul class="reveal-item">
            <li><a href="mailto:info@ilabsolutions.it">info@ilabsolutions.it</a></li>
            <li><a href="tel:+390813443748">+ (39) 081 3443 748</a></li>
          </ul>
          <ul class="social-links reveal-item">
            <li><a href="https://www.facebook.com/ilabdigitalcreativestudio" data-social="facebook" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href="https://www.instagram.com/ilabsolutions" data-social="instagram" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://www.linkedin.com/company/ilabsolutions" data-social="linkedin" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </main>

  <button class="contact-orbit" type="button" data-open-contact aria-label="Contattaci per un preventivo">
    <span class="contact-orbit-fill"></span>
    <img class="contact-ring contact-ring-light" src="/assets/text_white.png" alt="" />
    <img class="contact-ring contact-ring-dark" src="/assets/text_black.png" alt="" />
    <img class="contact-pencil contact-pencil-light" src="/assets/pencil_white.png" alt="" />
    <img class="contact-pencil contact-pencil-dark" src="/assets/pencil_black.png" alt="" />
  </button>

  <div class="contact-panel" id="contact-panel" role="dialog" aria-modal="true" aria-labelledby="form-title" aria-hidden="true">
    <button class="contact-close" type="button" aria-label="Chiudi il modulo">×</button>
    <form class="contact-form" id="contact-form">
      <h2 class="sr-only" id="form-title">Contatta ILAB</h2>
      <p>
        Salve <strong>ILAB,</strong><br />
        mi chiamo <input name="name" aria-label="Nome e cognome" placeholder="Nome e Cognome" required /> e mi occupo di
        <input name="occupation" aria-label="La tua attività" placeholder="parlaci della tua attività" />.<br />
        Sono alla ricerca di un'agenzia a cui affidare un progetto di
        <select name="project" aria-label="Tipo di progetto">
          <option>Branding</option><option>Web Design</option><option>Advertising</option><option>Social Media</option><option>Branding + Web</option>
        </select>.<br />
        Dispongo di un budget di
        <select name="budget" aria-label="Budget">
          <option>circa 5.000 €</option><option>5.000 - 10.000 €</option><option>10.000 - 20.000 €</option><option>+ 20.000 €</option>
        </select>
        e il progetto va avviato in circa
        <select name="timeline" aria-label="Tempi"><option>un mese</option><option>due mesi</option><option>tre mesi</option><option>sei mesi</option></select>.<br />
        Potrebbe esservi utile sapere che <input name="details" aria-label="Dettagli del progetto" placeholder="si tratta di..." />.<br />
        Preferirei essere contattato all'indirizzo
        <input name="email" type="email" aria-label="Email" placeholder="email" required /> o al numero
        <input name="phone" type="tel" aria-label="Telefono" placeholder="345 *******" />.
      </p>
      <label class="privacy"><input type="checkbox" required /> Accetto la Privacy Policy.</label>
      <button class="contact-submit" type="submit">Invia</button>
      <p class="form-status" aria-live="polite"></p>
    </form>
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
  [".service li", 0.02, 0.5, "x", -18],
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
const firstInput = panel.querySelector("input");
let previouslyFocused;

function openContact() {
  previouslyFocused = document.activeElement;
  panel.setAttribute("aria-hidden", "false");
  panel.classList.add("is-open");
  body.classList.add("contact-open");
  window.setTimeout(() => firstInput.focus(), reducedMotion ? 0 : 450);
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

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Nuovo progetto ${data.get("project")}`);
  const message = encodeURIComponent(
    `Nome: ${data.get("name")}\nAttività: ${data.get("occupation")}\nProgetto: ${data.get("project")}\nBudget: ${data.get("budget")}\nTempi: ${data.get("timeline")}\nDettagli: ${data.get("details")}\nEmail: ${data.get("email")}\nTelefono: ${data.get("phone")}`,
  );
  panel.querySelector(".form-status").textContent = "Apertura del tuo client email…";
  window.location.href = `mailto:info@ilabsolutions.it?subject=${subject}&body=${message}`;
});

document.querySelectorAll("[data-social]").forEach((link) => {
  link.addEventListener("pointerenter", () => { body.dataset.social = link.dataset.social; });
  link.addEventListener("pointerleave", () => { delete body.dataset.social; body.dataset.theme = activeTheme; });
});

applyChapter(document.querySelector(".hero"));
