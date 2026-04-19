# Design System Document: The Luminous Ledger

## 1. Overview & Creative North Star

**Creative North Star: "The Luminous Ledger"**
In the world of enterprise resource planning (ERP), data is often treated as a cold, static commodity. This design system rejects that notion. "The Luminous Ledger" treats data as a living, breathing ecosystem. By combining high-end editorial typography with an organic color palette inspired by nature, we transform complex workflows into a "Digital Sanctuary."

We break the traditional "admin dashboard" template through **intentional asymmetry** and **tonal depth**. Instead of rigid grids and suffocating borders, we use breathing room (negative space) and light-refraction principles. The result is a high-performance interface that feels premium, airy, and human-centric—moving the ERP from a utility tool to a signature brand experience.

---

## 2. Colors: Tonal Architecture

Our palette balances the professional stability of cool grays with the vibrant energy of the brand’s botanical roots.

### The Accent Strategy
- **Primary (`#236a00`)**: Used for growth, success, and primary actions. It represents the "Living" aspect of the brand.
- **Secondary (`#00658d`)**: Used for structural navigation and information hierarchy. It provides a "Professional Anchoring."
- **Tertiary (`#b50a53`)**: Reserved for high-contrast moments—analytics peaks, urgent notifications, or "human" touchpoints.

### The "No-Line" Rule
Standard UI relies on 1px borders to separate content. **In this design system, 1px solid borders for sectioning are prohibited.** Boundaries must be defined through:
1.  **Background Shifts**: Place a `surface-container-low` section against a `surface` background.
2.  **Tonal Transitions**: Use subtle shifts in lightness to signal where one functional area ends and another begins.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of fine, semi-translucent paper.
- **Base Layer**: `surface` (`#f8f9ff`).
- **Sectioning Layer**: `surface-container-low` (`#eff4ff`) for large background areas.
- **Content Layer**: `surface-container-lowest` (`#ffffff`) for cards and interactive elements to create a "lifted" feel.

### Signature Textures
To avoid a "flat" corporate look, use subtle linear gradients (135°) for main CTAs and hero data visualizations, transitioning from `primary` to `primary_container`. This adds a "soul" to the interface that flat hex codes cannot provide.

---

## 3. Typography: The Editorial Voice

We utilize a dual-typeface system to bridge the gap between "Brand Authority" and "Functional Utility."

- **The Display Voice (Manrope)**: Used for `display` and `headline` scales. Manrope’s geometric yet friendly curves provide a contemporary, premium feel. Use large `display-lg` (3.5rem) sizes for key KPIs to make data feel like a headline.
- **The Functional Voice (Inter)**: Used for `title`, `body`, and `label` scales. Inter is selected for its high x-height and exceptional readability in data-heavy tables.

**Hierarchy Tip**: Use `title-lg` for card headers but drop the weight to Medium. Pair it with `label-sm` in all-caps with 5% letter spacing for overlines to achieve a high-end editorial look.

---

## 4. Elevation & Depth: Atmospheric Layering

Depth is not a shadow; it is a relationship between light and surface.

- **The Layering Principle**: Instead of shadows, achieve depth by stacking. A `surface-container-highest` navigation rail sitting on a `surface-dim` backdrop creates immediate hierarchy without a single pixel of "drop shadow."
- **Ambient Shadows**: When an element must float (e.g., a Modal or Popover), use "Ambient Shadows." These must be extra-diffused.
    *   *Recipe:* Blur: 24px-40px | Opacity: 4%-6% | Color: A tinted version of `on-surface` (never pure black).
- **Glassmorphism**: For floating navigation or top bars, use `surface` at 80% opacity with a `backdrop-blur` of 12px. This makes the layout feel integrated and modern.
- **The "Ghost Border" Fallback**: If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. High-contrast, 100% opaque borders are strictly forbidden.

---

## 5. Components: The Living Elements

### Buttons
- **Primary**: Gradient fill (`primary` to `primary_container`) with `on_primary` text. `xl` roundedness (1.5rem).
- **Secondary**: `surface_container_high` background with `primary` text. No border.
- **Tertiary**: Ghost style. Text only in `secondary`, shifting to a subtle `surface_variant` background on hover.

### Cards & Data Lists
- **The Rule**: No divider lines.
- **Separation**: Use vertical white space from the spacing scale (e.g., 24px between items) or a `surface-container-low` background on hover to isolate a row. 
- **Shape**: Always use `lg` (1rem) or `xl` (1.5rem) corner radii to maintain the "airy" feel.

### Input Fields
- **Styling**: Use a "Soft-Infill" style. `surface_container_highest` background with a `none` border. On focus, transition the background to `surface_lowest` and add a 2px `primary` ghost-border (20% opacity).
- **Labels**: Always use `label-md` floating above the field, never inside.

### Chips (Selection/Filter)
- Use `secondary_container` for active states. Chips should be `full` roundedness (pill-shaped) to contrast against the more architectural card shapes.

---

## 6. Do’s and Don’ts

### Do
- **DO** use white space as a structural element. If an interface feels "messy," add more space, don't add more lines.
- **DO** use the `tertiary` (pink) accent for "human" moments—user avatars, celebratory milestones, or specialized tags.
- **DO** use `display-md` for large numbers. In an ERP, the data is the hero; let it be big and bold.
- **DO** align elements to a 4px/8px baseline grid, but allow for **asymmetric** layouts (e.g., a wide primary column paired with a narrow, offset utility column).

### Don’t
- **DON'T** use 1px solid borders to separate table rows. Use alternating tonal stripes (`surface` vs `surface_container_low`) or simply ample padding.
- **DON'T** use pure black (`#000000`) for text. Use `on_surface` (`#0b1c30`) to keep the "ink" feeling soft and professional.
- **DON'T** crowd the interface. If a screen requires more than 7 primary actions, use a "More" glassmorphism overflow menu.
- **DON'T** use sharp 0px corners. Every element should have at least a `sm` (0.25rem) radius to stay consistent with the organic "Biotiful" brand.