# ILAB Studio Experience

A modern, high-fidelity recreation of the ILAB Digital Creative Studio homepage. The page keeps the original editorial structure and public brand imagery while replacing the legacy jQuery/canvas implementation with Vite, Three.js, and GSAP.

## Development

```bash
npm install
npm run dev
```

The development server runs at `http://127.0.0.1:5173` by default.

## Production

```bash
npm run build
npm run preview
```

## Structure

- `src/main.js`: page composition, section transitions, cursor, contact dialog, and interactions
- `src/blob-scene.js`: responsive Three.js point-cloud scene and shader morphing
- `src/data.js`: clients, awards, and services content
- `src/styles.css`: responsive layout, themes, and component states
- `public/assets`: locally served font and public visual assets used by the recreation

The animation pauses when the page is hidden and renders a static scene when the operating system requests reduced motion.
