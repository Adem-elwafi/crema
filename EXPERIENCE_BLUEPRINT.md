# Experience & Motion Blueprint: Crema / Noir Refactor

## 1. Core Engineering Mechanics
* **Background Sequence Engine:** High-performance HTML5 `<canvas>` array running inside a fixed, full-viewport container.
* **Scroll Depth Horizon:** Mapped to exactly `400vh` of total document scroll space via GSAP `ScrollTrigger`.
* **Asset Layer Stack Layout:**
  * `Top Layer (z-index: 30)`: Foreground UI typography, navigation header, and glassmorphic product cards.
  * `Middle Layer (z-index: 20)`: The HTML5 Canvas running the 120-frame carbon cylinder split image sequence.
  * `Base Layer (z-index: 10)`: The looping, slow-motion espresso crema spiral video (`crema-core.mp4`).

---

## 2. Scroll Target Waypoints & Step-by-Step Timelines

### Timeline A: Outer Shell Canvas Sequence (Cylinder Split)
* **0% -> 30% Scroll (The Monolith Anchor):** Plays frames 1 to 40. The matte carbon container floats dead center in high-contrast lighting, slowly breathing/oscillating on its axis to hook the user.
* **30% -> 70% Scroll (The Fracture Gate):** Plays frames 41 to 90. As the user scrolls, the container splits cleanly down the middle. The two symmetrical halves slide smoothly to the far left and right edges of the screen viewport.
* **70% -> 100% Scroll (The Frame Lock):** Plays frames 91 to 120. The halves lock completely static at the screen boundaries, acting as a luxury frame for the remaining content down to the footer.

### Timeline B: The Liquid Core Veil (Base Video Layer)
* **0% -> 30% Scroll:** The background coffee video is looping quietly but is completely hidden from sight behind the solid body of the centered cylinder.
* **30% -> 70% Scroll:** As the outer shell panels split apart, the inner swirling espresso galaxy is naturally unveiled right through the empty negative space in the center of the screen.
* **70% -> 100% Scroll:** The background crema flow remains fully visible, moving slightly slower than the scroll rate (`yPercent: -12`) to create a deep, premium parallax illusion.

### Timeline C: Foreground UI Elements (Typography & Layout Cards)
* **Hero Layout (Scroll: 0% -> 30%):**
  * The minimalist text heading `"CREMA / NOIR"` and action buttons start at full visibility.
  * On scroll from 0% to 25%, the text smoothly fades out and scales up (`opacity: 0`, `scale: 1.12`) to clear the frame before the split.
* **The Collections Grid (Scroll: 30% -> 70%):**
  * The product cards (`src/components/ProductGrid.tsx`) are initialized out of view (`opacity: 0`, shifted down `y: 45`).
  * On scroll from 35% to 65%, the cards slide upward cleanly into a central grid column directly over the swirling coffee core background. Premium glassmorphic cards filter the background contrast to guarantee reading legibility.
* **The Brewing Ritual (Scroll: 70% -> 100%):**
  * The procedural text cards fade onto the layout in absolute symmetry as the page reaches its conclusion.