const canvas = document.getElementById("particle-canvas");
const context = canvas.getContext("2d");

const root = document.documentElement;

const sections = [...document.querySelectorAll(".section, .footer, .hero")];
const splitTargets = [...document.querySelectorAll('[data-split="letters"]')];

function splitLetters(element) {
  const text = element.textContent.trim();
  const characters = [...text];
  element.setAttribute("aria-label", text);
  element.innerHTML = characters
    .map((character, index) => {
      const safeCharacter = character === " " ? "&nbsp;" : character;
      return `<span class="letter" style="transition-delay:${index * 28}ms">${safeCharacter}</span>`;
    })
    .join("");
}

splitTargets.forEach(splitLetters);

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.18 }
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll(".stagger").forEach((group) => {
  [...group.children].forEach((child, index) => {
    child.style.setProperty("--order", index);
  });
});

const mouse = { x: 0.5, y: 0.35 };
let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rotation = { x: 0.4, y: 0.6, z: 0.1 };
let sphereScale = 1;

const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
mediaQuery.addEventListener("change", (event) => {
  prefersReducedMotion = event.matches;
});

window.addEventListener("mousemove", (event) => {
  const { innerWidth, innerHeight } = window;
  mouse.x = event.clientX / innerWidth;
  mouse.y = event.clientY / innerHeight;
});

const points = [];
const pointCount = 2200;

for (let index = 0; index < pointCount; index += 1) {
  const t = index / pointCount;
  const phi = Math.acos(1 - 2 * t);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;
  const radius = 0.96 + Math.sin(index * 0.91) * 0.02;

  points.push({
    x: Math.cos(theta) * Math.sin(phi) * radius,
    y: Math.sin(theta) * Math.sin(phi) * radius,
    z: Math.cos(phi) * radius,
    twinkle: Math.random() * Math.PI * 2,
  });
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize, { passive: true });
resize();

function project(point, angles, radius, width, height) {
  const sinX = Math.sin(angles.x);
  const cosX = Math.cos(angles.x);
  const sinY = Math.sin(angles.y);
  const cosY = Math.cos(angles.y);
  const sinZ = Math.sin(angles.z);
  const cosZ = Math.cos(angles.z);

  let x = point.x;
  let y = point.y;
  let z = point.z;

  let dx = x * cosY + z * sinY;
  let dz = -x * sinY + z * cosY;
  let dy = y * cosX - dz * sinX;
  dz = y * sinX + dz * cosX;

  const rx = dx * cosZ - dy * sinZ;
  const ry = dx * sinZ + dy * cosZ;

  const perspective = 1.6 / (1.6 - dz * 0.75);
  const sphereRadius = radius * perspective;

  return {
    x: width * 0.54 + rx * sphereRadius,
    y: height * 0.48 + ry * sphereRadius,
    z: dz,
    perspective
  };
}

function draw(timestamp) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);

  const pointerInfluenceX = (mouse.x - 0.5) * 0.18;
  const pointerInfluenceY = (mouse.y - 0.5) * -0.16;
  rotation.x = 0.35 + pointerInfluenceY + (timestamp * 0.00018);
  rotation.y = 0.62 + pointerInfluenceX + (timestamp * 0.00024);
  rotation.z = 0.12 + Math.sin(timestamp * 0.00035) * 0.07;

  const radius = Math.min(width, height) * 0.36 * sphereScale;
  const sorted = points
    .map((point) => {
      const projected = project(point, rotation, radius, width, height);
      return {
        ...projected,
        twinkle: point.twinkle
      };
    })
    .sort((a, b) => a.z - b.z);

  context.save();
  context.translate(0, 0);

  for (const point of sorted) {
    const alphaBase = 0.18 + (point.z + 1) * 0.24;
    const shimmer = prefersReducedMotion ? 0 : Math.sin(timestamp * 0.002 + point.twinkle) * 0.2;
    const alpha = Math.max(0.05, Math.min(1, alphaBase + shimmer));
    const size = 0.55 + point.perspective * 0.75 + (point.z + 1) * 0.18;

    context.beginPath();
    context.fillStyle = `rgba(255,255,255,${alpha})`;
    context.arc(point.x, point.y, size, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();

  if (!prefersReducedMotion) {
    sphereScale = 1 + Math.sin(timestamp * 0.00055) * 0.015;
  }

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

window.addEventListener(
  "scroll",
  () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = window.scrollY / max;
    root.style.setProperty("--scroll-progress", progress.toFixed(3));
  },
  { passive: true }
);
