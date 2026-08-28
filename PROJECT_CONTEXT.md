# Crema / Noir — Project Context & Developer Onboarding Handbook

This document provides a comprehensive technical analysis of the **Crema / Noir** project. It is structured to allow any AI model or developer to instantly understand the codebase, the architectural choices, and the next steps required to realize the complete design vision.

---

## 1. Executive Summary & Tech Stack

**Crema / Noir** is a luxury, minimalist interactive landing page dedicated to single-origin coffee roasts. The design philosophy is high-end, dark, and tactile, relying on advanced animations, 3D elements, and smooth scroll transitions to create a premium brand experience.

### Technical Stack
*   **Core**: React 19 (Functional components, Hooks)
*   **Build Tool**: Vite 7 (using native ES modules, Fast Refresh)
*   **Language**: TypeScript 5.9 (Strict mode enabled)
*   **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` compiler plugin, which compiles styles at build-time directly without requiring a separate `tailwind.config.js`)
*   **3D Rendering**: Three.js (`three` npm package, version `0.173.x`)
*   **Timeline & Scroll Animations**: GSAP 3 (GreenSock Animation Platform) + `@gsap/react` for React-safe effect lifecycles, and `ScrollTrigger` plugin for scroll-bound animations.
*   **Micro-interactions & Page Load Transitions**: Framer Motion 12 for high-level UI entrance transitions and keyframe components.
*   **Icons**: Lucide React.

---

## 2. Codebase Directory Map

```text
CREMA/
├── .git/                      # Version control history
├── node_modules/              # Project dependencies
├── public/                    # Static public assets
│   └── vite.svg               # Vite brand favicon
├── src/
│   ├── assets/                # Static asset files imported in code
│   │   ├── sequence/          # [WIP] Directory for 120-frame carbon cylinder split PNG sequence
│   │   ├── A_close_up_hyper_realistic_ma.mp4 # Slow-motion espresso crema background video
│   │   └── react.svg          # React logo
│   ├── components/            # React UI components
│   │   ├── BrewingRitual.tsx  # Scroll-staggered process highlights (GSAP)
│   │   ├── Coffee3D.tsx       # Interactive 3D Three.js rotating coffee bean (GSAP ScrollTrigger)
│   │   ├── Divider.tsx        # Subtle decorative gradient dividing line
│   │   ├── Footer.tsx         # Clean minimalist footer
│   │   ├── hero.tsx           # Page landing hero section with typographic overlay
│   │   ├── PageTransition.tsx # Framer Motion wrapper for elegant fade-in-up animations
│   │   ├── Philosophy.tsx     # Brand philosophy statement with parallax scroll effect
│   │   └── ProductGrid.tsx    # Glassmorphic product card grid with hover glows
│   ├── App.css                # Empty component-specific global styles
│   ├── App.tsx                # Main layout composition and page transition wrappers
│   ├── index.css              # Entry stylesheet importing Tailwind CSS v4
│   ├── main.tsx               # DOM entry rendering <App /> inside React StrictMode
│   └── vite-env.d.ts          # Vite client typescript environment declarations
├── eslint.config.js           # ESLint 9 configuration
├── index.html                 # HTML index entry point
├── package.json               # Package manifests, scripts, and dependencies
├── tsconfig.json              # TypeScript root project config references
├── tsconfig.app.json          # TypeScript application configuration
├── tsconfig.node.json         # TypeScript configuration for Vite node tools
└── vite.config.ts             # Vite configuration with React and Tailwind CSS v4 plugins
```

---

## 3. Detailed Component Breakdown

### 1. `App.tsx`
*   **Path**: [`src/App.tsx`](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/REACT/CREMA/src/App.tsx)
*   **Purpose**: Orchestrates the order of sections on the landing page. Wraps sections in `<PageTransition>` to manage their entrance animation sequences as the page mounts.
*   **Composition**:
    1.  `<Hero />` (Landing layout + Three.js Canvas)
    2.  `<ProductGrid />` (Glassmorphic cards)
    3.  `<BrewingRitual />` (Interactive step-by-step process)
    4.  `<Philosophy />` (Typographic focal point)
    5.  `<Footer />`

### 2. `components/hero.tsx`
*   **Path**: [`src/components/hero.tsx`](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/REACT/CREMA/src/components/hero.tsx)
*   **Purpose**: The main landing banner. It houses the minimalist typographical header `"CREMA / NOIR"`, intro copy, primary CTA buttons ("Explore the Roasts", "Learn our story"), and nests the `<Coffee3D />` component.
*   **Details**: Utilizes Framer Motion for stagger-revealing the title, paragraph, and buttons on initial page load.

### 3. `components/Coffee3D.tsx`
*   **Path**: [`src/components/Coffee3D.tsx`](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/REACT/CREMA/src/components/Coffee3D.tsx)
*   **Purpose**: Renders an interactive, floating, three-dimensional coffee bean in the background of the hero section.
*   **Mechanics**:
    *   **Three.js Setup**: Dynamic creation of a `WebGLRenderer`, `PerspectiveCamera`, `AmbientLight` (soft white), `DirectionalLight` (warm gold tint `#ffd7a3`), and `PointLight` (coffee brown tint `#8b4513` for volumetric depth).
    *   **Geometry & Material**: Employs a `SphereGeometry(1, 32, 16)` scaled to `(1.6, 1.1, 0.95)` to represent a coffee bean shape. The material is a `MeshStandardMaterial` configured with:
        *   `color`: `0x8b4513` (brown)
        *   `emissive`: `0x3c2a21` (dark roast core)
        *   `emissiveIntensity`: `0.12`
        *   `roughness`: `0.48`
        *   `metalness`: `0.18`
    *   **Scroll Binding**: Combines GSAP `ScrollTrigger` with the coffee bean's properties. As the user scrolls from `top top` to `bottom top` of the hero section:
        *   `rotation.y` animates to `Math.PI * 7` (continuous spin)
        *   `position.x` slides to `1.2` (migrating to the right side of the screen)
        *   `scale` enlarges slightly to `(1.8, 1.2, 1.05)`
    *   **Idle Animation**: A subtle sinusoidal floating motion is updated via `requestAnimationFrame` on `coffeeBean.rotation.x` (`Math.sin(Date.now() * 0.001) * 0.08`) and a constant slow rotation `coffeeBean.rotation.y += 0.004`.
    *   **Memory Management**: Properly disposes of the geometry, materials, renderer, and events in the `useEffect` cleanup return function.

