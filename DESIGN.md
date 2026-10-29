# DESIGN.md — CITT Connect Design System

> **Visual Authority:** Official [Duoc UC Kit Digital (Tipografía y Colores)](https://www.duoc.cl/kit-digital/web/tipografia-colores/) fused with the **3D Blue Circuit CITT Emblem** (`assets/citt-logo.webp`).

## 1. Aesthetic Direction & Materiality
- **Tactile Phygital Craft:** Inspired by the 3D-printed CITT circuit emblem (`assets/citt-logo.webp`), surfaces feel physical, layered, and precision-engineered over a deep dark canvas.
- **Spotlight & Depth:** In the Interactive Gallery, inactive member cards stay calm and slightly attenuated; focusing or hovering a card casts a soft blur across siblings and brings the active member into crisp, full-contrast focus.

## 2. Color System (Pinned Institucional Palette)

### Primary Palette (Kit Digital Duoc UC)
- **Negro Duoc (`#1A1A1A` / `rgba(26, 26, 26, 1)`)**: Primary elevated surface for cards, Radix UI dialogs, popovers, and navigation bars.
- **Blanco (`#FFFFFF` / `rgba(255, 255, 255, 1)`)**: Primary high-contrast typography, active icons, and circuit emblem traces.
- **Amarillo Duoc (`#FFB800` / `rgba(255, 184, 0, 1)`)**: Primary institutional accent for primary CTAs (*"Guardar Contacto"*, *"Conectar"*), focus rings, active states, and Captain/Coordinator badges.

### Secondary Palette (Kit Digital Duoc UC)
- **Terciario / Canvas (`#000000` / `rgba(0, 0, 0, 1)`)**: Deep background canvas behind `#1A1A1A` cards to create natural elevation without muddy shadows.
- **Gris Duoc (`#666666` / `rgba(102, 102, 102, 1)`)**: Secondary metadata text, muted borders, and idle card attenuation state.
- **Neutro Claro (`#EEEEEE` / `rgba(238, 238, 238, 1)`)**: High-contrast QR code container background (ensuring instant camera scan reliability) and secondary light surfaces.

### Brand & School Semantic Accents
- **CITT Circuit Blue (`#307FE2` / `#8BB8E8`)**: Matches the 3D CITT Emblem and the **Escuela de Informática y Telecomunicaciones**. Used for NFC/QR pulse indicators, circuit accents, and interactive links.
- **Duoc UC Official School Colors (Used for Member School Badges):**
  - Informática y Telecomunicaciones (`.E-IyT-New`): Primary `#307FE2` · Secondary `#8BB8E8`
  - Ingeniería y Recursos Naturales (`.E-Ing-New`): Primary `#43B02A` · Secondary `#A1D884`
  - Diseño (`.E-Dis-New`): Primary `#C4D600` · Secondary `#DBE442`
  - Administración y Negocios (`.E-AyN-New`): Primary `#AC4FC6` · Secondary `#C98BDB`
  - Comunicación (`.E-Com-New`): Primary `#D50032` · Secondary `#DF4661`
  - Construcción (`.E-Cons-New`): Primary `#E87722` · Secondary `#ECA154`
  - Salud y Bienestar (`.E-Sal-New`): Primary `#5BC2E7` · Secondary `#99D6EA`
  - Gastronomía (`.E-Gas`): Primary `#FF585D` · Secondary `#FF808B`
  - Turismo y Hospitalidad (`.E-Tur-New`): Primary `#00A499` · Secondary `#2AD2C9`

## 3. Typography & Modular Scale (Kit Digital Duoc UC)
- **Primary UI & Body Font:** **`Lato`** (`300 Light`, `400 Regular`, `700 Bold`, `900 Black`).
- **Editorial & Institutional Display Font:** **`Merriweather`** (`300 Light`, `400 Regular`, `700 Bold`, `900 Black`).
- **Scale:**
  - `h1`: `2.6875rem` (`43px`) — Bold (`700`)
  - `h2`: `2.1rem` (`33.6px`) — Bold (`700`)
  - `h3`: `1.5rem` (`24px`) — Bold (`700`)
  - `h4`: `1.25rem` (`20px`) — Regular (`400`)
  - `h5`: `1rem` (`16px`) — Regular (`400`)
  - `p`: `1rem` (`16px`) — Regular (`400`)
  - `small`: `0.8125rem` (`13px`) — Regular (`400`)

## 4. Component Architecture
- **Primitives:** `@radix-ui/primitives` (`Dialog`, `Select`, `Popover`, `Tabs`, `DropdownMenu`, `Tooltip`, `Avatar`, `Toast`) styled with Tailwind CSS tokens.
- **Brand Asset:** Always use `assets/citt-logo.webp` (`134 KB` lossless alpha WebP) rather than the unoptimized `1.61 MB` PNG.
