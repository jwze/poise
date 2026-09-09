import * as THREE from "three";
import { gsap } from "gsap";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uShape;
  uniform float uPointSize;
  uniform vec3 uBlobTransform;
  attribute vec2 aSeed;
  varying float vAlpha;

  vec3 shapeAt(float shape, vec3 p) {
    float waveA = sin(p.y * 7.0 + uTime * 0.42 + aSeed.x * 6.2831);
    float waveB = cos(p.x * 6.0 - uTime * 0.28 + aSeed.y * 6.2831);
    float noise = waveA * waveB;

    if (shape < 0.5) {
      float latitude = asin(clamp(p.y / 1.62, -1.0, 1.0));
      float longitude = atan(p.z, p.x);
      vec3 organic = p;
      organic.x *= 1.0 + 0.308 * sin(0.879 * latitude + uTime * 1.3);
      organic.z *= 1.0 + 0.24 * sin(0.165 * longitude + uTime * 0.8);
      return organic;
    }
    if (shape < 1.5) {
      vec3 cloud = vec3(
        (aSeed.x - 0.5) * 4.6 + p.x * 0.22,
        (aSeed.y - 0.5) * 3.35 + p.y * 0.18,
        p.z * 0.22
      );
      cloud.x += sin(p.y * 5.0 + aSeed.x * 8.0 + uTime * 0.12) * 0.18;
      cloud.y += cos(p.x * 4.0 + aSeed.y * 7.0 - uTime * 0.1) * 0.16;
      return cloud;
    }
    if (shape < 2.5) {
      vec3 burst = p * (1.12 + noise * 0.48);
      burst.x += sin(p.y * 9.0 + uTime * 0.3) * 0.22;
      return burst;
    }
    if (shape < 3.5) {
      vec3 folded = p;
      float angle = p.y * 0.85 + sin(uTime * 0.2) * 0.15;
      folded.xz = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * folded.xz;
      folded.y *= 0.76 + 0.12 * sin(p.x * 4.0 + uTime);
      return folded * (1.0 + noise * 0.12);
    }
    vec3 ribbon = p;
    ribbon.x *= 1.18 + 0.12 * sin(p.y * 3.0 + uTime * 0.4);
    ribbon.y *= 0.72;
    ribbon.z += sin(p.x * 4.5 + uTime * 0.35) * 0.2;
    return ribbon * (1.0 + noise * 0.08);
  }

  void main() {
    float fromShape = floor(uShape);
    float toShape = min(4.0, fromShape + 1.0);
    float blend = smoothstep(0.0, 1.0, fract(uShape));
    vec3 p = mix(shapeAt(fromShape, position), shapeAt(toShape, position), blend);
    p *= uBlobTransform;

    vec4 modelPosition = modelMatrix * vec4(p, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uPointSize * (6.0 / max(1.0, -viewPosition.z));
    vAlpha = 0.48 + (position.z + 1.0) * 0.24;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float dot = 1.0 - smoothstep(0.34, 0.5, distanceToCenter);
    if (dot <= 0.0) discard;
    gl_FragColor = vec4(uColor, dot * vAlpha);
  }
`;

export class BlobScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.rotationAxis = new THREE.Vector3(1, -1, 0).normalize();
    this.rotationAxisTarget = this.rotationAxis.clone();
    this.deltaRotation = new THREE.Quaternion();
    this.spinSpeed = 0.005;
    this.lastPointer = null;
    this.clock = new THREE.Clock();
    this.running = true;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    this.camera.position.z = 6.2;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x000000, 0);

    this.uniforms = {
      uTime: { value: 0 },
      uShape: { value: 0 },
      uPointSize: { value: window.innerWidth < 520 ? 1.45 : 1.65 },
      uBlobTransform: { value: new THREE.Vector3(1, 1, 1) },
      uColor: { value: new THREE.Color("#ffffff") },
    };

    this.points = this.createPoints();
    this.scene.add(this.points);
    this.resize();

    this.onResize = this.resize.bind(this);
    this.onPointerMove = this.handlePointer.bind(this);
    this.onVisibility = () => {
      this.running = !document.hidden;
      if (this.running) {
        this.clock.getDelta();
        this.render();
      }
    };

    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerleave", () => {
      this.lastPointer = null;
    });
    window.addEventListener("blur", () => {
      this.lastPointer = null;
    });
    document.addEventListener("visibilitychange", this.onVisibility);
    this.render();
  }

  createPoints() {
    const count = window.innerWidth < 520 ? 4200 : 7600;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 2);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < count; index += 1) {
      const y = 1 - 2 * ((index + 0.5) / count);
      const ringRadius = Math.sqrt(1 - y * y);
      const angularJitter = (Math.random() - 0.5) * 0.16;
      const theta = goldenAngle * index + angularJitter;
      const radius = 1.62 * (0.995 + Math.random() * 0.01);

      positions[index * 3] = Math.cos(theta) * ringRadius * radius;
      positions[index * 3 + 1] = y * radius;
      positions[index * 3 + 2] = Math.sin(theta) * ringRadius * radius;
      seeds[index * 2] = Math.random();
      seeds[index * 2 + 1] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 2));

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    return new THREE.Points(geometry, material);
  }

  setMode(mode, dark) {
    const sizes = window.innerWidth < 520 ? [1.45, 1.0, 1.05, 1.25, 1.1] : [1.65, 1.2, 1.2, 1.45, 1.25];
    const transforms = [
      [1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0],
      [0.86, 1.24, 0.68],
      [0.7, 0.9, 1.24],
      [0.78, 1.3, 0.78],
    ];
    const color = dark ? 1 : 0.48;
    const transform = transforms[mode] || transforms[0];

    if (this.reducedMotion) {
      this.uniforms.uShape.value = mode;
      this.uniforms.uPointSize.value = sizes[mode];
      this.uniforms.uBlobTransform.value.set(...transform);
      this.uniforms.uColor.value.setRGB(color, color, color);
      this.renderer.render(this.scene, this.camera);
      return;
    }

    gsap.to(this.uniforms.uShape, {
      value: mode,
      duration: 1.15,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to(this.uniforms.uPointSize, {
      value: sizes[mode],
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
    });
    gsap.to(this.uniforms.uBlobTransform.value, {
      x: transform[0],
      y: transform[1],
      z: transform[2],
      duration: 1.1,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to(this.uniforms.uColor.value, {
      r: color,
      g: color,
      b: color,
      duration: 0.45,
      overwrite: true,
    });
  }

  handlePointer(event) {
    if (this.reducedMotion) return;

    const now = performance.now();
    const current = { x: event.clientX, y: event.clientY, time: now };
    if (!this.lastPointer || now - this.lastPointer.time > 120) {
      this.lastPointer = current;
      return;
    }

    const dx = current.x - this.lastPointer.x;
    const dy = current.y - this.lastPointer.y;
    const movement = Math.hypot(dx, dy);
    const distanceFromCenter = Math.hypot(
      current.x - window.innerWidth / 2,
      current.y - window.innerHeight / 2,
    );
    this.lastPointer = current;

    const interactionRadius = Math.min(400, window.innerWidth * 0.42);
    if (movement === 0 || distanceFromCenter >= interactionRadius) return;

    const influence = distanceFromCenter < 20
      ? 1
      : (interactionRadius - distanceFromCenter) / (interactionRadius - 20);
    const nextSpeed = Math.min(movement, 100) * 0.001 * influence;

    if (nextSpeed > this.spinSpeed) {
      this.rotationAxisTarget.set(dy, -dx, 0).normalize();
      this.spinSpeed = nextSpeed;
    }
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.points.position.x = width < 600 ? 0.42 : 0.34;
    this.points.scale.setScalar(width < 600 ? 1.03 : Math.min(0.83, 0.7 + width / 12000));
    this.uniforms.uPointSize.value = width < 520 ? 1.45 : 1.65;
    if (this.reducedMotion) this.renderer.render(this.scene, this.camera);
  }

  render() {
    if (!this.running) return;
    const elapsed = this.clock.getElapsedTime();
    this.uniforms.uTime.value = this.reducedMotion ? 0 : elapsed;
    if (!this.reducedMotion) {
      this.rotationAxis.lerp(this.rotationAxisTarget, 0.16).normalize();
      this.spinSpeed += (0.005 - this.spinSpeed) * 0.018;
      this.deltaRotation.setFromAxisAngle(this.rotationAxis, this.spinSpeed);
      this.points.quaternion.premultiply(this.deltaRotation);
    }
    this.renderer.render(this.scene, this.camera);
    if (!this.reducedMotion) requestAnimationFrame(() => this.render());
  }
}