### 4. `components/ProductGrid.tsx`
*   **Path**: [`src/components/ProductGrid.tsx`](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/REACT/CREMA/src/components/ProductGrid.tsx)
*   **Purpose**: Renders four curated coffee roasts in a clean responsive grid.
*   **Design & Styling**:
    *   Features a dark radial gradient background (`bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.08),transparent_50%)]`).
    *   The cards are styled as premium glassmorphic containers (`bg-white/[0.03]`, `border-white/8`, `backdrop-blur-sm`).
    *   Hover effects include a card lift (`hover:-translate-y-1`), border tint transition (`hover:border-amber-500/30`), and an underlying amber glow sweep using a Tailwind gradient (`group-hover:opacity-100` on a absolute container).

### 5. `components/BrewingRitual.tsx`
*   **Path**: [`src/components/BrewingRitual.tsx`](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/REACT/CREMA/src/components/BrewingRitual.tsx)
*   **Purpose**: Displays the 4-step brewing workflow (Selection, Roasting, Resting, Brewing).
*   **Animations**: Uses GSAP `ScrollTrigger` with a context wrapper (`gsap.context`). When the section triggers, a staggered slide-up and fade-in animation (`y: 36 -> 0`, `opacity: 0 -> 1`) runs on the card elements using the `stagger: 0.16` parameter.

