# 02. Sistema de Diseño Duoc UC y Componentes Radix UI

> **Repositorio:** `CITT_Connect_Frontend`
> **Referencia Oficial:** [Kit Digital Duoc UC — Tipografía y Colores](https://www.duoc.cl/kit-digital/web/tipografia-colores/)

---

## 1. Paletas de Color Institucionales

### 1.1 Paleta de Color Primaria
| Nombre | Hex | RGBA | Clase Kit Digital | Uso en el Frontend |
| :--- | :--- | :--- | :--- | :--- |
| **Negro Duoc** | `#1A1A1A` | `rgba(26, 26, 26, 1)` | `.bg-dark` | Superficie de tarjetas (`MemberCard`), diálogos de Radix UI y barra de navegación. |
| **Blanco** | `#FFFFFF` | `rgba(255, 255, 255, 1)` | `.bg-white` | Títulos, nombres de miembros e íconos principales. |
| **Amarillo Duoc** | `#FFB800` | `rgba(255, 184, 0, 1)` | `.orange-duoc` | Botones primarios (CTA), borde activo en *hover*, indicadores de rol Capitán/Coordinador. |

### 1.2 Paleta de Color Secundaria
| Nombre | Hex | RGBA | Clase Kit Digital | Uso en el Frontend |
| :--- | :--- | :--- | :--- | :--- |
| **Gris Duoc** | `#666666` | `rgba(102, 102, 102, 1)` | `.bg-grey` | Textos secundarios, bordes en reposo y estado desaturado. |
| **Terciario (Negro Puro)** | `#000000` | `rgba(0, 0, 0, 1)` | — | Fondo base de la aplicación (`body`) para máximo contraste con `#1A1A1A`. |
| **Neutro Duoc** | `#EEEEEE` | `rgba(238, 238, 238, 1)` | — | Superficie del recuadro del Código QR (garantiza lectura inmediata con cámaras móviles). |

### 1.3 Colores Oficiales de Escuelas Duoc UC (`SchoolBadge`)
Cada tarjeta y perfil muestra la escuela del miembro utilizando el par cromático oficial del Kit Digital:

| Escuela | Clase | Principal | Secundario |
| :--- | :--- | :--- | :--- |
| **Informática y Telecomunicaciones** | `.E-IyT-New` | `#307FE2` *(Coincide con el Emblema 3D CITT)* | `#8BB8E8` |
| **Ingeniería y Recursos Naturales** | `.E-Ing-New` | `#43B02A` | `#A1D884` |
| **Diseño** | `.E-Dis-New` | `#C4D600` | `#DBE442` |
| **Administración y Negocios** | `.E-AyN-New` | `#AC4FC6` | `#C98BDB` |
| **Comunicación** | `.E-Com-New` | `#D50032` | `#DF4661` |
| **Construcción** | `.E-Cons-New` | `#E87722` | `#ECA154` |
| **Salud y Bienestar** | `.E-Sal-New` | `#5BC2E7` | `#99D6EA` |
| **Gastronomía** | `.E-Gas` | `#FF585D` | `#FF808B` |
| **Turismo y Hospitalidad** | `.E-Tur-New` | `#00A499` | `#2AD2C9` |

---

## 2. Tipografías y Escala Modular

Cargadas mediante `next/font/google`:
* **`Lato`** (`300`, `400`, `700`, `900`): Fuente principal de interfaz, tarjetas, etiquetas y navegación.
* **`Merriweather`** (`300`, `400`, `700`, `900`): Fuente editorial para encabezados destacados o citas.

| Elemento | Peso | Tamaño (`rem`) | Tamaño (`px`) |
| :--- | :--- | :--- | :--- |
| `h1` | Bold (`700`) | `2.6875rem` | `43px` |
| `h2` | Bold (`700`) | `2.1rem` | `33.6px` |
| `h3` | Bold (`700`) | `1.5rem` | `24px` |
| `h4` | Regular (`400`) | `1.25rem` | `20px` |
| `h5` | Regular (`400`) | `1rem` | `16px` |
| `p` | Regular (`400`) | `1rem` | `16px` |
| `small` | Regular (`400`) | `0.8125rem` | `13px` |

---

## 3. Catálogo de Componentes con Radix UI

1. **`ProfileSpotlightDialog` (`@radix-ui/react-dialog`):**
   * Abre la tarjeta expandida del miembro sobre un overlay `backdrop-blur-md bg-black/80` con animación de entrada de `Framer Motion`.
2. **`QRModal` (`@radix-ui/react-dialog`):**
   * Muestra el código QR dinámico sobre fondo `#EEEEEE` con el archivo [`assets/citt-logo.webp`](../assets/citt-logo.webp) al centro, botón de compartir nativo (`navigator.share`) y descarga de `.vcf`.
3. **`CampusAndTrackFilters` (`@radix-ui/react-select` + `@radix-ui/react-popover`):**
   * Selectores accesibles con búsqueda por **Sede Duoc UC**, **Escuela** y **Track CITT**.
4. **`ProfileTabs` (`@radix-ui/react-tabs`):**
   * Pestañas dentro del perfil para alternar entre *"Resumen y Skills"*, *"Proyectos CITT"*, *"Insignias"* y *"Actividad"*.
5. **`BadgeTooltip` (`@radix-ui/react-tooltip`):**
   * Muestra quién otorgó una insignia verificada y en qué fecha o hackathon se obtuvo.
