### Role: Senior Creative Developer & UI/UX Specialist (Emotional Design Expert)

### Context:
We are building the frontend for "Love Story" — a premium, intimate gallery for couples. The goal is to create an "Apple-esque" digital sanctuary that feels like a modern, high-end photo journal. It must be minimalist, elegant, and emotionally resonant.

### 1. Visual Identity & Design System (The Romantic Minimalist)
- **Theme:** "Warm Dark Mode" (Soft dark tones rather than pure black).
- **Color Palette:** - Background: Stone 950 (#0C0A09) for a warmer, organic dark feel.
  - Cards: Stone 900 (#1C1917) with a 1px border in Stone 800.
  - Accents: Rose 500 (#F43F5E) for heart icons and Soft Amber (#FDE68A) for special anniversary highlights.
- **Typography:** - Headings/Timer: **Playfair Display** (Serif) to evoke the feeling of a printed love letter.
  - Body: **Inter** or **Geist Sans** (Sans-serif) for clean readability.

### 2. Layout & Components (Story-First)
- **The Navigation:** Floating glassmorphic navbar. Replace the generic profile with a "Double Avatar" (User + Partner) representing the couple.
- **The Hero Section:** A cinematic, full-screen entry. 
  - **The Counter:** A large, elegant serif timer showing "Days Together."
  - **Background:** A subtle, slow-moving Mesh Gradient in Rose/Stone tones.
- **The Memory Gallery:** A **Responsive Masonry Layout**.
- **Memory Cards:** - Consistent 4:5 aspect ratio.
  - On-image overlay: When hovered, show the `event_date` and a "Mood" icon (e.g., 🌹, ✈️, 🏠).
  - Use `object-cover` with a subtle "Ken Burns" zoom effect on hover.

### 3. Motion & Emotional Micro-interactions (Framer Motion)
- **Initial Load:** A staggered "Letter Opening" animation — the timer fades in first, followed by the memory grid sliding up gracefully.
- **The Heartbeat:** Add a very subtle pulse animation to the "Days Together" counter.
- **Transitions:** Use `layoutId` for shared element transitions when opening a memory to create a seamless "zoom-in" effect.
- **Loading Vibe:** Elegant Skeleton loaders that mimic the masonry blocks.

### 4. Memory Detail View (The Narrative Experience)
- Use a **Fixed Overlay or Dialog** that feels like turning a page in a book.
- **Layout:** High-res image takes 60% of the screen. The right side features the "Story" (Markdown content), the "Location," and a "Back to Timeline" button.
- **Interaction:** A "Relive this Moment" button that toggles a slideshow mode.

### Implementation Instructions:
1. Use **Tailwind CSS** with a custom `Stone` and `Rose` theme.
2. Use **Framer Motion** for physics-based, smooth animations (no linear transitions).
3. Ensure **Mobile-First** design: the timer should be the focal point on small screens.
4. Focus on **Whitespace**: ensure the layout feels "expensive" through generous spacing.

"Let's turn these data points into a living, breathing story. Please start by configuring the Tailwind theme and the Hero Timer component."