### 6. `components/Philosophy.tsx`
*   **Path**: [`src/components/Philosophy.tsx`](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/REACT/CREMA/src/components/Philosophy.tsx)
*   **Purpose**: Centered, high-contrast, premium typographic layout highlighting the brand values.
*   **Animations**: Uses the `@gsap/react` `useGSAP` hook for scoped animations.
    *   **Entrance**: Staggers the eyebrow, title, and body text (`y: 48 -> 0`, `opacity: 0 -> 1`) using a `ScrollTrigger` that plays when the section enters 78% of the viewport.
    *   **Parallax**: Translates the elements upward (`yPercent: -8`) during the scroll range of the section (`scrub: true`) to establish vertical depth.

---

## 4. Current State vs. EXPERIENCE_BLUEPRINT.md (Gap Analysis)

The project includes an [`EXPERIENCE_BLUEPRINT.md`](file:///c:/Users/Adem/Desktop/Portfolio%20Projects/REACT/CREMA/EXPERIENCE_BLUEPRINT.md) outlining the ultimate design goals. Currently, the project is a skeleton that approximates some of these styles but misses several core interactive systems:

| Feature described in Blueprint | Current Code Status | Gap / Missing Implementation |
| :--- | :--- | :--- |
| **Asset Layer Stack Layout** | Standard scrolling web sections. | No absolute viewport stacking. Needs the 3 main layers: Base (Video), Middle (Canvas Sequence), and Top (HTML Content overlay). |
| **Background Sequence Engine (Canvas)** | Empty sequence folder (`src/assets/sequence`). | Missing the canvas frame preloader, resize handler, and GSAP timeline mapping the scroll to frames 1-120. |
| **The Liquid Core Veil (Base Video)** | The video `A_close_up_hyper_realistic_ma.mp4` exists in assets. | The video is not rendered in any component. Needs to be placed on the Base Layer, looping quietly, and revealed through the split cylinder. |
| **Timeline A: Outer Shell Split** | Three.js floating coffee bean is in `Coffee3D.tsx`. | The 3D coffee bean is a placeholder. The blueprint specifies a matte carbon container cylinder splitting down the center. |
| **Timeline B: Parallax Liquid Core** | No video background parallax. | Needs GSAP `yPercent` scroll bindings for the underlying video elements. |
| **Timeline C: Foreground UI Cards** | Product cards and steps fade in locally. | Foreground elements must be stacked absolutely on top of the canvas, fading/sliding dynamically over the splitting cylinder sequence. |

---

## 5. Development Playbook: Step-by-Step Implementation Guide

Any developer/AI model tasked with completing this project should execute the following implementation sprints:

### Sprint 1: Setup the Fixed Layout Stacking Context
Before starting complex animations, refactor the global layout structure in `App.tsx` or a layout component:
1.  Set the main document container height to `400vh` to reserve scroll space.
2.  Create a fixed container: `fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none`.
3.  Implement the **Layer Stack**:
    *   **Base Layer (z-index: 10)**: A full-viewport `<video>` looping `A_close_up_hyper_realistic_ma.mp4`. Ensure it is muted, playsinline, and uses CSS `object-fit: cover`.
    *   **Middle Layer (z-index: 20)**: An HTML5 `<canvas>` that matches the window dimensions.
    *   **Top Layer (z-index: 30)**: The HTML scrollable containers containing the UI components (Hero text, `ProductGrid`, `BrewingRitual`, `Philosophy`, `Footer`). Set `pointer-events-auto` on interactive UI containers, but keep the parent container transparent to allow canvas clicks if necessary.

### Sprint 2: Build the Canvas Sequence Engine
To drive the 120-frame split-cylinder sequence:
1.  **Frame Generation**: Populate `src/assets/sequence` (or `/public/sequence` to simplify path fetching) with 120 high-quality PNGs named sequentially: `frame_001.png` to `frame_120.png`.
2.  **Asset Preloader**: Create a utility in React to pre-cache the images into memory as HTMLImageElements:
    ```typescript
    const preloadImages = (urls: string[]): Promise<HTMLImageElement[]> => {
      const promises = urls.map(url => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      });
      return Promise.all(promises);
    };
    ```
3.  **Canvas Drawing Loop**: Create a render function that draws the active image frame to the canvas, maintaining aspect ratio.
4.  **GSAP Scroll Binding**:
    Use GSAP to animate a virtual frame counter object:
    ```typescript
    const frameObj = { frame: 0 };
    gsap.to(frameObj, {
      frame: 119, // 0-indexed
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#scroll-trigger-anchor", // a 400vh element
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: () => {
          drawFrame(frameObj.frame);
        }
      }
    });
    ```

### Sprint 3: Coordinate the Scroll Waypoint Timelines
Implement the three parallel timelines synchronized to the scroll percentage:

1.  **Timeline A: Canvas Split (0% to 100% Scroll)**
    *   **0% -> 30%**: Render frames 1–40 (cylinder floats in center, breathing slightly).
    *   **30% -> 70%**: Render frames 41–90 (cylinder fractures and splits; halves move to left/right boundaries).
    *   **70% -> 100%**: Render frames 91–120 (halves stay locked at viewport edges).
2.  **Timeline B: Liquid Core Veil (0% to 100% Scroll)**
    *   **0% -> 30%**: The background video is hidden (can be masked or hidden by the solid cylinder center in the canvas frames).
    *   **30% -> 70%**: As panels split, the video is revealed in the center empty space.
    *   **70% -> 100%**: Video remains fully exposed. Apply a parallax movement: `gsap.to(videoElement, { yPercent: -12, ease: "none", scrollTrigger: { ... scrub: true } })`.
3.  **Timeline C: Foreground UI Overlay (0% to 100% Scroll)**
    *   **0% -> 25%**: Fade out and scale up the Hero text layout (`opacity: 0`, `scale: 1.12`).
    *   **35% -> 65%**: Product cards slide up (`y: 45 -> 0`, `opacity: 0 -> 1`) in a central layout overlaid directly on the video center.
    *   **70% -> 100%**: Brewing steps and Philosophy sections enter symmetrically, scrolling naturally into view.

---

## 6. Critical Implementation Best Practices

Developers adding code to this project must adhere to the following rules:

### Tailwind CSS v4 Rules
*   Tailwind v4 is integrated via `@tailwindcss/vite`.
*   **NO `tailwind.config.js` exists**. Custom theme variables and utility directives must be declared directly in `src/index.css` using standard CSS `@theme` syntax:
    ```css
    @import "tailwindcss";
    @theme {
      --color-brand-accent: #f59e0b;
    }
    ```
*   Use Tailwind v4 utility values instead of arbitrary configurations.

### GSAP in React Guidelines
*   Always perform scroll-trigger bindings inside the standard `@gsap/react` `useGSAP` hook or inside a `gsap.context()` in `useEffect`.
*   Ensure that every ScrollTrigger is killed during component unmounting. Failing to clean up scroll triggers causes memory leaks and layout bugs during hot reloads:
    ```typescript
    useEffect(() => {
      const ctx = gsap.context(() => {
        // your ScrollTrigger animations here
      });
      return () => ctx.revert(); // clears all scrollTriggers and timelines within context
    }, []);
    ```

### Three.js Optimization Checklist
*   **Renderer & Resize Listener**: Ensure the Three.js resize listener is debounced or properly unmounted. Use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to prevent performance degradation on 4K/retina monitors.
*   **Resource Disposal**: Whenever a Three.js component unmounts, invoke:
    ```typescript
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    ```
    This releases GPU buffers and WebGL memory immediately.
